import type {IReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";

type TBulkAddReferenceGuideDrugDto = IReferenceGuideDrugEntity & {
    action: "add" | "edit" | "delete";
    failedReason: string;
    formularyAutoId: number;
    drug: string;
};

export interface BulkAddReferenceGuideDrugDto extends TBulkAddReferenceGuideDrugDto {}

export class BulkAddReferenceGuideDrugDto {
    constructor(body: TBulkAddReferenceGuideDrugDto) {
        this.id = body.formularyAutoId as number;
        this.drug = body.drug as string;
        this.category = body.category as string;
        this.subCategory = body.subCategory as string;
        this.min = body.min as number;
        this.max = body.max as number;
        this.notes = body.notes as string;
        this.action = body.action;
    }

    static create(body: unknown) {
        return new BulkAddReferenceGuideDrugDto(body as TBulkAddReferenceGuideDrugDto);
    }
}
