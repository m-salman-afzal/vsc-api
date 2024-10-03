import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {FacilityUnit} from "@infrastructure/Database/Models/FacilityUnit";

import type {FacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";
import type {IFacilityUnitRepository} from "@entities/FacilityUnit/IFacilityUnitRepository";

@injectable()
export class FacilityUnitRepository
    extends BaseRepository<FacilityUnit, FacilityUnitEntity>
    implements IFacilityUnitRepository
{
    constructor() {
        super(FacilityUnit);
    }
}
