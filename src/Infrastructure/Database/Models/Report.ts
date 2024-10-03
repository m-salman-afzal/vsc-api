import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";
import {SafeReport} from "./SafeReport";
import {SafeReportNotification} from "./SafeReportNotification";

@Entity("Reports")
export class Report extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    reportId!: string;

    @Column({
        nullable: true
    })
    status!: string;

    @Column({
        nullable: true
    })
    isAnonymous!: boolean;

    @Column({
        nullable: true
    })
    type!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    description!: string;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    closedByAdminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    safeReportId!: string;

    @ManyToOne(() => Admin, (admin) => admin.report, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.report, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @OneToOne(() => SafeReport, (safeReport) => safeReport.report, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "safeReportId",
        referencedColumnName: "safeReportId"
    })
    safeReport!: SafeReport;

    @ManyToOne(() => Admin, (admin) => admin.report, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "closedByAdminId",
        referencedColumnName: "adminId"
    })
    closedByAdmin!: Admin;

    @OneToMany(() => SafeReportNotification, (safeReportNotification) => safeReportNotification.report, {
        cascade: true
    })
    safeReportNotification!: SafeReportNotification[];
}
