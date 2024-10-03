import {Column, Entity, JoinColumn, OneToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";

import type {TUserSetting} from "@typings/UserSetting";

@Entity("UserSettings")
export class UserSetting extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    userSettingId!: string;

    @Column({
        nullable: true,
        type: "json"
    })
    setting!: TUserSetting;

    @Column({
        nullable: true
    })
    adminId!: string;

    @OneToOne(() => Admin, (admin) => admin.userSetting, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;
}
