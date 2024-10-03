import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";
import {Report} from "./Report";
import {SafeAssignmentComment} from "./SafeAssignmentComment";

@Entity("SafeReportNotification")
export class SafeReportNotification extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    notificationId!: string;

    @Column({
        nullable: false
    })
    notificationType!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    reportId!: string;

    @Column({
        nullable: true
    })
    reportType!: string;

    @Column({
        nullable: true
    })
    isRead!: boolean;

    @Column({
        nullable: true
    })
    isArchived!: boolean;

    @Column({
        nullable: true
    })
    safeAssignmentCommentId!: string;

    @ManyToOne(() => SafeAssignmentComment, (safeAssignmentComment) => safeAssignmentComment.safeReportNotification, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "safeAssignmentCommentId",
        referencedColumnName: "safeAssignmentCommentId"
    })
    safeAssignmentComment!: SafeAssignmentComment;

    @ManyToOne(() => Report, (report) => report.safeReportNotification, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "reportId",
        referencedColumnName: "reportId"
    })
    report!: Report;

    @ManyToOne(() => Admin, (admin) => admin.safeReportNotification, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.safeReportNotification, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;
}
