import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {FacilityContact} from "@infrastructure/Database/Models/FacilityContact";

import type {FacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";
import type {IFacilityContactRepository} from "@entities/FacilityContact/IFacilityContactRepository";

@injectable()
export class FacilityContactRepository
    extends BaseRepository<FacilityContact, FacilityContactEntity>
    implements IFacilityContactRepository
{
    constructor() {
        super(FacilityContact);
    }
}
