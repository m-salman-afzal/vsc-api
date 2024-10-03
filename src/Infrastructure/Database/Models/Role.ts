import {Column, Entity, OneToMany} from "typeorm";

import {AdminRole} from "./AdminRole";
import Base from "./Base";
import {RoleServiceList} from "./RoleServiceList";

@Entity("Roles")
export class Role extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    roleId!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: true
    })
    position!: number;

    @Column({
        nullable: true
    })
    colorCode!: string;

    @OneToMany(() => RoleServiceList, (RoleServiceList) => RoleServiceList.role, {
        cascade: true
    })
    roleServiceList!: RoleServiceList[];

    @OneToMany(() => AdminRole, (adminRole) => adminRole.role, {
        cascade: true
    })
    adminRole!: AdminRole[];
}
