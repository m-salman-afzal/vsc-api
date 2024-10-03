import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";

@Entity("AuditLogs")
export class AuditLog extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    auditLogId!: string;

    @Column({
        nullable: false
    })
    action!: string;

    @Column({
        nullable: false
    })
    entity!: string;

    @Column({
        nullable: true
    })
    entityId!: string;

    @Column({
        nullable: false,
        type: "longtext"
    })
    data!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @ManyToOne(() => Admin, (admin) => admin.auditLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.auditLog, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
