import {Column, Entity, OneToMany} from "typeorm";

import Base from "./Base";
import {CartRequestDrug} from "./CartRequestDrug";
import {CentralSupplyLogDrug} from "./CentralSupplyLogDrug";
import {FormularyLevel} from "./FormularyLevel";
import {Inventory} from "./Inventory";
import {ReferenceGuideDrug} from "./ReferenceGuideDrug";

@Entity("Formulary")
export class Formulary extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    formularyId!: string;

    @Column({
        nullable: true
    })
    drugName!: string;

    @Column({
        nullable: true
    })
    brandName!: string;

    @Column({
        nullable: true
    })
    genericName!: string;

    @Column({
        nullable: true
    })
    drugClass!: string;

    @Column({
        nullable: true
    })
    strengthUnit!: string;

    @Column({
        nullable: true
    })
    package!: string;

    @Column({
        nullable: true
    })
    unitsPkg!: number;

    @Column({
        nullable: true
    })
    release!: string;

    @Column({
        nullable: true
    })
    formulation!: string;

    @Column({
        nullable: true
    })
    isGeneric!: boolean;

    @Column({
        nullable: true
    })
    isControlled!: boolean;

    @Column({
        nullable: true
    })
    isFormulary!: boolean;

    @Column({
        nullable: true
    })
    isActive!: boolean;

    @Column({
        nullable: true
    })
    name!: string;

    @OneToMany(() => Inventory, (inventory) => inventory.formulary, {
        cascade: true
    })
    inventory!: Inventory[];

    @OneToMany(() => FormularyLevel, (formularyLevel) => formularyLevel.formulary, {
        cascade: true
    })
    formularyLevel!: FormularyLevel[];

    @OneToMany(() => ReferenceGuideDrug, (referenceGuideDrug) => referenceGuideDrug.formulary, {
        cascade: true
    })
    referenceGuideDrug!: ReferenceGuideDrug[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.formulary, {
        cascade: true
    })
    cartRequestDrug!: CartRequestDrug[];

    @OneToMany(() => CentralSupplyLogDrug, (centralSupplyLogDrug) => centralSupplyLogDrug.formulary, {
        cascade: true
    })
    centralSupplyLogDrug!: CentralSupplyLogDrug[];
}
