import async from "async";
import {inject, injectable} from "tsyringe";

import {PatientEntity} from "@entities/Patient/PatientEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS, SAPPHIRE_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS} from "@constants/FileConstant";
import {SAPPHIRE_FILENAME_PREFIX} from "@constants/SapphireConstant";

import {PatientValidation} from "@validations/PatientValidation";

import {PatientTransformer} from "@domain/Transformers/ActiveRosterTransformer";

import {DATE_TIME_FORMAT, ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {PatientFilter} from "@repositories/Shared/ORM/PatientFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cloudStorageUtils, facilityService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import type {AddPatientDTO} from "./DTOs/AddPatientDTO";
import type {GetPatientDTO} from "./DTOs/GetPatientDTO";
import type {IExternalPatient} from "@domain/Transformers/ActiveRosterTransformer";
import type {IPatientRepository} from "@entities/Patient/IPatientRepository";
import type {Patient} from "@infrastructure/Database/Models/Patient";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TOrderBy, TSearchFilters} from "@typings/ORM";

@injectable()
export class PatientService {
    constructor(@inject("IPatientRepository") private patientRepository: IPatientRepository) {}

    async fetchAll(searchFilters: TSearchFilters<Patient>, orderBy: TOrderBy<Patient>) {
        return await this.patientRepository.fetchAll(searchFilters, orderBy);
    }

    async subAddPatient(addPatientDTO: AddPatientDTO) {
        const searchFilters = PatientFilter.setFilter({
            jmsId: addPatientDTO.jmsId
        });
        const isPatient = await this.patientRepository.fetch(searchFilters);

        const patientEntity = PatientEntity.create(addPatientDTO);
        patientEntity.patientId = isPatient ? isPatient.patientId : SharedUtils.shortUuid();
        await this.patientRepository.upsert(patientEntity, searchFilters);

        return patientEntity;
    }

    async subGetPatients(getPatientDTO: GetPatientDTO, paginationDTO: PaginationDto) {
        const searchFilters = PatientFilter.setFilter({...getPatientDTO, name: getPatientDTO.searchText as string});
        const pagination = PaginationOptions.create(paginationDTO);
        const patients = await this.patientRepository.fetchPaginated(searchFilters, {name: ORDER_BY.ASC}, pagination);
        if (!patients) {
            return false;
        }

        const patientEntities = patients.map((patient) => PatientEntity.publicFields(patient));
        const patientCount = await this.patientRepository.count(searchFilters);

        return PaginationData.getPaginatedData(pagination, patientCount, patientEntities);
    }

    async getAllActivePatients() {
        const patients = await this.patientRepository.fetchAll(
            {
                status: "ACTIVE"
            },
            {}
        );
        if (!patients) {
            return false;
        }

        const patientEntities = patients.map((patient) => PatientEntity.publicFields(patient));

        return patientEntities;
    }

    async getPatients(getPatientDTO: GetPatientDTO, paginationDTO: PaginationDto) {
        try {
            const patientEntities = await this.subGetPatients(getPatientDTO, paginationDTO);
            if (!patientEntities) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(patientEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subBulkAddPatients(patients: AddPatientDTO[]) {
        const failedPatients: AddPatientDTO[] = [];
        const patientEntities: PatientEntity[] = [];
        await async.eachSeries(patients, async (patient) => {
            try {
                PatientValidation.addPatientValidation(patient);
                const patientEntity = await this.subAddPatient(patient);
                patientEntities.push(patientEntity);
            } catch (error) {
                failedPatients.push(patient);
            }
        });

        return {patientEntities, failedPatients};
    }

    async bulkUpsertPatients(options: {FILE_PREFIX: string}) {
        try {
            const filenames = await SharedUtils.getSapphireFilenames({
                service: PatientService.name,
                process: this.bulkUpsertPatients.name,
                bucket: BUCKETS.SAPPHIRE,
                filenameFilter: SAPPHIRE_FILENAME_PREFIX.ROSTER,
                filename: [
                    `${SharedUtils.getCurrentDate({format: DATE_TIME_FORMAT.YMD_SAPPHIRE})}_${
                        SAPPHIRE_FILENAME_PREFIX.ACTIVE_ROSTER
                    }.${FILE_EXTENSIONS.CSV}`,
                    `${SharedUtils.getCurrentDate({format: DATE_TIME_FORMAT.YMD_SAPPHIRE})}_${
                        SAPPHIRE_FILENAME_PREFIX.RELEASE_ROSTER
                    }.${FILE_EXTENSIONS.CSV}`
                ],
                argsPrefix: options.FILE_PREFIX
            });
            if (!filenames) {
                return;
            }

            await async.eachSeries(filenames, async (filename) => {
                try {
                    const csvString = await cloudStorageUtils.getFileContent(BUCKETS.SAPPHIRE, filename);

                    const rows = SharedUtils.csvToJson(csvString) as [];
                    rows.shift();

                    const failed = [];
                    const patients = await this.addPatients(rows);
                    if (!patients) {
                        return failed.push(rows as never);
                    }

                    if (patients.failedPatients.length > 0) {
                        return await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(patients.failedPatients),
                            `${FCH_BUCKET_FOLDERS.SAPPHIRE}/${SharedUtils.getCurrentDate({
                                format: DATE_TIME_FORMAT.YMD_SAPPHIRE
                            })}_${SAPPHIRE_FILENAME_PREFIX.ACTIVE_ROSTER}-ef.${FILE_EXTENSIONS.CSV}`
                        );
                    }

                    if (failed.length > 0) {
                        return await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(failed),
                            `${FCH_BUCKET_FOLDERS.SAPPHIRE}/${SharedUtils.getCurrentDate({
                                format: DATE_TIME_FORMAT.YMD_SAPPHIRE
                            })}_${SAPPHIRE_FILENAME_PREFIX.ACTIVE_ROSTER}-ef.${FILE_EXTENSIONS.CSV}`
                        );
                    }

                    await cloudStorageUtils.renameFile(
                        BUCKETS.SAPPHIRE,
                        filename,
                        `${SAPPHIRE_BUCKET_FOLDERS.PROCESSED}/${filename}`
                    );
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_PATIENTS.PROCESS}${AppErrorMessage.BULK_ADD_PATIENTS.ADD_PATIENTS}`
                    });
                }
            });

            return true;
        } catch (error) {
            return ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_PATIENTS.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }

    private setDateTimesForSapphire(record: PatientTransformer, fromHp: boolean) {
        return {
            ...record,
            dob: SharedUtils.setDate(record.dob),
            lastBookedDate: fromHp ? record.lastBookedDate : SharedUtils.setDateTimeForSapphire(record.lastBookedDate),
            lastReleaseDate: record.lastReleaseDate
                ? SharedUtils.setDateTimeForSapphire(record.lastReleaseDate)
                : record.lastReleaseDate
        };
    }

    async getPatientsById(searchBy: {
        id?: number;
        patientId?: string | string[];
        externalPatientId?: string | string[];
        jmsId?: string | string[];
    }) {
        const searchFilter = PatientFilter.setFilter(searchBy);
        const facilities =
            Object.keys(searchFilter).length > 0
                ? await this.patientRepository.fetchAll(searchFilter, {id: ORDER_BY.ASC})
                : false;
        if (!facilities) {
            return false;
        }

        return facilities.map((facility) => PatientEntity.create(facility));
    }

    private async getFacilityIds(externalPatient: IExternalPatient[]) {
        const uniqueExternalFacilityIds = SharedUtils.getUniqueArrayFromObject(externalPatient, "FACILITY_ID");
        const facility = await facilityService.getFacilitiesById({
            externalFacilityId: uniqueExternalFacilityIds
        });
        if (!facility) {
            return false;
        }

        return facility.map((f) => {
            return {[f.externalFacilityId]: f.facilityId};
        });
    }

    private setFacilityId(patient: PatientEntity, externalFacilityId: object[]) {
        const [facilityId] = externalFacilityId.filter((fId) => fId[patient.facilityId]);

        return {
            ...patient,
            facilityId: (facilityId as object)[patient.facilityId]
        };
    }

    async addPatients(rows: [], fromHp = false) {
        const patientRows = rows.map((mp) => PatientTransformer.create(mp));
        const transformedRecords = SharedUtils.convertStringToPrimitives(patientRows, {});

        const facilityIds = await this.getFacilityIds(rows);
        if (!facilityIds) {
            return false;
        }
        const patients = transformedRecords
            .map((r) => this.setDateTimesForSapphire(r, fromHp))
            .map((r) => this.setFacilityId(r, facilityIds));

        return await this.subBulkAddPatients(patients);
    }
}
