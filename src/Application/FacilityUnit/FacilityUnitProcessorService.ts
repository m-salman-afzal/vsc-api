import async from "async";

import {BUCKETS, FCH_BUCKET_FOLDERS, SAPPHIRE_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS} from "@constants/FileConstant";
import {SAPPHIRE_FILENAME_PREFIX} from "@constants/SapphireConstant";

import FacilityUnitValidation from "@validations/FacilityUnitValidation";

import {DATE_TIME_FORMAT} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, facilityUnitsService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {AddFacilityUnitDto} from "./Dtos/AddFacilityUnitDto";
import {FacilityUnitService} from "./FacilityUnitService";

import type {FacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";

export class FacilityUnitProcessorService extends FacilityUnitService {
    async subBulkAddUnits(units: AddFacilityUnitDto[]) {
        const failedUnits: AddFacilityUnitDto[] = [];
        const unitEntities: FacilityUnitEntity[] = [];
        await async.eachSeries(units, async (unit) => {
            try {
                FacilityUnitValidation.addFacilityUnitValidation(unit);
                const unitEntity = await facilityUnitsService.subAddUnits(unit);
                unitEntities.push(unitEntity);
            } catch (error) {
                failedUnits.push(unit);
            }
        });

        return {unitEntities, failedUnits};
    }
    async bulkAddUnits() {
        try {
            const fileContent = await cloudStorageUtils.getFileContent(
                BUCKETS.SAPPHIRE,
                `${SAPPHIRE_BUCKET_FOLDERS.PROCESSED}/${SharedUtils.getCurrentDate({format: DATE_TIME_FORMAT.YMD_SAPPHIRE})}_${
                    SAPPHIRE_FILENAME_PREFIX.MEDICATION
                }.${FILE_EXTENSIONS.CSV}`
            );

            const rows = SharedUtils.csvToJson(fileContent) as [];
            rows.shift();

            const transformedMedpassData = await this.transformMedpassData(rows);
            const failed = [];

            if (!transformedMedpassData) {
                return failed.push(rows as never);
            }
            const addFacilityUnitDto = transformedMedpassData.map((data) => AddFacilityUnitDto.create(data));
            const units = await this.subBulkAddUnits(addFacilityUnitDto);

            if (!units) {
                return failed.push(rows as never);
            }

            if (units.failedUnits.length > 0) {
                return await cloudStorageUtils.uploadFile(
                    BUCKETS.FCH,
                    SharedUtils.jsonToCsv(units.failedUnits),
                    `${FCH_BUCKET_FOLDERS.SAPPHIRE}/${SharedUtils.getCurrentDate({
                        format: DATE_TIME_FORMAT.YMD_H_MED_PASS
                    })}_${SAPPHIRE_FILENAME_PREFIX.MEDICATION}-ef.${FILE_EXTENSIONS.CSV}`
                );
            }

            if (failed.length > 0) {
                return await cloudStorageUtils.uploadFile(
                    BUCKETS.FCH,
                    SharedUtils.jsonToCsv(failed),
                    `${FCH_BUCKET_FOLDERS.SAPPHIRE}/${SharedUtils.getCurrentDate({
                        format: DATE_TIME_FORMAT.YMD_SAPPHIRE
                    })}_${SAPPHIRE_FILENAME_PREFIX.MEDICATION}-ef.${FILE_EXTENSIONS.CSV}`
                );
            }
        } catch (error) {
            ErrorLog(error, {prefixMessage: `${AppErrorMessage.BULK_ADD_LOCATIONS}${AppErrorMessage.GET_FILES}`});
        }
    }
}
