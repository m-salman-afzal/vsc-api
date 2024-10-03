import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {FacilityContact} from "@infrastructure/Database/Models/FacilityContact";
import type {ReplaceKeys} from "@typings/Misc";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterFacilityContact = ReplaceKeys<
    Partial<IContactEntity & Pick<IFacilityEntity, "facilityId">>,
    "facilityId" | "contactId",
    {
        facilityId: string | string[];
        contactId: string | string[];
    }
>;

type TQueryBuilderFacilityContact = TQueryBuilder<FacilityContact>;

export class FacilityContactQueryBuilder {
    private query: TQueryBuilderFacilityContact;
    constructor(query: TQueryBuilderFacilityContact, filters: TFilterFacilityContact) {
        this.query = query;
        this.setContactId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderFacilityContact, filters) {
        return new FacilityContactQueryBuilder(query, filters).query;
    }

    setFacilityId(filters: TFilterFacilityContact) {
        if (filters.facilityId) {
            this.query.andWhere("facilityContact.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setContactId(filters: TFilterFacilityContact) {
        if (Array.isArray(filters.contactId)) {
            this.query.andWhere("processContact.contactId IN (:...contactId)", {contactId: filters.contactId});

            return;
        }

        if (filters.contactId) {
            this.query.andWhere("processContact.contactId = :contactId", {contactId: filters.contactId});
        }
    }
}
