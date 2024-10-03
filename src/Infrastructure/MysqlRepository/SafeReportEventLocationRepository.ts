import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {SafeReportEventLocation} from "@infrastructure/Database/Models/SafeReportEventLocation";

import type {ISafeReportEventLocationRepository} from "@entities/SafeReportEventLocation/ISafeReportEventLocationRepository";
import type {SafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

@injectable()
export class SafeReportEventLocationRepository
    extends BaseRepository<SafeReportEventLocation, SafeReportEventLocationEntity>
    implements ISafeReportEventLocationRepository
{
    constructor() {
        super(SafeReportEventLocation);
    }
}
