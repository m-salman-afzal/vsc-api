import {FACILITY_SUPPLY_DAYS} from "@constants/FacilityConstant";

import * as BridgeTherapyConstants from "@domain/Constants/BridgeTherapyConstant";

import {TIMEZONES} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import type {BridgeTherapyFields} from "@domain/Constants/BridgeTherapyConstant";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IPatientEntity} from "@entities/Patient/PatientEntity";

export type TBridgeTherapyFields = {
    [key in (typeof BridgeTherapyFields)[number]]: string;
};

export interface BridgeTherapyTransformer extends TBridgeTherapyFields {}

export class BridgeTherapyTransformer {
    constructor(patientEntity: IPatientEntity, facilityEntities: IFacilityEntity[]) {
        const currentDate = SharedUtils.getCurrentDate({timezone: TIMEZONES.AMERICA_NEWYORK});
        const [effectiveYear, effectiveMonth, effectiveDay] = currentDate.split("-");
        const [terminationYear, terminationMonth, terminationDay] = SharedUtils.addDays(currentDate, 3).split("-");

        const [birthYear, birthMonth, birthDay] = patientEntity.dob.split("-");
        const [lastName, firstMiddleName] = patientEntity.name.split(", ");
        const [firstName, middleName] = (firstMiddleName as string).split(" ");

        const patientFacility = facilityEntities.find((f) => f.facilityId === patientEntity.facilityId);

        this.carrier = BridgeTherapyConstants.CARRIER;
        this.account = BridgeTherapyConstants.ACCOUNT;
        this.groupId = `${patientFacility?.externalGroupId}${patientEntity.supplyDays === FACILITY_SUPPLY_DAYS.THIRTY_DAYS ? "R" : ""}`;
        this.memberId = `${patientEntity.jmsId}01`;
        this.personCode = BridgeTherapyConstants.PERSON_CODE;
        this.relationshipCode = BridgeTherapyConstants.RELATIONSHIP_CODE;
        this.lastName = lastName?.slice(0, BridgeTherapyConstants.ASCELLA_PAD_SIZE.lastName) as string;
        this.firstName = firstName?.slice(0, BridgeTherapyConstants.ASCELLA_PAD_SIZE.firstName) as string;
        this.middleInitial = middleName
            ? (middleName.charAt(0)?.slice(0, BridgeTherapyConstants.ASCELLA_PAD_SIZE.middleInitial) as string)
            : "";
        this.sex = patientEntity.gender;
        this.dob = `${birthYear}${birthMonth}${birthDay}`;
        this.multipleBirthCode = "";
        this.memberType = "";
        this.languageCode = BridgeTherapyConstants.LANGUAGE_CODE;
        this.durFlag = BridgeTherapyConstants.DUR_FLAG;
        this.durKey = "";
        this.socialSecurityNumber = BridgeTherapyConstants.SOCIAL_SECURITY_NUMBER;
        this.address1 = "";
        this.address2 = "";
        this.address3 = "";
        this.city = "";
        this.state = "";
        this.zip = "";
        this.zip2 = "";
        this.zip3 = "";
        this.country = BridgeTherapyConstants.COUNTRY;
        this.phone = "";
        this.familyFlag = BridgeTherapyConstants.FAMILY_FLAG;
        this.familyType = BridgeTherapyConstants.FAMILY_TYPE;
        this.familyId = patientEntity.jmsId;
        this.originalFromDate = "";
        this.benefitResetDate = "";
        this.memberFromDate = `1${effectiveYear?.slice(2)}${effectiveMonth}${effectiveDay}`;
        this.memberThruDate = `1${terminationYear?.slice(2)}${terminationMonth}${terminationDay}`;
        this.otherFields = "";
    }

    static create(patientEntity, facilityEntities: IFacilityEntity[]) {
        return patientEntity
            .map((patient) => {
                const bridgeTherapy = new BridgeTherapyTransformer(patient, facilityEntities);

                return Object.keys(bridgeTherapy)
                    .map((key) => {
                        return bridgeTherapy[key].padEnd(BridgeTherapyConstants.ASCELLA_PAD_SIZE[key], " ");
                    })
                    .join("");
            })
            .join("\n");
    }
}
