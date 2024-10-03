import type {IShiftCountLogEntity} from "@entities/ShiftCountLog/ShiftCountLogEntity";

type TAddShiftCountDiscrepancyNotificationDto = Pick<IShiftCountLogEntity, "shiftCountLogId" | "cartId" | "facilityId">;
export interface AddShiftCountDiscrepancyNotificationDto extends TAddShiftCountDiscrepancyNotificationDto {}

export class AddShiftCountDiscrepancyNotificationDto {
    private constructor(body: TAddShiftCountDiscrepancyNotificationDto) {
        this.cartId = body.cartId;
        this.shiftCountLogId = body.shiftCountLogId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new AddShiftCountDiscrepancyNotificationDto(body as TAddShiftCountDiscrepancyNotificationDto);
    }
}
