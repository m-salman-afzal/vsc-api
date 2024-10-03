import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Notification} from "./Notification";

@Entity("NotificationAdmins")
export class NotificationAdmin extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    notificationAdminId!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    notificationId!: string;

    @Column({
        nullable: true
    })
    isRead!: boolean;

    @Column({
        nullable: true
    })
    isArchived!: boolean;

    @ManyToOne(() => Admin, (admin) => admin.notificationAdmin, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Notification, (notification) => notification.notificationAdmin, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "notificationId",
        referencedColumnName: "notificationId"
    })
    notification!: Notification;
}
