import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";

@Entity("FacilityAdmins")
export class FacilityAdmin extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    facilityAdminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @ManyToOne(() => Admin, (admin) => admin.facilityAdmin, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.facilityAdmin, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
