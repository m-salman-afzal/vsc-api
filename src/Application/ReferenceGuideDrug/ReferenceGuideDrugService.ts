import {inject, injectable} from "tsyringe";

import {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import {ReferenceGuideEntity} from "@entities/ReferenceGuide/ReferenceGuideEntity";
import {ReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ReferenceGuideDrugFilter} from "@repositories/Shared/ORM/ReferenceGuideDrugFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddReferenceGuideDrugDto} from "./Dtos/AddReferenceGuideDrugDto";
import type {ExportReferenceGuideDrugDto} from "./Dtos/ExportReferenceGuideDrugDto";
import type {GetReferenceGuideDrugDto} from "./Dtos/GetReferenceGuideDrugDto";
import type {RemoveReferenceGuideDrugDto} from "./Dtos/RemoveReferenceGuideDrugDto";
import type {UpdateReferenceGuideDrugDto} from "./Dtos/UpdateReferenceGuideDrugDto";
import type {IReferenceGuideDrugRepository} from "@entities/ReferenceGuideDrug/IReferenceGuideDrugRepository";
import type {ReferenceGuideDrug} from "@infrastructure/Database/Models/ReferenceGuideDrug";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterReferenceGuideDrug} from "@repositories/Shared/Query/ReferenceGuideDrugQueryBuilder";

@injectable()
export class ReferenceGuideDrugService extends BaseService<ReferenceGuideDrug, ReferenceGuideDrugEntity> {
    constructor(
        @inject("IReferenceGuideDrugRepository") private referenceGuideDrugRepository: IReferenceGuideDrugRepository
    ) {
        super(referenceGuideDrugRepository);
    }

    async addReferenceGuideDrug(dtoAddReferenceGuideDrug: AddReferenceGuideDrugDto) {
        const searchFilters = ReferenceGuideDrugFilter.setFilter({
            referenceGuideId: dtoAddReferenceGuideDrug.referenceGuideId,
            formularyId: dtoAddReferenceGuideDrug.formularyId
        });
        const isReferenceGuideDrug = await this.referenceGuideDrugRepository.fetch(searchFilters);

        if (isReferenceGuideDrug) {
            return false;
        }

        const referenceGuideDrugEntity = ReferenceGuideDrugEntity.create(dtoAddReferenceGuideDrug);
        referenceGuideDrugEntity.referenceGuideDrugId = SharedUtils.shortUuid();

        await this.referenceGuideDrugRepository.create(referenceGuideDrugEntity);

        return this.referenceGuideDrugRepository.fetch({
            referenceGuideDrugId: referenceGuideDrugEntity.referenceGuideDrugId
        });
    }

    async subRemoveReferenceGuideDrug(dtoRemoveReferenceGuideDrug: RemoveReferenceGuideDrugDto) {
        const isReferenceGuideDrug = await this.referenceGuideDrugRepository.fetch(
            ReferenceGuideDrugFilter.setFilter({
                referenceGuideId: dtoRemoveReferenceGuideDrug.referenceGuideId,
                formularyId: dtoRemoveReferenceGuideDrug.formularyId
            })
        );

        if (!isReferenceGuideDrug) {
            return false;
        }

        return await this.referenceGuideDrugRepository.remove({
            referenceGuideDrugId: isReferenceGuideDrug.referenceGuideDrugId
        });
    }

    async subUpdateReferenceGuideDrug(dtoUpdateReferenceGuideDrug: UpdateReferenceGuideDrugDto) {
        const isReferenceGuideDrug = await this.referenceGuideDrugRepository.fetch(
            ReferenceGuideDrugFilter.setFilter({
                formularyId: dtoUpdateReferenceGuideDrug.formularyId,
                referenceGuideId: dtoUpdateReferenceGuideDrug.referenceGuideId
            })
        );

        if (!isReferenceGuideDrug) {
            return false;
        }

        const referenceGuideDrugEntity = ReferenceGuideDrugEntity.create(dtoUpdateReferenceGuideDrug);

        return await this.referenceGuideDrugRepository.update(
            {referenceGuideDrugId: isReferenceGuideDrug.referenceGuideDrugId},
            referenceGuideDrugEntity
        );
    }

    async fetchPaginatedWithCart(searchFilters: TFilterReferenceGuideDrug, pagination: PaginationOptions) {
        return await this.referenceGuideDrugRepository.fetchPaginatedWithCart(searchFilters, pagination);
    }

    async getReferenceGuideDrugs(dtoGetReferenceGuideDrug: GetReferenceGuideDrugDto, dtoPagination: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(dtoPagination);
            const referenceGuideDrugs = await this.referenceGuideDrugRepository.fetchPaginatedBySearchQuery(
                dtoGetReferenceGuideDrug,
                pagination
            );

            if (!referenceGuideDrugs) {
                return HttpResponse.notFound();
            }

            const referenceGuideDrugsEntities = referenceGuideDrugs.rows.map((referenceGuideDrug) => ({
                ...ReferenceGuideDrugEntity.create(referenceGuideDrug),
                referenceGuide: referenceGuideDrug.referenceGuide
                    ? ReferenceGuideEntity.create(referenceGuideDrug.referenceGuide)
                    : null,
                formulary: referenceGuideDrug.formulary
                    ? FormularyEntity.publicFields(referenceGuideDrug.formulary)
                    : null
            }));

            return HttpResponse.ok(
                PaginationData.getPaginatedData(pagination, referenceGuideDrugs.count, referenceGuideDrugsEntities)
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async exportReferenceGuideDrugs(dtoExportReferenceGuideDrug: ExportReferenceGuideDrugDto) {
        try {
            const referenceGuideDrugs =
                await this.referenceGuideDrugRepository.fetchBySearchQuery(dtoExportReferenceGuideDrug);

            if (!referenceGuideDrugs) {
                return HttpResponse.notFound();
            }

            const referenceGuideDrugEntities = referenceGuideDrugs.map((rgd) => {
                return rgd;
            });

            return HttpResponse.ok(referenceGuideDrugEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getReferenceGuideDrugCategories(dto: GetReferenceGuideDrugDto) {
        try {
            const categories = await this.referenceGuideDrugRepository.fetchDistinctCategories({
                referenceGuideId: dto.referenceGuideId
            });

            if (!categories) {
                return HttpResponse.notFound();
            }

            const uniqueCategories = [...new Set(categories.map((c) => c.category))];

            const categoryEntities = uniqueCategories.map((uc: any) => {
                const subCategories = categories
                    .filter((c) => c.subCategory && c.category === uc)
                    .map((c) => c.subCategory);

                return {
                    category: uc,
                    subCategory: subCategories
                };
            });

            return HttpResponse.ok(categoryEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateReferenceGuideDrug(dtoUpdateReferenceGuideDrug: UpdateReferenceGuideDrugDto) {
        try {
            const isReferenceGuideDrug = await this.subUpdateReferenceGuideDrug(dtoUpdateReferenceGuideDrug);

            if (!isReferenceGuideDrug) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeReferenceGuideDrug(dtoRemoveReferenceGuideDrug: RemoveReferenceGuideDrugDto) {
        try {
            const isReferenceGuideDrug = await this.subRemoveReferenceGuideDrug(dtoRemoveReferenceGuideDrug);

            if (!isReferenceGuideDrug) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
