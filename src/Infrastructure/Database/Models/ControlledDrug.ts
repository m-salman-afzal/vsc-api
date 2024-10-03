import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {Cart} from "./Cart";
import {CartRequestDeduction} from "./CartRequestDeduction";
import {Inventory} from "./Inventory";
import {PerpetualInventory} from "./PerpetualInventory";

@Entity("ControlledDrugs")
export class ControlledDrug extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    controlledDrugId!: string;

    @Column({
        nullable: true
    })
    controlledId!: string;

    @Column({
        nullable: true
    })
    controlledType!: string;

    @Column({
        nullable: true
    })
    tr!: string;

    @Column({
        nullable: true
    })
    rx!: string;

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
    controlledQuantity!: number;

    @Column({
        nullable: true
    })
    inventoryId!: string;

    @Column({
        nullable: true
    })
    cartId!: string;

    @OneToMany(() => CartRequestDeduction, (cartRequestDeduction) => cartRequestDeduction.controlledDrug, {
        cascade: true
    })
    cartRequestDeduction!: CartRequestDeduction[];

    @OneToMany(() => PerpetualInventory, (pi) => pi.controlledDrug, {
        cascade: true
    })
    perpetualInventory!: PerpetualInventory[];

    @ManyToOne(() => Inventory, (inventory) => inventory.controlledDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "inventoryId",
        referencedColumnName: "inventoryId"
    })
    inventory!: Inventory;

    @ManyToOne(() => Cart, (cart) => cart.controlledDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;
}
