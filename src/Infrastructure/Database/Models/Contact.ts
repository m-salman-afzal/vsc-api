import {Column, Entity, JoinColumn, OneToMany, OneToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {FacilityContact} from "./FacilityContact";
import {ProcessContact} from "./ProcessContact";

@Entity("Contacts")
export class Contact extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    contactId!: string;

    @Column({
        nullable: true,
        unique: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    email!: string;

    @Column({
        nullable: true
    })
    firstName!: string;

    @Column({
        nullable: true
    })
    lastName!: string;

    @Column({
        nullable: false
    })
    type!: string;

    @OneToOne(() => Admin, (admin) => admin.contact, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @OneToMany(() => FacilityContact, (facilityContact) => facilityContact.contact, {
        cascade: true
    })
    facilityContact!: FacilityContact[];

    @OneToMany(() => ProcessContact, (processContact) => processContact.contact, {
        cascade: true
    })
    processContact!: ProcessContact[];
}
