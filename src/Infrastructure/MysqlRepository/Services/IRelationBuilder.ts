import type {RelationMetadata} from "typeorm/metadata/RelationMetadata";

export interface IRelationBuilder {
    getRelations(modelName: string): RelationMetadata[];
    getRelationNameAndColumns(relationModels: RelationMetadata[]): {
        relationName: string[];
        joinedColumn: string[];
    };
}
