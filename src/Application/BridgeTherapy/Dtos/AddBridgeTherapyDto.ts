import type {IPatientEntity} from "@entities/Patient/PatientEntity";

type TAddBridgeTherapyDto = Pick<IPatientEntity, "facilityId"> & {
    bridgeTherapy: Array<{patientId: string; supplyDays: number}>;
    adminId: string;
};

export interface AddBridgeTherapyDto extends TAddBridgeTherapyDto {}

export class AddBridgeTherapyDto {
    constructor(body: TAddBridgeTherapyDto) {
        this.bridgeTherapy = body.bridgeTherapy;
        this.facilityId = body.facilityId;
        this.adminId = body.adminId;
    }

    static create(body: unknown) {
        return new AddBridgeTherapyDto(body as TAddBridgeTherapyDto);
    }
}
