import type {
    FindOptionsOrder,
    FindOptionsWhere,
    InsertResult,
    ObjectLiteral,
    QueryDeepPartialEntity,
    SelectQueryBuilder,
    UpdateResult
} from "typeorm";

export type TSearchFilters<Model> = FindOptionsWhere<Model> | FindOptionsWhere<Model>[];

export type TSearchFiltersForRemove<Model> = FindOptionsWhere<Model>;

export type TSearchFiltersForUpdate<Model> = FindOptionsWhere<Model>;

export type TUpdateEntity<Model> = QueryDeepPartialEntity<ObjectLiteral extends Model ? unknown : Model>;

export type TUpdateResult = UpdateResult;

export type TWhereFilter<Model> = FindOptionsWhere<Model>;

export type TQueryBuilder<Model> = SelectQueryBuilder<Model>;

export type TOrderBy<Model> = FindOptionsOrder<Model>;

export type TUpsertOptions<Model> = string[] | UpsertOptions<Model>;

export type TUpsertEntity<Model> =
    | QueryDeepPartialEntity<ObjectLiteral extends Model ? unknown : Model>
    | QueryDeepPartialEntity<ObjectLiteral extends Model ? unknown : Model>[];

export type TUpsertResult = Promise<InsertResult>;
