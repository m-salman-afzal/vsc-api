import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {CentralSupplyLog} from "./CentralSupplyLog";
import {Formulary} from "./Formulary";

@Entity("CentralSupplyLogDrugs")
export class CentralSupplyLogDrug extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    centralSupplyLogDrugId!: string;

    @Column({
        nullable: true
    })
    orderedQuantity!: number;

    @Column({
        nullable: true
    })
    formularyQuantity!: number;

    @Column({
        nullable: true
    })
    centralSupplyLogId!: string;

    @Column({
        nullable: true
    })
    formularyId!: string;

    @ManyToOne(() => CentralSupplyLog, (centralSupplyLog) => centralSupplyLog.centralSupplyLogDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "centralSupplyLogId",
        referencedColumnName: "centralSupplyLogId"
    })
    centralSupplyLog!: CentralSupplyLog;

    @ManyToOne(() => Formulary, (formulary) => formulary.centralSupplyLogDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "formularyId",
        referencedColumnName: "formularyId"
    })
    formulary!: Formulary;
}
