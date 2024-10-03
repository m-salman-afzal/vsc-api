export interface IFacilityUnitEntity {
    facilityUnitId: string;
    facilityId: string;
    location: string;
    unit: string;
    cell: string;
    bed: string;
    isCart: number;
    isHnP: number;
    drugCount: number;
    patientCount: number;
    quantity: number;
    cartId: string;
}

export interface FacilityUnitEntity extends IFacilityUnitEntity {}

export class FacilityUnitEntity {
    constructor(facilityLocationEntity: IFacilityUnitEntity) {
        this.facilityUnitId = facilityLocationEntity.facilityUnitId;
        this.facilityId = facilityLocationEntity.facilityId;
        this.location = facilityLocationEntity.location
            ? facilityLocationEntity.location.trim()
            : facilityLocationEntity.location;
        this.unit = facilityLocationEntity.unit ? facilityLocationEntity.unit.trim() : facilityLocationEntity.unit;
        this.cell = facilityLocationEntity.cell ? facilityLocationEntity.cell.trim() : facilityLocationEntity.cell;
        this.bed = facilityLocationEntity.bed ? facilityLocationEntity.bed.trim() : facilityLocationEntity.bed;
        this.isHnP = facilityLocationEntity.isHnP ?? 1;
        this.isCart = facilityLocationEntity.isCart ?? 1;
        this.drugCount = facilityLocationEntity.drugCount;
        this.patientCount = facilityLocationEntity.patientCount;
        this.quantity = facilityLocationEntity.quantity;
        this.cartId = facilityLocationEntity.cartId;
    }

    static create(facilityLocationEntity) {
        return new FacilityUnitEntity(facilityLocationEntity);
    }
}
