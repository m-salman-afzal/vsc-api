import {In} from "typeorm";

import type {IFacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";
import type {FacilityChecklist} from "@infrastructure/Database/Models/FacilityChecklist";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFacilityChecklist = Omit<Partial<IFacilityChecklistEntity>, "event"> & {event?: string | string[]};
type TWhereFacilityChecklist = TWhereFilter<FacilityChecklist>;

export class FacilityChecklistFilter {
    private where: TWhereFacilityChecklist;
    constructor(filters: TFilterFacilityChecklist) {
        this.where = {};
        this.setFacilityChecklistId(filters);
        this.setFacilityId(filters);
        this.setAdminId(filters);
        this.setEvent(filters);
    }

    static setFilter(filters: TFilterFacilityChecklist) {
        return new FacilityChecklistFilter(filters).where;
    }

    setFacilityChecklistId(filters: TFilterFacilityChecklist) {
        if (filters.facilityChecklistId) {
            this.where.facilityChecklistId = filters.facilityChecklistId;
        }
    }

    setFacilityId(filters: TFilterFacilityChecklist) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setAdminId(filters: TFilterFacilityChecklist) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }

    setEvent(filters: TFilterFacilityChecklist) {
        if (Array.isArray(filters.event)) {
            this.where.event = In(filters.event);

            return;
        }
        if (filters.event) {
            this.where.event = filters.event;
        }
    }
}
