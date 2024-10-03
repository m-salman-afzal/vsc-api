import {parse, stringify, transform} from "csv/sync";
import {DateTime} from "luxon";
import {v4} from "uuid";

import {PERMISSION_PRIORITY} from "@constants/AuthConstant";
import {FCH} from "@constants/FchConstant";
import {FILE_ENCODINGS, FILE_STATUSES, SHERIFF_DIVISION_FILE_PROCESSES} from "@constants/FileConstant";
import {DRUG_TYPES} from "@constants/FormularyConstant";

import {DATE_TIME_FORMAT, DIVISION_TYPES, TIMEZONES} from "@appUtils/Constants";

import {cloudStorageUtils, slackUtils} from "@infrastructure/DIContainer/Resolver";

import type {COOKIE_CONFIG} from "@constants/AuthConstant";
import type {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {TRequest, TResponse} from "@src/typings/Express";
import type {PickBooleansFromObject} from "@typings/Misc";
import type * as csvSync from "csv/sync";

type TGroupedEntity<TModel, TEntity> = {
    uniqueId: string;
    name: string;
    factory: (model: TModel) => Partial<TEntity>;
    isFlat: boolean;
};

class SharedUtils {
    static generateUuid() {
        return v4();
    }

    static shortUuid() {
        return SharedUtils.generateUuid().slice(-12);
    }

    static isSamlVerifiedEmail(email: string) {
        if (email) {
            const domain = FCH.ALLOWED_EMAIL_DOMAINS.split("|")[0];

            return email.toLowerCase().endsWith(domain as string);
        }

        return false;
    }

    static setCurrentDateForMedPass() {
        return DateTime.fromISO(`${SharedUtils.getCurrentDate({})}T${SharedUtils.getCurrentTime({})}`).toFormat(
            DATE_TIME_FORMAT.YMD_H_MED_PASS
        );
    }

    static getCurrentDate(options: {format?: string; timezone?: string}) {
        return DateTime.now()
            .setZone(options.timezone ?? TIMEZONES.UTC)
            .toFormat(options.format ?? DATE_TIME_FORMAT.YMD_FORMAT);
    }

    static getCurrentTime(options: {format?: string; timezone?: string}) {
        return DateTime.now()
            .setZone(options.timezone ?? TIMEZONES.UTC)
            .toFormat(options.format ?? DATE_TIME_FORMAT.HMS_FORMAT);
    }

    static getCurrentEasternTime(options: {format?: string; timezone?: string}) {
        return DateTime.now()
            .setZone(options.timezone ?? TIMEZONES.AMERICA_NEWYORK)
            .toFormat(options.format ?? DATE_TIME_FORMAT.HMS_FORMAT);
    }

    static getHourMinute(time: string) {
        return time.split(":").slice(0, 2).join(":");
    }

    static setDate(date: string | Date) {
        const dt = new Date(date).toISOString();

        return DateTime.fromISO(dt).toFormat(DATE_TIME_FORMAT.YMD_FORMAT);
    }

    static setTime(time: string) {
        const date = DateTime.now().toFormat(DATE_TIME_FORMAT.YMD_FORMAT);
        const dt = new Date(`${date} ${time}`).toISOString();

        return DateTime.fromISO(dt).toFormat(DATE_TIME_FORMAT.HMS_FORMAT);
    }

    static convertEasternDateTimeToUtc(date: string, time: string) {
        const dt = DateTime.fromFormat(
            `${SharedUtils.setDate(date)} ${SharedUtils.setTime(time)}`,
            DATE_TIME_FORMAT.YMD_HMS_FORMAT,
            {
                zone: TIMEZONES.AMERICA_NEWYORK
            }
        );

        return dt.setZone(TIMEZONES.UTC).toFormat(DATE_TIME_FORMAT.YMD_HMS_FORMAT);
    }

    static convertEasternTimeToUtc(time: string) {
        const dt = DateTime.fromFormat(`${SharedUtils.setTime(time)}`, DATE_TIME_FORMAT.HMS_FORMAT, {
            zone: TIMEZONES.AMERICA_NEWYORK
        });

        return dt.setZone(TIMEZONES.UTC).toFormat(DATE_TIME_FORMAT.HMS_FORMAT);
    }

    static convertUtcDateTimeToEastern(date: string, time: string) {
        const dateTime = `${date}T${time}.000Z`;

        return DateTime.fromISO(dateTime).setZone(TIMEZONES.AMERICA_NEWYORK).toFormat(DATE_TIME_FORMAT.YMD_HMS_FORMAT);
    }

    static setDateTime(dateTime: string | Date, timezone?: string) {
        const dt = new Date(dateTime).toISOString();

        return {
            date: DateTime.fromISO(dt).setZone(timezone).toFormat(DATE_TIME_FORMAT.YMD_FORMAT),
            time: DateTime.fromISO(dt).setZone(timezone).toFormat(DATE_TIME_FORMAT.HMS_FORMAT)
        };
    }

    static setDateTimeForSapphire(dateTime: string) {
        return DateTime.fromFormat(dateTime, DATE_TIME_FORMAT.YMDHMS_SAPPHIRE).toFormat(
            DATE_TIME_FORMAT.YMD_HMS_FORMAT
        );
    }

    static convertDateTimeToEastern(date: string, time: string) {
        const dateTime = `${date}T${time}.000Z`;
        const dt = DateTime.fromISO(dateTime).setZone(TIMEZONES.AMERICA_NEWYORK);

        return {
            date: dt.toFormat(DATE_TIME_FORMAT.MDY_FORMAT),
            time: dt.toFormat(DATE_TIME_FORMAT.AMPM_FORMAT)
        };
    }

    static setDateToEndDay(date: string): string {
        return DateTime.fromISO(date).set({hour: 23, minute: 59, second: 59}).toFormat(DATE_TIME_FORMAT.YMD_HMS_FORMAT);
    }

    static setDateStartHours(date: string) {
        return new Date(`${date}T00:00:00.000Z`);
    }

    static setDateEndHours(date: string) {
        return new Date(`${date}T23:59:59.000Z`);
    }

    static getSubtractedDateForMedPass(days: number) {
        return DateTime.now().minus({days: days}).toFormat(DATE_TIME_FORMAT.YMD_H_MED_PASS);
    }

    static getCurrentMonthYear(): string {
        const dt = DateTime.now().setZone(TIMEZONES.AMERICA_NEWYORK);

        return `${dt.monthShort}${dt.year}`.toLowerCase();
    }

    static getYearFromDate(date: string) {
        return DateTime.fromFormat(date, DATE_TIME_FORMAT.YMD_FORMAT).toFormat(DATE_TIME_FORMAT.YYYY_FORMAT);
    }

    static getRecentDate(...date: DateTime[]): Date {
        return DateTime.max(...date).toJSDate();
    }

    static addMonthsToDate(date: Date, nMonths: number): Date {
        return DateTime.fromJSDate(date).plus({months: nMonths}).toJSDate();
    }

    static addDaysToDate(date: Date, nDays: number): Date {
        return DateTime.fromJSDate(date).plus({days: nDays}).toJSDate();
    }

    static addDays(date: string | Date, days: number) {
        const dt = new Date(date).toISOString();

        return DateTime.fromISO(dt).plus({days: days}).toFormat(DATE_TIME_FORMAT.YMD_FORMAT);
    }

    static base64Decoder(base64String: string) {
        return Buffer.from(base64String, FILE_ENCODINGS.BASE64);
    }

    static imageExtension(base64String: string) {
        const [imageType] = base64String.split(";base64,");

        return imageType ? imageType.split("/")[1] : "";
    }

    static csvToJson<T>(csv: string): T[] {
        const json = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true
        });

        return json.filter((record: object) => !SharedUtils.doesObjectContainAllEmptyStrings(record));
    }

    static jsonToCsv(json: object[], fields?: {header: string; key: string}[]) {
        return stringify(json, {
            header: true,
            columns: fields as csvSync.stringifier.ColumnOption[],
            quoted: true
        });
    }

    static groupBy<T extends object, K extends keyof T>(records: T[], keys: K[]) {
        const groupedData: Record<keyof T, Record<keyof T, T[]>> = {} as never;

        records.map((record) => {
            let currentGroup: {rows: T[]} = groupedData as never;
            keys.map((key) => {
                if (!currentGroup[record[key as string]]) {
                    currentGroup[record[key as string]] = {};
                }
                currentGroup = currentGroup[record[key as string]];
            });

            if (!currentGroup.rows) {
                currentGroup.rows = [];
            }
            currentGroup.rows.push(record);
        });

        return Object.values(groupedData);
    }

    static doesObjectContainAllEmptyStrings(obj: object) {
        return Object.keys(obj).every((key) => obj[key] === "");
    }

    static convertStringToPrimitives<T extends object, K extends keyof T>(
        records: T[],
        options: {
            toBooleanArray?: NoInfer<K[]>;
            toNumberArray?: NoInfer<K[]>;
            toArray?: NoInfer<K[]>;
        }
    ) {
        return transform(records, (record) => {
            if (options.toBooleanArray) {
                options.toBooleanArray.forEach((el) => {
                    if (record[el] !== null && record[el] !== undefined) {
                        (record[el] as undefined | T[K]) =
                            record[el] === "" ? undefined : ((record[el] === "1") as T[K]);
                    }
                });
            }

            if (options.toNumberArray) {
                options.toNumberArray.forEach((el) => {
                    if (record[el] !== null && record[el] !== undefined) {
                        (record[el] as undefined | T[K]) = record[el] === "" ? undefined : (Number(record[el]) as T[K]);
                    }
                });
            }

            Object.keys(record).forEach((el) => {
                record[el] = record[el] === "" ? undefined : record[el];
                if (el) {
                    record[el] = record[el] && typeof record[el] === "string" ? record[el].trim() : record[el];
                }
            });

            if (options.toArray) {
                options.toArray.forEach((el) => {
                    record[el] = record[el] ? ((record[el] as string).split(",") as T[K]) : record[el];
                });
            }

            return record;
        });
    }

    static toCapitalize(word: string) {
        return word ? word.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()) : "";
    }

    static uniqueArrayOfObjects<T extends object, K extends keyof T>(array: T[], props: K[] = []) {
        return [...new Map(array.map((entry) => [props.map((k) => entry[k]).join("|"), entry])).values()];
    }

    static formularyName(formulary: FormularyEntity) {
        const formulation = formulary.formulation;
        const packaged = formulary.package ?? "";
        const release = formulary.release ?? "";

        const simpleFormularyName =
            `${formulary.drugName === DRUG_TYPES.GENERIC ? formulary.genericName : formulary.brandName} ${formulary.strengthUnit} ${formulation}`.trim();

        switch (true) {
            case !!packaged && !!release:
                return `${simpleFormularyName} ${packaged} ${release}`.trim();
            case !!packaged:
                return `${simpleFormularyName} ${packaged}`.trim();
            case !!release:
                return `${simpleFormularyName} ${release}`.trim();
            default:
                return simpleFormularyName;
        }
    }

    static getUniqueArrayFromObject<T extends object, K extends keyof T>(records: T[], prop: K) {
        return [...new Set(records.map((record) => record[prop]))];
    }

    static isFalsyBooleanPresent<T extends object, K extends keyof T>(record: T, prop: K) {
        return prop in record && record[prop] !== null && record[prop] !== undefined;
    }

    static destroySession(request: TRequest, response: TResponse, cookies: typeof COOKIE_CONFIG) {
        request.session.destroy(() => {});
        response.clearCookie(cookies.AUTH_COOKIE);
        response.clearCookie(cookies.SESSION_COOKIE);

        return {request: request, response: response};
    }

    static getGroupedEntities<TModel extends object, K extends keyof TModel, TEntity>(
        model: TModel[],
        baseEntity: {
            uniqueId: K;
            factory: (model: TModel) => Partial<TEntity>;
        },
        subFirstEntity?: TGroupedEntity<TModel, TEntity>,
        subSecondEntity?: TGroupedEntity<TModel, TEntity>
    ) {
        const uniqueIds = SharedUtils.getUniqueArrayFromObject(model, baseEntity.uniqueId);

        return uniqueIds.map((id) => {
            const filteredrows = model.filter((md) => md[baseEntity.uniqueId] === id);
            const mainEntity = baseEntity.factory(filteredrows[0] as TModel);

            if (subFirstEntity) {
                const subEntities = filteredrows.map((fr) => subFirstEntity.factory(fr));
                const filteredSubEntities = subEntities.filter((subEntity) => subEntity[subFirstEntity.uniqueId]);
                mainEntity[subFirstEntity.name] = subFirstEntity.isFlat ? filteredSubEntities[0] : filteredSubEntities;
            }

            if (subSecondEntity) {
                const subSecondEntities = filteredrows.map((fr) => subSecondEntity.factory(fr));
                const filteredSubSecondEntities = subSecondEntities.filter(
                    (subEntity) => subEntity[subSecondEntity.uniqueId]
                );
                mainEntity[subSecondEntity.name] = subSecondEntity.isFlat
                    ? filteredSubSecondEntities[0]
                    : filteredSubSecondEntities;
            }

            return mainEntity;
        });
    }

    static csvDivisionYears(row) {
        const keys = Object.keys(row);
        const rawYears: string[] = [];
        keys.map((k) => {
            const [month, year] = k.split(" ");
            if (month && Number(year)) {
                rawYears.push(`${year}`);
            }
        });

        return [...new Set(rawYears)];
    }

    static csvDivisionHeaders(row, year) {
        const {
            Bold: bold,
            Title: title,
            Watch: watch,
            [`Jan ${year}`]: jan,
            [`Feb ${year}`]: feb,
            [`Mar ${year}`]: mar,
            [`Apr ${year}`]: apr,
            [`May ${year}`]: may,
            [`Jun ${year}`]: jun,
            [`Jul ${year}`]: jul,
            [`Aug ${year}`]: aug,
            [`Sep ${year}`]: sep,
            [`Oct ${year}`]: oct,
            [`Nov ${year}`]: nov,
            [`Dec ${year}`]: dec
        } = row;

        return {
            bold,
            title,
            watch,
            jan,
            feb,
            mar,
            apr,
            may,
            jun,
            jul,
            aug,
            sep,
            oct,
            nov,
            dec
        };
    }

    static divisionType(label) {
        switch (label) {
            case SHERIFF_DIVISION_FILE_PROCESSES.BULK_ADD_JAIL_DIVISION:
                return DIVISION_TYPES.JAIL_DIVISION;
            case SHERIFF_DIVISION_FILE_PROCESSES.BULK_ADD_SUPPORT_DIVISION:
                return DIVISION_TYPES.SUPPORT_DIVISION;
            case SHERIFF_DIVISION_FILE_PROCESSES.BULK_ADD_FIELD_DIVISION:
                return DIVISION_TYPES.FIELD_DIVISION;
            case SHERIFF_DIVISION_FILE_PROCESSES.BULK_ADD_COURT_DIVISION:
                return DIVISION_TYPES.COURT_DIVISION;
            default:
                return null;
        }
    }

    static removeKeys(object) {
        Object.keys(object).forEach((key) => {
            if (object[key] === undefined || object[key] === null || object[key] === "") {
                delete object[key];
            }
        });

        return object;
    }

    static filterKeys(object, filter) {
        if (filter.length > 0) {
            Object.keys(object).forEach((key) => {
                if (!filter.includes(key)) {
                    delete object[key];
                }
            });

            return object;
        }

        return object;
    }

    static cleanFloatNumbers(number) {
        if (typeof number === "string") {
            return parseFloat(number.replaceAll(",", ""));
        }

        return number;
    }

    static monthsYear(year) {
        return [
            `jan${year}`,
            `feb${year}`,
            `mar${year}`,
            `apr${year}`,
            `may${year}`,
            `jun${year}`,
            `jul${year}`,
            `aug${year}`,
            `sep${year}`,
            `oct${year}`,
            `nov${year}`,
            `dec${year}`
        ];
    }

    static buildMonths(fromDate, toDate) {
        if (!fromDate || !toDate) {
            return [];
        }
        const startDate = DateTime.fromFormat(fromDate, DATE_TIME_FORMAT.YMD_FORMAT);
        const endDate = DateTime.fromFormat(toDate, DATE_TIME_FORMAT.YMD_FORMAT);

        const startYear = +startDate.toFormat(DATE_TIME_FORMAT.YYYY_FORMAT);
        const endYear = +endDate.toFormat(DATE_TIME_FORMAT.YYYY_FORMAT);
        const months: string[] = [];
        for (let i = startYear; i <= endYear; i++) {
            months.push(...SharedUtils.monthsYear(i));
        }

        const startMonth = `${startDate.monthShort}${startDate.year}`.toLowerCase();
        const endMonth = `${endDate.monthShort}${endDate.year}`.toLowerCase();

        let unique = [...new Set(months)];
        const startIndex = unique.indexOf(startMonth);
        unique = unique.slice(startIndex);
        const endIndex = unique.indexOf(endMonth);
        unique.length = endIndex + 1;

        return unique;
    }

    static async getSapphireFilenames(options: {
        service: string;
        process: string;
        bucket: string;
        filename: string | string[];
        filenameFilter: string;
        argsPrefix?: string;
    }) {
        const isFilePresent = await cloudStorageUtils.getFilenames(
            options.bucket,
            options.argsPrefix ?? SharedUtils.getCurrentDate({format: DATE_TIME_FORMAT.YM_SAPPHIRE})
        );
        if (!isFilePresent) {
            await slackUtils.fileNotFound(options.service, options.process, options.filename);

            return false;
        }

        const files = isFilePresent.filter((f) => f.includes(options.filenameFilter));
        if (!files.length) {
            await slackUtils.fileNotFound(options.service, options.process, options.filename);

            return false;
        }

        return files;
    }

    static setRoleServiceList(admin: Admin) {
        const rbac = {};
        const [serviceList] = admin.adminRole.map((ar) => ar.role.roleServiceList.map((rsl) => rsl.serviceList.name));

        serviceList &&
            serviceList.forEach((_key) => {
                const rolesWithPermission = admin.adminRole.map((ar) => {
                    return {
                        ...ar.role.roleServiceList.find((rsl) => rsl.serviceList.name === _key)
                    };
                });
                const permissionTypes = [...new Set(rolesWithPermission.map((rp) => rp.permission))] as string[];
                if (permissionTypes.length === 0) {
                    return;
                }

                const permissionTypesPriority = permissionTypes.map((pt) => PERMISSION_PRIORITY[pt]);
                const maxPermissionType = Math.min(...permissionTypesPriority);

                rbac[_key] = (
                    Object.entries(PERMISSION_PRIORITY).find(([, value]) => value === maxPermissionType) as string[]
                )[0];
            });

        return rbac;
    }

    static isCronTime(time: string | undefined) {
        if (!time) {
            return false;
        }

        const currentEasternTime = SharedUtils.getCurrentEasternTime({});
        if (SharedUtils.getHourMinute(currentEasternTime) === SharedUtils.getHourMinute(time)) {
            return true;
        }

        return false;
    }

    static arrayIntersection<T, K extends keyof T>(array1: T[], array2: T[], keys: K[]) {
        return array1.filter((a1) => array2.some((a2) => keys.every((k) => a1[k] === a2[k])));
    }

    static getUniqueObjects<T, K extends keyof T>(array: T[], keys: K[]) {
        const unique = new Set();

        return array.filter((item) => {
            const key = keys.map((k) => item[k]).join("|");
            if (unique.has(key)) {
                return false;
            } else {
                unique.add(key);

                return true;
            }
        });
    }

    static convertBooleanToNumber<T extends object, K extends PickBooleansFromObject<T>>(obj: T, keys: K[]) {
        keys.forEach((key) => {
            if (obj[key] != null) {
                obj[key] = obj[key] ? (1 as T[K]) : (0 as T[K]);
            }
        });

        return obj;
    }

    static setFileStatus(failedCount: number, totalCount: number) {
        switch (true) {
            case failedCount === 0:
                return FILE_STATUSES.PROCESSED;
            case failedCount === totalCount:
                return FILE_STATUSES.FAILED;
            case failedCount > 0:
                return FILE_STATUSES.PARTIAL;
            default:
                return FILE_STATUSES.PROCESSED;
        }
    }

    static convertNullToEmptyString(obj: Record<string, unknown>) {
        for (const key in obj) {
            if (obj[key] === null) {
                obj[key] = "";
            }
        }

        return obj;
    }
}

export default SharedUtils;
