import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {SafeReport} from "./SafeReport";
import {SafeReportNotification} from "./SafeReportNotification";

@Entity("SafeAssignmentComments")
export class SafeAssignmentComment extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    safeAssignmentCommentId!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    comment!: string;

    @Column({
        nullable: true
    })
    safeReportId!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @OneToMany(() => SafeReportNotification, (safeReportNotification) => safeReportNotification.safeAssignmentComment, {
        cascade: true
    })
    safeReportNotification!: SafeReportNotification[];

    @ManyToOne(() => SafeReport, (safeReport) => safeReport.safeAssignmentComment, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "safeReportId",
        referencedColumnName: "safeReportId"
    })
    safeReport!: SafeReport;

    @ManyToOne(() => Admin, (admin) => admin.safeAssignmentComment, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;
}
