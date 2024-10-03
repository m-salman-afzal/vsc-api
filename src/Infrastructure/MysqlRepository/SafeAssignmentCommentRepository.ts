import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {SafeAssignmentComment} from "@infrastructure/Database/Models/SafeAssignmentComment";

import type {ISafeAssignmentCommentRepository} from "@entities/SafeAssignmentComment/ISafeAssignmentCommentRepository";
import type {SafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";

@injectable()
export class SafeAssignmentCommentRepository
    extends BaseRepository<SafeAssignmentComment, SafeAssignmentCommentEntity>
    implements ISafeAssignmentCommentRepository
{
    constructor() {
        super(SafeAssignmentComment);
    }
}
