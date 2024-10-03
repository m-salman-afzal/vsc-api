import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {CartRequestDrug} from "./CartRequestDrug";
import {CartRequestForm} from "./CartRequestForm";
import {Formulary} from "./Formulary";
import {ReferenceGuide} from "./ReferenceGuide";

@Entity("ReferenceGuideDrugs")
export class ReferenceGuideDrug extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    referenceGuideDrugId!: string;

    @Column({
        nullable: true
    })
    category!: string;

    @Column({
        nullable: true
    })
    subCategory!: string;

    @Column({
        nullable: true,
        type: "float"
    })
    min!: number;

    @Column({
        nullable: true,
        type: "float"
    })
    max!: number;

    @Column({
        nullable: true,
        type: "longtext"
    })
    notes!: string;

    @Column({
        nullable: true
    })
    referenceGuideId!: string;

    @Column({
        nullable: true
    })
    formularyId!: string;

    @ManyToOne(() => ReferenceGuide, (referenceGuide) => referenceGuide.referenceGuideDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "referenceGuideId",
        referencedColumnName: "referenceGuideId"
    })
    referenceGuide!: ReferenceGuide;

    @ManyToOne(() => Formulary, (formulary) => formulary.referenceGuideDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "formularyId",
        referencedColumnName: "formularyId"
    })
    formulary!: Formulary;

    @OneToMany(() => CartRequestForm, (cartRequestForm) => cartRequestForm.referenceGuideDrug, {
        cascade: true
    })
    cartRequestForm!: CartRequestForm[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.referenceGuideDrug, {
        cascade: true
    })
    cartRequestDrug!: CartRequestDrug[];
}
