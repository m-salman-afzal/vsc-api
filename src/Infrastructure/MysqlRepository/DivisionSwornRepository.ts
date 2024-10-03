import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {DivisionSworn} from "@infrastructure/Database/Models/DivisionSworn";

import type DivisionSwornEntity from "@entities/DivisionSworn/DivisionSwornEntity";
import type IDivisionSwornRepository from "@entities/DivisionSworn/IDivisionSwornRepository";

@injectable()
export class DivisionSwornRepository
    extends BaseRepository<DivisionSworn, DivisionSwornEntity>
    implements IDivisionSwornRepository
{
    constructor() {
        super(DivisionSworn);
    }
}
