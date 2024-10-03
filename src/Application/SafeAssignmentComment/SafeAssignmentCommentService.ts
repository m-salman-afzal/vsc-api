import {inject, injectable} from "tsyringe";

import {SafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";

import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import type {AddSafeAssignmentCommentDto} from "./Dtos/AddSafeAssignmentCommentDto";
import type {ISafeAssignmentCommentRepository} from "@entities/SafeAssignmentComment/ISafeAssignmentCommentRepository";
import type {SafeAssignmentComment} from "@infrastructure/Database/Models/SafeAssignmentComment";

@injectable()
export class SafeAssignmentCommentService extends BaseService<SafeAssignmentComment, SafeAssignmentCommentEntity> {
    constructor(
        @inject("ISafeAssignmentCommentRepository") safeAssignmentCommentRepository: ISafeAssignmentCommentRepository
    ) {
        super(safeAssignmentCommentRepository);
    }

    async addSafeAssignmentComment(addSafeAssignmentCommentDto: AddSafeAssignmentCommentDto) {
        const safeAssignmentCommentEntity = SafeAssignmentCommentEntity.create(addSafeAssignmentCommentDto);

        safeAssignmentCommentEntity.safeAssignmentCommentId = SharedUtils.shortUuid();

        await this.create(safeAssignmentCommentEntity);

        return safeAssignmentCommentEntity;
    }
}
