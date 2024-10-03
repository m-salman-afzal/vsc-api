import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";

@Entity("InventoryHistory")
export class InventoryHistory extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    inventoryHistoryId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Facility, (facility) => facility.inventoryHistory, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
