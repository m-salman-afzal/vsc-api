import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {ProcessContact} from "@infrastructure/Database/Models/ProcessContact";
import type {ReplaceKeys} from "@typings/Misc";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterProcessContact = ReplaceKeys<
    Partial<IContactEntity & Pick<IProcessEntity, "processId">>,
    "processId" | "contactId",
    {
        processId: string | string[];
        contactId: string | string[];
    }
>;

type TQueryBuilderProcessContact = TQueryBuilder<ProcessContact>;

export class ProcessContactQueryBuilder {
    private query: TQueryBuilderProcessContact;
    constructor(query: TQueryBuilderProcessContact, filters: TFilterProcessContact) {
        this.query = query;
        this.setProcessId(filters);
        this.setContactId(filters);
    }

    static setFilter(query: TQueryBuilderProcessContact, filters) {
        return new ProcessContactQueryBuilder(query, filters).query;
    }

    setProcessId(filters: TFilterProcessContact) {
        if (filters.processId) {
            this.query.andWhere("processContact.processId = :processId", {processId: filters.processId});
        }
    }

    setContactId(filters: TFilterProcessContact) {
        if (Array.isArray(filters.contactId)) {
            this.query.andWhere("processContact.contactId IN (:...contactId)", {contactId: filters.contactId});

            return;
        }

        if (filters.contactId) {
            this.query.andWhere("processContact.contactId = :contactId", {contactId: filters.contactId});
        }
    }
}
