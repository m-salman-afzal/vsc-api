import async from "async";
import {inject, injectable} from "tsyringe";

import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";

import HttpResponse from "@appUtils/HttpResponse";

import {BaseService} from "@application/BaseService";

import {ServiceDisruptionFilter} from "@repositories/Shared/ORM/ServiceDisruptionFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {contactService, emailUtils, processService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {GetServiceDisruptionDto} from "./Dtos/GetServiceDisruptionDto";
import type {RemoveServiceDisruptionDto} from "./Dtos/RemoveServiceDisruptionDto";
import type {ProcessEntity} from "@entities/Process/ProcessEntity";
import type {IServiceDisruptionRepository} from "@entities/ServiceDisruption/IServiceDisruptionRepository";
import type {ServiceDisruption} from "@infrastructure/Database/Models/ServiceDisruption";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterServiceDisruption} from "@repositories/Shared/Query/ServiceDisruptionQueryBuilder";

type TAlert = {date: string; time: string; count: number; duplicate: number};

@injectable()
export class ServiceDisruptionService extends BaseService<ServiceDisruption, ServiceDisruptionEntity> {
    constructor(
        @inject("IServiceDisruptionRepository") private serviceDisruptionRepository: IServiceDisruptionRepository
    ) {
        super(serviceDisruptionRepository);
    }

    async fetchPaginatedBySearchQuery(searchFilter: TFilterServiceDisruption, pagination: PaginationOptions) {
        return await this.serviceDisruptionRepository.fetchPaginatedBySearchQuery(searchFilter, pagination);
    }

    async getServiceDisruption(getServiceDisruptionDto: GetServiceDisruptionDto, paginationDto?: PaginationDto) {
        try {
            const searchFilters = getServiceDisruptionDto;

            const pagination = PaginationOptions.create(paginationDto);
            const serviceDisruption = await this.fetchPaginatedBySearchQuery(searchFilters, pagination);
            if (!serviceDisruption) {
                return HttpResponse.notFound();
            }

            const serviceDisruptionEntities = serviceDisruption.rows.map((sd) => {
                return {...ServiceDisruptionEntity.publicFields(sd), facility: FacilityEntity.publicFields(sd)};
            });

            const paginatedServiceDisruption = PaginationData.getPaginatedData<ServiceDisruptionEntity[]>(
                pagination,
                serviceDisruption.count,
                serviceDisruptionEntities
            );

            return HttpResponse.ok(paginatedServiceDisruption);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async sendServiceDisruptionAlert(
        alert: TAlert,
        serviceDisruptions: ServiceDisruptionEntity[],
        facilityName: string,
        PROCESS_LABEL: string
    ) {
        const processes = await processService.subGetProcesses({
            processLabel: PROCESS_LABEL
        });

        if (!processes) {
            return false;
        }

        const contacts = await contactService.subGetContactsFacilitiesProcess({
            facilityName: facilityName,
            processLabel: PROCESS_LABEL,
            type: (processes[0] as ProcessEntity).type === "BOTH" ? "" : (processes[0] as ProcessEntity).type
        });
        if (!contacts) {
            return false;
        }

        await async.eachSeries(contacts, async (contact) => {
            await emailUtils.sendServiceDisruptionEmail({
                toEmail: contact.email,
                firstName: contact.firstName as string,
                alert,
                serviceDisruptions: serviceDisruptions,
                facilityName: facilityName
            });
        });

        return true;
    }

    async removeServiceDisruption(dtoRemoveServiceDisruptionDto: RemoveServiceDisruptionDto) {
        try {
            const isServiceDisruption = await this.serviceDisruptionRepository.fetch(
                ServiceDisruptionFilter.setFilter({
                    serviceDisruptionId: dtoRemoveServiceDisruptionDto.serviceDisruptionId,
                    facilityId: dtoRemoveServiceDisruptionDto.facilityId
                })
            );

            if (!isServiceDisruption) {
                return HttpResponse.notFound();
            }

            await this.serviceDisruptionRepository.remove({
                serviceDisruptionId: dtoRemoveServiceDisruptionDto.serviceDisruptionId
            });

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
