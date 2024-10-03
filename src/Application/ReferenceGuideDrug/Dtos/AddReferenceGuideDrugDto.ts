import type {IReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";

type TAddReferenceGuideDrugDto = IReferenceGuideDrugEntity;

export interface AddReferenceGuideDrugDto extends TAddReferenceGuideDrugDto {}

export class AddReferenceGuideDrugDto {
    constructor(body: TAddReferenceGuideDrugDto) {
        this.formularyId = body.formularyId as string;
        this.referenceGuideDrugId = body.referenceGuideDrugId as string;
        this.referenceGuideId = body.referenceGuideId as string;
        this.category = body.category as string;
        this.subCategory = body.subCategory as string;
        this.min = body.min as number;
        this.max = body.max as number;
        this.notes = body.notes as string;
    }

    static create(body: unknown) {
        return new AddReferenceGuideDrugDto(body as TAddReferenceGuideDrugDto);
    }
}
