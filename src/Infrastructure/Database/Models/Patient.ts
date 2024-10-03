import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";
import {HistoryPhysical} from "./HistoryPhysical";

@Entity("Patients")
export class Patient extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    patientId!: string;

    @Column({
        nullable: false,
        unique: true
    })
    externalPatientId!: string;

    @Column({
        nullable: false,
        unique: true
    })
    jmsId!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: true
    })
    location!: string;

    @Column({
        type: "date",
        nullable: true
    })
    dob!: string;

    @Column({
        nullable: true
    })
    gender!: string;

    @Column({
        nullable: true
    })
    status!: string;

    @Column({
        type: "datetime",
        nullable: true
    })
    lastBookedDate!: string;

    @Column({
        type: "datetime",
        nullable: true
    })
    lastReleaseDate!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Facility, (facility) => facility.patient, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToOne(() => HistoryPhysical, (historyPhysical) => historyPhysical.patient, {
        cascade: true
    })
    historyPhysical!: HistoryPhysical;
}
