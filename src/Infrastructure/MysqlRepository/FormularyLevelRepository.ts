import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {FormularyLevel} from "@infrastructure/Database/Models/FormularyLevel";

import type {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";
import type {IFormularyLevelRepository} from "@entities/FormularyLevel/IFormularyLevelRepository";

@injectable()
export class FormularyLevelRepository
    extends BaseRepository<FormularyLevel, FormularyLevelEntity>
    implements IFormularyLevelRepository
{
    constructor() {
        super(FormularyLevel);
    }
}
