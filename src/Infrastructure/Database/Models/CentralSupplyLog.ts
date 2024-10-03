import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {CentralSupplyLogDrug} from "./CentralSupplyLogDrug";
import {Facility} from "./Facility";

@Entity("CentralSupplyLogs")
export class CentralSupplyLog extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    centralSupplyLogId!: string;

    @Column({
        nullable: true
    })
    orderedQuantity!: number;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Admin, (admin) => admin.centralSupplyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.centralSupplyLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToMany(() => CentralSupplyLogDrug, (centralSupplyLogDrug) => centralSupplyLogDrug.centralSupplyLog, {
        cascade: true
    })
    centralSupplyLogDrug!: CentralSupplyLogDrug[];
}
