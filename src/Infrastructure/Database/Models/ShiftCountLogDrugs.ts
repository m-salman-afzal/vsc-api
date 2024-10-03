import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {ShiftCountLogs} from "./ShiftCountLogs";

@Entity("ShiftCountLogDrugs")
export class ShiftCountLogDrugs extends Base {
    @Column({
        unique: true,
        nullable: false
    })
    shiftCountLogDrugId!: string;

    @Column({
        nullable: true
    })
    shiftCountLogId!: string;

    @Column({
        nullable: false
    })
    countedQuantity!: number;

    @Column({
        nullable: false
    })
    quantityOnHand!: number;

    @Column({
        nullable: false
    })
    rowNumber!: number;

    @Column({
        nullable: false
    })
    controlledId!: string;

    @Column({
        nullable: true
    })
    tr!: string;

    @Column({
        nullable: true
    })
    rx!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @ManyToOne(() => ShiftCountLogs, (scl) => scl.shiftCountLogDrugs, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "shiftCountLogId",
        referencedColumnName: "shiftCountLogId"
    })
    shiftCountLog!: ShiftCountLogs;
}
