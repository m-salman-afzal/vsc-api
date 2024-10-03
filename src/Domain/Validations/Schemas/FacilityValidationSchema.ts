import {z} from "zod";

const stringValidation = z.string().trim().min(1, {message: "String required"});
export const FacilityValidationSchema = z
    .object({
        id: z.number().nonnegative({message: "Invalid id"}),
        facilityId: stringValidation.or(z.array(stringValidation)),
        facilityName: stringValidation,
        externalFacilityId: stringValidation.or(z.array(stringValidation)),
        address: stringValidation,
        population: z.number().nonnegative({message: "Invalid population"}),
        launchDate: stringValidation,
        text: stringValidation,
        sapphireFacilityId: stringValidation
    })
    .partial();
