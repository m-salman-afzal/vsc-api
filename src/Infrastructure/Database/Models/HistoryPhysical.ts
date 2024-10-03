import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";
import {Patient} from "./Patient";

@Entity("HistoryPhysical")
export class HistoryPhysical extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    historyPhysicalId!: string;

    @Column({
        nullable: false
    })
    sapphirePatientId!: string;

    @Column({
        nullable: false
    })
    patientName!: string;

    @Column({
        nullable: false
    })
    patientNumber!: string;

    @Column({
        nullable: false
    })
    location!: string;

    @Column({
        nullable: false,
        type: "date"
    })
    dob!: string;

    @Column({
        nullable: false
    })
    age!: number;

    @Column({
        nullable: true,
        type: "date"
    })
    annualDate!: string;

    @Column({
        nullable: true,
        type: "date"
    })
    initialDate!: string;

    @Column({
        nullable: true,
        type: "date"
    })
    lastBooked!: string;

    @Column({
        nullable: false,
        type: "boolean"
    })
    isYearly!: boolean;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    patientId!: string;

    @ManyToOne(() => Facility, (facility) => facility.historyPhysical, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToOne(() => Patient, (patient) => patient.historyPhysical, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "patientId",
        referencedColumnName: "patientId"
    })
    patient!: Patient;
}
