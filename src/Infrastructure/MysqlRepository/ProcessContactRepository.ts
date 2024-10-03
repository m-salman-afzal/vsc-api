import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ProcessContact} from "@infrastructure/Database/Models/ProcessContact";

import type {IProcessContactRepository} from "@entities/ProcessContact/IProcessContactRepository";
import type {ProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

@injectable()
export class ProcessContactRepository
    extends BaseRepository<ProcessContact, ProcessContactEntity>
    implements IProcessContactRepository
{
    constructor() {
        super(ProcessContact);
    }
}
