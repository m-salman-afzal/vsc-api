import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {Admin} from "./Admin";
import Base from "./Base";
import {Facility} from "./Facility";
import {ReferenceGuide} from "./ReferenceGuide";

import type {TFileInfo} from "@typings/File";

@Entity("Files")
export class File extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    fileId!: string;

    @Column({
        nullable: false
    })
    fileName!: string;

    @Column({
        nullable: false
    })
    fileExtension!: string;

    @Column({
        nullable: false
    })
    repository!: string;

    @Column({
        nullable: false
    })
    process!: string;

    @Column({
        nullable: false
    })
    status!: string;

    @Column({
        nullable: false
    })
    isEf!: boolean;

    @Column({
        nullable: true,
        type: "json"
    })
    info!: TFileInfo;

    @Column({
        nullable: true
    })
    adminId!: string;

    @Column({
        nullable: true
    })
    facilityId!: string;

    @Column({
        nullable: true
    })
    referenceGuideId!: string;

    @ManyToOne(() => Admin, (admin) => admin.file, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "adminId",
        referencedColumnName: "adminId"
    })
    admin!: Admin;

    @ManyToOne(() => Facility, (facility) => facility.file, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "facilityId",
        referencedColumnName: "facilityId"
    })
    facility!: Facility;

    @ManyToOne(() => ReferenceGuide, (referenceGuide) => referenceGuide.file, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "referenceGuideId",
        referencedColumnName: "referenceGuideId"
    })
    referenceGuide!: ReferenceGuide;
}
