import {Brackets} from "typeorm";

import {CONTACT_TYPES} from "@appUtils/Constants";

import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {Contact} from "@infrastructure/Database/Models/Contact";
import type {ReplaceKeys} from "@typings/Misc";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterContact = ReplaceKeys<
    Partial<
        IContactEntity &
            Pick<IProcessEntity, "processId" | "processName" | "processLabel"> &
            Pick<IFacilityEntity, "facilityId" | "facilityName">
    >,
    "facilityId" | "contactId",
    {
        facilityId: string | string[];
        contactId: string | string[];
    }
>;

type TQueryBuilderContact = TQueryBuilder<Contact>;

export class ContactQueryBuilder {
    private query: TQueryBuilderContact;
    constructor(query: TQueryBuilderContact, filters: TFilterContact) {
        this.query = query;
        this.setId(filters);

        this.setContactId(filters);
        this.setAdminId(filters);
        this.setProcessId(filters);
        this.setFacilityId(filters);
        this.setContactType(filters);

        this.setProcessName(filters);
        this.setProcessLabel(filters);
        this.setFacilityName(filters);

        this.setMultiple(filters);
    }

    static setFilter(query: TQueryBuilderContact, filters) {
        return new ContactQueryBuilder(query, filters).query;
    }

    setId(filters: TFilterContact) {
        if (!Number.isNaN(Number(filters.id))) {
            this.query.andWhere("contact.id = :id", {id: filters.id});
        }
    }

    setFacilityId(filters: TFilterContact) {
        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setProcessId(filters: TFilterContact) {
        if (filters.processId) {
            this.query.andWhere("process.processId = :processId", {processId: filters.processId});
        }
    }

    setContactType(filters: TFilterContact) {
        if (filters.type) {
            this.query.andWhere("contact.type = :type", {type: filters.type});
        }
    }

    setAdminId(filters: TFilterContact) {
        if (filters.adminId) {
            this.query.andWhere("contact.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setContactId(filters: TFilterContact) {
        if (Array.isArray(filters.contactId)) {
            this.query.andWhere("contact.contactId IN (:...contactId)", {contactId: filters.contactId});

            return;
        }

        if (filters.contactId) {
            this.query.andWhere("contact.contactId = :contactId", {contactId: filters.contactId});
        }
    }

    setProcessName(filters: TFilterContact) {
        if (Array.isArray(filters.processName)) {
            this.query.andWhere("process.processName IN (:...processName)", {processName: filters.processName});

            return;
        }

        if (filters.processName) {
            this.query.andWhere("process.processName = :processName", {processName: filters.processName});
        }
    }

    setProcessLabel(filters: TFilterContact) {
        if (Array.isArray(filters.processLabel)) {
            this.query.andWhere("process.processLabel IN (:...processLabel)", {processLabel: filters.processLabel});

            return;
        }

        if (filters.processLabel) {
            this.query.andWhere("process.processLabel = :processLabel", {processLabel: filters.processLabel});
        }
    }

    setFacilityName(filters: TFilterContact) {
        if (Array.isArray(filters.facilityName)) {
            this.query.andWhere("facility.facilityName IN (:...facilityName)", {facilityName: filters.facilityName});

            return;
        }

        if (filters.facilityName) {
            this.query.andWhere("facility.facilityName = :facilityName", {facilityName: filters.facilityName});
        }
    }

    setMultiple(filters: TFilterContact) {
        this.query.andWhere(
            new Brackets((qb) => {
                filters.firstName &&
                    qb.orWhere(
                        filters.type === CONTACT_TYPES.INTERNAL
                            ? "admin.firstName LIKE :firstName"
                            : "contact.firstName LIKE :firstName",
                        {
                            firstName: `%${filters.firstName}%`
                        }
                    );
                filters.lastName &&
                    qb.orWhere(
                        filters.type === CONTACT_TYPES.INTERNAL
                            ? "admin.lastName LIKE :lastName"
                            : "contact.lastName LIKE :lastName",
                        {
                            lastName: `%${filters.lastName}%`
                        }
                    );
                filters.email &&
                    qb.orWhere(
                        filters.type === CONTACT_TYPES.INTERNAL
                            ? "admin.email LIKE :email"
                            : "contact.email LIKE :email",
                        {
                            email: `%${filters.email}%`
                        }
                    );
            })
        );
    }
}
