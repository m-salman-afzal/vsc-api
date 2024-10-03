import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {Cart} from "./Cart";
import {Facility} from "./Facility";
import {ShiftCountLogDrugs} from "./ShiftCountLogDrugs";

@Entity("ShiftCountLogs")
export class ShiftCountLogs extends Base {
    @Column({
        unique: true,
        nullable: false
    })
    shiftCountLogId!: string;

    @Column({
        nullable: true
    })
    cartId!: string;

    @Column({
        nullable: false
    })
    handOffName!: string;

    @Column({
        nullable: false
    })
    handOffSignature!: string;

    @Column({
        nullable: false
    })
    receiverName!: string;

    @Column({
        nullable: false
    })
    receiverSignature!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    comment!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    isDiscrepancy!: boolean;

    @ManyToOne(() => Cart, (cart) => cart.shiftCountLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;

    @OneToMany(() => ShiftCountLogDrugs, (scld) => scld.shiftCountLog, {
        cascade: true
    })
    shiftCountLogDrugs!: ShiftCountLogDrugs[];

    @ManyToOne(() => Facility, (facility) => facility.shiftCountLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
