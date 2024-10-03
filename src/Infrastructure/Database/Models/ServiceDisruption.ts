import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";
import {ServiceDisruptionPatient} from "./ServiceDisruptionPatient";

@Entity("ServiceDisruptions")
export class ServiceDisruption extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    serviceDisruptionId!: string;

    @Column({
        type: "date",
        nullable: true
    })
    date!: string;

    @Column({
        type: "time",
        nullable: true
    })
    time!: string;

    @Column({
        nullable: true
    })
    service!: string;

    @Column({
        nullable: true
    })
    reason!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @ManyToOne(() => Admin, (admin) => admin.serviceDisruptions, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admins!: Admin;

    @OneToMany(
        () => ServiceDisruptionPatient,
        (serviceDisruptionPatient) => serviceDisruptionPatient.serviceDisruption,
        {
            cascade: true
        }
    )
    serviceDisruptionPatient!: ServiceDisruptionPatient[];

    @ManyToOne(() => Facility, (facility) => facility.serviceDisruption, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
