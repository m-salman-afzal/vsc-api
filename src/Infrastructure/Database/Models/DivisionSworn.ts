import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";

@Entity("DivisionSworn")
export class DivisionSworn extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    divisionSwornId!: string;

    @Column({
        nullable: true
    })
    position!: number;

    @Column({
        nullable: false
    })
    title!: string;

    @Column({
        type: "float",
        nullable: true
    })
    dsp!: number;

    @Column({
        type: "float",
        nullable: true
    })
    dsj!: number;

    @Column({
        type: "float",
        nullable: true
    })
    dsr!: number;

    @Column({
        type: "float",
        nullable: true
    })
    mds!: number;

    @Column({
        type: "float",
        nullable: true
    })
    cpl!: number;

    @Column({
        type: "float",
        nullable: true
    })
    sgt!: number;

    @Column({
        type: "float",
        nullable: true
    })
    lt!: number;

    @Column({
        type: "float",
        nullable: true
    })
    cap!: number;

    @Column({
        type: "float",
        nullable: true
    })
    maj!: number;

    @Column({
        type: "float",
        nullable: true
    })
    ltCol!: number;

    @Column({
        type: "float",
        nullable: true
    })
    col!: number;

    @Column({
        type: "float",
        nullable: true
    })
    dcr!: number;

    @Column({
        type: "float",
        nullable: true
    })
    chd!: number;

    @Column({
        nullable: false
    })
    year!: string;

    @Column({
        nullable: true
    })
    category!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Facility, (facility) => facility.division, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
