import {inject, injectable} from "tsyringe";

import {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {formularyService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFormularyLevelDto} from "./Dtos/UpsertFormularyLevelDto";
import type {IFormularyLevelRepository} from "@entities/FormularyLevel/IFormularyLevelRepository";
import type {FormularyLevel} from "@infrastructure/Database/Models/FormularyLevel";

@injectable()
export class FormularyLevelService extends BaseService<FormularyLevel, FormularyLevelEntity> {
    constructor(@inject("IFormularyLevelRepository") formularyLevelRepository: IFormularyLevelRepository) {
        super(formularyLevelRepository);
    }

    async subUpsertFormularyLevel(addFormularyLevelDto: AddFormularyLevelDto) {
        const formulary = await formularyService.fetch({formularyId: addFormularyLevelDto.formularyId});
        if (!formulary) {
            return false;
        }

        const isFormularyLevel = await this.fetch({
            formularyId: addFormularyLevelDto.formularyId,
            facilityId: addFormularyLevelDto.facilityId
        });

        const formularyLevelEntity = FormularyLevelEntity.create(addFormularyLevelDto);
        formularyLevelEntity.formularyLevelId = isFormularyLevel
            ? isFormularyLevel.formularyLevelId
            : SharedUtils.shortUuid();

        await this.upsert(
            {
                formularyId: addFormularyLevelDto.formularyId,
                facilityId: addFormularyLevelDto.facilityId
            },
            formularyLevelEntity
        );

        return formularyLevelEntity;
    }

    async upsertFormularyLevel(addFormularyLevelDtos: AddFormularyLevelDto) {
        try {
            const formularyLevelEntity = await this.subUpsertFormularyLevel(addFormularyLevelDtos);
            if (!formularyLevelEntity) {
                return HttpResponse.notFound;
            }

            return HttpResponse.created(formularyLevelEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
