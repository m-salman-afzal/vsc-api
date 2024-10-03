import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_STATUSES, FORMULARY_LEVEL_FILE_PROCESSES, REPOSITORIES} from "@constants/FileConstant";

import {FormularyLevelValidation} from "@validations/FormularyLevelValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, fileService, formularyService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {FormularyLevelService} from "./FormularyLevelService";

import type {BulkUploadFomularyLevelsDto} from "./Dtos/BulkUploadFomularyLevelsDto";

@injectable()
export class FormularyLevelsProcessorService extends FormularyLevelService {
    private async subBulkAddFormularyLevels(
        transformedFormularyLevels: BulkUploadFomularyLevelsDto[],
        facilityId: string,
        formularyLevels: BulkUploadFomularyLevelsDto[] = []
    ) {
        const failedRows: BulkUploadFomularyLevelsDto[] = [];
        let addedCount = 0;
        const removedCount = 0;
        let failedCount = 0;
        const updatedCount = 0;
        const formularyIds: string[] = [];

        let processedNumber = -1;

        await async.eachSeries(transformedFormularyLevels, async (fmLevels) => {
            try {
                processedNumber++;
                fmLevels.facilityId = facilityId;

                FormularyLevelValidation.bulkFormularyLevelValidation(fmLevels);

                const formularyEntity = await formularyService.fetch({id: fmLevels.formularyAutoId});

                if (!formularyEntity) {
                    (formularyLevels[processedNumber] as BulkUploadFomularyLevelsDto).failedReason =
                        "Formulary not found";
                    failedRows.push(formularyLevels[processedNumber] as BulkUploadFomularyLevelsDto);
                    failedCount++;

                    return;
                }

                const formularyLevel = {
                    facilityId: fmLevels.facilityId,
                    formularyId: formularyEntity.formularyId,
                    isStock: fmLevels.isCentralSupply,
                    formularyLevelId: SharedUtils.shortUuid(),
                    max: fmLevels.max,
                    min: fmLevels.min,
                    parLevel: fmLevels.parLevel,
                    threshold: fmLevels.threshold
                };

                if (formularyEntity.name !== fmLevels.drug) {
                    (formularyLevels[processedNumber] as BulkUploadFomularyLevelsDto).failedReason =
                        "Drug name and id do not match";
                    failedRows.push(formularyLevels[processedNumber] as BulkUploadFomularyLevelsDto);
                    failedCount++;

                    return;
                }

                const formularyLevelEntity = FormularyLevelEntity.create(formularyLevel);

                await this.upsert(
                    {formularyId: formularyEntity.formularyId, facilityId: fmLevels.facilityId},
                    formularyLevelEntity
                );
                formularyIds.push(formularyLevelEntity.formularyId);
                addedCount++;
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    (formularyLevels[processedNumber] as BulkUploadFomularyLevelsDto).failedReason =
                        errorMessage.toString();
                }

                failedRows.push(formularyLevels[processedNumber] as BulkUploadFomularyLevelsDto);
                failedCount++;
            }
        });

        return {
            failedRows: failedRows,
            addedCount: addedCount,
            removedCount: removedCount,
            failedCount: failedCount,
            updatedCount: updatedCount,
            drugCount: new Set(formularyIds).size
        };
    }

    async bulkAddFormularyLevels() {
        try {
            const files = await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: FORMULARY_LEVEL_FILE_PROCESSES.BULK_ADD_FORMULARY_LEVELS,
                repository: REPOSITORIES.FORMULARY_LEVELS
            });
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}.${file.fileExtension}`
                    );

                    const formularyLevels = SharedUtils.csvToJson<BulkUploadFomularyLevelsDto>(csvString);
                    const transformedformularyLevels = SharedUtils.convertStringToPrimitives(
                        structuredClone(formularyLevels),
                        {
                            toNumberArray: ["formularyAutoId", "min", "max", "parLevel", "threshold"],
                            toBooleanArray: ["isCentralSupply"]
                        }
                    );

                    const {failedRows, ...processedInfo} = await this.subBulkAddFormularyLevels(
                        transformedformularyLevels,
                        file.facilityId,
                        formularyLevels
                    );

                    file.isEf = failedRows.length > 0;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformedformularyLevels.length);
                    file.info = processedInfo;
                    await fileService.updateFile(file);

                    if (file.isEf) {
                        await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(failedRows),
                            `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}-ef.${file.fileExtension}`
                        );
                    }
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_INVENTORY.PROCESS}${AppErrorMessage.BULK_ADD_FORMULARY_LEVEL.ADD_FORMULARY_LEVELS}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_INVENTORY.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
