import {Column, Entity, OneToMany} from "typeorm";

import Base from "./Base";
import {SafeReportEventLocation} from "./SafeReportEventLocation";

@Entity("SafeEventLocations")
export class SafeEventLocation extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    safeEventLocationId!: string;

    @Column({
        nullable: true
    })
    location!: string;

    @OneToMany(() => SafeReportEventLocation, (safeReportEventLocation) => safeReportEventLocation.safeEventLocation, {
        cascade: true
    })
    safeReportEventLocation!: SafeReportEventLocation[];
}
