import {Column, Entity, OneToMany} from "typeorm";

import {AuditLog} from "./AuditLog";
import Base from "./Base";
import {BridgeTherapyLog} from "./BridgeTherapyLog";
import {Cart} from "./Cart";
import {CartInventoryLogs} from "./CartInventoryLogs";
import {CartRequestDeduction} from "./CartRequestDeduction";
import {CartRequestDrug} from "./CartRequestDrug";
import {CartRequestForm} from "./CartRequestForm";
import {CartRequestLog} from "./CartRequestLog";
import {CentralSupplyLog} from "./CentralSupplyLog";
import {DiscrepancyLog} from "./DiscrepancyLog";
import {Division} from "./Division";
import {DivisionSworn} from "./DivisionSworn";
import {FacilityAdmin} from "./FacilityAdmin";
import {FacilityChecklist} from "./FacilityChecklist";
import {FacilityContact} from "./FacilityContact";
import {FacilityUnit} from "./FacilityUnit";
import {File} from "./File";
import {FormularyLevel} from "./FormularyLevel";
import {HistoryPhysical} from "./HistoryPhysical";
import {Inventory} from "./Inventory";
import {InventoryControl} from "./InventoryControl";
import {InventoryHistory} from "./InventoryHistory";
import {Patient} from "./Patient";
import {PerpetualInventory} from "./PerpetualInventory";
import {ReferenceGuide} from "./ReferenceGuide";
import {Report} from "./Report";
import {SafeReportNotification} from "./SafeReportNotification";
import {ServiceDisruption} from "./ServiceDisruption";
import {ShiftCountLogs} from "./ShiftCountLogs";

@Entity("Facilities")
export class Facility extends Base {
    @Column({
        nullable: false,
        unique: true
    })
    facilityId!: string;

    @Column({
        nullable: false
    })
    facilityName!: string;

    @Column({
        nullable: true,
        unique: true
    })
    externalFacilityId!: string;

    @Column({
        nullable: true,
        unique: true
    })
    externalGroupId!: string;

    @Column({
        nullable: false
    })
    address!: string;

    @Column({
        nullable: true
    })
    population!: number;

    @Column({
        nullable: true
    })
    supplyDays!: number;

    @Column({
        nullable: true,
        type: "datetime"
    })
    launchDate!: string;

    @OneToMany(() => FacilityAdmin, (facilityAdmin) => facilityAdmin.facility, {
        cascade: true
    })
    facilityAdmin!: FacilityAdmin[];

    @OneToMany(() => FacilityContact, (facilityContact) => facilityContact.facility, {
        cascade: true
    })
    facilityContact!: FacilityContact[];

    @OneToMany(() => Report, (report) => report.facility, {
        cascade: true
    })
    report!: Report[];

    @OneToMany(() => SafeReportNotification, (safeReportNotification) => safeReportNotification.facility, {
        cascade: true
    })
    safeReportNotification!: SafeReportNotification[];

    @OneToMany(() => ServiceDisruption, (serviceDisruption) => serviceDisruption.facility, {
        cascade: true
    })
    serviceDisruption!: ServiceDisruption[];

    @OneToMany(() => Inventory, (inventory) => inventory.facility, {
        cascade: true
    })
    inventory!: Inventory[];

    @OneToMany(() => HistoryPhysical, (historyPhysical) => historyPhysical.facility, {
        cascade: true
    })
    historyPhysical!: HistoryPhysical[];

    @OneToMany(() => Division, (division) => division.facility, {
        cascade: true
    })
    division!: Division[];

    @OneToMany(() => DivisionSworn, (divisionSworn) => divisionSworn.facility, {
        cascade: true
    })
    divisionSworn!: DivisionSworn[];

    @OneToMany(() => Patient, (patient) => patient.facility, {
        cascade: true
    })
    patient!: Patient[];

    @OneToMany(() => File, (file) => file.facility, {
        cascade: true
    })
    file!: File[];

    @OneToMany(() => FacilityUnit, (facilityUnit) => facilityUnit.facility, {
        cascade: true
    })
    facilityUnit!: FacilityUnit[];

    @OneToMany(() => Cart, (cart) => cart.facility, {
        cascade: true
    })
    cart!: Cart[];

    @OneToMany(() => BridgeTherapyLog, (bridgeTherapyLog) => bridgeTherapyLog.facility, {
        cascade: true
    })
    bridgeTherapyLog!: BridgeTherapyLog[];

    @OneToMany(() => AuditLog, (auditLog) => auditLog.facility, {
        cascade: true
    })
    auditLog!: AuditLog[];

    @OneToMany(() => InventoryControl, (inventoryControl) => inventoryControl.facility, {
        cascade: true
    })
    inventoryControl!: InventoryControl[];

    @OneToMany(() => FormularyLevel, (formularyLevel) => formularyLevel.facility, {
        cascade: true
    })
    formularyLevel!: FormularyLevel[];

    @OneToMany(() => FacilityChecklist, (facilityChecklist) => facilityChecklist.facility, {
        cascade: true
    })
    facilityChecklist!: FacilityChecklist[];

    @OneToMany(() => ReferenceGuide, (referenceGuide) => referenceGuide.facility, {
        cascade: true
    })
    referenceGuide!: ReferenceGuide[];

    @OneToMany(() => CartRequestForm, (cartRequestForm) => cartRequestForm.facility, {
        cascade: true
    })
    cartRequestForm!: CartRequestForm[];

    @OneToMany(() => CartRequestLog, (cartRequestLog) => cartRequestLog.facility, {
        cascade: true
    })
    cartRequestLog!: CartRequestLog[];

    @OneToMany(() => CartRequestDrug, (cartRequestDrug) => cartRequestDrug.facility, {
        cascade: true
    })
    cartRequestDrug!: CartRequestDrug[];

    @OneToMany(() => CartRequestDeduction, (cartRequestDeduction) => cartRequestDeduction.facility, {
        cascade: true
    })
    cartRequestDeduction!: CartRequestDeduction[];

    @OneToMany(() => CentralSupplyLog, (centralSupplyLog) => centralSupplyLog.facility, {
        cascade: true
    })
    centralSupplyLog!: CentralSupplyLog[];

    @OneToMany(() => PerpetualInventory, (pi) => pi.facility, {
        cascade: true
    })
    perpetualInventory!: PerpetualInventory[];

    @OneToMany(() => InventoryHistory, (inventoryHistory) => inventoryHistory.facility, {
        cascade: true
    })
    inventoryHistory!: InventoryHistory[];

    @OneToMany(() => CartInventoryLogs, (cartInventoryLogs) => cartInventoryLogs.facility, {
        cascade: true
    })
    cartInventoryLogs!: CartInventoryLogs[];
    @OneToMany(() => DiscrepancyLog, (discrepancyLog) => discrepancyLog.facility, {
        cascade: true
    })
    discrepancyLog!: DiscrepancyLog[];

    @OneToMany(() => ShiftCountLogs, (scl) => scl.facility, {
        cascade: true
    })
    shiftCountLog!: ShiftCountLogs[];
}
