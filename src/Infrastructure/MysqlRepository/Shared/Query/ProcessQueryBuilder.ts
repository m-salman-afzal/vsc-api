import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {Process} from "@infrastructure/Database/Models/Process";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterProcess = Partial<IProcessEntity> &
    Partial<Pick<IFacilityEntity, "facilityName">> &
    Partial<Pick<IContactEntity, "type">>;

type TQueryBuilderFacility = TQueryBuilder<Process>;

export class ProcessQueryBuilder {
    private query: TQueryBuilderFacility;
    constructor(query: TQueryBuilderFacility, filters: TFilterProcess) {
        this.query = query;
        this.setId(filters);
        this.setProcessId(filters);
    }

    static setFilter(query: TQueryBuilderFacility, filters) {
        return new ProcessQueryBuilder(query, filters).query;
    }

    setId(filters: TFilterProcess) {
        if (!Number.isNaN(Number(filters.id))) {
            this.query.andWhere("processContact.id = :id", {id: filters.id});
        }
    }

    setProcessId(filters: TFilterProcess) {
        if (filters.processId) {
            this.query.andWhere("process.processId = :processId", {processId: filters.processId});
        }
    }
}
