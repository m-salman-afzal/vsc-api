import type {ReferenceGuideEntity} from "./ReferenceGuideEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {ReferenceGuide} from "@infrastructure/Database/Models/ReferenceGuide";

export interface IReferenceGuideRepository extends IBaseRepository<ReferenceGuide, ReferenceGuideEntity> {}
