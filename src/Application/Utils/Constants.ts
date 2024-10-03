import path from "path";

import {dev, google, sapphire, server} from "@infraConfig/index";

export const REQUEST_METHODS = {GET: "GET", POST: "POST", PUT: "PUT", DELETE: "DELETE"} as const;

export const BOOLEAN_VALUES = {TRUE: "true", FALSE: "false"} as const;

export const NUMBER_BOOLEAN_VALUES = {ONE: "1", ZERO: "0"} as const;

export const NODE_ENV = {PROD: "PROD", DEV: "DEV"} as const;

export const SERVER_CONFIG = {
    PORT: server.PORT,
    APP_NAME: server.APP_NAME,
    NODE_ENV: server.NODE_ENV,
    SECRET: server.SECRET,
    APP_URL: server.APP_URL,
    APP_VERSION: server.APP_VERSION,
    PORTAL_APP_URL: server.PORTAL_APP_URL,
    PORTAL_APP_VERSION: server.PORTAL_APP_VERSION,
    SOCKET_PATH: server.SOCKET_PATH
};

export const RESPONSE_MESSAGES = {
    ERROR: "Bad request",
    NOT_AUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden access",
    NOT_FOUND: "No data found",
    PASSWORD_EXPIRED: "Password expired",
    CONFLICT: "Already exists",
    INTERNAL_SERVER_ERROR: "Internal server error",
    NOT_ALLOWED: "Not Allowed"
};

export const DATE_TIME_FORMAT = {
    YMD_HM_FORMAT: "yyyy-MM-dd H:mm",
    YMD_FORMAT: "yyyy-MM-dd",
    HMS_FORMAT: "HH:mm:ss",
    YMD_HMS_FORMAT: "yyyy-MM-dd HH:mm:ss",
    MDY_FORMAT: "MM/dd/yyyy",
    AMPM_FORMAT: "t",
    MDY_AMPM_FORMAT: "MM/dd/yyyy t",
    YMD_H_MED_PASS: "yyyyMMdd_HH",
    YMD_SAPPHIRE: "yyyyMMdd",
    HMS_SAPPHIRE: "HHmmss",
    YMDHMS_SAPPHIRE: "yyyyMMddHHmmss",
    YYYY_FORMAT: "yyyy",
    YM_SAPPHIRE: "yyyyMM",
    YMD_HMS_ASCELLA: "yyyyMMdd_HHmmss"
};

export const TIMEZONES = {
    AMERICA_NEWYORK: "America/New_York",
    UTC: "UTC"
};

export const APP_URLS = {
    APP_URL: server.APP_URL,
    PORTAL_APP_URL: server.PORTAL_APP_URL,
    RESET_PASSWORD_URL: `${server.APP_URL}/reset`,
    PORTAL_RESET_PASSWORD_URL: `${server.PORTAL_APP_URL}/resetPassword`,
    FORGOT_PASSWORD_URL: `${server.APP_URL}/forgot`,
    PORTAL_FORGOT_PASSWORD_URL: `${server.PORTAL_APP_URL}/forgot`
};

export const EMAIL_TYPES = {
    HTML: "text/html",
    TEXT: "text/plain"
} as const;

export const ASSETS_URL = {
    FCH_LOGO_HORIZONTAL: "https://storage.googleapis.com/vs-corrections-assets/assets/logos/fch-logo.png"
};

export const CREDENTIALS = {
    GCP_KEY: path.resolve(__dirname, `../../Infrastructure/Services/ThirdPartyClient/Credentials/${google.GCP_KEY}`),
    GCP_LOGGING_KEY: path.resolve(
        __dirname,
        `../../Infrastructure/Services/ThirdPartyClient/Credentials/${google.GCP_LOGGING_KEY}`
    )
};

export const SAPPHIRE_CONFIG = {
    SAPPHIRE_REMOVE_FILE_DAYS: Number(sapphire.SAPPHIRE_REMOVE_FILE_DAYS)
};

export const CSV_HEADERS = {
    BULK_ADD_ADMINS: [
        {header: "firstName", key: "firstName"},
        {header: "lastName", key: "lastName"},
        {header: "email", key: "email"},
        {header: "adminType", key: "adminType"}
    ],
    BULK_REMOVE_ADMINS: [
        {header: "adminId", key: "adminId"},
        {header: "firstName", key: "firstName"},
        {header: "lastName", key: "lastName"},
        {header: "email", key: "email"},
        {header: "adminType", key: "adminType"}
    ],
    BULK_UPLOAD_SERVICE_DISRUPTION: [
        {header: "date", key: "date"},
        {header: "time", key: "time"},
        {header: "patientName", key: "patientName"},
        {header: "patientNumber", key: "patientNumber"},
        {header: "service", key: "service"},
        {header: "reason", key: "reason"},
        {header: "comments", key: "comments"},
        {header: "delayPeriod", key: "delayPeriod"}
    ],
    BULK_ADD_INVENTORY: [
        {header: "ndc", key: "ndc"},
        {header: "manufacturer", key: "manufacturer"},
        {header: "lotNo", key: "lotNo"},
        {header: "expirationDate", key: "expirationDate"},
        {header: "quantity", key: "quantity"},
        {header: "id", key: "id"}
    ],
    BULK_ADD_FORMULARY: [
        {header: "drugName", key: "drugName"},
        {header: "genericName", key: "genericName"},
        {header: "strengthUnit", key: "strengthUnit"},
        {header: "formulation", key: "formulation"},
        {header: "brandName", key: "brandName"},
        {header: "release", key: "release"},
        {header: "package", key: "package"},
        {header: "isGeneric", key: "isGeneric"},
        {header: "drugClass", key: "drugClass"},
        {header: "isActive", key: "isActive"},
        {header: "isStock", key: "isStock"},
        {header: "minLevel", key: "minLevel"},
        {header: "adminId", key: "adminId"}
    ]
};

export const ORDER_BY = {
    ASC: "ASC",
    DESC: "DESC"
} as const;

export const DEV_CONFIG = {
    DEV_SERVER_KEY_PATH: dev.DEV_SERVER_KEY_PATH,
    DEV_SERVER_CERT_PATH: dev.DEV_SERVER_CERT_PATH
};

export const DIVISION_TYPES = {
    JAIL_DIVISION: "JAIL_DIVISION",
    SUPPORT_DIVISION: "SUPPORT_DIVISION",
    FIELD_DIVISION: "FIELD_DIVISION",
    COURT_DIVISION: "COURT_DIVISION",
    ADMINISTRATIVE_DIVISION: "ADMINISTRATIVE_DIVISION"
};

export const SWORN_PERSONNEL_DIVISION_TYPES = {
    SWORN_PERSONNEL_DIVISION: "SWORN_PERSONNEL_DIVISION"
};

export const SHERIFF_OFFICE_ACCESS_ROLES = [
    "SHERIFF_OFFICE_READER",
    "SHERIFF_OFFICE_WRITER",
    "SHERIFF_OFFICE_CONFIDENTIAL"
];

export const REPORT_NAMES = {
    SAFE_AWARENESS: "SAFE",
    ISSUE_AWARENESS: "ISSUE"
};

export const CONTACT_TYPES = {
    EXTERNAL: "EXTERNAL",
    INTERNAL: "INTERNAL",
    BOTH: "BOTH"
};

export const FOMMULARY_AUTH_ROUTES = {
    NON_CONTROLLED: "formularyNonControlled",
    CONTROLLED: "formularyControlled"
};

export const SOCKET_EVENTS = {
    NOTIFICATION_COUNT: "NOTIFICATION_COUNT",
    RECEIVE_NOTIFICATION: "RECEIVE_NOTIFICATION"
};
