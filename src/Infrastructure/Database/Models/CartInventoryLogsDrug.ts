import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {CartInventoryLogs} from "./CartInventoryLogs";

@Entity("CartInventoryLogsDrug")
export class CartInventoryLogsDrug extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    cartInventoryLogsDrugId!: string;

    @Column({
        nullable: true
    })
    cartInventoryLogsId!: string;

    @Column({
        nullable: false
    })
    name!: string;

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
    quantity!: number;

    @ManyToOne(() => CartInventoryLogs, (cartInventoryLogs) => cartInventoryLogs.cartInventoryLogsDrug, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "cartInventoryLogsId",
        referencedColumnName: "cartInventoryLogsId"
    })
    cartInventoryLogs!: CartInventoryLogs;
}
