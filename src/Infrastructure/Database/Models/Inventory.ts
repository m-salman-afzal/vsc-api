import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {CartRequestDeduction} from "./CartRequestDeduction";
import {ControlledDrug} from "./ControlledDrug";
import {Facility} from "./Facility";
import {Formulary} from "./Formulary";
import {InventoryControl} from "./InventoryControl";

@Entity("Inventory")
export class Inventory extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    inventoryId!: string;

    @Column({
        nullable: true
    })
    ndc!: string;

    @Column({
        nullable: true
    })
    manufacturer!: string;

    @Column({
        nullable: true
    })
    isActive!: boolean;

    @Column({
        nullable: true
    })
    lotNo!: string;

    @Column({
        nullable: true,
        type: "date"
    })
    expirationDate!: string;

    @Column({
        type: "float",
        nullable: true
    })
    quantity!: number;

    @Column({
        nullable: true
    })
    formularyId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Formulary, (formulary) => formulary.inventory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "formularyId",
        referencedColumnName: "formularyId"
    })
    formulary!: Formulary;

    @ManyToOne(() => Facility, (facility) => facility.inventory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToMany(() => InventoryControl, (inventoryControl) => inventoryControl.inventory, {
        cascade: true
    })
    inventoryControl!: InventoryControl[];

    @OneToMany(() => ControlledDrug, (controlledDrug) => controlledDrug.inventory, {
        cascade: true
    })
    controlledDrug!: ControlledDrug[];

    @OneToMany(() => CartRequestDeduction, (cartRequestDeduction) => cartRequestDeduction.inventory, {
        cascade: true
    })
    cartRequestDeduction!: CartRequestDeduction[];
}
