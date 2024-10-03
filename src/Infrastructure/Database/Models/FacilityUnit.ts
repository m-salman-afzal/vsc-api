import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Cart} from "./Cart";
import {Facility} from "./Facility";

@Entity("FacilityUnits")
export class FacilityUnit extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    facilityUnitId!: string;

    @Column({
        nullable: false,
        unique: true
    })
    unit!: string;

    @Column({
        nullable: true
    })
    cell!: string;

    @Column({
        nullable: true
    })
    bed!: string;

    @Column({
        nullable: false
    })
    isCart!: number;

    @Column({
        nullable: false
    })
    isHnP!: number;

    @Column({
        nullable: true
    })
    drugCount!: number;

    @Column({
        nullable: true
    })
    patientCount!: number;

    @Column({
        nullable: true
    })
    quantity!: number;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({nullable: true})
    cartId!: string;

    @ManyToOne(() => Cart, (cart) => cart.facilityUnit, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartId",
        referencedColumnName: "cartId"
    })
    cart!: Cart;

    @ManyToOne(() => Facility, (facility) => facility.facilityUnit, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
