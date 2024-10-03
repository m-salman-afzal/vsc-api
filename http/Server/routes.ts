import {bootstrap as app} from "@server/bootstrap";

import * as Routes from "@routes/index";

const apiVersion = "api/v1";

app.use(`/${apiVersion}/saml`, Routes.SamlRouter);
app.use(`/${apiVersion}/apiHealthCheck`, Routes.ApiHealthCheckRouter);

app.use(`/${apiVersion}/auth`, Routes.AuthRouter);
app.use(`/${apiVersion}/userAuth`, Routes.AuthUserRouter);

app.use(`/${apiVersion}/admins`, Routes.AdminRouter);
app.use(`/${apiVersion}/users`, Routes.AdminUserRouter);
app.use(`/${apiVersion}/facilities`, Routes.FacilityRouter);
app.use(`/${apiVersion}/userSettings`, Routes.UserSettingRouter);
app.use(`/${apiVersion}/formulary`, Routes.FormularyRouter);
app.use(`/${apiVersion}/formularyControlled`, Routes.FormularyRouter);
app.use(`/${apiVersion}/formularyNonControlled`, Routes.FormularyRouter);

app.use(`/${apiVersion}/logs`, Routes.LogRouter);
app.use(`/${apiVersion}/files`, Routes.FileRouter);
app.use(`/${apiVersion}/inventory`, Routes.InventoryRouter);
app.use(`/${apiVersion}/serviceDisruptions`, Routes.ServiceDisruptionRouter);
app.use(`/${apiVersion}/historyPhysical`, Routes.HistoryPhysicalRouter);
app.use(`/${apiVersion}/divisions`, Routes.DivisionRouter);
app.use(`/${apiVersion}/divisionSworn`, Routes.DivisionSwornRouter);
app.use(`/${apiVersion}/patients`, Routes.PatientRouter);
app.use(`/${apiVersion}/medicationLists`, Routes.MedicationListRouter);
app.use(`/${apiVersion}/bridgeTherapy`, Routes.BridgeTherapyRouter);
app.use(`/${apiVersion}/auditLog`, Routes.AuditLogRouter);
app.use(`/${apiVersion}/refillStock`, Routes.RefillStockRouter);

app.use(`/${apiVersion}/reports`, Routes.ReportRouter);
app.use(`/${apiVersion}/reportHistory`, Routes.ReportRouter);
app.use(`/${apiVersion}/safeReportInvestigations`, Routes.SafeReportRouter);
app.use(`/${apiVersion}/safeReportReviews`, Routes.SafeReportRouter);
app.use(`/${apiVersion}/notificationsAndTasks`, Routes.NotificationsAndTasksRouter);
app.use(`/${apiVersion}/facilityChecklist`, Routes.FacilityChecklistRouter);

app.use(`/${apiVersion}/roles`, Routes.RoleRouter);
app.use(`/${apiVersion}/serviceList`, Routes.ServiceListRouter);
app.use(`/${apiVersion}/roleServiceList`, Routes.RoleServiceListRouter);

app.use(`/${apiVersion}/communication`, Routes.CommunicationRouter);

app.use(`/${apiVersion}/facilityUnits`, Routes.FacilityUnitsRouter);
app.use(`/${apiVersion}/carts`, Routes.CartRouter);
app.use(`/${apiVersion}/referenceGuide`, Routes.ReferenceGuideRouter);
app.use(`/${apiVersion}/cartRequestForms`, Routes.CartRequestFormRouter);
app.use(`/${apiVersion}/cartRequestDrugs`, Routes.CartRequestDrugRouter);
app.use(`/${apiVersion}/perpetualInventory`, Routes.PerpetualInventoryRouter);
app.use(`/${apiVersion}/inventoryHistory`, Routes.InventoryHistoryRouter);
app.use(`/${apiVersion}/serviceDependency`, Routes.ServiceDependencyRoutes);
app.use(`/${apiVersion}/controlLogBookAdminister`, Routes.ControlLogBookAdministerRoutes);
