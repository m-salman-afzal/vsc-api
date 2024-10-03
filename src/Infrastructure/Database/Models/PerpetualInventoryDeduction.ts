import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {DiscrepancyLog} from "./DiscrepancyLog";
import {PerpetualInventory} from "./PerpetualInventory";

@Entity("PerpetualInventoryDeductions")
export class PerpetualInventoryDeduction extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    perpetualInventoryDeductionId!: string;

    @Column({
        nullable: true,
        type: "date"
    })
    date!: string;

    @Column({
        nullable: true,
        type: "time"
    })
    time!: string;

    @Column({
        nullable: true
    })
    patientName!: string;

    @Column({
        nullable: true
    })
    providerName!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    adminName!: string;

    @Column({
        nullable: true
    })
    witnessName!: string;

    @Column({
        nullable: true
    })
    nurseName!: string;

    @Column({
        nullable: true
    })
    adminSignature!: string;

    @Column({
        nullable: true
    })
    witnessSignature!: string;

    @Column({
        nullable: true
    })
    nurseSignature!: string;

    @Column({
        nullable: true
    })
    type!: string;

    @Column({
        type: "float",
        nullable: true
    })
    quantityDeducted!: number;

    @Column({
        nullable: true,
        type: "longtext"
    })
    comment!: string;

    @Column({
        nullable: true
    })
    perpetualInventoryId!: string;

    @ManyToOne(() => PerpetualInventory, (pi) => pi.perpetualInventoryDeduction, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "perpetualInventoryId",
        referencedColumnName: "perpetualInventoryId"
    })
    perpetualInventory!: PerpetualInventory;

    @ManyToOne(() => Admin, (admin) => admin.perpetualInventoryDeduction, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @OneToMany(() => DiscrepancyLog, (discrepancyLog) => discrepancyLog.perpetualInventoryDeduction, {
        cascade: true
    })
    discrepancyLog!: DiscrepancyLog[];
}
