import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {ServiceList} from "./ServiceList";

@Entity("ServiceDependency")
export class ServiceDependency extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    serviceDependencyId!: string;
    @Column({
        nullable: false
    })
    minimumPermission!: string;

    @Column({
        nullable: false
    })
    minimumPermissionDependsOn!: string;

    @Column({
        nullable: true
    })
    dependencyOrRelationGroupId!: string;

    @Column({
        nullable: true
    })
    serviceListId!: string;

    @Column({
        nullable: true
    })
    serviceDependsOnId!: string;

    @ManyToOne(() => ServiceList, (serviceList) => serviceList.serviceDependency, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "serviceListId",
        referencedColumnName: "serviceListId"
    })
    serviceList!: ServiceList;

    @ManyToOne(() => ServiceList, (serviceList) => serviceList.serviceDependency, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "serviceDependsOnId",
        referencedColumnName: "serviceListId"
    })
    serviceDependsOn!: ServiceList;
}
