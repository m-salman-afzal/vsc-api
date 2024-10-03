const adminFields = [
    "admin.id AS idAdmin",
    "admin.adminId AS adminId",
    "admin.adminType AS adminType",
    "admin.firstName AS firstName",
    "admin.lastName AS lastName",
    "admin.email AS email",
    "admin.password AS password",
    "admin.resetPasswordToken AS resetPasswordToken",
    "admin.passwordResetOn AS passwordResetOn",
    "admin.email AS email",
    "admin.loginType AS loginType",
    "admin.loginTries AS loginTries",
    "admin.sessionId as sessionId"
];

const serviceDisruptionFields = [
    "serviceDisruption.serviceDisruptionId AS serviceDisruptionId",
    "serviceDisruption.date AS date",
    "serviceDisruption.time AS time",
    "serviceDisruption.service AS service",
    "serviceDisruption.reason AS reason",
    "serviceDisruption.adminId AS adminId",
    "COUNT(serviceDisruptionPatient.serviceDisruptionId) AS serviceDisruptionPatients"
];

const serviceDisruptionPatientFields = [
    "serviceDisruptionPatient.serviceDisruptionPatientId AS serviceDisruptionPatientId",
    "serviceDisruptionPatient.patientName AS patientName",
    "serviceDisruptionPatient.patientNumber AS patientNumber",
    "serviceDisruptionPatient.comments AS comments",
    "serviceDisruptionPatient.delayPeriod AS delayPeriod",
    "serviceDisruptionPatient.time AS time",
    "serviceDisruption.serviceDisruptionId AS serviceDisruptionId",
    "serviceDisruption.date AS date",
    "serviceDisruption.service AS service",
    "serviceDisruption.reason AS reason"
];

const contactFields = ["contact.id AS idContact", "contact.contactId AS contactId"];

const facilityFields = [
    "facility.id AS idFacility",
    "facility.facilityId AS facilityId",
    "facility.facilityName AS facilityName",
    "facility.externalFacilityId AS externalFacilityId",
    "facility.externalGroupId AS externalGroupId",
    "facility.address AS address",
    "facility.population AS population",
    "facility.supplyDays AS supplyDays",
    "facility.launchDate AS launchDate"
];

const historyPhysicalFields = [
    "historyPhysical.id AS idHistoryPhysical",
    "historyPhysical.historyPhysicalId AS historyPhysicalId",
    "historyPhysical.age AS age",
    "historyPhysical.annualDate AS annualDate",
    "historyPhysical.initialDate AS initialDate",
    "historyPhysical.lastBooked AS lastBooked",
    "historyPhysical.isYearly AS isYearly"
];

const patientFields = [
    "patient.id AS idPatient",
    "patient.externalPatientId AS externalPatientId",
    "patient.jmsId AS jmsId",
    "patient.name AS name",
    "patient.location AS location",
    "patient.dob AS dob",
    "patient.gender AS gender",
    "patient.status AS status",
    "patient.lastBookedDate AS lastBookedDate",
    "patient.lastReleaseDate AS lastReleaseDate"
];

const userSettingFeilds = ["userSetting.userSettingId AS userSettingId", "userSetting.setting AS setting"];

const logFields = ["log.logId AS logId", "log.reqUrl AS reqUrl", "log.method AS method", "log.payload AS payload"];

const fileFields = [
    "file.fileId as fileId",
    "file.fileName as fileName",
    "file.fileExtension as fileExtension",
    "file.repository as repository",
    "file.process as process",
    "file.status as status",
    "file.isEf as isEf",
    "file.createdAt as fileCreatedAt",
    "file.referenceGuideId AS referenceGuideId"
];

const bridgeTherapyLogFields = [
    "bridgeTherapyLog.bridgeTherapyLogId AS bridgeTherapyLogId",
    "bridgeTherapyLog.filename AS filename",
    "bridgeTherapyLog.createdAt AS createdAt"
];

const formularyFields = [
    "formulary.id AS idFormulary",
    "formulary.formularyId AS formularyId",
    "formulary.drugName AS drugName",
    "formulary.brandName AS brandName",
    "formulary.genericName AS genericName",
    "formulary.drugClass AS drugClass",
    "formulary.strengthUnit AS strengthUnit",
    "formulary.package AS package",
    "formulary.unitsPkg AS unitsPkg",
    "formulary.release AS `release`",
    "formulary.formulation AS formulation",
    "formulary.isGeneric AS isGeneric",
    "formulary.isControlled AS isControlled",
    "formulary.isFormulary AS isFormulary",
    "formulary.isActive AS isActiveFormulary",
    "formulary.name AS name"
];

const inventoryFields = [
    "inventory.id AS idInventory",
    "inventory.inventoryId AS inventoryId",
    "inventory.ndc AS ndc",
    "inventory.manufacturer AS manufacturer",
    "inventory.isActive AS isActiveInventory",
    "inventory.lotNo AS lotNo",
    "inventory.expirationDate AS expirationDate",
    "inventory.quantity AS quantityInventory",
    "inventory.facilityId AS facilityId"
];

const controlledDrugFields = [
    "controlledDrug.id AS idControlledDrug",
    "controlledDrug.controlledDrugId AS controlledDrugId",
    "controlledDrug.controlledType AS controlledType",
    "controlledDrug.tr AS tr",
    "controlledDrug.rx AS rx",
    "controlledDrug.controlledId AS controlledId",
    "controlledDrug.controlledQuantity AS controlledQuantity",
    "controlledDrug.patientName AS patientName"
];

const cartRequestDrugFields = [
    "cartRequestDrug.cartRequestDrugId AS cartRequestDrugId",
    "cartRequestDrug.packageQuantity AS packageQuantity",
    "cartRequestDrug.pickStatus AS pickStatus",
    "cartRequestDrug.allocationStatus AS allocationStatus",
    "cartRequestDrug.pickedAt AS pickedAt",
    "cartRequestDrug.allocatedAt AS allocatedAt"
];

const cartRequestPickLogFields = [
    "cartRequestPickLog.cartRequestLogId AS cartRequestLogId",
    "cartRequestPickLog.type AS type"
];

const formularyLevelFields = [
    "formularyLevel.formularyLevelId AS formularyLevelId",
    "formularyLevel.min AS min",
    "formularyLevel.max AS max",
    "formularyLevel.parLevel AS parLevel",
    "formularyLevel.threshold AS threshold",
    "formularyLevel.isStock AS isStock"
];

const referenceGuideDrugFields = [
    "referenceGuideDrug.referenceGuideId AS referenceGuideId",
    "referenceGuideDrug.referenceGuideDrugId AS referenceGuideDrugId",
    "referenceGuideDrug.category AS category",
    "referenceGuideDrug.subCategory AS subCategory",
    "referenceGuideDrug.min AS min",
    "referenceGuideDrug.max AS max",
    "referenceGuideDrug.notes AS notes",
    "formulary.id AS fId",
    "formulary.formularyId AS formularyId",
    "formulary.name AS name"
];

const safeAssignmentCommentFields = [
    "safeAssignmentComment.id AS idSafeAssignmentComment",
    "safeAssignmentComment.safeAssignmentCommentId AS safeAssignmentCommentId",
    "safeAssignmentComment.comment AS comment"
];

const reportFields = ["report.id AS idReport", "report.reportId AS reportId", "report.type AS reportType"];

const safeReportFields = [
    "safeReport.id AS idSafeReport",
    "safeReport.safeReportId AS safeReportId",
    "safeReport.eventType AS eventType",
    "safeReport.detail AS detail",
    "safeReport.patientName AS patientName",
    "safeReport.date AS date",
    "safeReport.time AS time",
    "safeReport.severityType AS severityType",
    "safeReport.nearMissType AS nearMissType",
    "safeReport.isPatientHarmed AS isPatientHarmed",
    "safeReport.sbarrSituation AS sbarrSituation",
    "safeReport.sbarrBackground AS sbarrBackground",
    "safeReport.sbarrAction AS sbarrAction",
    "safeReport.sbarrRecommendation AS sbarrRecommendation",
    "safeReport.sbarrResult AS sbarrResult",
    "safeReport.interventionDescription AS interventionDescription",
    "safeReport.involvedParty AS involvedParty",
    "safeReport.findings AS findings",
    "safeReport.involvedPartyText AS involvedPartyText",
    "safeReport.isFinding AS isFinding"
];

const notificationFields = [
    "notification.id AS idNotification",
    "notification.createdAt AS createdAt",
    "notification.notificationId AS notificationId",
    "notification.repository AS repository",
    "notification.repositoryId AS repositoryId",
    "notification.type AS notificationType",
    "notification.facilityId AS facilityId"
];

const notificationAdminFields = [
    "notificationAdmin.id AS idNotificationAdmin",
    "notificationAdmin.notificationAdminId AS notificationAdminId",
    "notificationAdmin.adminId AS adminId",
    "notificationAdmin.notificationId AS notificationId",
    "notificationAdmin.isRead AS isRead",
    "notificationAdmin.isArchived AS isArchived"
];

const perpetualInventoryFields = [
    "perpetualInventory.perpetualInventoryId AS perpetualInventoryId",
    "perpetualInventory.rowNumber AS rowNumber",
    "perpetualInventory.name AS name",
    "perpetualInventory.controlledId AS controlledId",
    "perpetualInventory.tr AS tr",
    "perpetualInventory.rx AS rx",
    "perpetualInventory.patientName AS patientName",
    "perpetualInventory.providerName AS providerName",
    "perpetualInventory.createdAt AS createdAt",
    "perpetualInventory.quantityAllocated AS quantityAllocated",
    "perpetualInventory.staffName AS staffName",
    "perpetualInventory.isPatientSpecific AS isPatientSpecific"
];

const perpetualInventoryDeductionFields = [
    "pid.perpetualInventoryDeductionId AS perpetualInventoryDeductionId",
    "pid.date AS date",
    "pid.time AS time",
    "pid.providerName AS deductionProviderName",
    "pid.patientName AS deductionPatientName",
    "pid.adminName AS adminName",
    "pid.witnessName AS witnessName",
    "pid.type AS type",
    "pid.quantityDeducted AS quantityDeducted"
];

const shiftCountLogFields = ["shiftCountLogs.cartId AS cartId", "shiftCountLogs.shiftCountLogId AS shiftCountLogId"];

const cartFields = ["cart.cart AS cart"];

const perpetualInventoryDeductionAdminFields = ["admin.firstName AS adminFirstName", "admin.lastName AS adminLastName"];

export const FETCH_ALL_PERPETUAL_INVENTORY_DEDUCTIONS = [
    ...perpetualInventoryFields,
    ...perpetualInventoryDeductionFields,
    ...cartFields,
    ...perpetualInventoryDeductionAdminFields
];

export const FETCH_ALL_FORMULARY_INVENTORY_LEVEL = [
    ...formularyFields,
    ...inventoryFields,
    ...formularyLevelFields,
    ...controlledDrugFields
];

export const SEARCH_NOTIFICATION_FIELDS = [
    ...facilityFields,
    ...notificationAdminFields,
    ...notificationFields,
    ...formularyFields,
    ...reportFields,
    ...safeReportFields,
    ...safeAssignmentCommentFields,
    ...adminFields,
    ...controlledDrugFields,
    ...shiftCountLogFields,
    ...cartFields
];

export const SEARCH_ADMIN_REPOSITORY_FIELDS = [...adminFields, ...facilityFields, ...userSettingFeilds];

export const SEARCH_SAFE_REPORT_REPOSITORY_FIELDS = [...safeReportFields, ...adminFields, ...facilityFields];

export const SEARCH_LOG_REPOSITORY_FIELDS = [...logFields, ...adminFields];

export const SEARCH_SERVICE_DISRUPTION_REPOSITORY_FIELDS = [...serviceDisruptionFields];

export const SEARCH_SERVICE_DISRUPTION_PATIENT_REPOSITORY_FIELDS = [...serviceDisruptionPatientFields];

export const SEARCH_FACILITY_REPOSITORY_FIELDS = [...facilityFields];

export const SEARCH_CONTACT_REPOSITORY_FIELDS = [...contactFields];

export const SEARCH_HISTORY_PHYSICAL_REPOSITORY_FIELDS = [...historyPhysicalFields, ...patientFields];

export const SEARCH_FILE_REPOSITORY_FIELDS = [...fileFields, ...facilityFields, ...adminFields];

export const SEARCH_REFERENCE_GUIDE_DRUG_REPOSITORY_FIELDS = [...referenceGuideDrugFields];

export const SEARCH_BRIDGE_THERAPY_LOG_REPOSITORY_FIELDS = [
    ...bridgeTherapyLogFields,
    ...adminFields,
    ...facilityFields
];

const pickedByAdminFields = [
    "pickedByAdmin.adminId AS adminId",
    "pickedByAdmin.adminType AS adminType",
    "pickedByAdmin.firstName AS firstName",
    "pickedByAdmin.lastName AS lastName",
    "pickedByAdmin.email AS email"
];

export const SEARCH_CART_REQUEST_PICK_REPOSITORY_FIELDS = [
    ...formularyFields,
    ...inventoryFields,
    ...cartRequestDrugFields,
    ...cartRequestPickLogFields,
    ...pickedByAdminFields,
    ...controlledDrugFields
];

const cartRequestDrugsFields = [
    "cartRequestDrugs.totalPackageQuantities AS totalPackageQuantities",
    "cartRequestDrugs.allocationStatus AS allocationStatus",
    "cartRequestDrugs.allocatedAt AS allocatedAt",
    "cartRequestDrugs.pickedAt AS pickedAt",
    "cartRequestDrugs.adminId AS adminId",
    "cartRequestDrugs.adminType AS adminType",
    "cartRequestDrugs.firstName AS firstName",
    "cartRequestDrugs.lastName AS lastName",
    "cartRequestDrugs.email AS email"
];

export const FETCH_ALL_FORMULARY = [...formularyFields, ...cartRequestDrugsFields];

export const FETCH_ALL_PICKED_BY_ADMINS = [...pickedByAdminFields];
