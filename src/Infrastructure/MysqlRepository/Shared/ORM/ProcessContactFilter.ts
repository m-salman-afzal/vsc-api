import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";
import type {Contact} from "@infrastructure/Database/Models/Contact";
import type {ProcessContact} from "@infrastructure/Database/Models/ProcessContact";
import type {TWhereFilter} from "@typings/ORM";

type TFilterProcessContact = Omit<Partial<IProcessContactEntity>, "facilityId"> &
    Partial<
        IContactEntity & {
            facilityId: string;
        }
    >;

type TWhereProcessContact = TWhereFilter<ProcessContact> & TWhereFilter<Contact>;

export class ProcessContactFilter {
    private where: TWhereProcessContact;
    constructor(filters: TFilterProcessContact) {
        this.where = {};
        this.setProcessContactId(filters);
        this.setProcessId(filters);
        this.setContactId(filters);
    }

    static setFilter(filters: TFilterProcessContact) {
        return new ProcessContactFilter(filters).where;
    }

    setProcessContactId(filters: TFilterProcessContact) {
        if (filters.processContactId) {
            this.where.processContactId = filters.processContactId;
        }
    }

    setProcessId(filters: TFilterProcessContact) {
        if (filters.processId) {
            this.where.processId = filters.processId;
        }
    }

    setContactId(filters: TFilterProcessContact) {
        if (filters.contactId) {
            this.where.contactId = filters.contactId;
        }
    }
}
