import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {Cart} from "./Cart";
import {Facility} from "./Facility";
import {File} from "./File";
import {ReferenceGuideDrug} from "./ReferenceGuideDrug";

@Entity("ReferenceGuides")
export class ReferenceGuide extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    referenceGuideId!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    note!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Facility, (facility) => facility.referenceGuide, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToMany(() => File, (file) => file.referenceGuide, {
        cascade: true
    })
    file!: File[];

    @OneToMany(() => ReferenceGuideDrug, (referenceGuideDrug) => referenceGuideDrug.referenceGuide, {
        cascade: true
    })
    referenceGuideDrug!: ReferenceGuideDrug[];

    @OneToMany(() => Cart, (cart) => cart.referenceGuide, {
        cascade: true
    })
    cart!: Cart[];
}
