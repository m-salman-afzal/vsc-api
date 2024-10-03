import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Division} from "@infrastructure/Database/Models/Division";

import type DivisionEntity from "@entities/Division/DivisionEntity";
import type IDivisionRepository from "@entities/Division/IDivisionRepository";

@injectable()
export class DivisionRepository extends BaseRepository<Division, DivisionEntity> implements IDivisionRepository {
    constructor() {
        super(Division);
    }
}
