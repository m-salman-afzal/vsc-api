import async from "async";
import {inject, injectable} from "tsyringe";

import DivisionEntity from "@entities/Division/DivisionEntity";

import {SHERIFF_OFFICE_ACCESS_ROLES} from "@constants/AuthConstant";
import {BUCKETS} from "@constants/CloudStorageConstant";
import {ADMINISTRATIVE_DIVISION_FILE_PROCESSES, FILE_STATUSES, REPOSITORIES} from "@constants/FileConstant";

import DivisionValidation from "@validations/DivisionValidation";

import {DIVISION_TYPES, ORDER_BY, SWORN_PERSONNEL_DIVISION_TYPES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {DivisionFilter} from "@repositories/Shared/ORM/DivisionFilter";
import {DivisionReportFilter} from "@repositories/Shared/ORM/DivisionReportFilter";

import {cloudStorageUtils, divisionSwornService, fileService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import type GetDivisionDTO from "./DTOs/GetDivisionDTO";
import type GetDivisionReportDTO from "./DTOs/GetDivisionReportDTO";
import type IDivisionRepository from "@entities/Division/IDivisionRepository";
import type {FileEntity} from "@entities/File/FileEntity";

@injectable()
export class DivisionService {
    constructor(@inject("IDivisionRepository") private divisionRepository: IDivisionRepository) {}

    async getDivisions(dtoGetDivision: GetDivisionDTO) {
        try {
            const searchFilters = DivisionFilter.setFilter({
                ...dtoGetDivision,
                setPosition: true
            });
            const divisions = await this.divisionRepository.fetchAll(searchFilters, {
                position: ORDER_BY.ASC
            });

            if (!divisions) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok({
                rows: this.computeDivisions(divisions),
                columns: this.computeMonths(divisions)
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    computeDivisions(divisions) {
        const divisionEntities = divisions.map((d) => DivisionEntity.create(d));
        const uniqueTitles = [...new Set(divisionEntities.map((d) => d.title))];

        return uniqueTitles.map((title) => {
            const entities = divisionEntities.filter((de) => de.title === title);
            const entity = entities.map((f) => DivisionEntity.publicFields(f));
            const sumEntities = this.aggregateWatches(entity);

            return SharedUtils.removeKeys(Object.assign({}, ...sumEntities));
        });
    }

    aggregateWatches(watches) {
        const years = [...new Set(watches.map((d) => d.year))];
        const monthsBuilder = years.map((y) => {
            return {
                [`jan${y}`]: null,
                [`feb${y}`]: null,
                [`mar${y}`]: null,
                [`apr${y}`]: null,
                [`may${y}`]: null,
                [`jun${y}`]: null,
                [`jul${y}`]: null,
                [`aug${y}`]: null,
                [`sep${y}`]: null,
                [`oct${y}`]: null,
                [`nov${y}`]: null,
                [`dec${y}`]: null
            };
        });

        const months = Object.assign({}, ...monthsBuilder);

        return watches.map((w) => {
            return {
                ...w,
                ...months,
                [`jan${w.year}`]:
                    w[`jan${w.year}`] !== null ? (months[`jan${w.year}`] += w[`jan${w.year}`]) : months[`jan${w.year}`],
                [`feb${w.year}`]:
                    w[`feb${w.year}`] !== null ? (months[`feb${w.year}`] += w[`feb${w.year}`]) : months[`feb${w.year}`],
                [`mar${w.year}`]:
                    w[`mar${w.year}`] !== null ? (months[`mar${w.year}`] += w[`mar${w.year}`]) : months[`mar${w.year}`],
                [`apr${w.year}`]:
                    w[`apr${w.year}`] !== null ? (months[`apr${w.year}`] += w[`apr${w.year}`]) : months[`apr${w.year}`],
                [`may${w.year}`]:
                    w[`may${w.year}`] !== null ? (months[`may${w.year}`] += w[`may${w.year}`]) : months[`may${w.year}`],
                [`jun${w.year}`]:
                    w[`jun${w.year}`] !== null ? (months[`jun${w.year}`] += w[`jun${w.year}`]) : months[`jun${w.year}`],
                [`jul${w.year}`]:
                    w[`jul${w.year}`] !== null ? (months[`jul${w.year}`] += w[`jul${w.year}`]) : months[`jul${w.year}`],
                [`aug${w.year}`]:
                    w[`aug${w.year}`] !== null ? (months[`aug${w.year}`] += w[`aug${w.year}`]) : months[`aug${w.year}`],
                [`sep${w.year}`]:
                    w[`sep${w.year}`] !== null ? (months[`sep${w.year}`] += w[`sep${w.year}`]) : months[`sep${w.year}`],
                [`oct${w.year}`]:
                    w[`oct${w.year}`] !== null ? (months[`oct${w.year}`] += w[`oct${w.year}`]) : months[`oct${w.year}`],
                [`nov${w.year}`]:
                    w[`nov${w.year}`] !== null ? (months[`nov${w.year}`] += w[`nov${w.year}`]) : months[`nov${w.year}`],
                [`dec${w.year}`]:
                    w[`dec${w.year}`] !== null ? (months[`dec${w.year}`] += w[`dec${w.year}`]) : months[`dec${w.year}`]
            };
        });
    }

    computeMonths(divisions) {
        const divisionEntities = divisions.map((d) => DivisionEntity.create(d));
        const years = divisionEntities.map((de) => de.year);
        const uniqueYears = [...new Set(years)].sort();
        const months: string[] = [];
        uniqueYears.map((uy) => months.push(...SharedUtils.monthsYear(uy)));
        let isIndex = months.indexOf(SharedUtils.getCurrentMonthYear());
        if (isIndex > 0) {
            months.length = ++isIndex;
        }

        return months;
    }

    async getReports(dtoGetReportDivision: GetDivisionReportDTO, adminType) {
        try {
            const searchFilters = DivisionReportFilter.setFilter(dtoGetReportDivision);
            const divisions = await this.divisionRepository.fetchAll(searchFilters, {
                position: ORDER_BY.ASC
            });

            const swornPersonnel = await divisionSwornService.getSwornPersonnelReports(dtoGetReportDivision);

            if (!divisions && !swornPersonnel) {
                return HttpResponse.notFound();
            }

            const months = SharedUtils.buildMonths(dtoGetReportDivision.dateFrom, dtoGetReportDivision.dateTo);
            const reports = this.computeReports(divisions, swornPersonnel, months, dtoGetReportDivision.divisionType);
            if (adminType === SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_READER) {
                delete reports.administrativeDivision;
                delete reports.swornPersonnelDivision;
            }

            return HttpResponse.ok(reports);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    computeReports(divisions, swornPersonnel, months, divisionType) {
        switch (divisionType) {
            case DIVISION_TYPES.COURT_DIVISION:
                return {
                    courtDivision: this.computeDivisionsReport(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.COURT_DIVISION),
                            months
                        )
                    )
                };
            case DIVISION_TYPES.FIELD_DIVISION:
                return {
                    fieldDivision: this.computeDivisionsReport(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.FIELD_DIVISION),
                            months
                        )
                    )
                };
            case DIVISION_TYPES.JAIL_DIVISION:
                return {
                    jailDivision: this.watchesDivision(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.JAIL_DIVISION),
                            months
                        )
                    )
                };
            case DIVISION_TYPES.SUPPORT_DIVISION:
                return {
                    supportDivision: this.computeDivisionsReport(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.SUPPORT_DIVISION),
                            months
                        )
                    )
                };
            case DIVISION_TYPES.ADMINISTRATIVE_DIVISION:
                return {
                    administrativeDivision: this.watchesDivision(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.ADMINISTRATIVE_DIVISION),
                            months
                        )
                    )
                };
            case SWORN_PERSONNEL_DIVISION_TYPES.SWORN_PERSONNEL_DIVISION:
                return {
                    swornPersonnelDivision: swornPersonnel ? swornPersonnel : []
                };
            default:
                return {
                    courtDivision: this.computeDivisionsReport(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.COURT_DIVISION),
                            months
                        )
                    ),
                    fieldDivision: this.computeDivisionsReport(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.FIELD_DIVISION),
                            months
                        )
                    ),
                    jailDivision: this.watchesDivision(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.JAIL_DIVISION),
                            months
                        )
                    ),
                    supportDivision: this.computeDivisionsReport(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.SUPPORT_DIVISION),
                            months
                        )
                    ),
                    administrativeDivision: this.watchesDivision(
                        this.transformDivisionReports(
                            this.sortAndFilterDivisionReports(divisions, DIVISION_TYPES.ADMINISTRATIVE_DIVISION),
                            months
                        )
                    ),
                    swornPersonnelDivision: swornPersonnel ? swornPersonnel : []
                };
        }
    }

    sortAndFilterDivisionReports(divisions, divisionType) {
        if (!divisions) {
            return [];
        }

        return divisions
            .filter((d) => d.divisionType === divisionType)
            .sort((a, b) => {
                if (a.position === null) {
                    return 1;
                }
                if (b.position === null) {
                    return -1;
                }
                if (a.position === b.position) {
                    return 0;
                }

                return a.position < b.position ? -1 : 1;
            });
    }

    transformDivisionReports(reports, months) {
        if (!reports) {
            return [];
        }

        return reports.map((dr) => {
            const entity = DivisionEntity.publicFields(dr);

            return {
                title: entity.title,
                watch: entity.watch,
                divisionType: entity.divisionType,
                isBold: entity.isBold,
                isNested: entity.isNested,
                ...SharedUtils.filterKeys(entity, months)
            };
        });
    }

    watchesDivision(division) {
        if (!division) {
            return [];
        }
        const uniqueWatches = [...new Set(division.map((d) => d.watch))];
        const watches: object[] = [];
        uniqueWatches.map((watch) => {
            const watchTitles = this.computeDivisionsReport(division.filter((jd) => jd.watch === watch));
            watches.push(...watchTitles);
        });

        return watches;
    }

    computeDivisionsReport(divisions) {
        if (!divisions) {
            return [];
        }
        const uniqueTitles = [...new Set(divisions.map((d) => d.title))];

        return uniqueTitles.map((title) => {
            const titles = divisions.filter((de) => de.title === title);

            return SharedUtils.removeKeys(Object.assign({}, ...titles));
        });
    }

    async bulkAddDivision(options) {
        try {
            const {DIVISION_LABEL} = options;
            const files = (await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: DIVISION_LABEL,
                repository: REPOSITORIES.SHERIFF_DIVISION
            })) as unknown as FileEntity[];

            await async.eachSeries(files, async (file) => {
                try {
                    file.status = FILE_STATUSES.QUEUED;
                    await fileService.updateFile(file);

                    const csv = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${file.repository}/${file.fileId}.${file.fileExtension}`
                    );
                    const rows = SharedUtils.csvToJson(csv);
                    const rawYears: any[] = [];
                    rows.map((row) => {
                        rawYears.push(...SharedUtils.csvDivisionYears(row));
                    });
                    const years = [...new Set(rawYears)].sort();

                    const searchFilters = DivisionFilter.setFilter({
                        divisionType: SharedUtils.divisionType(DIVISION_LABEL) as string,
                        setPosition: true,
                        years: years as any[]
                    });
                    await this.divisionRepository.update(searchFilters, {
                        position: null
                    });

                    await async.eachSeries(years, async (year: any) => {
                        try {
                            let position = 1;
                            await async.eachSeries(rows, async (row: any) => {
                                const headers = SharedUtils.csvDivisionHeaders(row, year);
                                const dtoDivision = {
                                    title: headers.title,
                                    year: year,
                                    watch: headers.watch,
                                    isBold: headers.bold === "bold",
                                    divisionType: SharedUtils.divisionType(DIVISION_LABEL),
                                    jan: headers.jan,
                                    feb: headers.feb,
                                    mar: headers.mar,
                                    apr: headers.apr,
                                    may: headers.may,
                                    jun: headers.jun,
                                    jul: headers.jul,
                                    aug: headers.aug,
                                    sep: headers.sep,
                                    oct: headers.oct,
                                    nov: headers.nov,
                                    dec: headers.dec,
                                    position: position
                                };
                                DivisionValidation.addDivisionValidation(dtoDivision);
                                const searchFilters = DivisionFilter.setFilter({
                                    title: dtoDivision.title,
                                    watch: dtoDivision.watch,
                                    year: year,
                                    divisionType: dtoDivision.divisionType as string,
                                    setPosition: false
                                });
                                const isDivision = await this.divisionRepository.fetch(searchFilters);
                                const divisionEntity = isDivision
                                    ? DivisionEntity.create({
                                          ...isDivision,
                                          ...dtoDivision
                                      })
                                    : DivisionEntity.create({
                                          ...dtoDivision,
                                          divisionId: SharedUtils.shortUuid()
                                      });
                                !isDivision
                                    ? await this.divisionRepository.create(divisionEntity)
                                    : await this.divisionRepository.update(
                                          {
                                              divisionId: isDivision.divisionId
                                          },
                                          divisionEntity
                                      );

                                position++;
                            });
                        } catch (error) {
                            ErrorLog(error);
                        }
                    });
                    file.status = FILE_STATUSES.PROCESSED;
                    await fileService.updateFile(file);
                } catch (error) {
                    file.status = FILE_STATUSES.FAILED;
                    await fileService.updateFile(file);
                    ErrorLog(error);
                }
            });
        } catch (error) {
            ErrorLog(error, {prefixMessage: `${AppErrorMessage.BULK_ADD_DIVISION}${AppErrorMessage.GET_FILES}`});
        }
    }

    async bulkAddAdministrativeDivision() {
        try {
            const files = (await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: ADMINISTRATIVE_DIVISION_FILE_PROCESSES.BULK_ADD_ADMINISTRATIVE_DIVISION,
                repository: REPOSITORIES.ADMINISTRATIVE_DIVISION
            })) as unknown as FileEntity[];

            await async.eachSeries(files, async (file) => {
                try {
                    file.status = FILE_STATUSES.QUEUED;
                    await fileService.updateFile(file);

                    const csv = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${file.repository}/${file.fileId}.${file.fileExtension}`
                    );
                    const csvRows = SharedUtils.csvToJson(csv);
                    const years = [...new Set(csvRows.map((r: any) => r.year))].sort();
                    const searchFilters = DivisionFilter.setFilter({
                        divisionType: DIVISION_TYPES.ADMINISTRATIVE_DIVISION,
                        setPosition: true,
                        years: years as number[]
                    });
                    await this.divisionRepository.update(searchFilters, {
                        position: null
                    });
                    await async.eachSeries(years, async (year: number) => {
                        let position = 1;
                        const rows = csvRows.filter((r: any) => r.year === year);
                        await async.eachSeries(rows, async (row: any) => {
                            try {
                                const dtoDivision = {
                                    title: row.title,
                                    year: row.year,
                                    watch: row.category,
                                    isBold: row.bold === "bold",
                                    divisionType: DIVISION_TYPES.ADMINISTRATIVE_DIVISION,
                                    jan: row.jan,
                                    feb: row.feb,
                                    mar: row.mar,
                                    apr: row.apr,
                                    may: row.may,
                                    jun: row.jun,
                                    jul: row.jul,
                                    aug: row.aug,
                                    sep: row.sep,
                                    oct: row.oct,
                                    nov: row.nov,
                                    dec: row.dec,
                                    position: position
                                };
                                DivisionValidation.addDivisionValidation(dtoDivision);
                                const searchFilters = DivisionFilter.setFilter({
                                    title: dtoDivision.title,
                                    watch: dtoDivision.watch,
                                    year: row.year,
                                    divisionType: dtoDivision.divisionType as string,
                                    setPosition: false
                                });
                                const isDivision = await this.divisionRepository.fetch(searchFilters);
                                const divisionEntity = isDivision
                                    ? DivisionEntity.create({
                                          ...isDivision,
                                          ...dtoDivision
                                      })
                                    : DivisionEntity.create({
                                          ...dtoDivision,
                                          divisionId: SharedUtils.shortUuid()
                                      });
                                !isDivision
                                    ? await this.divisionRepository.create(divisionEntity)
                                    : await this.divisionRepository.update(
                                          {
                                              divisionId: isDivision.divisionId
                                          },
                                          divisionEntity
                                      );

                                position++;
                            } catch (error) {
                                ErrorLog(error);
                            }
                        });
                    });
                    file.status = FILE_STATUSES.PROCESSED;
                    await fileService.updateFile(file);
                } catch (error) {
                    file.status = FILE_STATUSES.FAILED;
                    await fileService.updateFile(file);
                    ErrorLog(error);
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_ADMINISTRATIVE_DIVISION}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
