import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {CentralSupplyLogDrug} from "@infrastructure/Database/Models/CentralSupplyLogDrug";

import {CentralSupplyLogDrugQueryBuilder} from "./Shared/Query/CentralSupplyLogDrugQueryBuilder";

import type {TFilterCentralSupplyLogDrug} from "./Shared/Query/CentralSupplyLogDrugQueryBuilder";
import type {CentralSupplyLogDrugEntity} from "@entities/CentralSupplyLogDrug/CentralSupplyLogDrugEntity";
import type {ICentralSupplyLogDrugRepository} from "@entities/CentralSupplyLogDrug/ICentralSupplyLogDrugRepository";

@injectable()
export class CentralSupplyLogDrugRepository
    extends BaseRepository<CentralSupplyLogDrug, CentralSupplyLogDrugEntity>
    implements ICentralSupplyLogDrugRepository
{
    constructor() {
        super(CentralSupplyLogDrug);
    }

    async fetchAllBySearchQuery(searchFilters: TFilterCentralSupplyLogDrug) {
        const query = this.model
            .createQueryBuilder("centralSupplyLogDrug")
            .leftJoinAndSelect("centralSupplyLogDrug.formulary", "formulary")
            .leftJoinAndSelect("formulary.formularyLevel", "formularyLevel")
            .orderBy("formulary.name");

        const queryFilters = CentralSupplyLogDrugQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
