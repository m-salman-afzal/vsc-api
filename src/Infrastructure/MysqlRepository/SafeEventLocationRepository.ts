import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {SafeEventLocation} from "@infrastructure/Database/Models/SafeEventLocation";

import type {ISafeEventLocationRepository} from "@entities/SafeEventLocation/ISafeEventLocationRepository";
import type {SafeEventLocationEntity} from "@entities/SafeEventLocation/SafeEventLocationEntity";

@injectable()
export class SafeEventLocationRepository
    extends BaseRepository<SafeEventLocation, SafeEventLocationEntity>
    implements ISafeEventLocationRepository
{
    constructor() {
        super(SafeEventLocation);
    }
}
