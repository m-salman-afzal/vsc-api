import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";

type TGetCartAllocationDto = Pick<
    ICartRequestDrugEntity,
    "allocationStatus" | "cartId" | "pickStatus" | "facilityId" | "allocatedByAdminId"
> & {
    name?: string;
    adminId: string;
    type?: string;
    isControlled: boolean;
    toDate?: string;
    fromDate?: string;
    allocatedByAdminId?: string;
};

export interface GetCartAllocationDto extends TGetCartAllocationDto {}

export class GetCartAllocationDto {
    private constructor(body: TGetCartAllocationDto) {
        this.allocationStatus = body.allocationStatus;
        this.cartId = body.cartId;
        this.pickStatus = body.pickStatus;
        this.facilityId = body.facilityId;
        this.allocatedByAdminId = body.allocatedByAdminId;
        this.name = body.name as string;
        this.adminId = body.adminId;
        this.type = body.type as string;
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
        this.allocatedByAdminId = body.allocatedByAdminId as string;
    }

    static create(body: unknown) {
        return new GetCartAllocationDto(body as TGetCartAllocationDto);
    }
}
