import {Column, Entity, OneToMany} from "typeorm";

import Base from "./Base";
import {RoleServiceList} from "./RoleServiceList";
import {ServiceDependency} from "./ServiceDependency";

@Entity("ServiceList")
export class ServiceList extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    serviceListId!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @OneToMany(() => RoleServiceList, (roleServiceList) => roleServiceList.serviceList, {
        cascade: true
    })
    roleServiceList!: RoleServiceList[];

    @OneToMany(() => ServiceDependency, (serviceDependency) => serviceDependency.serviceList, {
        cascade: true
    })
    serviceDependency!: ServiceDependency[];
}
