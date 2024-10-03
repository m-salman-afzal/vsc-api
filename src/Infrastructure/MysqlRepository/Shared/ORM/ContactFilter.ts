import {In, Like} from "typeorm";

import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {Contact} from "@infrastructure/Database/Models/Contact";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterContact = ReplaceKeys<Partial<IContactEntity>, "contactId", {contactId: string | string[]}>;

type TWhereContact = TWhereFilter<Contact>;

export class ContactFilter {
    private where: TWhereContact;
    constructor(filters: TFilterContact) {
        this.where = {};
        this.setContactId(filters);
        this.setAdminId(filters);
        this.setFirstName(filters);
        this.setLastName(filters);
        this.setEmail(filters);
        this.setContactType(filters);
    }

    static setFilter(filters: TFilterContact) {
        return new ContactFilter(filters).where;
    }

    setAdminId(filters: TFilterContact) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }

    setContactId(filters: TFilterContact) {
        if (Array.isArray(filters.contactId)) {
            this.where.contactId = In(filters.contactId);

            return;
        }

        if (filters.contactId) {
            this.where.contactId = filters.contactId;
        }
    }

    setFirstName(filters: TFilterContact) {
        if (filters.firstName) {
            this.where.firstName = Like(`%${filters.firstName}%`);
        }
    }

    setLastName(filters: TFilterContact) {
        if (filters.lastName) {
            this.where.lastName = Like(`%${filters.lastName}%`);
        }
    }

    setEmail(filters: TFilterContact) {
        if (filters.email) {
            this.where.email = Like(`%${filters.email}%`);
        }
    }

    setContactType(filters: TFilterContact) {
        if (filters.type) {
            this.where.type = filters.type;
        }
    }
}
