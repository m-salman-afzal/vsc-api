import {Column, Entity, OneToMany, OneToOne} from "typeorm";

import Base from "./Base";
import {Report} from "./Report";
import {SafeAssignmentComment} from "./SafeAssignmentComment";
import {SafeFacilityChecklist} from "./SafeFacilityChecklist";
import {SafeReportEventLocation} from "./SafeReportEventLocation";

@Entity("SafeReports")
export class SafeReport extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    safeReportId!: string;

    @Column({
        nullable: true
    })
    eventType!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    detail!: string;

    @Column({
        nullable: true
    })
    patientName!: string;

    @Column({
        nullable: true,
        type: "date"
    })
    date!: string;

    @Column({
        nullable: true,
        type: "time"
    })
    time!: string;

    @Column({
        nullable: true
    })
    severityType!: string;

    @Column({
        nullable: true
    })
    nearMissType!: string;

    @Column({
        nullable: true
    })
    isPatientHarmed!: boolean;

    @Column({
        nullable: true,
        type: "longtext"
    })
    sbarrSituation!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    sbarrBackground!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    sbarrAction!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    sbarrRecommendation!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    sbarrResult!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    interventionDescription!: string;

    @Column({
        nullable: true
    })
    involvedParty!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    findings!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    involvedPartyText!: string;

    @Column({
        nullable: true
    })
    isFinding!: boolean;

    @OneToOne(() => Report, (report) => report.safeReport, {
        cascade: true
    })
    report!: Report[];

    @OneToMany(() => SafeFacilityChecklist, (safeFacilityChecklist) => safeFacilityChecklist.safeReport, {
        cascade: true
    })
    safeFacilityChecklist!: SafeFacilityChecklist[];

    @OneToMany(() => SafeReportEventLocation, (safeReportEventLocation) => safeReportEventLocation.safeReport, {
        cascade: true
    })
    safeReportEventLocation!: SafeReportEventLocation[];

    @OneToMany(() => SafeAssignmentComment, (safeAssignmentComment) => safeAssignmentComment.safeReport, {
        cascade: true
    })
    safeAssignmentComment!: SafeAssignmentComment[];
}
