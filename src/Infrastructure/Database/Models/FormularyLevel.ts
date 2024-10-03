import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";
import {Formulary} from "./Formulary";

@Entity("FormularyLevels")
export class FormularyLevel extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    formularyLevelId!: string;

    @Column({
        nullable: true
    })
    min!: number;

    @Column({
        nullable: true
    })
    max!: number;

    @Column({
        nullable: true
    })
    parLevel!: number;

    @Column({
        nullable: true
    })
    threshold!: number;

    @Column({
        nullable: true
    })
    isStock!: boolean;

    @Column({
        nullable: true
    })
    orderedQuantity!: number;

    @Column({
        nullable: true
    })
    formularyId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Formulary, (formulary) => formulary.formularyLevel, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "formularyId",
        referencedColumnName: "formularyId"
    })
    formulary!: Formulary;

    @ManyToOne(() => Facility, (facility) => facility.formularyLevel, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
