import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {DeepPartial} from "@typings/Misc";

export const formularyWithInventoryAndLevel: DeepPartial<Formulary>[] = [
    {
        brandName: "asd",
        formularyId: "asd",
        genericName: "asd",
        isActive: true,
        isControlled: false,
        name: "asd",
        strengthUnit: "asd",
        drugClass: "asd",
        drugName: "asd",
        formulation: "asd",
        id: 1,
        isGeneric: false,
        package: "asd",
        release: "asd",
        unitsPkg: 1,
        formularyLevel: [
            {
                formularyId: "1",
                facilityId: "asd",
                id: 1,
                parLevel: 1,
                orderedQuantity: 1,
                formularyLevelId: "1",
                isStock: true,
                max: 1,
                min: 1,
                threshold: 1
            }
        ],
        inventory: [
            {
                expirationDate: "asd",
                id: 1,
                inventoryId: "1",
                formularyId: "1",
                isActive: true,
                lotNo: "asd",
                ndc: "asd",
                manufacturer: "asd",
                quantity: 1
            }
        ]
    }
];
