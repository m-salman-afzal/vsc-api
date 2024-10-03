import type {ISafeAssignmentCommentEntity} from "@entities/SafeAssignmentComment/SafeAssignmentCommentEntity";

type IAddSafeAssignmentCommentDto = Omit<ISafeAssignmentCommentEntity, "safeAssignmentCommentId">;

export interface AddSafeAssignmentCommentDto extends IAddSafeAssignmentCommentDto {}

export class AddSafeAssignmentCommentDto {
    private constructor(body: IAddSafeAssignmentCommentDto) {
        this.comment = body.comment;
        this.adminId = body.adminId;
        this.safeReportId = body.safeReportId;
    }

    static create(body: unknown) {
        return new AddSafeAssignmentCommentDto(body as IAddSafeAssignmentCommentDto);
    }
}
