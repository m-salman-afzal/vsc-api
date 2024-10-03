import {Column, Entity} from "typeorm";

import Base from "./Base";

@Entity("MedicationLists")
export class MedicationList extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    medicationListId!: string;

    @Column({
        nullable: false
    })
    filename!: string;
}
