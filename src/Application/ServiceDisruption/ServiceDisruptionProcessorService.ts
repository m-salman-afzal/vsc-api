import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_STATUSES, REPOSITORIES, SERVICE_DISRUPTION_FILE_PROCESSES} from "@constants/FileConstant";

import ServiceDisruptionPatientValidation from "@validations/ServiceDisruptionPatientValidation";
import ServiceDisruptionValidation from "@validations/ServiceDisruptionValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, fileService, serviceDisruptionPatientService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {ServiceDisruptionService} from "./ServiceDisruptionService";

import type {AddServiceDisruptionPatientDto} from "@application/ServiceDisruptionPatient/Dtos/AddServiceDisruptionPatientDto";
import type {IServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {IServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";
import type {File} from "@infrastructure/Database/Models/File";

type TServiceDisruption = Partial<IServiceDisruptionEntity & IServiceDisruptionPatientEntity> & {
    externalFacilityId?: string;
    failedReason: string;
};

@injectable()
export class ServiceDisruptionProcessorService extends ServiceDisruptionService {
    private async subBulkAddServiceDisruption(
        transformedServiceDisruption: TServiceDisruption[],
        serviceDisruption: TServiceDisruption[],
        file: File
    ) {
        const failedRows: TServiceDisruption[] = [];
        let addedCount = 0;
        const updatedCount = 0;
        const removedCount = 0;
        let failedCount = 0;
        let processedNumber = -1;
        let processedInstanceNumber = -1;

        const duplicateServiceDisruptions = [];
        const serviceDisruptionEntities: (ServiceDisruptionEntity & {individuals: number})[] = [];

        let csvRowCounter = 0;
        await async.eachSeries(transformedServiceDisruption, async (dtoServiceDisruption) => {
            try {
                processedInstanceNumber++;
                dtoServiceDisruption.adminId = file.adminId;
                ServiceDisruptionValidation.addServiceDisruptionValidation(dtoServiceDisruption);
                const isServiceDisruption = await this.fetch({
                    date: SharedUtils.setDate(dtoServiceDisruption.date as string),
                    time: SharedUtils.setTime(dtoServiceDisruption.time as string),
                    service: dtoServiceDisruption.service as string,
                    reason: dtoServiceDisruption.reason as string,
                    facilityId: file.facilityId
                });

                const serviceDisruptionEntity = isServiceDisruption
                    ? ServiceDisruptionEntity.create(isServiceDisruption)
                    : ServiceDisruptionEntity.create({
                          ...dtoServiceDisruption,
                          serviceDisruptionId: SharedUtils.shortUuid(),
                          facilityId: file.facilityId
                      });
                if (!isServiceDisruption) {
                    await this.create(serviceDisruptionEntity);
                }

                const serviceDisruptionPatients = serviceDisruption.filter(
                    (sd) =>
                        sd.date === dtoServiceDisruption.date &&
                        sd.time === dtoServiceDisruption.time &&
                        sd.service === dtoServiceDisruption.service &&
                        sd.reason === dtoServiceDisruption.reason
                );

                let patientCounter = 0;
                await async.eachSeries(
                    serviceDisruptionPatients,
                    async (dtoServiceDisruptionPatient: Partial<AddServiceDisruptionPatientDto>) => {
                        try {
                            csvRowCounter++;
                            processedNumber++;
                            dtoServiceDisruptionPatient.serviceDisruptionId =
                                serviceDisruptionEntity.serviceDisruptionId;
                            ServiceDisruptionPatientValidation.addServiceDisruptionPatientValidation(
                                dtoServiceDisruptionPatient
                            );
                            const isServiceDisruptionPatient =
                                await serviceDisruptionPatientService.getServiceDisruptionPatient({
                                    serviceDisruptionId: serviceDisruptionEntity.serviceDisruptionId as string,
                                    patientName: dtoServiceDisruptionPatient.patientName as string,
                                    patientNumber: dtoServiceDisruptionPatient.patientNumber as string,
                                    time: dtoServiceDisruptionPatient.time as string
                                });

                            if (isServiceDisruptionPatient) {
                                duplicateServiceDisruptions.push(dtoServiceDisruptionPatient as never);

                                return;
                            }

                            await serviceDisruptionPatientService.addServiceDisruptionPatient(
                                dtoServiceDisruptionPatient as AddServiceDisruptionPatientDto
                            );

                            addedCount++;
                            patientCounter++;
                        } catch (error) {
                            if (error instanceof ZodError) {
                                const errorMessage = fromZodError(error);
                                (serviceDisruption[processedNumber] as TServiceDisruption).failedReason =
                                    errorMessage.toString();
                            }

                            failedRows.push(serviceDisruption[processedNumber] as TServiceDisruption);
                            failedCount++;
                        }
                    }
                );
                if (patientCounter > 0) {
                    serviceDisruptionEntities.push({
                        ...serviceDisruptionEntity,
                        individuals: patientCounter
                    });
                }
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    (serviceDisruption[processedInstanceNumber] as TServiceDisruption).failedReason =
                        errorMessage.toString();
                }

                failedRows.push(serviceDisruption[processedInstanceNumber] as TServiceDisruption);
                failedCount++;
            }
        });

        return {
            failedRows: failedRows,
            csvRowCounter: csvRowCounter,
            serviceDisruptionEntities: serviceDisruptionEntities,
            duplicateServiceDisruptions: duplicateServiceDisruptions,
            addedCount: addedCount,
            updatedCount: updatedCount,
            removedCount: removedCount,
            failedCount: failedCount
        };
    }

    async bulkAddServiceDisruption(options) {
        const {PROCESS_LABEL} = options;

        try {
            const files = await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: SERVICE_DISRUPTION_FILE_PROCESSES.BULK_ADD_SERVICE_DISRUPTION,
                repository: REPOSITORIES.SERVICE_DISRUPTION
            });
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    file.status = FILE_STATUSES.QUEUED;
                    await fileService.updateFile(file);

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}.${file.fileExtension}`
                    );
                    const serviceDisruptions = SharedUtils.csvToJson<TServiceDisruption>(csvString);
                    const transformed = SharedUtils.uniqueArrayOfObjects(structuredClone(serviceDisruptions), [
                        "date",
                        "time",
                        "service",
                        "reason"
                    ]);
                    const {
                        failedRows,
                        csvRowCounter,
                        serviceDisruptionEntities,
                        duplicateServiceDisruptions,
                        ...processedInfo
                    } = await this.subBulkAddServiceDisruption(transformed, serviceDisruptions, file);

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

                    const {date, time} = SharedUtils.convertDateTimeToEastern(
                        SharedUtils.getCurrentDate({}),
                        SharedUtils.getCurrentTime({})
                    );

                    if (csvRowCounter !== duplicateServiceDisruptions.length) {
                        await this.sendServiceDisruptionAlert(
                            {
                                date: date,
                                time: time,
                                count: csvRowCounter,
                                duplicate: duplicateServiceDisruptions.length
                            },
                            serviceDisruptionEntities,
                            file.facilityName,
                            PROCESS_LABEL
                        );
                    }
                } catch (error) {
                    file.status = FILE_STATUSES.FAILED;
                    await fileService.updateFile(file);
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_SERVICE_DISRUPTION.PROCESS}${AppErrorMessage.BULK_ADD_SERVICE_DISRUPTION.FILE_FAILED}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_SERVICE_DISRUPTION.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
