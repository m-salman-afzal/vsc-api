import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {Cart} from "./Cart";
import {CartRequestDrug} from "./CartRequestDrug";
import {Facility} from "./Facility";
import {ReferenceGuideDrug} from "./ReferenceGuideDrug";

@Entity("CartRequestForms")
export class CartRequestForm extends Base {
    @Column({
        nullable: false,
        unique: true
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
    facilityId!: string;

    @ManyToOne(() => Cart, (cart) => cart.cartRequestForm, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;

    @ManyToOne(() => ReferenceGuideDrug, (referenceGuideDrug) => referenceGuideDrug.cartRequestForm, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "referenceGuideDrugId",
        referencedColumnName: "referenceGuideDrugId"
    })
    referenceGuideDrug!: ReferenceGuideDrug;

    @ManyToOne(() => Facility, (facility) => facility.cartRequestForm, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cartRequestForm, {
        cascade: true
    })
    cartRequestDrug!: CartRequestDrug[];
}
