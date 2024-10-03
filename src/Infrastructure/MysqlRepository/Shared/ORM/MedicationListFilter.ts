import {And, LessThanOrEqual, MoreThanOrEqual} from "typeorm";

import SharedUtils from "@appUtils/SharedUtils";

import type {IMedicationListEntity} from "@entities/MedicationList/MedicationListEntity";
import type {MedicationList} from "@infrastructure/Database/Models/MedicationList";
import type {TWhereFilter} from "@typings/ORM";

type TFilterMedicationList = Partial<IMedicationListEntity & {dateFrom: string; dateTo: string}>;

type TWhereMedicationList = TWhereFilter<MedicationList>;

export class MedicationListFilter {
    private where: TWhereMedicationList;
    constructor(filters: TFilterMedicationList) {
        this.where = {};
        this.setDateRange(filters);
    }

    static setFilter(filters: TFilterMedicationList) {
        return new MedicationListFilter(filters).where;
    }

    setDateRange(filters: TFilterMedicationList) {
        if (filters.dateFrom && filters.dateTo) {
            this.where.updatedAt = And(
                MoreThanOrEqual(SharedUtils.setDateStartHours(filters.dateFrom)),
                LessThanOrEqual(SharedUtils.setDateEndHours(filters.dateTo))
            );
        }
    }
}
