import {inject, injectable} from "tsyringe";

import {ContactEntity} from "@entities/Contact/ContactEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {ProcessEntity} from "@entities/Process/ProcessEntity";

import {CONTACT_TYPES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ContactFilter} from "@repositories/Shared/ORM/ContactFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    facilityContactService,
    facilityService,
    processContactService,
    processService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddContactDto} from "./Dtos/AddContactDto";
import type {GetContactDto} from "./Dtos/GetContactDto";
import type {RemoveContactDto} from "./Dtos/RemoveContactDto";
import type {UpdateContactDto} from "./Dtos/UpdateContactDto";
import type {IContactRepository} from "@entities/Contact/IContactRepository";
import type {Contact} from "@infrastructure/Database/Models/Contact";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TSearchFilters} from "@src/typings/ORM";

@injectable()
export class ContactService extends BaseService<Contact, ContactEntity> {
    constructor(@inject("IContactRepository") private contactRepository: IContactRepository) {
        super(contactRepository);
    }

    async fetchByQuery(searchFilters: TSearchFilters<Contact>) {
        return await this.contactRepository.fetchByQuery(searchFilters);
    }

    async subContactFacilitiesProcessesExist(updateContactDto: UpdateContactDto) {
        const arraysMatch = (arr1, arr2) => {
            return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
        };

        const newFacilities = await facilityService.getFacilitiesById({
            facilityId: updateContactDto.facilityId as string
        });

        if (!newFacilities) {
            return false;
        }

        const newProcesses = await processService.getProcessesById({
            processId: updateContactDto.processId as string
        });

        if (!newProcesses) {
            return false;
        }

        const contacts = await this.contactRepository.fetchAllByQuery({
            contactId: updateContactDto.contactId
        });

        if (!contacts) {
            return false;
        }

        return contacts.some((contact: any) => {
            const facilities = contact.facilityContact.map((facilityContact: any) => facilityContact.facilityId);
            const processes = contact.processContact.map((processContact: any) => processContact.processId);

            const facilitiesMatch = arraysMatch(
                facilities,
                newFacilities.map((facility) => facility.facilityId)
            );

            const processesMatch = arraysMatch(
                processes,
                newProcesses.map((process) => process.processId)
            );

            return facilitiesMatch && processesMatch;
        });
    }

    async subUpdateContactFacilityProcess(updateContactDto: UpdateContactDto, isAdd: boolean) {
        const facilities = await facilityService.getFacilitiesById({
            facilityId: updateContactDto.facilityId as string
        });
        if (!facilities) {
            return false;
        }

        const isFacilityContactUpdated = await facilityContactService.subUpdateFacilityContacts({
            ...updateContactDto,
            isAdd
        });
        if (!isFacilityContactUpdated) {
            return false;
        }

        const processs = await processService.getProcessesById({
            processId: updateContactDto.processId as string
        });
        if (!processs) {
            return false;
        }

        const isProcessContactUpdated = await processContactService.subUpdateProcessContacts({
            ...updateContactDto,
            isAdd
        });
        if (!isProcessContactUpdated) {
            return false;
        }

        return await this.subGetContactWithFacilitiesProcess({contactId: updateContactDto.contactId});
    }

    async subAddContact(addContactDto: AddContactDto) {
        const searchFilters = {
            email: addContactDto.email as string,
            adminId: addContactDto.adminId as string
        };

        const isContact = await this.contactRepository.fetchByQuery(searchFilters);

        if (isContact) {
            const pairExist = await this.subContactFacilitiesProcessesExist({
                ...addContactDto,
                contactId: isContact.contactId
            });
            if (pairExist) {
                return false;
            }

            const contactEntity = ContactEntity.create(isContact);

            if (isContact.type === CONTACT_TYPES.EXTERNAL) {
                contactEntity.contactId = SharedUtils.shortUuid();
                await this.contactRepository.create(contactEntity);
            }

            return this.subUpdateContactFacilityProcess({...addContactDto, contactId: contactEntity.contactId}, true);
        }

        const isDeletedContact = await this.contactRepository.fetchWithDeleted(searchFilters);
        if (isDeletedContact) {
            await this.contactRepository.restore(
                addContactDto.type === CONTACT_TYPES.INTERNAL
                    ? {adminId: isDeletedContact.adminId}
                    : {email: isDeletedContact.email}
            );
        }

        const contactEntity = ContactEntity.create(addContactDto);
        contactEntity.contactId = isDeletedContact ? isDeletedContact.contactId : SharedUtils.shortUuid();
        await this.contactRepository.upsert(
            contactEntity,
            addContactDto.type === CONTACT_TYPES.INTERNAL
                ? {adminId: contactEntity.adminId}
                : {email: addContactDto.email}
        );

        return this.subUpdateContactFacilityProcess({...addContactDto, contactId: contactEntity.contactId}, true);
    }

    async addContact(addContactDto: AddContactDto) {
        try {
            const contactEntity = await this.subAddContact(addContactDto);
            if (!contactEntity) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(contactEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetContactWithFacilitiesProcess(getContactDto: GetContactDto) {
        const isContact = await this.contactRepository.fetchByQuery(getContactDto);
        if (!isContact) {
            return false;
        }

        const contactEntity = ContactEntity.create(isContact);

        if (contactEntity.type === CONTACT_TYPES.INTERNAL) {
            contactEntity.email = isContact.admin.email;
            contactEntity.firstName = isContact.admin.firstName;
            contactEntity.lastName = isContact.admin.lastName;
        }

        contactEntity.facility = isContact.facilityContact.map((facilityContact) => {
            return FacilityEntity.create(facilityContact.facility);
        });

        contactEntity.process = isContact.processContact.map((processContact) => {
            return ProcessEntity.create(processContact.process);
        });

        return contactEntity;
    }

    async subGetContactsFacilitiesProcess(getContactDto: GetContactDto) {
        const searchFilters = {
            processLabel: getContactDto.processLabel as string,
            processName: getContactDto.processName as string,
            facilityId: getContactDto.facilityId as string | string[],
            facilityName: getContactDto.facilityName as string,
            type: getContactDto.type as string
        };

        const isContacts = await this.contactRepository.fetchAllByQuery(searchFilters);

        if (!isContacts) {
            return false;
        }

        const contactEntities: ContactEntity[] = isContacts.map((contact) => {
            const contactEntity = ContactEntity.create(contact);

            if (contactEntity.type === CONTACT_TYPES.INTERNAL) {
                contactEntity.email = contact.admin.email;
                contactEntity.firstName = contact.admin.firstName;
                contactEntity.lastName = contact.admin.lastName;
            }

            contactEntity.facility = contact.facilityContact.map((facilityContact) => {
                return FacilityEntity.create(facilityContact.facility);
            });

            contactEntity.process = contact.processContact.map((processContact) => {
                return ProcessEntity.create(processContact.process);
            });

            return contactEntity;
        });

        return contactEntities;
    }

    async subGetContacts(getContactDto: GetContactDto, paginationDto?: PaginationDto) {
        const pagination = PaginationOptions.create(paginationDto);

        const isContact = await this.contactRepository.fetchPaginatedBySearchQuery(getContactDto, pagination);
        if (!isContact) {
            return false;
        }

        const contactEntities = isContact.rows.map((contact: Contact) => {
            const contactEntity = ContactEntity.create(contact);

            if (contactEntity.type === CONTACT_TYPES.INTERNAL) {
                contactEntity.email = contact.admin.email;
                contactEntity.firstName = contact.admin.firstName;
                contactEntity.lastName = contact.admin.lastName;
            }

            contactEntity.facility = contact.facilityContact.map((facilityContact) => {
                return FacilityEntity.create(facilityContact.facility);
            });

            contactEntity.process = contact.processContact.map((processContact) => {
                return ProcessEntity.create(processContact.process);
            });

            return contactEntity;
        });

        return PaginationData.getPaginatedData(pagination, isContact.count, contactEntities);
    }

    async getContacts(getContactDto: GetContactDto, paginationDto?: PaginationDto) {
        try {
            const contactEntities = await this.subGetContacts(getContactDto, paginationDto);
            if (!contactEntities) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(contactEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subUpdateContact(updateContactDto: UpdateContactDto) {
        const isContact = await this.contactRepository.fetch({
            contactId: updateContactDto.contactId as string
        });
        if (!isContact) {
            return false;
        }
        const contactEntity = ContactEntity.create({
            ...isContact,
            ...updateContactDto
        });
        await this.contactRepository.update({contactId: isContact.contactId}, contactEntity);

        return this.subUpdateContactFacilityProcess(updateContactDto, false);
    }

    async updateContact(updateContactDto: UpdateContactDto) {
        try {
            const isContactUpdated = await this.subUpdateContact(updateContactDto);
            if (!isContactUpdated) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(isContactUpdated);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemoveContact(removeContactDto: RemoveContactDto) {
        const searchFilters = ContactFilter.setFilter(removeContactDto);
        const isContact = await this.contactRepository.fetch(searchFilters);
        if (!isContact) {
            return false;
        }

        await facilityContactService.subRemoveFacilityContact({
            contactId: isContact.contactId
        });

        const isProcessContactRemoved = await processContactService.subRemoveProcessContact({
            contactId: isContact.contactId
        });
        if (!isProcessContactRemoved) {
            return false;
        }

        return await this.contactRepository.remove(searchFilters);
    }

    async removeContact(removeContactDto: RemoveContactDto) {
        try {
            const isContactRemoved = await this.subRemoveContact(removeContactDto);
            if (!isContactRemoved) {
                HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
