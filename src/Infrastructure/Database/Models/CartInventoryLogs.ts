import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {CartInventoryLogsDrug} from "./CartInventoryLogsDrug";
import {Facility} from "./Facility";

@Entity("CartInventoryLogs")
export class CartInventoryLogs extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    cartInventoryLogsId!: string;

    @Column({
        nullable: false
    })
    cart!: string;

    @Column({
        nullable: false
    })
    countedBy!: string;

    @Column({
        nullable: true
    })
    countedBySignature!: string;

    @Column({
        nullable: false
    })
    witnessName!: string;

    @Column({
        nullable: true
    })
    witnessSignature!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    comment!: string;

    @OneToMany(() => CartInventoryLogsDrug, (cartInventoryLogsDrug) => cartInventoryLogsDrug.cartInventoryLogs, {
        cascade: true
    })
    cartInventoryLogsDrug!: CartInventoryLogsDrug[];

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Facility, (facility) => facility.cartInventoryLogs, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
