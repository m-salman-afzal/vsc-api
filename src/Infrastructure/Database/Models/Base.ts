import {CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

class Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({
        nullable: false
    })
    createdAt!: Date;

    @UpdateDateColumn({
        nullable: false
    })
    updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true
    })
    deletedAt!: Date;
}

export default Base;
