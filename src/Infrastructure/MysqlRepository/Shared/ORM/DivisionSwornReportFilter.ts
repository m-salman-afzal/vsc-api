import {Between} from "typeorm";

import SharedUtils from "@appUtils/SharedUtils";

import type DivisionSwornEntity from "@entities/DivisionSworn/DivisionSwornEntity";
import type {DivisionSworn} from "@infrastructure/Database/Models/DivisionSworn";
import type {TWhereFilter} from "@typings/ORM";

type TFilterDivisionSworn = Partial<DivisionSwornEntity> & {dateFrom: string; dateTo: string};

type TWhereDivisionSworn = TWhereFilter<DivisionSworn>;

export class DivisionSwornReportFilter {
    private where: TWhereDivisionSworn;
    constructor(filters: TFilterDivisionSworn) {
        this.where = {};
        this.setFacilityId(filters);
        this.setDateRange(filters);
    }

    static setFilter(filters: TFilterDivisionSworn) {
        return new DivisionSwornReportFilter(filters).where;
    }

    setFacilityId(filters: TFilterDivisionSworn) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setDateRange(filters: TFilterDivisionSworn) {
        if (filters.dateFrom && filters.dateTo) {
            this.where.year = Between(
                SharedUtils.getYearFromDate(filters.dateFrom),
                SharedUtils.getYearFromDate(filters.dateTo)
            );
        }
    }
}
