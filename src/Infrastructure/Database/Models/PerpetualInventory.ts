import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";

import Base from "./Base";
import {Cart} from "./Cart";
import {CartRequestDeduction} from "./CartRequestDeduction";
import {ControlledDrug} from "./ControlledDrug";
import {DiscrepancyLog} from "./DiscrepancyLog";
import {Facility} from "./Facility";
import {PerpetualInventoryDeduction} from "./PerpetualInventoryDeduction";

import type {CartRequestDrug} from "./CartRequestDrug";

@Entity("PerpetualInventory")
export class PerpetualInventory extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    perpetualInventoryId!: string;

    @Column({
        nullable: false
    })
    rowNumber!: number;

    @Column({
        nullable: false
    })
    controlledId!: string;

    @Column({
        nullable: true
    })
    tr!: string;

    @Column({
        nullable: true
    })
    rx!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: true
    })
    patientName!: string;

    @Column({
        nullable: true
    })
    providerName!: string;

    @Column({
        nullable: true
    })
    staffName!: string;

    @Column({
        nullable: true
    })
    staffSignature!: string;

    @Column({
        type: "float",
        nullable: true
    })
    quantityAllocated!: number;

    @Column({
        nullable: true
    })
    isPatientSpecific!: boolean;

    @Column({
        nullable: true
    })
    isModified!: boolean;

    @Column({
        nullable: true
    })
    isArchived!: boolean;

    @Column({
        nullable: true
    })
    cartRequestDeductionId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    cartId!: string;

    @Column({
        nullable: true
    })
    controlledDrugId!: string;

    @OneToMany(() => PerpetualInventoryDeduction, (pid) => pid.perpetualInventory, {
        cascade: true
    })
    perpetualInventoryDeduction!: PerpetualInventoryDeduction[];

    @ManyToOne(() => Cart, (cart) => cart.perpetualInventory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;

    @ManyToOne(() => Facility, (facility) => facility.perpetualInventory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => ControlledDrug, (cd) => cd.perpetualInventory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "controlledDrugId",
        referencedColumnName: "controlledDrugId"
    })
    controlledDrug!: ControlledDrug;

    @OneToOne(() => CartRequestDeduction, (crd) => crd.perpetualInventory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestDeductionId",
        referencedColumnName: "cartRequestDeductionId"
    })
    cartRequestDeduction!: CartRequestDrug;

    @OneToMany(() => DiscrepancyLog, (discrepancyLog) => discrepancyLog.perpetualInventory, {
        cascade: true
    })
    discrepancyLog!: DiscrepancyLog[];
}
