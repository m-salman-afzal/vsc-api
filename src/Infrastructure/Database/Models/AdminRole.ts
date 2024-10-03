import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Role} from "./Role";

@Entity("AdminRoles")
export class AdminRole extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    adminRoleId!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    roleId!: string;

    @ManyToOne(() => Role, (role) => role.adminRole, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "roleId",
        referencedColumnName: "roleId"
    })
    role!: Role;

    @ManyToOne(() => Admin, (admin) => admin.adminRole, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;
}
