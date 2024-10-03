import {inject, injectable} from "tsyringe";
import {Like} from "typeorm";

import {FormularyEntity} from "@entities/Formulary/FormularyEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {FormularyFilter} from "@repositories/Shared/ORM/FormularyFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {inventoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFormularyDto} from "./Dtos/AddFormularyDto";
import type {GetAllFormularyDto} from "./Dtos/GetAllFomulary";
import type {GetFormularyDto} from "./Dtos/GetFormularyDto";
import type {RemoveFormularyDto} from "./Dtos/RemoveFormularyDto";
import type {UpdateFormularyDto} from "./Dtos/UpdateFormularyDto";
import type {IFormularyRepository} from "@entities/Formulary/IFormularyRepository";
import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterFormulary} from "@repositories/Shared/Query/FormularyQueryBuilder";

@injectable()
export class FormularyService extends BaseService<Formulary, FormularyEntity> {
    constructor(@inject("IFormularyRepository") private formularyRepository: IFormularyRepository) {
        super(formularyRepository);
    }

    async fetchAllWithInventory(searchFilters: TFilterFormulary) {
        return await this.formularyRepository.fetchAllWithInventory(searchFilters);
    }

    async fetchPaginatedWithLevelAndInventory(searchFilters: TFilterFormulary, paginationDto: PaginationOptions) {
        return await this.formularyRepository.fetchPaginatedWithLevelAndInventory(searchFilters, paginationDto);
    }

    async fetchAllWithLevelAndInventory(searchFilters: TFilterFormulary) {
        return await this.formularyRepository.fetchAllWithLevelAndInventory(searchFilters);
    }

    async fetchPaginatedForCartPick(searchFilters: TFilterFormulary, pagination: PaginationOptions) {
        return await this.formularyRepository.fetchPaginatedForCartPick(searchFilters, pagination);
    }

    async fetchAllForCentralSupply(searchFilters: TFilterFormulary) {
        return await this.formularyRepository.fetchAllForCentralSupply(searchFilters);
    }

    async fetchAllWithLevelAndInventoryForCentralSupply(searchFilters: TFilterFormulary) {
        return await this.formularyRepository.fetchAllWithLevelAndInventoryForCentralSupply(searchFilters);
    }

    async subAddFormulary(addFormularyDto: AddFormularyDto) {
        const searchFilters = FormularyFilter.setFilter({
            drugName: addFormularyDto.drugName,
            dupGenericName: addFormularyDto.genericName,
            dupBrandName: addFormularyDto.brandName as string,
            strengthUnit: addFormularyDto.strengthUnit,
            formulation: addFormularyDto.formulation
        });
        const isFormulary = await this.fetch(searchFilters);
        if (isFormulary) {
            return false;
        }

        const formularyEntity = FormularyEntity.create(addFormularyDto);
        formularyEntity.formularyId = SharedUtils.shortUuid();
        formularyEntity.isActive = true;
        formularyEntity.isControlled = formularyEntity.isControlled ?? false;
        formularyEntity.name = SharedUtils.formularyName(formularyEntity);

        await this.create(formularyEntity);

        return await this.fetch({formularyId: formularyEntity.formularyId});
    }

    async addFormulary(addFormularyDto: AddFormularyDto) {
        try {
            const formularyEntity = await this.subAddFormulary(addFormularyDto);
            if (!formularyEntity) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(FormularyEntity.publicFields(formularyEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetFormulary(getFormularyDto: GetFormularyDto, paginationDto?: PaginationDto) {
        const {name, id, ...newGetFormularyDto} = getFormularyDto;
        const filters = FormularyFilter.setFilter(newGetFormularyDto);

        const pagination = PaginationOptions.create(paginationDto);
        const nameFilters = [{...filters, name: Like(`%${name ?? ""}%`)}];
        const searchFilters = isNaN(Number(id)) ? nameFilters : [...nameFilters, {...filters, id: Number(id)}];
        const formulary = await this.fetchPaginated(searchFilters, {name: ORDER_BY.ASC}, pagination);
        if (!formulary) {
            return false;
        }

        const formularyCount = await this.count(searchFilters);

        const formularyEntities = formulary.map((fm) => FormularyEntity.publicFields(fm));

        return PaginationData.getPaginatedData(pagination, formularyCount, formularyEntities);
    }

    async getFormulary(getFormularyDto: GetFormularyDto, paginationDto: PaginationDto) {
        try {
            const paginatedFormulary = await this.subGetFormulary(getFormularyDto, paginationDto);
            if (!paginatedFormulary) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(paginatedFormulary);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateInventoryStatusifNeeded(updateFormularyDto: UpdateFormularyDto, formulary: Formulary) {
        if (
            SharedUtils.isFalsyBooleanPresent(updateFormularyDto, "isActive") &&
            updateFormularyDto.isActive !== formulary.isActive
        ) {
            return await inventoryService.updateInventoryStatus({
                formularyId: updateFormularyDto.formularyId,
                isActive: updateFormularyDto.isActive as boolean
            });
        }

        return true;
    }

    async subUpdateFormulary(updateFormularyDto: UpdateFormularyDto) {
        const searchFilters = updateFormularyDto.formularyId
            ? {formularyId: updateFormularyDto.formularyId as string}
            : {id: updateFormularyDto.id as number};
        const formulary = await this.fetch(searchFilters);
        if (!formulary) {
            return false;
        }

        await this.updateInventoryStatusifNeeded(
            {...updateFormularyDto, formularyId: formulary.formularyId},
            formulary
        );

        const formularyEntity = FormularyEntity.create({...formulary, ...updateFormularyDto});
        formularyEntity.name = SharedUtils.formularyName(formularyEntity);
        await this.update(searchFilters, formularyEntity);

        return {...formularyEntity, id: formulary.id};
    }

    async updateFormulary(updateFormularyDto: UpdateFormularyDto) {
        try {
            const isformularyUpdated = await this.subUpdateFormulary(updateFormularyDto);
            if (!isformularyUpdated) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(FormularyEntity.publicFields(isformularyUpdated));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemoveFormulary(removeFormularyDto: RemoveFormularyDto) {
        const searchFilters = removeFormularyDto.formularyId
            ? {formularyId: removeFormularyDto.formularyId as string}
            : {id: removeFormularyDto.id as number};
        const isFormulary = await this.fetch(searchFilters);
        if (!isFormulary) {
            return false;
        }

        await this.remove(searchFilters);

        return true;
    }

    async removeFormulary(removeFormularyDto: RemoveFormularyDto) {
        try {
            const isFormulary = await this.subRemoveFormulary(removeFormularyDto);
            if (!isFormulary) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getAllFormulary(getAllFormularyDto: GetAllFormularyDto) {
        try {
            const searchFilters = FormularyFilter.setFilter(getAllFormularyDto);
            const formulary = await this.fetchAll(searchFilters, {name: ORDER_BY.ASC});
            if (!formulary) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(
                formulary.map((form) => ({
                    ...FormularyEntity.publicFields(form),
                    isActive: form.isActive ? 1 : 0,
                    isControlled: form.isControlled ? 1 : 0,
                    isFormulary: form.isFormulary ? 1 : 0,
                    isGeneric: form.isGeneric ? 1 : 0
                }))
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getSingleFormularyById(searchBy: {id?: number; formularyId?: string}) {
        const formulary = searchBy.id
            ? await this.fetch({id: searchBy.id})
            : await this.fetch({formularyId: searchBy.formularyId as string});

        if (!formulary) {
            return false;
        }

        return FormularyEntity.publicFields(formulary);
    }
}
