import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {FacilityChecklist} from "./FacilityChecklist";
import {SafeReport} from "./SafeReport";

@Entity("SafeFacilityChecklist")
export class SafeFacilityChecklist extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    safeFacilityChecklistId!: string;

    @Column({
        nullable: true
    })
    facilityChecklistId!: string;

    @Column({
        nullable: true
    })
    safeReportId!: string;

    @ManyToOne(() => FacilityChecklist, (facilityChecklist) => facilityChecklist.safeFacilityChecklist, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityChecklistId",
        referencedColumnName: "facilityChecklistId"
    })
    facilityChecklist!: FacilityChecklist;

    @ManyToOne(() => SafeReport, (safeReport) => safeReport.safeFacilityChecklist, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "safeReportId",
        referencedColumnName: "safeReportId"
    })
    safeReport!: SafeReport;
}
