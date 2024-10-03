import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Cart} from "./Cart";
import {Facility} from "./Facility";
import {PerpetualInventory} from "./PerpetualInventory";
import {PerpetualInventoryDeduction} from "./PerpetualInventoryDeduction";

@Entity("DiscrepancyLogs")
export class DiscrepancyLog extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    discrepancyLogId!: string;

    @Column({
        nullable: true
    })
    type!: string;

    @Column({
        nullable: true
    })
    level!: number;

    @Column({
        nullable: true
    })
    quantityDeducted!: number;

    @Column({
        nullable: true
    })
    quantityAllocated!: number;

    @Column({
        nullable: true,
        type: "longtext"
    })
    comment!: string;

    @Column({
        nullable: true
    })
    handOffName!: string;

    @Column({
        nullable: true
    })
    receiverName!: string;

    @Column({
        nullable: true
    })
    perpetualInventoryId!: string;

    @Column({
        nullable: true
    })
    perpetualInventoryDeductionId!: string;

    @Column({
        nullable: true
    })
    cartId!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    expectedQuantity!: number;

    @ManyToOne(() => Facility, (facility) => facility.discrepancyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => Admin, (admin) => admin.discrepancyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Cart, (cart) => cart.discrepancyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;

    @ManyToOne(() => PerpetualInventory, (pi) => pi.discrepancyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "perpetualInventoryId",
        referencedColumnName: "perpetualInventoryId"
    })
    perpetualInventory!: PerpetualInventory;

    @ManyToOne(() => PerpetualInventoryDeduction, (pid) => pid.discrepancyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "perpetualInventoryDeductionId",
        referencedColumnName: "perpetualInventoryDeductionId"
    })
    perpetualInventoryDeduction!: PerpetualInventoryDeduction;
}
