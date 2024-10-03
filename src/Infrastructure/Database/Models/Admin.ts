import {Column, Entity, OneToMany, OneToOne} from "typeorm";

import {AdminRole} from "./AdminRole";
import {AuditLog} from "./AuditLog";
import Base from "./Base";
import {BridgeTherapyLog} from "./BridgeTherapyLog";
import {CartRequestDrug} from "./CartRequestDrug";
import {CartRequestLog} from "./CartRequestLog";
import {CentralSupplyLog} from "./CentralSupplyLog";
import {Contact} from "./Contact";
import {DiscrepancyLog} from "./DiscrepancyLog";
import {FacilityAdmin} from "./FacilityAdmin";
import {FacilityChecklist} from "./FacilityChecklist";
import {File} from "./File";
import Log from "./Log";
import {NotificationAdmin} from "./NotificationAdmin";
import {PerpetualInventoryDeduction} from "./PerpetualInventoryDeduction";
import {Report} from "./Report";
import {SafeAssignmentComment} from "./SafeAssignmentComment";
import {SafeReportNotification} from "./SafeReportNotification";
import {ServiceDisruption} from "./ServiceDisruption";
import {UserSetting} from "./UserSetting";

@Entity("Admins")
export class Admin extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    adminId!: string;

    @Column({
        nullable: false
    })
    firstName!: string;

    @Column({
        nullable: false
    })
    lastName!: string;

    @Column({
        nullable: false,
        unique: true
    })
    email!: string;

    @Column({
        nullable: true
    })
    password!: string;

    @Column({
        nullable: true
    })
    resetPasswordToken!: string;

    @Column({
        type: "date",
        nullable: true
    })
    passwordResetOn!: string;

    @Column({
        nullable: true
    })
    loginTries!: number;

    @Column({
        nullable: true
    })
    sessionId!: string;

    @Column({
        nullable: true
    })
    loginType!: string;

    @Column({
        nullable: false
    })
    adminType!: string;

    @OneToMany(() => Log, (log) => log.admin, {
        cascade: true
    })
    log!: Log;

    @OneToMany(() => File, (file) => file.admin, {
        cascade: true
    })
    file!: File[];

    @OneToMany(() => ServiceDisruption, (serviceDisruption) => serviceDisruption.admins, {
        cascade: true
    })
    serviceDisruptions!: ServiceDisruption[];

    @OneToMany(() => FacilityAdmin, (facilityAdmin) => facilityAdmin.admin, {
        cascade: true
    })
    facilityAdmin!: FacilityAdmin[];

    @OneToOne(() => UserSetting, (userSetting) => userSetting.admin, {
        cascade: true
    })
    userSetting!: UserSetting;

    @OneToMany(() => BridgeTherapyLog, (bridgeTherapyLog) => bridgeTherapyLog.admin, {
        cascade: true
    })
    bridgeTherapyLog!: BridgeTherapyLog;

    @OneToMany(() => AdminRole, (adminRole) => adminRole.admin, {
        cascade: true
    })
    adminRole!: AdminRole[];

    @OneToMany(() => AuditLog, (auditLog) => auditLog.admin, {
        cascade: true
    })
    auditLog!: AuditLog[];

    @OneToMany(() => FacilityChecklist, (facilityChecklist) => facilityChecklist.admin, {
        cascade: true
    })
    facilityChecklist!: FacilityChecklist[];

    @OneToMany(() => Report, (report) => report.admin, {
        cascade: true
    })
    report!: Report[];

    @OneToMany(() => Report, (report) => report.closedByAdmin, {
        cascade: true
    })
    closedByReport!: Report[];

    @OneToMany(() => SafeAssignmentComment, (safeAssignmentComment) => safeAssignmentComment.admin, {
        cascade: true
    })
    safeAssignmentComment!: SafeAssignmentComment[];

    @OneToOne(() => Contact, (contact) => contact.admin, {
        cascade: true
    })
    contact!: Contact;

    @OneToMany(() => CartRequestLog, (cartRequestLog) => cartRequestLog.admin, {
        cascade: true
    })
    cartRequestLog!: CartRequestLog[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.pickedByAdmin, {
        cascade: true
    })
    pickedByCartRequestDrug!: CartRequestDrug[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.allocatedByAdmin, {
        cascade: true
    })
    allocatedByCartRequestDrug!: CartRequestDrug[];

    @OneToMany(() => NotificationAdmin, (notificationAdmin) => notificationAdmin.admin, {
        cascade: true
    })
    notificationAdmin!: NotificationAdmin[];

    @OneToMany(() => SafeReportNotification, (safeReportNotification) => safeReportNotification.admin, {
        cascade: true
    })
    safeReportNotification!: SafeReportNotification[];
    @OneToMany(() => CentralSupplyLog, (centralSupplyLog) => centralSupplyLog.admin, {
        cascade: true
    })
    centralSupplyLog!: CentralSupplyLog[];

    @OneToMany(() => PerpetualInventoryDeduction, (pid) => pid.admin, {
        cascade: true
    })
    perpetualInventoryDeduction!: PerpetualInventoryDeduction[];

    @OneToMany(() => DiscrepancyLog, (discrepancyLog) => discrepancyLog.admin, {
        cascade: true
    })
    discrepancyLog!: PerpetualInventoryDeduction[];
}
