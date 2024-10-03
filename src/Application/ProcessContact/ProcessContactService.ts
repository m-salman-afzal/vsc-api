import async from "async";
import {inject, injectable} from "tsyringe";

import {ProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {ProcessContactFilter} from "@repositories/Shared/ORM/ProcessContactFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddProcessContactDto} from "./Dtos/AddProcessContactDto";
import type {GetProcessContactDto} from "./Dtos/GetProcessContactDto";
import type {RemoveProcessContactDto} from "./Dtos/RemoveProcessContactDto";
import type {UpdateProcessContactDto} from "./Dtos/UpdateProcessContactDto";
import type {IProcessContactRepository} from "@entities/ProcessContact/IProcessContactRepository";
import type {ProcessContact} from "@infrastructure/Database/Models/ProcessContact";

@injectable()
export class ProcessContactService {
    constructor(@inject("IProcessContactRepository") private processContactRepository: IProcessContactRepository) {}

    async subRestoreProcessContact(searchBy: {processId: string; contactId: string}) {
        const searchFilters = ProcessContactFilter.setFilter(searchBy);
        const processContact = await this.processContactRepository.restore(searchFilters);
        if (!processContact) {
            return false;
        }

        return processContact;
    }

    private async toBeRestored(
        deletedProcessContacts: ProcessContact[],
        updateProcessContactDto: UpdateProcessContactDto
    ) {
        const processContactsToBeRestored = deletedProcessContacts.filter(
            (processContact) =>
                processContact.deletedAt && updateProcessContactDto.processId?.includes(processContact.processId)
        );
        await async.eachSeries(processContactsToBeRestored, async (processContact) => {
            try {
                await this.subRestoreProcessContact({
                    processId: processContact.processId,
                    contactId: updateProcessContactDto.contactId as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });

        return processContactsToBeRestored;
    }

    private async toBeRemoved(processIds: string[], updateProcessContactDto: UpdateProcessContactDto) {
        const processIdsToBeRemoved = processIds.filter(
            (processId) => !updateProcessContactDto.processId?.includes(processId)
        );
        await async.eachSeries(processIdsToBeRemoved, async (processId) => {
            try {
                await this.subRemoveProcessContact({
                    processId: processId,
                    contactId: updateProcessContactDto.contactId as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    private async toBeAdded(
        processIds: string[],
        updateProcessContactDto: UpdateProcessContactDto,
        restoredProcessContacts: ProcessContact[]
    ) {
        const processIdsToBeAdded = (updateProcessContactDto.processId as string[]).filter(
            (processId) =>
                !processIds.includes(processId) && !restoredProcessContacts?.find((fa) => fa.processId === processId)
        );

        await async.eachSeries(processIdsToBeAdded, async (processId) => {
            try {
                await this.subAddProcessContact({
                    processId: processId,
                    contactId: updateProcessContactDto.contactId as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    async subAddProcessContact(addProcessContactDto: AddProcessContactDto) {
        const isProcessContact = await this.processContactRepository.fetchAll(
            {
                processId: addProcessContactDto.processId as string,
                contactId: addProcessContactDto.contactId as string
            },
            {}
        );

        if (isProcessContact) {
            return false;
        }

        const processContactsEntity = ProcessContactEntity.create({
            ...addProcessContactDto
        });
        processContactsEntity.processContactId = SharedUtils.shortUuid();
        await this.processContactRepository.create(processContactsEntity);

        return processContactsEntity;
    }

    async addProcessContact(addProcessContactDto: AddProcessContactDto) {
        try {
            const isProcessContact = await this.subAddProcessContact(addProcessContactDto);
            if (!isProcessContact) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(isProcessContact);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetProcessContacts(getProcessContactDto: GetProcessContactDto) {
        const searchFilters = ProcessContactFilter.setFilter(getProcessContactDto);
        const processContacts = await this.processContactRepository.fetchAll(searchFilters, {id: ORDER_BY.DESC});
        if (!processContacts) {
            return false;
        }

        return processContacts;
    }

    async subGetProcessContactsWithDeleted(searchBy: {processId?: string; contactId?: string}) {
        const searchFilters = ProcessContactFilter.setFilter(searchBy);
        const processContacts = await this.processContactRepository.fetchAllWithDeleted(searchFilters);
        if (!processContacts) {
            return false;
        }

        return processContacts;
    }

    async subUpdateProcessContacts(updateProcessContactDto: UpdateProcessContactDto) {
        const results = await this.subGetProcessContactsWithDeleted({
            contactId: updateProcessContactDto.contactId as string
        });

        const isDeletedProcessContacts = results ? results : [];

        const restoredProcessContacts = await this.toBeRestored(isDeletedProcessContacts, updateProcessContactDto);

        const isProcessContacts = isDeletedProcessContacts.filter((processContacts) => !processContacts.deletedAt);
        const processIds = isProcessContacts.map((processAdmin) => {
            return processAdmin.processId;
        });

        !updateProcessContactDto.isAdd && (await this.toBeRemoved(processIds as string[], updateProcessContactDto));

        await this.toBeAdded(processIds as string[], updateProcessContactDto, restoredProcessContacts);

        return true;
    }

    async updateProcessContact(updateProcessContactDto: UpdateProcessContactDto) {
        try {
            const isProcessContact = await this.subUpdateProcessContacts(updateProcessContactDto);

            if (!isProcessContact) {
                return HttpResponse.notFound();
            }

            return HttpResponse.created(isProcessContact);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemoveProcessContact(removeProcessContactDto: RemoveProcessContactDto) {
        const searchFilters = ProcessContactFilter.setFilter(removeProcessContactDto);

        const isProcessContact = await this.processContactRepository.fetch(searchFilters);
        if (!isProcessContact) {
            return false;
        }

        return await this.processContactRepository.remove(searchFilters);
    }

    async removeProcessContact(removeProcessContactDto: RemoveProcessContactDto) {
        try {
            const isProcessContactRemoved = await this.subRemoveProcessContact(removeProcessContactDto);
            if (!isProcessContactRemoved) {
                HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
