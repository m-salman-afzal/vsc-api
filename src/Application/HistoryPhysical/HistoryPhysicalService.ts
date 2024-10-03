import async from "async";
import {DateTime} from "luxon";
import {inject, injectable} from "tsyringe";
import {z} from "zod";

import {HistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";
import {PatientEntity} from "@entities/Patient/PatientEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS, SAPPHIRE_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS} from "@constants/FileConstant";
import {ATA_STATUS, ELEVEN_DAYS, ISALPHA, TWELVE_MONTHS} from "@constants/HistoryPhysicalConstant";
import {PATIENT_STATUS_TYPE} from "@constants/PatientConstant";
import {BATCH_SIZE} from "@constants/RepositoryConstant";
import {SAPPHIRE_FILENAME_PREFIX} from "@constants/SapphireConstant";

import {DATE_TIME_FORMAT} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, facilityService, patientService, processService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import type {GetHistoryPhysicalDTO} from "./DTOs/GetHistoryPhysicalDTO";
import type IHistoryPhysicalRepository from "@entities/HistoryPhysical/IHistoryPhysicalRepository";
import type {Process} from "@infrastructure/Database/Models/Process";

interface IUncleanHPData {
    SAPPHIRE_PAT_ID: string;
    FACILITY: string;
    FACILITY_ID: string;
    JMS_ID: string;
    PATIENT_NAME: string;
    LOCATION: string;
    DOB: string;
    GENDER: string;
    PAT_STATUS: string;
    LAST_BOOKED_DATE_FORMATTED: string;
    LAST_RELEASE_DATE: string;
    AGE: string;
    LAST_BOOKED_DATE: string;
    LAST_PA: string;
    LAST_PCHP: string;
    LAST_PAHP: string;
    ATA_STATUS: string;
}

type TCleanHPData = Omit<
    IUncleanHPData,
    | "AGE"
    | "DOB"
    | "LAST_RELEASE_DATE"
    | "LAST_BOOKED_DATE_FORMATTED"
    | "LAST_PA"
    | "LAST_PCHP"
    | "LAST_BOOKED_DATE"
    | "LAST_PAHP"
> & {
    AGE: number;
    DOB: Date;
    LAST_PA: Date | "NULL";
    LAST_PCHP: Date | "NULL";
    LAST_BOOKED_DATE: Date;
    LAST_PAHP: Date | "NULL";
    LAST_RELEASE_DATE: string;
};

const DATE_OR_NULL = z
    .custom<Date | "NULL">((d) => {
        if (typeof d !== "string") {
            return false;
        }

        if (d === "NULL") {
            return true;
        }

        return z.coerce.date().safeParse(d).success;
    })
    .transform((x) => {
        if (x === "NULL") {
            return x;
        }

        return new Date(x);
    });

const SaphireDataSchema: z.Schema<TCleanHPData> = z.object({
    SAPPHIRE_PAT_ID: z.string(),
    FACILITY: z.string(),
    FACILITY_ID: z.string(),
    JMS_ID: z.string(),
    PATIENT_NAME: z.string(),
    LOCATION: z.string(),
    DOB: z.coerce.date(),
    GENDER: z.string(),
    PAT_STATUS: z.string(),
    LAST_BOOKED_DATE: z.coerce.date(),
    LAST_RELEASE_DATE: z.string(),
    AGE: z.coerce.number(),
    LAST_PA: DATE_OR_NULL,
    LAST_PCHP: DATE_OR_NULL,
    LAST_PAHP: DATE_OR_NULL,
    ATA_STATUS: z.enum(ATA_STATUS)
});

type AnnualHP = Omit<
    TCleanHPData,
    | "LAST_PA"
    | "LAST_PCHP"
    | "LAST_BOOKED_DATE"
    | "PAT_STATUS"
    | "FACILITY_ID"
    | "FACILITY"
    | "LAST_PAHP"
    | "ATA_STATUS"
> & {ANNUAL_HP_DATE: Date; isYearly: true; facilityId: string; patientId: string};

type InitialHP = Omit<
    TCleanHPData,
    "LAST_PA" | "LAST_PCHP" | "PAT_STATUS" | "FACILITY_ID" | "FACILITY" | "LAST_PAHP" | "ATA_STATUS"
> & {
    INITIAL_HP_DATE: Date;
    isYearly: false;
    facilityId: string;
    patientId: string;
};

export interface IAnnualHPTransformer {
    historyPhysicalId: string;
    sapphirePatientId: string;
    patientName: string;
    patientNumber: string;
    location: string;
    dob: string;
    age: number;
    annualDate: string;
    isYearly: true;
    facilityId: string;
    patientId: string;
    externalPatientId: string;
}

export interface IInitialHPTransformer {
    historyPhysicalId: string;
    sapphirePatientId: string;
    patientName: string;
    patientNumber: string;
    location: string;
    dob: string;
    age: number;
    initialDate: string;
    lastBooked: string;
    isYearly: false;
    facilityId: string;
    patientId: string;
    externalPatientId: string;
}

@injectable()
export class HistoryPhysicalService {
    constructor(@inject("IHistoryPhysicalRepository") private historyPhysicalRepository: IHistoryPhysicalRepository) {}

    private locationValidator(location: string): boolean {
        const data = location.split("-");

        const unit = data[0]?.trim();
        const room = data[2]?.trim();
        const bunk = data[3]?.trim();

        if (!unit || !room || !bunk) {
            return false;
        }
        if (unit === "Z") {
            return true;
        }
        if (!ISALPHA.test(bunk)) {
            return false;
        }

        return true;
    }

    private isValidByLoc(row: TCleanHPData): boolean {
        return this.locationValidator(row.LOCATION);
    }

    private isAtaStatus(row: TCleanHPData) {
        return row.ATA_STATUS === "FALSE";
    }

    private toAnnualHpReport(row: TCleanHPData, annualHpDate: Date): AnnualHP {
        return {
            PATIENT_NAME: row.PATIENT_NAME,
            DOB: row.DOB,
            LOCATION: row.LOCATION,
            AGE: row.AGE,
            JMS_ID: row.JMS_ID,
            GENDER: row.GENDER,
            SAPPHIRE_PAT_ID: row.SAPPHIRE_PAT_ID,
            ANNUAL_HP_DATE: annualHpDate,
            isYearly: true,
            facilityId: row.FACILITY_ID,
            patientId: "",
            LAST_RELEASE_DATE: row.LAST_RELEASE_DATE
        };
    }

    private calculateAnnualHpDate(row: TCleanHPData): AnnualHP {
        const dates = [row.LAST_PA, row.LAST_PCHP, row.LAST_PAHP].filter((d) => d !== "NULL") as Date[];

        if (dates.length === 0) {
            throw new Error();
        }

        const mostRecentDate = DateTime.fromJSDate(
            SharedUtils.addMonthsToDate(
                SharedUtils.getRecentDate(...dates.map((date) => DateTime.fromJSDate(date))),
                TWELVE_MONTHS
            )
        );

        return this.toAnnualHpReport(row, mostRecentDate.toJSDate());
    }

    private calculateHPDate(row: TCleanHPData): AnnualHP | InitialHP {
        if (row.LAST_PCHP === "NULL" && row.LAST_PA === "NULL" && row.LAST_PAHP === "NULL") {
            const initialHPDate: Date = SharedUtils.addDaysToDate(row.LAST_BOOKED_DATE, ELEVEN_DAYS);

            return {
                PATIENT_NAME: row.PATIENT_NAME,
                DOB: row.DOB,
                LOCATION: row.LOCATION,
                JMS_ID: row.JMS_ID,
                AGE: row.AGE,
                GENDER: row.GENDER,
                SAPPHIRE_PAT_ID: row.SAPPHIRE_PAT_ID,
                LAST_BOOKED_DATE: row.LAST_BOOKED_DATE,
                INITIAL_HP_DATE: initialHPDate,
                isYearly: false,
                facilityId: row.FACILITY_ID,
                patientId: "",
                LAST_RELEASE_DATE: row.LAST_RELEASE_DATE
            };
        }

        return this.calculateAnnualHpDate(row);
    }

    private cleanHPRows(rows: IUncleanHPData[]): TCleanHPData[] {
        const rs: TCleanHPData[] = [];

        rows.forEach((r) => {
            const parsed = SaphireDataSchema.safeParse(r);

            if (parsed.success) {
                rs.push(parsed.data);
            }
        });

        return rs;
    }

    private historyPhysicalTransformer(row: AnnualHP | InitialHP): IInitialHPTransformer | IAnnualHPTransformer {
        if (row.isYearly) {
            return {
                historyPhysicalId: SharedUtils.shortUuid(),
                sapphirePatientId: row.SAPPHIRE_PAT_ID,
                patientName: row.PATIENT_NAME,
                patientNumber: row.JMS_ID,
                location: row.LOCATION,
                dob: row.DOB.toISOString(),
                age: row.AGE,
                annualDate: row.ANNUAL_HP_DATE.toISOString(),
                isYearly: true,
                facilityId: row.facilityId,
                patientId: row.patientId,
                externalPatientId: row.SAPPHIRE_PAT_ID
            };
        }

        return {
            historyPhysicalId: SharedUtils.shortUuid(),
            sapphirePatientId: row.SAPPHIRE_PAT_ID,
            patientName: row.PATIENT_NAME,
            patientNumber: row.JMS_ID,
            location: row.LOCATION,
            dob: row.DOB.toISOString(),
            age: row.AGE,
            initialDate: row.INITIAL_HP_DATE.toISOString(),
            lastBooked: row.LAST_BOOKED_DATE.toISOString(),
            isYearly: false,
            facilityId: row.facilityId,
            patientId: row.patientId,
            externalPatientId: row.SAPPHIRE_PAT_ID
        };
    }

    private async getFacilityIds(cleanHPRows: TCleanHPData[]) {
        const uniqueExternalFacilityIds = SharedUtils.getUniqueArrayFromObject(cleanHPRows, "FACILITY_ID");
        const facility = await facilityService.getFacilitiesById({
            externalFacilityId: uniqueExternalFacilityIds
        });
        if (!facility) {
            throw new Error();
        }

        return facility.map((f) => {
            return {[f.externalFacilityId]: f.facilityId};
        });
    }

    private setFacilityId(processedHP: IInitialHPTransformer | IAnnualHPTransformer, externalFacilityId: object[]) {
        const [facilityId] = externalFacilityId.filter((fId) => fId[processedHP.facilityId]);

        return {
            ...processedHP,
            facilityId: (facilityId as object)[processedHP.facilityId]
        };
    }

    private async setPatientIdInBatch(processedHP: HistoryPhysicalEntity[], cleanHPRows: TCleanHPData[]) {
        const noPatientFound: HistoryPhysicalEntity[] = [];
        const historyPhysicals: HistoryPhysicalEntity[] = [];
        const batchNumbers = Math.ceil(processedHP.length / BATCH_SIZE);
        const countArray = Array.from(Array(batchNumbers).keys());

        let count = 0;
        await async.eachSeries(countArray, async () => {
            const batchedHP = processedHP.slice(count, count + BATCH_SIZE);
            const jmsPatientIds = batchedHP.map((r) => r.patientNumber);

            count += BATCH_SIZE;
            const patients = await patientService.getPatientsById({jmsId: jmsPatientIds as string[]});
            if (!patients) {
                return noPatientFound.push(...batchedHP);
            }

            return batchedHP.forEach((r) => {
                const patient = patients.find((p) => p.jmsId === r.patientNumber);
                if (!patient) {
                    return noPatientFound.push(r);
                }

                return historyPhysicals.push({
                    ...r,
                    patientId: patient.patientId
                });
            });
        });

        if (noPatientFound.length > 0) {
            const patients = noPatientFound.map((f) => cleanHPRows.filter((r) => r.JMS_ID === f.patientNumber)[0]);
            const patientEntities = await patientService.addPatients(patients as [], true);
            if (!patientEntities) {
                throw new Error();
            }
            const mappedPatients = noPatientFound.map((f) => {
                return {
                    ...f,
                    patientId: patientEntities.patientEntities.find((r) => r.jmsId === f.patientNumber)
                        ?.patientId as string
                };
            });
            historyPhysicals.push(...mappedPatients);
        }

        return historyPhysicals;
    }

    async processHistoryPhysicalRecord(options: {FILE_PREFIX: string; PROCESS_LABEL: string}) {
        const process = await processService.subGetProcesses({processLabel: options.PROCESS_LABEL});
        if (!process) {
            return;
        }

        const isTime = SharedUtils.isCronTime((process[0] as Process).time);
        if (!isTime) {
            return;
        }

        const filenames = await SharedUtils.getSapphireFilenames({
            service: HistoryPhysicalService.name,
            process: this.processHistoryPhysicalRecord.name,
            bucket: BUCKETS.SAPPHIRE,
            filenameFilter: SAPPHIRE_FILENAME_PREFIX.PHYSICAL_ASSESSMENT,
            filename: `${SharedUtils.getCurrentDate({format: DATE_TIME_FORMAT.YMD_SAPPHIRE})}_${
                SAPPHIRE_FILENAME_PREFIX.PHYSICAL_ASSESSMENT
            }.${FILE_EXTENSIONS.CSV}`,
            argsPrefix: options.FILE_PREFIX
        });
        if (!filenames) {
            return;
        }

        await async.eachSeries(filenames, async (filename) => {
            try {
                const csvString = await cloudStorageUtils.getFileContent(BUCKETS.SAPPHIRE, `${filename}`);
                const rows = SharedUtils.csvToJson(csvString) as IUncleanHPData[];
                const cleanHPRows = this.cleanHPRows(rows);
                const facilityIds = await this.getFacilityIds(cleanHPRows);
                const failed: HistoryPhysicalEntity[] = [];

                const processed = cleanHPRows
                    .filter((r) => this.isValidByLoc(r))
                    .filter((r) => this.isAtaStatus(r))
                    .map((r) => this.calculateHPDate(r))
                    .map((r) => this.historyPhysicalTransformer(r))
                    .map((r) => this.setFacilityId(r, facilityIds));

                const hp = await this.setPatientIdInBatch(processed, cleanHPRows);

                await async.eachSeries(hp, async (row) => {
                    try {
                        const hpFinalRecord = HistoryPhysicalEntity.create(row);
                        const isHp = await this.historyPhysicalRepository.fetch([
                            {sapphirePatientId: hpFinalRecord.sapphirePatientId},
                            {patientId: hpFinalRecord.patientId}
                        ]);
                        if (isHp) {
                            return await this.historyPhysicalRepository.update(
                                {historyPhysicalId: isHp.historyPhysicalId},
                                hpFinalRecord
                            );
                        }

                        return await this.historyPhysicalRepository.create(hpFinalRecord);
                    } catch (error) {
                        return failed.push(row);
                    }
                });

                if (failed.length > 0) {
                    await cloudStorageUtils.uploadFile(
                        BUCKETS.FCH,
                        SharedUtils.jsonToCsv(failed),
                        `${FCH_BUCKET_FOLDERS.SAPPHIRE}/${SharedUtils.getCurrentDate({
                            format: DATE_TIME_FORMAT.YMD_SAPPHIRE
                        })}_${SAPPHIRE_FILENAME_PREFIX.PHYSICAL_ASSESSMENT}-ef.${FILE_EXTENSIONS.CSV}`
                    );
                }

                await cloudStorageUtils.renameFile(
                    BUCKETS.SAPPHIRE,
                    filename,
                    `${SAPPHIRE_BUCKET_FOLDERS.PROCESSED}/${filename}`
                );

                return true;
            } catch (error) {
                return ErrorLog(error, {
                    prefixMessage: `${AppErrorMessage.HISTORY_PHYSICAL.PROCESS}${AppErrorMessage.HISTORY_PHYSICAL.FETCH_DATA}`
                });
            }
        });
    }

    async getHistoryPhysicalData(body: GetHistoryPhysicalDTO) {
        const targetDate = DateTime.fromJSDate(new Date()).toSQLDate() as string;
        if (body.isYearly) {
            if (!body.to || !body.from) {
                const annualRepoData = await this.historyPhysicalRepository.fetchBySearchQuery({
                    isYearly: true,
                    annualDate: targetDate,
                    facilityId: body.facilityId,
                    status: PATIENT_STATUS_TYPE.ACTIVE
                });
                if (!annualRepoData) {
                    return HttpResponse.notFound();
                }

                const hpEntities = annualRepoData.map((row) => {
                    return {
                        ...HistoryPhysicalEntity.publicFields(row),
                        ...PatientEntity.publicFields(row)
                    };
                });

                return HttpResponse.ok(hpEntities);
            }

            const fromDate = DateTime.fromJSDate(new Date(body.from as string)).toSQLDate() as string;
            const toDate = DateTime.fromJSDate(new Date(body.to as string)).toSQLDate() as string;

            const annualRepoData = await this.historyPhysicalRepository.fetchBySearchQuery({
                isYearly: true,
                facilityId: body.facilityId,
                fromDate: fromDate,
                toDate: toDate,
                status: PATIENT_STATUS_TYPE.ACTIVE
            });
            if (!annualRepoData) {
                return HttpResponse.notFound();
            }

            const hpEntities = annualRepoData.map((row) => {
                return {
                    ...HistoryPhysicalEntity.publicFields(row),
                    ...PatientEntity.publicFields(row)
                };
            });

            return HttpResponse.ok(hpEntities);
        }

        const initialRepoData = await this.historyPhysicalRepository.fetchBySearchQuery({
            isYearly: false,
            initialDate: targetDate,
            facilityId: body.facilityId,
            status: PATIENT_STATUS_TYPE.ACTIVE
        });
        if (!initialRepoData) {
            return HttpResponse.notFound();
        }

        const hpEntities = initialRepoData.map((row) => {
            return {
                ...HistoryPhysicalEntity.publicFields(row),
                ...PatientEntity.publicFields(row)
            };
        });

        return HttpResponse.ok(hpEntities);
    }
}
