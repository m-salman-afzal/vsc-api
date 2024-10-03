import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";
import {Inventory} from "./Inventory";

@Entity("InventoryControls")
export class InventoryControl extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    inventoryControlId!: string;

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
    inventoryId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Inventory, (inventory) => inventory.inventoryControl, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "inventoryId",
        referencedColumnName: "inventoryId"
    })
    inventory!: Inventory;

    @ManyToOne(() => Facility, (facility) => facility.inventoryControl, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
