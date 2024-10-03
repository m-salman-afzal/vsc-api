import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Contact} from "./Contact";
import {Process} from "./Process";

@Entity("ProcessContact")
export class ProcessContact extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    processContactId!: string;

    @Column({
        nullable: true
    })
    processId!: string;

    @Column({
        nullable: true
    })
    contactId!: string;

    @ManyToOne(() => Contact, (contact) => contact.processContact, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "contactId",
        referencedColumnName: "contactId"
    })
    contact!: Contact;

    @ManyToOne(() => Process, (process) => process.processContact, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "processId",
        referencedColumnName: "processId"
    })
    process!: Process;
}
