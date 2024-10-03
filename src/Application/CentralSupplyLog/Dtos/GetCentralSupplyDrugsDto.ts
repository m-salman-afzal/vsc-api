import {BOOLEAN_VALUES} from "@appUtils/Constants";

import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TGetCentralSupplyDrugsDto = Partial<
    Pick<IFormularyEntity, "name" | "isControlled"> & {
        isFormulary: boolean;
        orderedQuantityMin: number;
        orderedQuantityMax: number;
        facilityId: string;
        isDepleted: boolean;
    }
>;

export interface GetCentralSupplyDrugsDto extends TGetCentralSupplyDrugsDto {}

export class GetCentralSupplyDrugsDto {
    private constructor(body: TGetCentralSupplyDrugsDto) {
        this.name = body.name as string;
        this.isControlled = (
            body.isControlled ? (body.isControlled as never) === BOOLEAN_VALUES.TRUE : null
        ) as boolean;
        this.isFormulary = (body.isFormulary ? (body.isFormulary as never) === BOOLEAN_VALUES.TRUE : null) as boolean;
        this.orderedQuantityMin = (body.orderedQuantityMin ? Number(body.orderedQuantityMin) : null) as number;
        this.orderedQuantityMax = (body.orderedQuantityMax ? Number(body.orderedQuantityMax) : null) as number;
        this.facilityId = body.facilityId as string;

        this.isDepleted = (body.isDepleted ? (body.isDepleted as never) === BOOLEAN_VALUES.TRUE : null) as boolean;
    }

    static create(body: unknown) {
        return new GetCentralSupplyDrugsDto(body as TGetCentralSupplyDrugsDto);
    }
}
