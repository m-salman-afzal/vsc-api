import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_STATUSES, REFERENCE_GUIDE_PROCESSES, REPOSITORIES, ROW_ACTION} from "@constants/FileConstant";
import {VALIDATION_MESSAGES_VALUE_OBJECTS} from "@constants/ValidationMessagesConstant";

import {ReferenceGuideDrugValidation} from "@validations/ReferenceGuideDrugValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {RemoveReferenceGuideDto} from "@application/ReferenceGuide/Dtos/RemoveReferenceGuideDto";

import {
    cloudStorageUtils,
    fileService,
    formularyService,
    referenceGuideService
} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {BulkAddReferenceGuideDrugDto} from "./Dtos/BulkAddReferenceGuideDrugDto";
import {ReferenceGuideDrugService} from "./ReferenceGuideDrugService";

@injectable()
export class ReferenceGuideDrugProcessorService extends ReferenceGuideDrugService {
    async bulkAddReferenceGuideDrugs(
        transformed: BulkAddReferenceGuideDrugDto[],
        original: BulkAddReferenceGuideDrugDto[],
        referenceGuideId
    ) {
        const failedRows: BulkAddReferenceGuideDrugDto[] = [];
        let addedCount = 0;
        let updatedCount = 0;
        let removedCount = 0;
        let failedCount = 0;
        let processedNumber = -1;

        await async.eachSeries(transformed, async (td) => {
            try {
                processedNumber++;

                switch (td.action) {
                    case ROW_ACTION.ADD:
                        {
                            if (!td.id) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ACTION_AND_ID_MISMATCH
                                );
                            }
                            const isFormulary = await formularyService.fetch({
                                id: td.id as number
                            });

                            if (!isFormulary) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ID
                                );
                            }
                            td.formularyId = isFormulary.formularyId;
                            td.referenceGuideId = referenceGuideId;
                            ReferenceGuideDrugValidation.addReferenceGuideDrugValidation(td);

                            if (td.drug !== isFormulary.name) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NAME_AND_ID_MISMATCH
                                );
                            }

                            if (!(await this.addReferenceGuideDrug(td))) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ALREADY_EXISTS
                                );
                            }
                            addedCount++;
                        }
                        break;

                    case ROW_ACTION.EDIT:
                        {
                            if (!td.id) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ACTION_AND_ID_MISMATCH
                                );
                            }

                            const formularyEntity = await formularyService.fetch({
                                id: td.id as number
                            });
                            if (!formularyEntity) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ID
                                );
                            }

                            td.formularyId = formularyEntity.formularyId;
                            td.referenceGuideId = referenceGuideId;
                            ReferenceGuideDrugValidation.updateReferenceGuideDrugValidation(td);

                            if (td.drug !== formularyEntity.name) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NAME_AND_ID_MISMATCH
                                );
                            }

                            const updateDrug = await this.subUpdateReferenceGuideDrug(td);
                            if (!updateDrug) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NOT_FOUND
                                );
                            }
                            updatedCount++;
                        }
                        break;

                    case ROW_ACTION.DELETE:
                        {
                            if (!td.id) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ACTION_AND_ID_MISMATCH
                                );
                            }
                            const formularyEntity = await formularyService.fetch({
                                id: td.id as number
                            });
                            if (!formularyEntity) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ID
                                );
                            }

                            td.formularyId = formularyEntity.formularyId;
                            td.referenceGuideId = referenceGuideId;
                            ReferenceGuideDrugValidation.removeReferenceGuideDrugValidation(td);

                            if (td.drug !== formularyEntity.name) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NAME_AND_ID_MISMATCH
                                );
                            }

                            const removeDrug = await this.subRemoveReferenceGuideDrug(td);

                            if (!removeDrug) {
                                failedCount++;

                                return this.validationFailedRows(
                                    original[processedNumber],
                                    failedRows,
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NOT_FOUND
                                );
                            }

                            removedCount++;
                        }
                        break;

                    default:
                        failedCount++;

                        return this.validationFailedRows(
                            original[processedNumber],
                            failedRows,
                            VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ACTION
                        );
                }
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    failedCount++;

                    return this.validationFailedRows(original[processedNumber], failedRows, errorMessage.toString());
                }
                failedRows.push(original[processedNumber] as BulkAddReferenceGuideDrugDto);
                failedCount++;
            }
        });

        return {
            failedRows: failedRows,
            addedCount: addedCount,
            updatedCount: updatedCount,
            removedCount: removedCount,
            failedCount: failedCount
        };
    }

    validationFailedRows(row, failed, message) {
        (row as BulkAddReferenceGuideDrugDto).failedReason = message;
        failed.push(row as BulkAddReferenceGuideDrugDto);
    }

    async execute() {
        try {
            const dtoFiles = {
                status: FILE_STATUSES.RECEIVED,
                process: REFERENCE_GUIDE_PROCESSES.BULK_ADD_REFERENCE_GUIDE,
                repository: REPOSITORIES.REFERENCE_GUIDE
            };
            const files = await fileService.fetchBySearchQuery(dtoFiles);
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});
                    const {referenceGuideId} = file;
                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}.${file.fileExtension}`
                    );
                    const referenceGuideDrugs = SharedUtils.csvToJson<BulkAddReferenceGuideDrugDto>(csvString);
                    const transformed = SharedUtils.convertStringToPrimitives(
                        structuredClone(referenceGuideDrugs).map((t: any) => BulkAddReferenceGuideDrugDto.create(t)),
                        {
                            toNumberArray: ["id", "min", "max"]
                        }
                    );

                    const {failedRows, ...processedInfo} = await this.bulkAddReferenceGuideDrugs(
                        transformed,
                        referenceGuideDrugs,
                        referenceGuideId
                    );

                    if (failedRows.length === transformed.length) {
                        const hasDrugs = await this.fetchAll({referenceGuideId: referenceGuideId}, {});

                        if (!hasDrugs) {
                            const dtoRemoveReferenceGuide = RemoveReferenceGuideDto.create({
                                referenceGuideId: referenceGuideId,
                                facilityId: file.facilityId
                            });
                            await referenceGuideService.removeReferenceGuide(dtoRemoveReferenceGuide);
                        }
                    }

                    file.isEf = failedRows.length > 0;
                    file.info = processedInfo;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformed.length);
                    await fileService.updateFile(file);

                    if (file.isEf) {
                        await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(failedRows),
                            `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}-ef.${file.fileExtension}`
                        );
                    }
                } catch (error) {
                    file.status = FILE_STATUSES.FAILED;
                    await fileService.updateFile(file);
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_REFERENCE_GUIDE_DRUGS.PROCESS}${AppErrorMessage.BULK_ADD_REFERENCE_GUIDE_DRUGS.ADD_DRUGS}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_REFERENCE_GUIDE_DRUGS.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
