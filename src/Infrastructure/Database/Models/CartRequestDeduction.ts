import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";

import Base from "./Base";
import {CartRequestDrug} from "./CartRequestDrug";
import {ControlledDrug} from "./ControlledDrug";
import {Facility} from "./Facility";
import {Inventory} from "./Inventory";
import {PerpetualInventory} from "./PerpetualInventory";

@Entity("CartRequestDeductions")
export class CartRequestDeduction extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    cartRequestDeductionId!: string;

    @Column({
        nullable: true
    })
    quantity!: number;

    @Column({
        nullable: true
    })
    inventoryId!: string;

    @Column({
        nullable: true
    })
    controlledDrugId!: string;

    @Column({
        nullable: true
    })
    cartRequestDrugId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Inventory, (inventory) => inventory.cartRequestDeduction, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "inventoryId",
        referencedColumnName: "inventoryId"
    })
    inventory!: Inventory;

    @ManyToOne(() => ControlledDrug, (controlledDrug) => controlledDrug.cartRequestDeduction, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "controlledDrugId",
        referencedColumnName: "controlledDrugId"
    })
    controlledDrug!: ControlledDrug;

    @ManyToOne(() => Facility, (facility) => facility.cartRequestDeduction, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cartRequestDeduction, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartRequestDrugId",
        referencedColumnName: "cartRequestDrugId"
    })
    cartRequestDrug!: CartRequestDrug;

    @OneToOne(() => PerpetualInventory, (pi) => pi.cartRequestDeduction, {
        cascade: true
    })
    perpetualInventory!: PerpetualInventory;
}
