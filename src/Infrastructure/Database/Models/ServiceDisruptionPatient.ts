import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {ServiceDisruption} from "./ServiceDisruption";

@Entity("ServiceDisruptionPatients")
export class ServiceDisruptionPatient extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    serviceDisruptionPatientId!: string;

    @Column({
        nullable: true
    })
    patientName!: string;

    @Column({
        nullable: true
    })
    patientNumber!: string;

    @Column({
        type: "time",
        nullable: true
    })
    time!: string;

    @Column({
        nullable: true,
        type: "text"
    })
    comments!: string;

    @Column({
        nullable: true
    })
    delayPeriod!: string;

    @Column({
        nullable: true
    })
    serviceDisruptionId!: string;

    @ManyToOne(() => ServiceDisruption, (serviceDisruption) => serviceDisruption.serviceDisruptionPatient, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "serviceDisruptionId",
        referencedColumnName: "serviceDisruptionId"
    })
    serviceDisruption!: ServiceDisruption;
}
