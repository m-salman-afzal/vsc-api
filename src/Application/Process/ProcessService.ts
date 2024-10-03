import {inject, injectable} from "tsyringe";

import {ProcessEntity} from "@entities/Process/ProcessEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";

import {ProcessFilter} from "@repositories/Shared/ORM/ProcessFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {GetProcessDto} from "./Dtos/GetProcessDto";
import type {UpdateProcessDto} from "./Dtos/UpdateProcessDto";
import type {IProcessRepository} from "@entities/Process/IProcessRepository";
import type {Process} from "@infrastructure/Database/Models/Process";
import type {TSearchFilters} from "@src/typings/ORM";

type TSearchProcess = TSearchFilters<Process> & {processId?: string | string[]};

@injectable()
export class ProcessService {
    constructor(@inject("IProcessRepository") private processRepository: IProcessRepository) {}

    async getProcessById(searchBy: {processId?: string}) {
        const searchFilter = ProcessFilter.setFilter(searchBy);
        const process = await this.processRepository.fetch(searchFilter);
        if (!process) {
            return false;
        }

        return process;
    }

    async getProcessesById(searchBy: {processId?: string | string[]}) {
        const searchFilter = ProcessFilter.setFilter(searchBy);
        const processs = await this.processRepository.fetchAll(searchFilter, {id: ORDER_BY.ASC});
        if (!processs) {
            return false;
        }

        return processs.map((process) => ProcessEntity.create(process));
    }

    async subGetProcesses(getProcessDto: GetProcessDto) {
        const searchFilters = getProcessDto;
        const isProcesss = await this.processRepository.fetchAll(searchFilters, {});
        if (!isProcesss) {
            return false;
        }

        const processEntities = isProcesss.map((isProcess) => {
            return ProcessEntity.create(isProcess);
        });

        return processEntities;
    }

    async getProcesses(getProcessDto: GetProcessDto) {
        try {
            const Processs = await this.subGetProcesses(getProcessDto);
            if (!Processs) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(Processs);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subUpdateProcess(updateProcessDto: UpdateProcessDto) {
        try {
            const searchById: TSearchProcess = {processId: updateProcessDto.processId};
            const process = await this.processRepository.fetch(searchById);
            if (!process) {
                return false;
            }

            const processEntity = ProcessEntity.create({...process, ...updateProcessDto});
            await this.processRepository.update(searchById, processEntity);

            const updatedProcess = await this.subGetProcesses({
                processId: processEntity.processId
            });
            if (!updatedProcess) {
                return false;
            }

            return updatedProcess[0] as ProcessEntity;
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateProcess(updateProcessDto: UpdateProcessDto) {
        try {
            const Processs = await this.subUpdateProcess(updateProcessDto);
            if (!Processs) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(Processs);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
