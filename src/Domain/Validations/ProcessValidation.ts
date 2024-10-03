import {ProcessValidationSchema} from "@validations/Schemas/ProcessValidationSchema";

export class ProcessValidation {
    static getProcessValidation(body: unknown) {
        const getProcess = ProcessValidationSchema.partial({
            processId: true,
            processName: true,
            processLabel: true
        });

        return getProcess.parse(body);
    }

    static updateProcessValidation(body: unknown) {
        const updateProcessContact = ProcessValidationSchema.required({
            processId: true
        });

        return updateProcessContact.parse(body);
    }
}
