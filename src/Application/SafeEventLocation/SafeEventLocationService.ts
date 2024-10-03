import {inject, injectable} from "tsyringe";

import {SafeEventLocationEntity} from "@entities/SafeEventLocation/SafeEventLocationEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddSafeEventLocationDto} from "./Dtos/AddSafeEventLocationDto";
import type {ISafeEventLocationRepository} from "@entities/SafeEventLocation/ISafeEventLocationRepository";
import type {SafeEventLocation} from "@infrastructure/Database/Models/SafeEventLocation";

@injectable()
export class SafeEventLocationService extends BaseService<SafeEventLocation, SafeEventLocationEntity> {
    constructor(@inject("ISafeEventLocationRepository") safeEventLocationRepository: ISafeEventLocationRepository) {
        super(safeEventLocationRepository);
    }

    async addSafeEventLocation(addSafeEventLocationDto: AddSafeEventLocationDto) {
        try {
            const safeEventLocationEntity = SafeEventLocationEntity.create(addSafeEventLocationDto);
            safeEventLocationEntity.safeEventLocationId = SharedUtils.shortUuid();

            await this.create(safeEventLocationEntity);

            return HttpResponse.created(safeEventLocationEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
