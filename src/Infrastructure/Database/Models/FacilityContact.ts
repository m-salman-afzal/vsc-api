import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Contact} from "./Contact";
import {Facility} from "./Facility";

@Entity("FacilityContacts")
export class FacilityContact extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    facilityContactId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    contactId!: string;

    @ManyToOne(() => Contact, (contact) => contact.facilityContact, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "contactId",
        referencedColumnName: "contactId"
    })
    contact!: Contact;

    @ManyToOne(() => Facility, (facility) => facility.facilityContact, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
