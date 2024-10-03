export const ACCESS_ROLES = {SUPER_ADMIN: "SUPER_ADMIN", ADMIN: "ADMIN", USER: "USER", PHARMACY: "PHARMACY"} as const;
export const SHERIFF_OFFICE_ACCESS_ROLES = {
    SHERIFF_OFFICE_READER: "SHERIFF_OFFICE_READER",
    SHERIFF_OFFICE_WRITER: "SHERIFF_OFFICE_WRITER",
    SHERIFF_OFFICE_CONFIDENTIAL: "SHERIFF_OFFICE_CONFIDENTIAL"
} as const;

export const DEFAULT_ACCESS_ROLE = "USER";

export const COOKIE_CONFIG = {
    AUTH_COOKIE: "session",
    SESSION_COOKIE: "connect.sid"
};

export const LOGIN_TYPE = {
    PASSWORD: "PASSWORD",
    SAML: "SAML",
    HYBRID: "HYBRID"
};

export const APP_NAME = {
    FCH_APP: "FCH_APP",
    SHERIFF_PORTAL_APP: "SHERIFF_PORTAL_APP"
};

export const REQUEST_METHODS_PRIORITY = {
    POST: 1,
    PUT: 1,
    DELETE: 1,
    GET: 2
} as const;

export const PERMISSIONS = {
    WRITE: "WRITE",
    READ: "READ",
    HIDE: "HIDE"
} as const;

export const PERMISSION_PRIORITY = {
    WRITE: 1,
    READ: 2,
    HIDE: 3
} as const;

export const COMMON_ROUTES = ["userSettings/"];

export const FACILITY_FREE_ROUTES: string[] = [
    "admins",
    "facilities",
    "facilityUnits",
    "serviceList",
    "roleServiceList",
    "roles",
    "communication",
    "formulary",
    "userSettings",
    "files",
    "formularyNonControlled",
    "formularyControlled",
    "notificationsAndTasks",
    "serviceDependency"
];

export const SAFE_REPORT_AUTH_ROUTES = {
    REPORT: "reports",
    REPORT_HISTORY: "reportHistory",
    SAFE_REPORT_INVESTIGATIONS: "safeReportInvestigations",
    SAFE_REPORT_REVIEWS: "safeReportReviews"
};
