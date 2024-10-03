import async from "async";
import {inject, injectable} from "tsyringe";

import DivisionSwornEntity from "@entities/DivisionSworn/DivisionSwornEntity";

import {BUCKETS} from "@constants/CloudStorageConstant";
import {ADMINISTRATIVE_DIVISION_FILE_PROCESSES, FILE_STATUSES, REPOSITORIES} from "@constants/FileConstant";

import DivisionSwornValidation from "@validations/DivisionSwornValidation";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {DivisionSwornFilter} from "@repositories/Shared/ORM/DivisionSwornFilter";
import {DivisionSwornReportFilter} from "@repositories/Shared/ORM/DivisionSwornReportFilter";

import {cloudStorageUtils, fileService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import type GetDivisionSwornDTO from "./DTOs/GetDivisionSwornDTO";
import type GetDivisionSwornReportDTO from "./DTOs/GetDivisionSwornReportDTO";
import type IDivisionSwornRepository from "@entities/DivisionSworn/IDivisionSwornRepository";
import type {FileEntity} from "@entities/File/FileEntity";

@injectable()
export class DivisionSwornService {
    constructor(@inject("IDivisionSwornRepository") private divisionSwornRepository: IDivisionSwornRepository) {}

    async getSwornPersonnel(dtoGetDivisionSworn: GetDivisionSwornDTO) {
        try {
            const searchFilters = DivisionSwornFilter.setFilter({
                ...dtoGetDivisionSworn,
                setPosition: true
            });
            const swornTitles = await this.divisionSwornRepository.fetchAll(searchFilters, {
                position: ORDER_BY.ASC
            });

            if (!swornTitles) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok({
                rows: swornTitles.map((st) => DivisionSwornEntity.create(st))
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getSwornPersonnelReports(dtoGetReportDivisionSworn: GetDivisionSwornReportDTO) {
        try {
            const searchFilters = DivisionSwornReportFilter.setFilter(dtoGetReportDivisionSworn);
            const divisions = await this.divisionSwornRepository.fetchAll(searchFilters, {
                year: ORDER_BY.ASC,
                id: ORDER_BY.ASC
            });

            if (!divisions) {
                return false;
            }

            return divisions.map((d) => DivisionSwornEntity.publicFields(d));
        } catch (error) {
            return false;
        }
    }

    async bulkAddSwornPersonnel() {
        try {
            const files = (await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: ADMINISTRATIVE_DIVISION_FILE_PROCESSES.BULK_ADD_SWORN_PERSONNEL_DIVISION,
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
                    const searchFilters = DivisionSwornFilter.setFilter({
                        setPosition: true,
                        years: years as number[]
                    });
                    await this.divisionSwornRepository.update(searchFilters, {
                        position: null
                    });
                    await async.eachSeries(years, async (year: number) => {
                        let position = 1;
                        const rows = csvRows.filter((r: any) => r.year === year);
                        await async.eachSeries(rows, async (row: any) => {
                            try {
                                const dtoDivisionSworn = {
                                    title: row.title,
                                    year: row.year,
                                    category: row.category,
                                    dsp: row.dsSrPt,
                                    dsj: row.dsJailer,
                                    dsr: row.dsSr,
                                    mds: row.mds,
                                    cpl: row.cpl,
                                    sgt: row.sgt,
                                    lt: row.lt,
                                    cap: row.cap,
                                    maj: row.maj,
                                    ltCol: row.ltCol,
                                    col: row.col,
                                    dcr: row.divCmdr,
                                    chd: row.chiefDep,
                                    position: position
                                };
                                DivisionSwornValidation.addDivisionSwornValidation(dtoDivisionSworn);
                                const searchFilters = DivisionSwornFilter.setFilter({
                                    title: dtoDivisionSworn.title,
                                    category: dtoDivisionSworn.category,
                                    year: row.year,
                                    setPosition: false
                                });
                                const isDivisionSworn = await this.divisionSwornRepository.fetch(searchFilters);
                                const divisionSwornEntity = isDivisionSworn
                                    ? DivisionSwornEntity.create({
                                          ...isDivisionSworn,
                                          ...dtoDivisionSworn
                                      })
                                    : DivisionSwornEntity.create({
                                          ...dtoDivisionSworn,
                                          divisionSwornId: SharedUtils.shortUuid()
                                      });
                                !isDivisionSworn
                                    ? await this.divisionSwornRepository.create(divisionSwornEntity)
                                    : await this.divisionSwornRepository.update(
                                          {
                                              divisionSwornId: isDivisionSworn.divisionSwornId
                                          },
                                          divisionSwornEntity
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
            ErrorLog(error, {prefixMessage: `${AppErrorMessage.BULK_ADD_DIVISION}${AppErrorMessage.GET_FILES}`});
        }
    }
}
