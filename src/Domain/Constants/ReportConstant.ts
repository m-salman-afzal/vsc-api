export const REPORT_TYPES = {
    ISSUE: "ISSUE",
    SAFE: "SAFE",
    ALL: ""
} as const;

export const SAFE_SEVERITY_TYPES = {
    NEAR_MISS: "NEAR_MISS",
    REACHED_PATIENT: "REACHED_PATIENT"
} as const;

export const SAFE_NEAR_MISS_TYPES = {
    INCIDENTAL: "INCIDENTAL",
    ACTIVE_RECOVERY: "ACTIVE_RECOVERY"
} as const;

export const SAFE_REPORT_STATUS = {
    UNDER_INVESTIGATION: "UNDER_INVESTIGATION",
    PENDING: "PENDING",
    IN_REVIEW: "IN_REVIEW",
    CLOSED: "CLOSED",
    ALL: ""
} as const;

export const SAFE_REPORT_EVENT_LOCATION = {
    INTAKE: "INTAKE",
    MEDICAL_UNIT_INFIRMARY: "MEDICAL_UNIT_INFIRMARY",
    CLINIC: "CLINIC",
    HOUSING_UNIT: "HOUSING_UNIT",
    MEDICATION_CART: "MEDICATION_CART",
    OTHER: "OTHER"
};

export const SAFE_INVOLVED_PARTIES = {
    UNSAFE: "UNSAFE",
    NEAR_MISS_INCIDENT: "NEAR_MISS_INCIDENT",
    NEAR_MISS_ACTIVE: "NEAR_MISS_ACTIVE",
    NO_HARM: "NO_HARM",
    NO_HARM_MONITORING: "NO_HARM_MONITORING",
    HARM_TEMP: "HARM_TEMP",
    HARM_TEMP_HOSPITAL: "HARM_TEMP_HOSPITAL",
    HARM_PERM: "HARM_PERM",
    HARM_INTERVENTION: "HARM_INTERVENTION",
    DEATH: "DEATH"
};
