import type {ICentralSupplyLogDrugEntity} from "@entities/CentralSupplyLogDrug/CentralSupplyLogDrugEntity";

type TGetCentralSupplyLogDrugDto = Pick<ICentralSupplyLogDrugEntity, "centralSupplyLogId"> & {
    facilityId: string;
    isControlled?: boolean;
};

export interface GetCentralSupplyLogDrugDto extends TGetCentralSupplyLogDrugDto {}

export class GetCentralSupplyLogDrugDto {
    private constructor(body: TGetCentralSupplyLogDrugDto) {
        this.centralSupplyLogId = body.centralSupplyLogId;
        this.facilityId = body.facilityId;
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new GetCentralSupplyLogDrugDto(body as TGetCentralSupplyLogDrugDto);
    }
}
