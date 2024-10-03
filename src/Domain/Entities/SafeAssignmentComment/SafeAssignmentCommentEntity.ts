import SharedUtils from "@appUtils/SharedUtils";

import type {SafeAssignmentComment} from "@infrastructure/Database/Models/SafeAssignmentComment";

export interface ISafeAssignmentCommentEntity {
    safeAssignmentCommentId: string;
    comment: string;
    safeReportId: string;
    adminId: string;
    createdAt?: string;
}

export interface SafeAssignmentCommentEntity extends ISafeAssignmentCommentEntity {}

export class SafeAssignmentCommentEntity {
    constructor(body: ISafeAssignmentCommentEntity) {
        this.safeAssignmentCommentId = body.safeAssignmentCommentId;
        this.comment = body.comment ? body.comment.trim() : body.comment;
        this.safeReportId = body.safeReportId;
        this.adminId = body.adminId;
    }

    static create(body: unknown) {
        return new SafeAssignmentCommentEntity(body as ISafeAssignmentCommentEntity);
    }

    static publicFields(body: SafeAssignmentComment) {
        const comment = new SafeAssignmentCommentEntity(body as never);
        const {date, time} = SharedUtils.setDateTime(body.createdAt);
        comment.createdAt = `${date} ${time}`;

        return comment;
    }
}
