import type IBaseRepository from "@entities/IBaseRepository";
import type {SafeEventLocationEntity} from "@entities/SafeEventLocation/SafeEventLocationEntity";
import type {SafeEventLocation} from "@infrastructure/Database/Models/SafeEventLocation";

export interface ISafeEventLocationRepository extends IBaseRepository<SafeEventLocation, SafeEventLocationEntity> {}
