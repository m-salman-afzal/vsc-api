import z from "zod";

import {FACILITY_SUPPLY_DAYS} from "@constants/FacilityConstant";

import {BridgeTherapyLogValidationSchema} from "@validations/Schemas/BridgeTherapyLogValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {PatientValidationSchema} from "./Schemas/PatientValidationSchema";

export class BridgeTherapyValidation {
    static getBridgeTherapyLogValidation(body: unknown) {
        const row = BridgeTherapyLogValidationSchema.merge(PaginationValidationSchema)
            .required({facilityId: true})
            .partial({
                adminId: true,
                bridgeTherapyLogCreatedAt: true,
                currentPage: true,
                perPage: true,
                sort: true
            });

        return row.parse(body);
    }

    static downloadBridgeTherapyLogValidation(body: unknown) {
        const row = BridgeTherapyLogValidationSchema.required({
            facilityId: true,
            bridgeTherapyLogId: true
        });

        return row.parse(body);
    }

    static addBridgeTherapy(body: unknown) {
        const row = PatientValidationSchema.required({facilityId: true, adminId: true}).merge(
            z.object({
                bridgeTherapy: z
                    .array(
                        z.object({
                            patientId: z.string(),
                            supplyDays: z.nativeEnum(FACILITY_SUPPLY_DAYS)
                        })
                    )
                    .min(1)
            })
        );

        return row.parse(body);
    }

    static getBridgeTherapyAdminsValidation(body: unknown) {
        const row = BridgeTherapyLogValidationSchema.partial({
            text: true
        }).required({facilityId: true});

        return row.parse(body);
    }
}
