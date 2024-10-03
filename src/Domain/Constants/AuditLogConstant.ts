export const LOG_ACTIONS = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    REMOVE: "REMOVE"
} as const;

export const LOG_ENTITIES = {
    ADMIN: "Admin",
    SERVICE_INTERRUPTION: "ServiceDisruption",
    SAFE_REPORT: "SafeReport",
    BRIDGE_THERAPY: "BridgeTherapyLog",
    INVENTORY: "Inventory",
    STOCK_REFILL: "StockRefill",
    FACILITY: "Facility",
    FORMULARY: "Formulary",
    CONTACT: "Contact",
    PROCESS: "Process",
    PROCESS_CONTACT: "ProcessContact",
    FACILITY_CONTACT: "FacilityContact",
    FILE: "File",
    LOT: "Lot",
    ROLE: "Role",
    ROLE_SERVICE_LIST: "RoleServiceList",
    INVENTORY_CONTROL: "InventoryControl",
    REFERENCE_GUIDE: "ReferenceGuide",
    REFERENCE_GUIDE_DRUG: "ReferenceGuideDrug"
} as const;
