import {ContactValidationSchema} from "@validations/Schemas/ContactValidationSchema";

import {FacilityValidationSchema} from "./Schemas/FacilityValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {ProcessValidationSchema} from "./Schemas/ProcessValidationSchema";

export class ContactValidation {
    static addContactValidation(body: unknown) {
        const addContact = ContactValidationSchema.merge(FacilityValidationSchema)
            .merge(ProcessValidationSchema)
            .required({
                type: true,
                facilityId: true,
                processId: true
            })
            .partial({firstName: true, lastName: true, email: true});

        return addContact.parse(body);
    }

    static getContactValidation(body: unknown) {
        const getContact = ContactValidationSchema.merge(ProcessValidationSchema)
            .merge(FacilityValidationSchema)
            .merge(PaginationValidationSchema)
            .partial({
                contactId: true,
                email: true,
                firstName: true,
                lastName: true,
                type: true,
                processId: true,
                facilityId: true,
                searchText: true
            });

        return getContact.parse(body);
    }

    static updateContactValidation(body: unknown) {
        const updateContact = ContactValidationSchema.merge(FacilityValidationSchema)
            .merge(ProcessValidationSchema)
            .required({
                contactId: true
            })
            .partial({
                firstName: true,
                lastName: true,
                email: true,
                type: true,
                facilityId: true,
                processId: true
            });

        return updateContact.parse(body);
    }

    static removeContactValidation(body: unknown) {
        const removeContact = ContactValidationSchema.required({
            contactId: true
        });

        return removeContact.parse(body);
    }
}
