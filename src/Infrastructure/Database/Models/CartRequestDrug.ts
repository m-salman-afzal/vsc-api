import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Cart} from "./Cart";
import {CartRequestDeduction} from "./CartRequestDeduction";
import {CartRequestForm} from "./CartRequestForm";
import {CartRequestLog} from "./CartRequestLog";
import {Facility} from "./Facility";
import {Formulary} from "./Formulary";
import {ReferenceGuideDrug} from "./ReferenceGuideDrug";

@Entity("CartRequestDrugs")
export class CartRequestDrug extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    cartRequestDrugId!: string;

    @Column({
        nullable: true
    })
    initialPendingOrderQuantity!: number;

    @Column({
        nullable: true
    })
    packageQuantity!: number;

    @Column({
        nullable: true
    })
    totalUnits!: number;

    @Column({
        nullable: true
    })
    controlledId!: string;

    @Column({
        nullable: true
    })
    tr!: string;

    @Column({
        nullable: true
    })
    pickStatus!: string;

    @Column({
        nullable: true
    })
    allocationStatus!: string;

    @Column({
        nullable: true
    })
    fromPartial!: boolean;

    @Column({
        nullable: true
    })
    formularyId!: string;

    @Column({
        nullable: true
    })
    cartRequestFormId!: string;

    @Column({
        nullable: true
    })
    cartId!: string;

    @Column({
        nullable: true
    })
    referenceGuideDrugId!: string;

    @Column({
        nullable: true
    })
    cartRequestLogId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true,
        type: "datetime"
    })
    pickedAt!: string;

    @Column({
        nullable: true,
        type: "datetime"
    })
    allocatedAt!: string;

    @Column({
        nullable: true
    })
    pickedByAdminId!: string;

    @Column({
        nullable: true
    })
    allocatedByAdminId!: string;

    @Column({
        nullable: true
    })
    cartRequestPickLogId!: string;

    @Column({
        nullable: true
    })
    cartRequestAllocationLogId!: string;

    @Column({
        nullable: true
    })
    cartRequestDeletionLogId!: string;

    @ManyToOne(() => CartRequestLog, (cartRequestLog) => cartRequestLog.cartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestLogId",
        referencedColumnName: "cartRequestLogId"
    })
    cartRequestLog!: CartRequestLog;

    @ManyToOne(() => CartRequestForm, (cartRequestForm) => cartRequestForm.cartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestFormId",
        referencedColumnName: "cartRequestFormId"
    })
    cartRequestForm!: CartRequestForm;

    @ManyToOne(() => Cart, (cart) => cart.cartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;

    @ManyToOne(() => ReferenceGuideDrug, (referenceGuideDrug) => referenceGuideDrug.cartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "referenceGuideDrugId",
        referencedColumnName: "referenceGuideDrugId"
    })
    referenceGuideDrug!: ReferenceGuideDrug;

    @ManyToOne(() => Facility, (facility) => facility.cartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => Formulary, (formulary) => formulary.cartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "formularyId",
        referencedColumnName: "formularyId"
    })
    formulary!: Formulary;

    @ManyToOne(() => Admin, (admin) => admin.pickedByCartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "pickedByAdminId",
        referencedColumnName: "adminId"
    })
    pickedByAdmin!: Admin;

    @ManyToOne(() => Admin, (admin) => admin.allocatedByCartRequestDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "allocatedByAdminId",
        referencedColumnName: "adminId"
    })
    allocatedByAdmin!: Admin;

    @ManyToOne(() => CartRequestLog, (cartRequestLog) => cartRequestLog.cartRequestPickDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestPickLogId",
        referencedColumnName: "cartRequestLogId"
    })
    cartRequestPickLog!: CartRequestLog;

    @ManyToOne(() => CartRequestLog, (cartRequestLog) => cartRequestLog.cartRequestAllocationDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestAllocationLogId",
        referencedColumnName: "cartRequestLogId"
    })
    cartRequestAllocationLog!: CartRequestLog;

    @ManyToOne(() => CartRequestLog, (cartRequestLog) => cartRequestLog.cartRequestDeletionDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestDeletionLogId",
        referencedColumnName: "cartRequestLogId"
    })
    cartRequestDeletionLog!: CartRequestLog;

    @OneToMany(() => CartRequestDeduction, (cartRequestDeduction) => cartRequestDeduction.cartRequestDrug, {
        cascade: true
    })
    cartRequestDeduction!: CartRequestDeduction[];
}
