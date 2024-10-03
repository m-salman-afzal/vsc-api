import async from "async";
import {inject, injectable} from "tsyringe";

import {MedicationListEntity} from "@entities/MedicationList/MedicationListEntity";

import {BUCKETS, SAPPHIRE_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS} from "@constants/FileConstant";
import {SAPPHIRE_FILENAME_PREFIX} from "@constants/SapphireConstant";

import {DATE_TIME_FORMAT, ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {MedicationListFilter} from "@repositories/Shared/ORM/MedicationListFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cloudStorageUtils, facilityService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import type {DownloadMedicationListDTO} from "./DTOs/DownloadMedicationListDTO";
import type {GetMedicationListLastUpdateDTO} from "./DTOs/GetMedicationListLastUpdateDTO";
import type {GetMedicationListDTO} from "@application/MedicationList/DTOs/GetMedicationListDTO";
import type {IMedicationListRepository} from "@entities/MedicationList/IMedicationListRepository";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class MedicationListService {
    constructor(@inject("IMedicationListRepository") private medicationListRepository: IMedicationListRepository) {}

    async getMedicationList(dtoGetMedicationList: GetMedicationListDTO, paginationDTO?: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDTO);
            const searchFilters = MedicationListFilter.setFilter({...dtoGetMedicationList});

            const medicationLists = await this.medicationListRepository.fetchPaginated(
                searchFilters,
                {id: ORDER_BY.DESC},
                pagination
            );
            const count = await this.medicationListRepository.count(searchFilters);
            if (!medicationLists || medicationLists.length === 0) {
                return HttpResponse.notFound();
            }

            const medicationListEntities = medicationLists.map((ml) => {
                return {
                    ...MedicationListEntity.create(ml),
                    dateTime: ml.updatedAt
                };
            });

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, count, medicationListEntities));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async downloadMedicationList(dtoDownloadMedicationList: DownloadMedicationListDTO) {
        try {
            const facility = await facilityService.getFacilitiesById({
                facilityId: dtoDownloadMedicationList.facilityId
            });
            if (!facility) {
                return HttpResponse.notFound();
            }

            const medicationList = await this.medicationListRepository.fetch({
                medicationListId: dtoDownloadMedicationList.medicationListId
            });
            if (!medicationList) {
                return HttpResponse.notFound();
            }

            const csvString = await cloudStorageUtils.getFileContent(
                BUCKETS.SAPPHIRE,
                `${SAPPHIRE_BUCKET_FOLDERS.PROCESSED}/${medicationList.filename}`
            );

            const rows = SharedUtils.csvToJson(csvString) as {FACILITY_ID: string}[];
            rows.shift();
            const medications = rows.filter((r) => r.FACILITY_ID === facility[0]?.externalFacilityId);

            return HttpResponse.ok(medications);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getMedicationListLastUpdate(dtoGetMedicationListLastUpdate: GetMedicationListLastUpdateDTO) {
        try {
            const facility = await facilityService.getFacilitiesById({
                facilityId: dtoGetMedicationListLastUpdate.facilityId
            });
            if (!facility) {
                return HttpResponse.notFound();
            }

            const dboMedicationList = await this.medicationListRepository.fetchPaginated(
                {},
                {id: ORDER_BY.DESC},
                {offset: 0, perPage: 1, currentPage: 1}
            );

            if (!dboMedicationList) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok({
                ...MedicationListEntity.create(dboMedicationList[0]),
                lastUpdate: dboMedicationList[0]?.updatedAt
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addMedicationList(options: {FILE_PREFIX: string}) {
        try {
            const filenames = await SharedUtils.getSapphireFilenames({
                service: MedicationListService.name,
                process: this.addMedicationList.name,
                bucket: BUCKETS.SAPPHIRE,
                filenameFilter: SAPPHIRE_FILENAME_PREFIX.MEDICATION,
                filename: `${SharedUtils.getCurrentDate({format: DATE_TIME_FORMAT.YMD_SAPPHIRE})}_${
                    SAPPHIRE_FILENAME_PREFIX.MEDICATION
                }.${FILE_EXTENSIONS.CSV}`,
                argsPrefix: options.FILE_PREFIX
            });
            if (!filenames) {
                return;
            }

            await async.eachSeries(filenames, async (file) => {
                try {
                    const medicationListEntity = MedicationListEntity.create({
                        medicationListId: SharedUtils.shortUuid(),
                        filename: file
                    });

                    await this.medicationListRepository.create(medicationListEntity);

                    await cloudStorageUtils.renameFile(
                        BUCKETS.SAPPHIRE,
                        file,
                        `${SAPPHIRE_BUCKET_FOLDERS.PROCESSED}/${file}`
                    );
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.ADD_MEDICATION_LIST.PROCESS}${AppErrorMessage.ADD_MEDICATION_LIST.ADD_MEDICATION}`
                    });
                }
            });

            return true;
        } catch (error) {
            return ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.ADD_MEDICATION_LIST.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
