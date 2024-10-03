import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {BUCKETS} from "@constants/CloudStorageConstant";
import {ADMIN_FILE_PROCESSES, FILE_STATUSES, REPOSITORIES, ROW_ACTION} from "@constants/FileConstant";

import AdminValidation from "@validations/AdminValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, facilityService, fileService, roleService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {AdminService} from "./AdminService";

import type {UpsertAdminDto} from "./Dtos/UpsertAdminDto";

@injectable()
export class AdminProcessorService extends AdminService {
    private async subBulkUpsertAdmins(transformedAdmins: UpsertAdminDto[], admins: UpsertAdminDto[]) {
        const failedRows: UpsertAdminDto[] = [];
        let addedCount = 0;
        let updatedCount = 0;
        let removedCount = 0;
        let failedCount = 0;
        let processedNumber = -1;

        await async.eachSeries(transformedAdmins, async (admin) => {
            try {
                processedNumber++;

                const facilities = await facilityService.getFacilitiesById({
                    externalFacilityId: admin.facility
                });
                if (!facilities) {
                    (admins[processedNumber] as UpsertAdminDto).failedReason = "Facility not found";
                    failedRows.push(admins[processedNumber] as UpsertAdminDto);

                    return;
                }

                admin.facilityId = facilities.map((facility) => facility.facilityId);

                const roles = await roleService.subGetRoles({name: admin.role});
                if (!roles) {
                    (admins[processedNumber] as UpsertAdminDto).failedReason = "Role not found";
                    failedRows.push(admins[processedNumber] as UpsertAdminDto);
                    failedCount++;

                    return;
                }

                admin.roleId = roles.map((role) => role.roleId);

                switch (admin.action) {
                    case ROW_ACTION.ADD:
                        {
                            if (admin.id) {
                                (admins[processedNumber] as UpsertAdminDto).failedReason = "Action and id mismatch";
                                failedRows.push(admins[processedNumber] as UpsertAdminDto);
                                failedCount++;

                                return;
                            }

                            AdminValidation.addAdminValidation(admin);
                            const addedAdmin = await this.subAddAdmin(admin);
                            if (!addedAdmin) {
                                (admins[processedNumber] as UpsertAdminDto).failedReason = "Already exists";
                                failedRows.push(admins[processedNumber] as UpsertAdminDto);
                                failedCount++;

                                return;
                            }

                            addedCount++;
                        }
                        break;

                    case ROW_ACTION.EDIT:
                        {
                            if (!admin.id) {
                                (admins[processedNumber] as UpsertAdminDto).failedReason = "Action and id mismatch";
                                failedRows.push(admins[processedNumber] as UpsertAdminDto);
                                failedCount++;

                                return;
                            }

                            AdminValidation.updateAdminValidation(admin);
                            const updatedAdmin = await this.subUpdateAdmin(admin);
                            if (!updatedAdmin) {
                                (admins[processedNumber] as UpsertAdminDto).failedReason = "Not found";
                                failedRows.push(admins[processedNumber] as UpsertAdminDto);
                                failedCount++;

                                return;
                            }

                            updatedCount++;
                        }
                        break;

                    case ROW_ACTION.DELETE:
                        {
                            if (!admin.id) {
                                (admins[processedNumber] as UpsertAdminDto).failedReason = "Action and id mismatch";
                                failedRows.push(admins[processedNumber] as UpsertAdminDto);
                                failedCount++;

                                return;
                            }

                            AdminValidation.removeAdminValidation(admin);
                            const removedAdmin = await this.subRemoveAdmin(admin);
                            if (!removedAdmin) {
                                (admins[processedNumber] as UpsertAdminDto).failedReason = "Not found";
                                failedRows.push(admins[processedNumber] as UpsertAdminDto);
                                failedCount++;

                                return;
                            }

                            removedCount++;
                        }
                        break;

                    default:
                        (admins[processedNumber] as UpsertAdminDto).failedReason = "Wrong action";
                        failedRows.push(admins[processedNumber] as UpsertAdminDto);
                        failedCount++;
                        break;
                }
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    (admins[processedNumber] as UpsertAdminDto).failedReason = errorMessage.toString();
                }

                failedRows.push(admins[processedNumber] as UpsertAdminDto);
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

    async bulkUpsertAdmins() {
        try {
            const getFileDTO = {
                status: FILE_STATUSES.RECEIVED,
                process: ADMIN_FILE_PROCESSES.BULK_UPSERT_ADMINS,
                repository: REPOSITORIES.ADMIN
            };
            const files = await fileService.fetchBySearchQuery(getFileDTO);
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${file.repository}/${file.fileId}.${file.fileExtension}`
                    );

                    const admins = SharedUtils.csvToJson<UpsertAdminDto>(csvString);
                    const transformedAdmins = SharedUtils.convertStringToPrimitives(structuredClone(admins), {
                        toArray: ["facility", "role"],
                        toNumberArray: ["id"]
                    });
                    const {failedRows, ...processedInfo} = await this.subBulkUpsertAdmins(transformedAdmins, admins);

                    file.isEf = failedRows.length > 0;
                    file.info = processedInfo;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformedAdmins.length);
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
                        prefixMessage: `${AppErrorMessage.BULK_UPSERT_ADMINS.PROCESS}${AppErrorMessage.BULK_UPSERT_ADMINS.UPSERT_ADMIN}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_UPSERT_ADMINS.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
