import {Column, Entity, OneToMany} from "typeorm";

import Base from "./Base";
import {ProcessContact} from "./ProcessContact";

@Entity("Process")
export class Process extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    processId!: string;

    @Column({
        nullable: true
    })
    type!: string;

    @Column({
        nullable: false
    })
    method!: string;

    @Column({
        type: "time",
        nullable: true
    })
    time!: string;

    @Column({
        nullable: true
    })
    processName!: string;

    @Column({
        nullable: true
    })
    processLabel!: string;

    @OneToMany(() => ProcessContact, (processContact) => processContact.process, {
        cascade: true
    })
    processContact!: ProcessContact[];
}
