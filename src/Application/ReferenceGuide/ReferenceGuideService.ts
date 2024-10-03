import {inject, injectable} from "tsyringe";

import {ReferenceGuideEntity} from "@entities/ReferenceGuide/ReferenceGuideEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ReferenceGuideFilter} from "@repositories/Shared/ORM/ReferenceGuideFilter";

import {fileService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddReferenceGuideDto} from "./Dtos/AddReferenceGuideDto";
import type {GetReferenceGuideDto} from "./Dtos/GetReferenceGuideDto";
import type {ModifyReferenceGuideDto} from "./Dtos/ModifyReferenceGuideDto";
import type {RemoveReferenceGuideDto} from "./Dtos/RemoveReferenceGuideDto";
import type {SetReferenceGuideNoteDto} from "./Dtos/SetReferenceGuideNoteDto";
import type {UpdateReferenceGuideDto} from "./Dtos/UpdateReferenceGuideDto";
import type {AddFileDto} from "@application/File/Dtos/AddFileDto";
import type {IReferenceGuideRepository} from "@entities/ReferenceGuide/IReferenceGuideRepository";
import type {ReferenceGuide} from "@infrastructure/Database/Models/ReferenceGuide";

@injectable()
export class ReferenceGuideService extends BaseService<ReferenceGuide, ReferenceGuideEntity> {
    constructor(@inject("IReferenceGuideRepository") private referenceGuideRepository: IReferenceGuideRepository) {
        super(referenceGuideRepository);
    }

    async getReferenceGuides(dtoGetReferenceGuide: GetReferenceGuideDto) {
        try {
            const searchFilters = ReferenceGuideFilter.setFilter({
                facilityId: dtoGetReferenceGuide.facilityId
            });
            const referenceGuides = await this.referenceGuideRepository.fetchAll(searchFilters, {
                name: ORDER_BY.ASC
            });

            if (!referenceGuides) {
                return HttpResponse.notFound();
            }

            const referenceGuideDrugsEntities = referenceGuides.map((rg) => ReferenceGuideEntity.create(rg));

            return HttpResponse.ok(referenceGuideDrugsEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addReferenceGuide(dtoAddReferenceGuide: AddReferenceGuideDto, dtoAddFile: AddFileDto) {
        try {
            const searchFilters = ReferenceGuideFilter.setFilter({
                name: dtoAddReferenceGuide.name,
                facilityId: dtoAddReferenceGuide.facilityId
            });
            const isReferenceGuide = await this.referenceGuideRepository.fetch(searchFilters);
            if (isReferenceGuide) {
                return HttpResponse.conflict();
            }

            const referenceGuideEntity = ReferenceGuideEntity.create(dtoAddReferenceGuide);
            referenceGuideEntity.referenceGuideId = SharedUtils.shortUuid();

            await this.referenceGuideRepository.create(referenceGuideEntity);
            await fileService.addFile({...dtoAddFile, referenceGuideId: referenceGuideEntity.referenceGuideId});

            return HttpResponse.created(ReferenceGuideEntity.create(referenceGuideEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async modifyReferenceGuide(dtoModifyReferenceGuide: ModifyReferenceGuideDto, dtoAddFile: AddFileDto) {
        try {
            const searchFilters = ReferenceGuideFilter.setFilter({
                referenceGuideId: dtoModifyReferenceGuide.referenceGuideId,
                facilityId: dtoModifyReferenceGuide.facilityId
            });
            const isReferenceGuide = await this.referenceGuideRepository.fetch(searchFilters);
            if (!isReferenceGuide) {
                return HttpResponse.notFound();
            }

            await fileService.addFile({...dtoAddFile, referenceGuideId: dtoModifyReferenceGuide.referenceGuideId});

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateReferenceGuide(dtoUpdateReferenceGuide: UpdateReferenceGuideDto) {
        try {
            const isReferenceGuide = await this.referenceGuideRepository.fetch(
                ReferenceGuideFilter.setFilter({
                    referenceGuideId: dtoUpdateReferenceGuide.referenceGuideId
                })
            );
            if (!isReferenceGuide) {
                return HttpResponse.notFound();
            }

            const isReferenceGuideName = await this.referenceGuideRepository.fetch(
                ReferenceGuideFilter.setFilter({
                    name: dtoUpdateReferenceGuide.name,
                    facilityId: dtoUpdateReferenceGuide.facilityId
                })
            );

            if (isReferenceGuideName) {
                return HttpResponse.conflict();
            }

            const referenceGuideEntity = ReferenceGuideEntity.create({
                ...isReferenceGuide,
                ...dtoUpdateReferenceGuide
            });
            await this.referenceGuideRepository.update(
                {referenceGuideId: referenceGuideEntity.referenceGuideId},
                referenceGuideEntity
            );

            return HttpResponse.ok(referenceGuideEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeReferenceGuide(dtoRemoveReferenceGuide: RemoveReferenceGuideDto) {
        try {
            const isReferenceGuide = await this.referenceGuideRepository.fetch(
                ReferenceGuideFilter.setFilter({
                    referenceGuideId: dtoRemoveReferenceGuide.referenceGuideId,
                    facilityId: dtoRemoveReferenceGuide.facilityId
                })
            );
            if (!isReferenceGuide) {
                return HttpResponse.notFound();
            }

            await this.referenceGuideRepository.remove({
                referenceGuideId: isReferenceGuide.referenceGuideId
            });

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async setReferenceGuideNote(dtoReferenceGuideNote: SetReferenceGuideNoteDto) {
        try {
            const isReferenceGuide = await this.referenceGuideRepository.fetch(
                ReferenceGuideFilter.setFilter({
                    referenceGuideId: dtoReferenceGuideNote.referenceGuideId,
                    facilityId: dtoReferenceGuideNote.facilityId
                })
            );
            if (!isReferenceGuide) {
                return HttpResponse.notFound();
            }

            await this.referenceGuideRepository.update(
                {
                    referenceGuideId: isReferenceGuide.referenceGuideId
                },
                ReferenceGuideEntity.create({...dtoReferenceGuideNote})
            );

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeReferenceGuideNote(dtoReferenceGuideNote: RemoveReferenceGuideDto) {
        try {
            const isReferenceGuide = await this.referenceGuideRepository.fetch(
                ReferenceGuideFilter.setFilter({
                    referenceGuideId: dtoReferenceGuideNote.referenceGuideId,
                    facilityId: dtoReferenceGuideNote.facilityId
                })
            );
            if (!isReferenceGuide) {
                return HttpResponse.notFound();
            }

            await this.referenceGuideRepository.update(
                {
                    referenceGuideId: isReferenceGuide.referenceGuideId
                },
                {
                    note: null
                }
            );

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
