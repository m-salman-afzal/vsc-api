import {inject, injectable} from "tsyringe";

import {CentralSupplyLogDrugEntity} from "@entities/CentralSupplyLogDrug/CentralSupplyLogDrugEntity";
import {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddCentralSupplyLogDrugDto} from "./Dtos/AddCentralSupplyLogDrugDto";
import type {GetCentralSupplyLogDrugDto} from "./Dtos/GetCentralSupplyDrugDto";
import type {ICentralSupplyLogDrugRepository} from "@entities/CentralSupplyLogDrug/ICentralSupplyLogDrugRepository";
import type {CentralSupplyLogDrug} from "@infrastructure/Database/Models/CentralSupplyLogDrug";
import type {TFilterCentralSupplyLogDrug} from "@repositories/Shared/Query/CentralSupplyLogDrugQueryBuilder";

@injectable()
export class CentralSupplyLogDrugService extends BaseService<CentralSupplyLogDrug, CentralSupplyLogDrugEntity> {
    constructor(
        @inject("ICentralSupplyLogDrugRepository")
        private centralSupplyLogDrugRepository: ICentralSupplyLogDrugRepository
    ) {
        super(centralSupplyLogDrugRepository);
    }

    async fetchAllBySearchQuery(searchFilters: TFilterCentralSupplyLogDrug) {
        return await this.centralSupplyLogDrugRepository.fetchAllBySearchQuery(searchFilters);
    }

    async subAddCentralSupplyDrug(addCentralSupplyDrugDto: AddCentralSupplyLogDrugDto) {
        const centralSupplyLogDrug = CentralSupplyLogDrugEntity.create(addCentralSupplyDrugDto);
        centralSupplyLogDrug.centralSupplyLogDrugId = SharedUtils.shortUuid();

        return await this.create(centralSupplyLogDrug);
    }

    async getCentralSupplyDrugs(getCentralSupplyDrugDto: GetCentralSupplyLogDrugDto) {
        try {
            const centralSupplyLogDrug = await this.fetchAllBySearchQuery({
                ...getCentralSupplyDrugDto,
                formularyLevelFacilityId: getCentralSupplyDrugDto.facilityId
            });
            if (!centralSupplyLogDrug) {
                return HttpResponse.notFound();
            }

            const centralSupplyLogDrugEntities = centralSupplyLogDrug.map((centralSupplyLogDrug) => {
                return {
                    ...FormularyEntity.toCsv(centralSupplyLogDrug.formulary),
                    ...CentralSupplyLogDrugEntity.toCsv(centralSupplyLogDrug),
                    ...FormularyLevelEntity.toCsv(centralSupplyLogDrug.formulary.formularyLevel[0])
                };
            });

            return HttpResponse.ok(centralSupplyLogDrugEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
