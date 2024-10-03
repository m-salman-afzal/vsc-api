import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import Base from "./Base";
import {SafeEventLocation} from "./SafeEventLocation";
import {SafeReport} from "./SafeReport";

@Entity("SafeReportEventLocations")
export class SafeReportEventLocation extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    safeReportEventLocationId!: string;

    @Column({
        nullable: true
    })
    safeReportId!: string;

    @Column({
        nullable: true
    })
    safeEventLocationId!: string;

    @Column({
        nullable: true,
        type: "longtext"
    })
    description!: string;

    @ManyToOne(() => SafeReport, (safeReport) => safeReport.safeReportEventLocation, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "safeReportId",
        referencedColumnName: "safeReportId"
    })
    safeReport!: SafeReport;

    @ManyToOne(() => SafeEventLocation, (safeEventLocation) => safeEventLocation.safeReportEventLocation, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "safeEventLocationId",
        referencedColumnName: "safeEventLocationId"
    })
    safeEventLocation!: SafeEventLocation;
}
