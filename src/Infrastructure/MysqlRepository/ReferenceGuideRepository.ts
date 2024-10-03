import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ReferenceGuide} from "@infrastructure/Database/Models/ReferenceGuide";

import type {IReferenceGuideRepository} from "@entities/ReferenceGuide/IReferenceGuideRepository";
import type {ReferenceGuideEntity} from "@entities/ReferenceGuide/ReferenceGuideEntity";

@injectable()
export class ReferenceGuideRepository
    extends BaseRepository<ReferenceGuide, ReferenceGuideEntity>
    implements IReferenceGuideRepository
{
    constructor() {
        super(ReferenceGuide);
    }
}
