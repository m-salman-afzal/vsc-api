import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";

@Entity("BridgeTherapyLogs")
export class BridgeTherapyLog extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    bridgeTherapyLogId!: string;

    @Column({
        nullable: false
    })
    filename!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Admin, (admin) => admin.log, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.bridgeTherapyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
