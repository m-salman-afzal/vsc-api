import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {PERMISSIONS} from "@constants/AuthConstant";
import {BUCKETS} from "@constants/CloudStorageConstant";
import {FILE_STATUSES, FORMULARY_FILE_PROCESSES, REPOSITORIES, ROW_ACTION} from "@constants/FileConstant";
import {DRUG_TYPES} from "@constants/FormularyConstant";
import {VALIDATION_MESSAGES_VALUE_OBJECTS} from "@constants/ValidationMessagesConstant";

import {FormularyValidation} from "@validations/FormularyValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {adminService, cloudStorageUtils, fileService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {BulkAddFormularyDto} from "./Dtos/BulkAddFormularyDto";
import {FormularyService} from "./FormularyService";

@injectable()
export class FormularyProcessorService extends FormularyService {
    private async subBulkAddFormulary(
        transformedFormulary: BulkAddFormularyDto[],
        formulary: BulkAddFormularyDto[],
        rbac: Record<string, string>
    ) {
        const failedRows: BulkAddFormularyDto[] = [];
        const {formularyNonControlled, formularyControlled} = rbac;
        let addedCount = 0;
        let updatedCount = 0;
        let removedCount = 0;
        let failedCount = 0;
        let processedNumber = -1;

        await async.eachSeries(transformedFormulary, async (fm) => {
            try {
                processedNumber++;

                fm.drugName =
                    fm.brandName && fm.drugName && fm.drugName.toLowerCase() === fm.brandName.toLowerCase()
                        ? DRUG_TYPES.BRAND
                        : DRUG_TYPES.GENERIC;

                if (fm.isControlled && formularyControlled !== PERMISSIONS.WRITE) {
                    failedCount = this.handleFailure(
                        formulary,
                        processedNumber,
                        failedRows,
                        failedCount,
                        VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ACTION_RBAC
                    );

                    return;
                }

                if (!fm.isControlled && formularyNonControlled !== PERMISSIONS.WRITE) {
                    failedCount = this.handleFailure(
                        formulary,
                        processedNumber,
                        failedRows,
                        failedCount,
                        VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ACTION_RBAC
                    );

                    return;
                }

                switch (fm.action) {
                    case ROW_ACTION.ADD:
                        {
                            if (fm.id) {
                                (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ACTION_AND_ID_MISMATCH;
                                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                                failedCount++;

                                return;
                            }

                            FormularyValidation.addFormularyValidation(fm);
                            const addedFormulary = await this.subAddFormulary(fm);
                            if (!addedFormulary) {
                                (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ALREADY_EXISTS;
                                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                                failedCount++;

                                return;
                            }

                            addedCount++;
                        }
                        break;

                    case ROW_ACTION.EDIT:
                        {
                            if (!fm.id) {
                                (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ACTION_AND_ID_MISMATCH;
                                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                                failedCount++;

                                return;
                            }

                            FormularyValidation.updateFormualaryValidation(fm);
                            const updatedFormulary = await this.subUpdateFormulary(fm);
                            if (!updatedFormulary) {
                                (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NOT_FOUND;
                                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                                failedCount++;

                                return;
                            }

                            updatedCount++;
                        }
                        break;

                    case ROW_ACTION.DELETE:
                        {
                            if (!fm.id) {
                                (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.ACTION_AND_ID_MISMATCH;
                                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                                failedCount++;

                                return;
                            }

                            FormularyValidation.removeFormularyValidation(fm);
                            const removedFormulary = await this.subRemoveFormulary(fm);
                            if (!removedFormulary) {
                                (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                                    VALIDATION_MESSAGES_VALUE_OBJECTS.NOT_FOUND;
                                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                                failedCount++;

                                return;
                            }

                            removedCount++;
                        }
                        break;

                    default:
                        (formulary[processedNumber] as BulkAddFormularyDto).failedReason =
                            VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ACTION;
                        failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
                        failedCount++;

                        break;
                }
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    (formulary[processedNumber] as BulkAddFormularyDto).failedReason = errorMessage.toString();
                }

                failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
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

    handleFailure(
        formulary: BulkAddFormularyDto[],
        processedNumber: number,
        failedRows: BulkAddFormularyDto[],
        failedCount: number,
        failedReason: string
    ): number {
        (formulary[processedNumber] as BulkAddFormularyDto).failedReason = failedReason;
        failedRows.push(formulary[processedNumber] as BulkAddFormularyDto);
        failedCount++;

        return failedCount;
    }

    async bulkAddFormulary() {
        try {
            const getFileDto = {
                status: FILE_STATUSES.RECEIVED,
                process: FORMULARY_FILE_PROCESSES.BULK_ADD_FORMULARY,
                repository: REPOSITORIES.FORMULARY
            };
            const files = await fileService.fetchBySearchQuery(getFileDto);
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});
                    const admin = await adminService.fetchByQuery({adminId: file.adminId});
                    const rbac = SharedUtils.setRoleServiceList(admin as any);

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${file.repository}/${file.fileId}.${file.fileExtension}`
                    );

                    const formulary = SharedUtils.csvToJson<BulkAddFormularyDto>(csvString);
                    const transformed = SharedUtils.convertStringToPrimitives(
                        structuredClone(formulary).map((t: any) => BulkAddFormularyDto.create(t)),
                        {
                            toBooleanArray: ["isGeneric", "isControlled", "isActive", "isFormulary"],
                            toNumberArray: ["id", "unitsPkg"]
                        }
                    );
                    const {failedRows, ...processedInfo} = await this.subBulkAddFormulary(transformed, formulary, rbac);

                    file.isEf = failedRows.length > 0;
                    file.info = processedInfo;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformed.length);
                    await fileService.updateFile(file);

                    if (file.isEf) {
                        await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(failedRows),
                            `${file.repository}/${file.fileId}-ef.${file.fileExtension}`
                        );
                    }
                } catch (error) {
                    file.status = FILE_STATUSES.FAILED;
                    await fileService.updateFile(file);
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_FORMULARY.PROCESS}${AppErrorMessage.BULK_ADD_FORMULARY.ADD_FORMULARY}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_FORMULARY.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
