import type {IHistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";

type TGetHistoryPhysicalDTO = Partial<Pick<IHistoryPhysicalEntity, "isYearly">> &
    Pick<IHistoryPhysicalEntity, "facilityId"> & {
        to?: string;
        from?: string;
    };

export interface GetHistoryPhysicalDTO extends TGetHistoryPhysicalDTO {}

export class GetHistoryPhysicalDTO {
    isYearly: boolean;

    private constructor(body: TGetHistoryPhysicalDTO) {
        this.isYearly = (body.isYearly as unknown) === "true";
        this.to = body.to as string;
        this.from = body.from as string;
        this.facilityId = body.facilityId;
    }

    static create(body: TGetHistoryPhysicalDTO) {
        return new GetHistoryPhysicalDTO(body);
    }
}
