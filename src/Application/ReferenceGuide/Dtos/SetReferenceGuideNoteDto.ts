type TSetReferenceGuideNoteDto = {
    referenceGuideId: string;
    facilityId: string;
    note: string;
};

export interface SetReferenceGuideNoteDto extends TSetReferenceGuideNoteDto {}

export class SetReferenceGuideNoteDto {
    constructor(body: TSetReferenceGuideNoteDto) {
        this.referenceGuideId = body.referenceGuideId;
        this.facilityId = body.facilityId;
        this.note = body.note;
    }

    static create(body: unknown) {
        return new SetReferenceGuideNoteDto(body as TSetReferenceGuideNoteDto);
    }
}
