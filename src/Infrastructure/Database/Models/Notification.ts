import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import Base from "./Base";
import {Facility} from "./Facility";
import {NotificationAdmin} from "./NotificationAdmin";

@Entity("Notifications")
export class Notification extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    notificationId!: string;

    @Column({
        nullable: false
    })
    repository!: string;

    @Column({
        nullable: true
    })
    repositoryId!: string;

    @Column({
        nullable: true
    })
    type!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @ManyToOne(() => Facility, (facility) => facility.safeReportNotification, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToMany(() => NotificationAdmin, (notificationAdmin) => notificationAdmin.notification, {
        cascade: true
    })
    notificationAdmin!: NotificationAdmin[];
}
