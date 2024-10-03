import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";

@Entity("Logs")
class Log extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    logId!: string;

    @Column({
        nullable: true
    })
    reqUrl!: string;

    @Column({
        nullable: true
    })
    method!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    payload!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @ManyToOne(() => Admin, (admin) => admin.log, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;
}

export default Log;
