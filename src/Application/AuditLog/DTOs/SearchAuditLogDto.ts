type TSearchAuditLogDto = Partial<{
    text: string;
    firstName: string;
    lastName: string;
}>;

export interface SearchAuditLogDto extends TSearchAuditLogDto {}
export class SearchAuditLogDto {
    constructor(body: TSearchAuditLogDto) {
        if (body.text) {
            const names = body.text.split(" ");
            this.firstName = names.at(0) as string;
            if (names.length === 2) {
                this.lastName = names.at(1) as string;
            }
        }
    }

    static create(body: unknown) {
        return new SearchAuditLogDto(body as TSearchAuditLogDto);
    }
}
