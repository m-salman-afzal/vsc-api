import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";
import type {Contact} from "@infrastructure/Database/Models/Contact";
import type {FacilityContact} from "@infrastructure/Database/Models/FacilityContact";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFacilityContact = Partial<IFacilityContactEntity> & Partial<IContactEntity>;

type TWhereFacilityContact = TWhereFilter<FacilityContact> & TWhereFilter<Contact>;

export class FacilityContactFilter {
    private where: TWhereFacilityContact;
    constructor(filters: TFilterFacilityContact) {
        this.where = {};
        this.setFacilityContactId(filters);
        this.setFacilityId(filters);
        this.setContactId(filters);
    }

    static setFilter(filters: TFilterFacilityContact) {
        return new FacilityContactFilter(filters).where;
    }

    setFacilityContactId(filters: TFilterFacilityContact) {
        if (filters.facilityContactId) {
            this.where.facilityContactId = filters.facilityContactId;
        }
    }

    setFacilityId(filters: TFilterFacilityContact) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setContactId(filters: TFilterFacilityContact) {
        if (filters.contactId) {
            this.where.contactId = filters.contactId;
        }
    }
}
