import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {CartRequestDrug} from "./CartRequestDrug";
import {CartRequestForm} from "./CartRequestForm";
import {CartRequestLog} from "./CartRequestLog";
import {ControlledDrug} from "./ControlledDrug";
import {DiscrepancyLog} from "./DiscrepancyLog";
import {Facility} from "./Facility";
import {FacilityUnit} from "./FacilityUnit";
import {PerpetualInventory} from "./PerpetualInventory";
import {ReferenceGuide} from "./ReferenceGuide";
import {ShiftCountLogs} from "./ShiftCountLogs";

@Entity("Carts")
export class Cart extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    cartId!: string;

    @Column({
        nullable: false
    })
    cart!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    referenceGuideId!: string;

    @OneToMany(() => FacilityUnit, (FacilityUnit) => FacilityUnit.cart, {
        cascade: true
    })
    facilityUnit!: FacilityUnit[];

    @OneToMany(() => PerpetualInventory, (pi) => pi.cart, {
        cascade: true
    })
    perpetualInventory!: PerpetualInventory[];

    @OneToMany(() => ShiftCountLogs, (scl) => scl.cart, {
        cascade: true
    })
    shiftCountLog!: ShiftCountLogs[];

    @ManyToOne(() => Facility, (facility) => facility.cart, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => ReferenceGuide, (referenceGuide) => referenceGuide.cart, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "referenceGuideId",
        referencedColumnName: "referenceGuideId"
    })
    referenceGuide!: ReferenceGuide;

    @OneToMany(() => CartRequestForm, (cartRequestForm) => cartRequestForm.cart, {
        cascade: true
    })
    cartRequestForm!: CartRequestForm[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cart, {
        cascade: true
    })
    cartRequestDrug!: CartRequestDrug[];

    @OneToMany(() => CartRequestLog, (cartRequestLog) => cartRequestLog.cart, {
        cascade: true
    })
    cartRequestLog!: CartRequestLog[];

    @OneToMany(() => ControlledDrug, (controlledDrug) => controlledDrug.cart, {
        cascade: true
    })
    controlledDrug!: ControlledDrug[];

    @OneToMany(() => DiscrepancyLog, (dl) => dl.cart, {
        cascade: true
    })
    discrepancyLog!: DiscrepancyLog[];
}
