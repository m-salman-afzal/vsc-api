import {inject, injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {setLoggerEntities} from "@logger/AuditLogger";

import type {AddAuditLogDto} from "@application/AuditLog/DTOs/AddAuditLogDto";
import type {IRelationBuilder} from "@repositories/Services/IRelationBuilder";

@injectable()
export class RelationService {
    constructor(@inject("IRelationBuilder") private relationBuilder: IRelationBuilder) {}

    async getRelations(addAuditLogDto: AddAuditLogDto) {
        const relations = this.relationBuilder.getRelations(addAuditLogDto.entity);
        const relationNameAndColumn = this.relationBuilder.getRelationNameAndColumns(relations);

        for (const [index, element] of relationNameAndColumn.relationName.entries()) {
            if (element === "AuditLog") {
                continue;
            }

            const baseRepo = new BaseRepository(element);

            const searchFilter = {};
            const searchKey = this.setSearchKey(`${relationNameAndColumn.joinedColumn[index]}`);
            if (searchKey !== "undefined") {
                searchFilter[searchKey] = addAuditLogDto.data[searchKey];
                addAuditLogDto.data[element] = await baseRepo.fetch(searchFilter);
                addAuditLogDto.data[element] = setLoggerEntities(element, addAuditLogDto.data[element]);
            }
        }

        return addAuditLogDto;
    }

    private setSearchKey(referenceColumn: string) {
        switch (referenceColumn) {
            case "closedByAdminId":
                return "adminId";

            case "allocatedByAdminId":
                return "adminId";

            case "pickedByAdminId":
                return "adminId";

            case "cartRequestPickLogId":
                return "cartRequestLogId";

            case "cartRequestAllocationLogId":
                return "cartRequestLogId";

            case "cartRequestDeletionLogId":
                return "cartRequestLogId";

            case "serviceDependsOnId":
                return "serviceListId";

            default:
                return referenceColumn;
        }
    }
}
