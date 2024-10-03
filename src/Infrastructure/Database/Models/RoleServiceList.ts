import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {Role} from "./Role";
import {ServiceList} from "./ServiceList";

@Entity("RoleServiceList")
export class RoleServiceList extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    roleServiceListId!: string;

    @Column({
        nullable: true
    })
    serviceListId!: string;

    @Column({
        nullable: true
    })
    permission!: string;

    @Column({
        nullable: true
    })
    roleId!: string;

    @ManyToOne(() => Role, (role) => role.roleServiceList, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "roleId",
        referencedColumnName: "roleId"
    })
    role!: Role;

    @ManyToOne(() => ServiceList, (serviceList) => serviceList.roleServiceList, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "serviceListId",
        referencedColumnName: "serviceListId"
    })
    serviceList!: ServiceList;
}
