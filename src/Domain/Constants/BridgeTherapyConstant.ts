export const BRIDGE_THERAPY_FILE_NAME_PREFIX = "2004787_AAH_AAHASCELLMBRU_FIRSTCLASS_";

export const BRIDGE_THERAPY_FILE_NAME_SUFFIX = "_";

export const BridgeTherapyFields = [
    "carrier",
    "account",
    "groupId",
    "memberId",
    "personCode",
    "relationshipCode",
    "lastName",
    "firstName",
    "middleInitial",
    "sex",
    "dob",
    "multipleBirthCode",
    "memberType",
    "languageCode",
    "durFlag",
    "durKey",
    "socialSecurityNumber",
    "address1",
    "address2",
    "address3",
    "city",
    "state",
    "zip",
    "zip2",
    "zip3",
    "country",
    "phone",
    "familyFlag",
    "familyType",
    "familyId",
    "originalFromDate",
    "benefitResetDate",
    "memberFromDate",
    "memberThruDate",
    "otherFields"
] as const;

export const CARRIER = "AAHASCELL";

export const ACCOUNT = "FIRSTCLASS";

export const MEMBER_ID = "01";

export const PERSON_CODE = "01";

export const RELATIONSHIP_CODE = "1";

export const LANGUAGE_CODE = "100";

export const DUR_FLAG = "Y";

export const SOCIAL_SECURITY_NUMBER = "999999999";

export const COUNTRY = "USA";

export const FAMILY_FLAG = "N";

export const FAMILY_TYPE = "2";

export const ASCELLA_PAD_SIZE: {[key in (typeof BridgeTherapyFields)[number]]: number} = {
    carrier: 9,
    account: 15,
    groupId: 15,
    memberId: 18,
    personCode: 3,
    relationshipCode: 1,
    lastName: 25,
    firstName: 15,
    middleInitial: 1,
    sex: 1,
    dob: 8,
    multipleBirthCode: 1,
    memberType: 1,
    languageCode: 3,
    durFlag: 1,
    durKey: 18,
    socialSecurityNumber: 9,
    address1: 40,
    address2: 40,
    address3: 40,
    city: 20,
    state: 2,
    zip: 5,
    zip2: 4,
    zip3: 2,
    country: 4,
    phone: 10,
    familyFlag: 1,
    familyType: 1,
    familyId: 18,
    originalFromDate: 7,
    benefitResetDate: 7,
    memberFromDate: 7,
    memberThruDate: 7,
    otherFields: 2040
};
