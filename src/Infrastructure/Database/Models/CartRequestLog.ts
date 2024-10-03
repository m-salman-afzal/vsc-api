import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Cart} from "./Cart";
import {CartRequestDrug} from "./CartRequestDrug";
import {Facility} from "./Facility";

@Entity("CartRequestLogs")
export class CartRequestLog extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    cartRequestLogId!: string;

    @Column({
        nullable: true
    })
    type!: string;

    @Column({
        nullable: true
    })
    canUndo!: boolean;

    @Column({
        nullable: true
    })
    controlledType!: string;

    @Column({
        nullable: true
    })
    receiverName!: string;

    @Column({
        nullable: true
    })
    receiverSignature!: string;

    @Column({
        nullable: true
    })
    witnessName!: string;

    @Column({
        nullable: true
    })
    witnessSignature!: string;

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

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cartRequestLog, {
        cascade: true
    })
    cartRequestDrug!: CartRequestDrug[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cartRequestAllocationLog, {
        cascade: true
    })
    cartRequestAllocationDrug!: CartRequestDrug[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cartRequestPickLog, {
        cascade: true
    })
    cartRequestPickDrug!: CartRequestDrug[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.cartRequestDeletionLog, {
        cascade: true
    })
    cartRequestDeletionDrug!: CartRequestDrug[];

    @ManyToOne(() => Admin, (admin) => admin.cartRequestLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.cartRequestLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => Cart, (cart) => cart.cartRequestLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;
}
