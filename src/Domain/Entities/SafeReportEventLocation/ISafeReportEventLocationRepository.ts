import type IBaseRepository from "@entities/IBaseRepository";
import type {SafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";
import type {SafeReportEventLocation} from "@infrastructure/Database/Models/SafeReportEventLocation";

export interface ISafeReportEventLocationRepository
    extends IBaseRepository<SafeReportEventLocation, SafeReportEventLocationEntity> {}
