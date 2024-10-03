import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Process} from "@infrastructure/Database/Models/Process";

import type {IProcessRepository} from "@entities/Process/IProcessRepository";
import type {ProcessEntity} from "@entities/Process/ProcessEntity";

@injectable()
export class ProcessRepository extends BaseRepository<Process, ProcessEntity> implements IProcessRepository {
    constructor() {
        super(Process);
    }
}
