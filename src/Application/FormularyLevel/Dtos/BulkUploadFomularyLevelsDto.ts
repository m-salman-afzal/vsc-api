import type {IFormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

type TBulkUploadFomularyLevelsDto = IFormularyLevelEntity & {
    formularyAutoId: number;
    isCentralSupply: boolean;
    failedReason: string;
    drug: string;
};

export interface BulkUploadFomularyLevelsDto extends TBulkUploadFomularyLevelsDto {}

export class BulkUploadFomularyLevelsDto {
    constructor(body: TBulkUploadFomularyLevelsDto) {
        this.facilityId = body.facilityId;
        this.formularyAutoId = body.formularyAutoId;
        this.min = body.min;
        this.max = body.max;
        this.threshold = body.threshold;
        this.parLevel = body.parLevel;
        this.isStock = body.isCentralSupply;
        this.drug = body.drug;
    }

    static create(body: unknown) {
        return new BulkUploadFomularyLevelsDto(body as TBulkUploadFomularyLevelsDto);
    }
}
