import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {FacilityChecklist} from "@infrastructure/Database/Models/FacilityChecklist";

import {FacilityChecklistQueryBuilder} from "./Shared/Query/FacilityChecklistQueryBuilder";

import type {FacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";
import type {IFacilityChecklistRepository} from "@entities/FacilityChecklist/IFacilityChecklistRepository";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class FacilityChecklistRepository
    extends BaseRepository<FacilityChecklist, FacilityChecklistEntity>
    implements IFacilityChecklistRepository
{
    constructor() {
        super(FacilityChecklist);
    }

    async fetchByQuery(searchFilters: TSearchFilters<FacilityChecklist>) {
        const query = this.model
            .createQueryBuilder("facilityChecklist")
            .leftJoinAndSelect("facilityChecklist.admin", "admin")
            .leftJoinAndSelect("admin.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.role", "role")
            .leftJoinAndSelect("role.roleServiceList", "roleServiceList")
            .leftJoinAndSelect("roleServiceList.serviceList", "serviceList")
            .leftJoinAndSelect("facilityChecklist.facility", "facility");

        const queryFilter = FacilityChecklistQueryBuilder.setFilter(query, searchFilters);
        const checklist = await queryFilter.getMany();

        if (!checklist.length) {
            return false;
        }

        return checklist;
    }
}
