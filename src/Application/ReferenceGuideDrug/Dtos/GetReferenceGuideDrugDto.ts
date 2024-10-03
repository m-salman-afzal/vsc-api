import type {IReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";

type TGetReferenceGuideDrugDto = Partial<
    Pick<IReferenceGuideDrugEntity, "category" | "subCategory" | "referenceGuideId"> & {text: string}
>;

export interface GetReferenceGuideDrugDto extends TGetReferenceGuideDrugDto {}

export class GetReferenceGuideDrugDto {
    constructor(body: TGetReferenceGuideDrugDto) {
        this.category = body.category as string;
        this.subCategory = body.subCategory as string;
        this.referenceGuideId = body.referenceGuideId as string;
        this.text = body.text as string;
    }

    static create(body: unknown) {
        return new GetReferenceGuideDrugDto(body as GetReferenceGuideDrugDto);
    }
}
