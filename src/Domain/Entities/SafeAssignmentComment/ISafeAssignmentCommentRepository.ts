import type IBaseRepository from "@entities/IBaseRepository";
import type {SafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";
import type {SafeAssignmentComment} from "@infrastructure/Database/Models/SafeAssignmentComment";

export interface ISafeAssignmentCommentRepository
    extends IBaseRepository<SafeAssignmentComment, SafeAssignmentCommentEntity> {}
