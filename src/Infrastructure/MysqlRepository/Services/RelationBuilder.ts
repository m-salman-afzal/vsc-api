import {injectable} from "tsyringe";

import {dataSource} from "@infrastructure/Database/mysqlConnection";

import type {IRelationBuilder} from "./IRelationBuilder";
import type {RelationMetadata} from "typeorm/metadata/RelationMetadata";

@injectable()
export class RelationBuilder implements IRelationBuilder {
    getRelations(modelName: string) {
        return dataSource.getRepository(modelName).metadata.relations;
    }

    getRelationNameAndColumns(relationModels: RelationMetadata[]) {
        const relationName: string[] = [];
        const joinedColumn: string[] = [];

        relationModels.forEach((relationModel) => {
            relationName.push(relationModel.inverseEntityMetadata.discriminatorValue as string);
            joinedColumn.push(relationModel.joinColumns[0]?.databasePath as string);
        });

        return {relationName, joinedColumn};
    }
}
