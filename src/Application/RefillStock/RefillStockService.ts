import {inject, injectable} from "tsyringe";

import {FormularyEntity} from "@entities/Formulary/FormularyEntity";

import HttpResponse from "@appUtils/HttpResponse";

import {FormularyFilter} from "@repositories/Shared/ORM/FormularyFilter";

import {formularyService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type RefillStockDto from "./Dtos/RefillStockDto";
import type {IFormularyRepository} from "@entities/Formulary/IFormularyRepository";

@injectable()
export class RefillStockService {
    constructor(@inject("IFormularyRepository") private formularyRepository: IFormularyRepository) {}

    async refillStockFormulary(refillStockFormularyDTO: RefillStockDto) {
        try {
            const searchFilters = FormularyFilter.setFilter({...refillStockFormularyDTO, refillStock: true});
            const formulary = await this.formularyRepository.fetchAll(searchFilters, {});
            if (!formulary) {
                return HttpResponse.notFound();
            }

            const formularyIds = formulary.map((fm) => fm.formularyId);
            const search = FormularyFilter.setFilter({formularyId: formularyIds});
            await this.formularyRepository.update(search, {counter: 0});

            const newFormulary = await formularyService.subGetFormulary(
                {isActive: true, refillStock: true},
                {currentPage: 1, perPage: 10}
            );

            return HttpResponse.ok({
                csv: formulary.map((fm) => ({...FormularyEntity.publicFields(fm), counter: 0})),
                formulary: !newFormulary ? [] : newFormulary
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
