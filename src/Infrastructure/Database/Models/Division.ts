import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";

@Entity("Divisions")
export class Division extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    divisionId!: string;

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
    jan!: number;

    @Column({
        type: "float",
        nullable: true
    })
    feb!: number;

    @Column({
        type: "float",
        nullable: true
    })
    mar!: number;

    @Column({
        type: "float",
        nullable: true
    })
    apr!: number;

    @Column({
        type: "float",
        nullable: true
    })
    may!: number;

    @Column({
        type: "float",
        nullable: true
    })
    jun!: number;

    @Column({
        type: "float",
        nullable: true
    })
    jul!: number;

    @Column({
        type: "float",
        nullable: true
    })
    aug!: number;

    @Column({
        type: "float",
        nullable: true
    })
    sep!: number;

    @Column({
        type: "float",
        nullable: true
    })
    oct!: number;

    @Column({
        type: "float",
        nullable: true
    })
    nov!: number;

    @Column({
        type: "float",
        nullable: true
    })
    dec!: number;

    @Column({
        nullable: false
    })
    year!: string;

    @Column({
        nullable: true
    })
    watch!: string;

    @Column({
        type: "boolean",
        nullable: false
    })
    isBold!: boolean;

    @Column({
        nullable: false
    })
    divisionType!: string;

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
