import {inject, injectable} from "tsyringe";

import {ShiftCountLogDrugEntity} from "@entities/ShiftCountLogDrug/ShiftCountLogDrugEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddShiftCountLogDrugsDto} from "./Dtos/AddShiftCoungLogDrugsDto";
import type {GetShiftCountLogDrugsDto} from "./Dtos/GetShiftCountLogDrugsDto";
import type {IShiftCountLogDrugRepository} from "@entities/ShiftCountLogDrug/IShiftCountLogDrugRepository";
import type {ShiftCountLogDrugs} from "@infrastructure/Database/Models/ShiftCountLogDrugs";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class ShiftCountLogDrugsService extends BaseService<ShiftCountLogDrugs, ShiftCountLogDrugEntity> {
    constructor(@inject("IShiftCountLogDrugsRepository") shiftCountLogDrugsRepo: IShiftCountLogDrugRepository) {
        super(shiftCountLogDrugsRepo);
    }

    async getShiftCountLogDrugs(getShiftCountLogDrugsDto: GetShiftCountLogDrugsDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const shiftCountLogDrugs = await this.fetchPaginated(getShiftCountLogDrugsDto, {}, pagination);
            const count = await this.count(getShiftCountLogDrugsDto);

            if (!shiftCountLogDrugs) {
                return HttpResponse.notFound();
            }

            const shiftCountLogEntities = shiftCountLogDrugs.map((scl) => {
                return ShiftCountLogDrugEntity.create(scl);
            });

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, count, shiftCountLogEntities));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addShiftCountLogDrugs(addShiftCountLogDrugsDto: AddShiftCountLogDrugsDto) {
        try {
            const shiftCountLogDrugs = addShiftCountLogDrugsDto.shiftCountLogDrugs.map((dto) =>
                ShiftCountLogDrugEntity.create({
                    ...dto,
                    shiftCountLogId: addShiftCountLogDrugsDto.shiftCountLogId,
                    shiftCountLogDrugId: SharedUtils.shortUuid()
                })
            );
            const drugsAdded = await this.bulkInsert(shiftCountLogDrugs);

            if (!drugsAdded) {
                return false;
            }

            return drugsAdded;
        } catch {
            return false;
        }
    }
}
