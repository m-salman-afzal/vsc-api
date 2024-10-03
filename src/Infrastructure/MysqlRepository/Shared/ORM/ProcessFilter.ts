import {In, Like} from "typeorm";

import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {Process} from "@infrastructure/Database/Models/Process";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterProcess = ReplaceKeys<Partial<IProcessEntity>, "processId", {processId: string | string[]}>;

type TWhereProcess = TWhereFilter<Process>;

export class ProcessFilter {
    private where: TWhereProcess;
    constructor(filters: TFilterProcess) {
        this.where = {};
        this.setProcessId(filters);
        this.setName(filters);
        this.setLabel(filters);
        this.setTime(filters);
        this.setType(filters);
    }

    static setFilter(filters: TFilterProcess) {
        return new ProcessFilter(filters).where;
    }

    setProcessId(filters: TFilterProcess) {
        if (Array.isArray(filters.processId)) {
            this.where.processId = In(filters.processId);

            return;
        }

        if (filters.processId) {
            this.where.processId = filters.processId;
        }
    }

    setName(filters: TFilterProcess) {
        if (filters.processName) {
            this.where.processName = Like(`%${filters.processName}%`);
        }
    }

    setLabel(filters: TFilterProcess) {
        if (filters.processLabel) {
            this.where.processLabel = Like(`%${filters.processLabel}%`);
        }
    }

    setTime(filters: TFilterProcess) {
        if (filters.time) {
            this.where.time = filters.time;
        }
    }

    setType(filters: TFilterProcess) {
        if (filters.type) {
            this.where.type = filters.type;
        }
    }
}
