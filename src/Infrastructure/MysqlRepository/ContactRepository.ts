import {injectable} from "tsyringe";

import {CONTACT_TYPES} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {Contact} from "@infrastructure/Database/Models/Contact";

import type { TFilterContact} from "./Shared/Query/ContactQueryBuilder";
import {ContactQueryBuilder} from "./Shared/Query/ContactQueryBuilder";

import type {ContactEntity} from "@entities/Contact/ContactEntity";
import type {IContactRepository} from "@entities/Contact/IContactRepository";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {Process} from "@infrastructure/Database/Models/Process";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class ContactRepository extends BaseRepository<Contact, ContactEntity> implements IContactRepository {
    constructor() {
        super(Contact);
    }

    async fetchByQuery(searchFilters: TSearchFilters<Contact>): Promise<false | Contact> {
        const query = this.model
            .createQueryBuilder("contact")
            .leftJoinAndSelect("contact.admin", "admin")
            .leftJoinAndSelect("contact.facilityContact", "facilityContact")
            .leftJoinAndSelect("facilityContact.facility", "facility")
            .leftJoinAndSelect("contact.processContact", "processContact")
            .leftJoinAndSelect("processContact.process", "process")
            .where("1=1")
            .orderBy(
                (searchFilters as TFilterContact).type === CONTACT_TYPES.INTERNAL
                    ? "admin.lastName"
                    : "contact.lastName",
                "ASC"
            );

        const queryFilters = ContactQueryBuilder.setFilter(query, searchFilters);

        const contact = await queryFilters.getOne();

        if (!contact) {
            return false;
        }

        return contact;
    }

    async fetchAllByQuery(searchFilters: TSearchFilters<Contact>): Promise<false | Contact[]> {
        const query = this.model
            .createQueryBuilder("contact")
            .leftJoinAndSelect("contact.admin", "admin")
            .leftJoinAndSelect("contact.facilityContact", "facilityContact")
            .leftJoinAndSelect("contact.processContact", "processContact")
            .leftJoinAndSelect("facilityContact.facility", "facility")
            .leftJoinAndSelect("processContact.process", "process")
            .where("1=1")
            .orderBy(
                (searchFilters as TFilterContact).type === CONTACT_TYPES.INTERNAL
                    ? "admin.lastName"
                    : "contact.lastName",
                "ASC"
            );

        const queryFilters = ContactQueryBuilder.setFilter(query, searchFilters);

        const contact = await queryFilters.getMany();

        if (!contact) {
            return false;
        }

        return contact;
    }

    async fetchContactFacilitiesProcessSearchQuery(
        searchFilters: Omit<TSearchFilters<Contact & Facility & Process>, "contactId"> & {contactId?: string[]}
    ): Promise<false | Contact[]> {
        const query = this.model
            .createQueryBuilder("contact")
            .leftJoinAndSelect("contact.admin", "admin")
            .leftJoinAndSelect("contact.facilityContact", "facilityContact")
            .leftJoinAndSelect("contact.processContact", "processContact")
            .leftJoinAndSelect("facilityContact.facility", "facility")
            .leftJoinAndSelect("processContact.process", "process")
            .where("1=1")
            .orderBy(
                (searchFilters as TFilterContact).type === CONTACT_TYPES.INTERNAL
                    ? "admin.lastName"
                    : "contact.lastName",
                "ASC"
            );

        const queryFilters = ContactQueryBuilder.setFilter(query, searchFilters);

        const contact = await queryFilters.getMany();

        if (!contact) {
            return false;
        }

        return contact;
    }

    async fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<Contact>,
        pagination: PaginationOptions
    ): Promise<false | {rows: Contact[]; count: number}> {
        const query = this.model
            .createQueryBuilder("contact")
            .leftJoinAndSelect("contact.admin", "admin")
            .leftJoinAndSelect("contact.facilityContact", "facilityContact")
            .leftJoinAndSelect("contact.processContact", "processContact")
            .leftJoinAndSelect("facilityContact.facility", "facility")
            .leftJoinAndSelect("processContact.process", "process")
            .orderBy(
                (searchFilters as TFilterContact).type === CONTACT_TYPES.INTERNAL
                    ? "admin.lastName"
                    : "contact.lastName",
                "ASC"
            )
            .take(pagination.perPage)
            .skip(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("contact")
            .leftJoinAndSelect("contact.admin", "admin")
            .leftJoin("contact.facilityContact", "facilityContact")
            .leftJoin("contact.processContact", "processContact")
            .leftJoin("facilityContact.facility", "facility")
            .leftJoin("processContact.process", "process");

        const countFilters = ContactQueryBuilder.setFilter(countQuery, searchFilters);
        const contactQueryFilters = ContactQueryBuilder.setFilter(query, searchFilters);

        const contact = await contactQueryFilters.getMany();
        const contactCount = await countFilters.getCount();

        if (contact.length === 0) {
            return false;
        }

        return {count: contactCount, rows: contact};
    }
}
