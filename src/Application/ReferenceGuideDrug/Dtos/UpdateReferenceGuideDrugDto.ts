import type {IReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";

type TUpdateReferenceGuideDrugDto = Pick<
    IReferenceGuideDrugEntity,
    "referenceGuideDrugId" | "formularyId" | "referenceGuideId"
> &
    Partial<Pick<IReferenceGuideDrugEntity, "category" | "subCategory" | "min" | "max" | "notes">>;

export interface UpdateReferenceGuideDrugDto extends TUpdateReferenceGuideDrugDto {}

export class UpdateReferenceGuideDrugDto {
    constructor(body: TUpdateReferenceGuideDrugDto) {
        this.referenceGuideDrugId = body.referenceGuideDrugId as string;
        this.referenceGuideId = body.referenceGuideId as string;
        this.formularyId = body.formularyId as string;
        this.category = body.category as string;
        this.subCategory = body.subCategory as string;
        this.min = body.min as number;
        this.max = body.max as number;
        this.notes = body.notes as string;
    }

    static create(body: unknown) {
        return new UpdateReferenceGuideDrugDto(body as UpdateReferenceGuideDrugDto);
    }
}
