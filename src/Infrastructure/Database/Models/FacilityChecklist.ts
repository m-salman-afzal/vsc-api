import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";
import {SafeFacilityChecklist} from "./SafeFacilityChecklist";

@Entity("FacilityChecklist")
export class FacilityChecklist extends Base {
    @Column({nullable: false, unique: true})
    facilityChecklistId!: string;

    @Column({nullable: false})
    event!: string;

    @Column({nullable: true})
    priority!: number;

    @Column({nullable: true})
    adminId!: string;

    @Column({nullable: true})
    facilityId!: string;

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

    @OneToMany(() => SafeFacilityChecklist, (safeFacilityChecklist) => safeFacilityChecklist.facilityChecklist, {
        cascade: true
    })
    safeFacilityChecklist!: SafeFacilityChecklist[];
}
