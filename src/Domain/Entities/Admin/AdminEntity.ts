import {DEFAULT_ACCESS_ROLE} from "@constants/AuthConstant";

import type {AdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type {FacilityEntity} from "@entities/Facility/FacilityEntity";
import type {FacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";
import type {RoleEntity} from "@entities/Role/RoleEntity";
import type {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

export interface IAdminEntity {
    id?: number;
    adminId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    resetPasswordToken: string;
    passwordResetOn: string;
    loginTries: number;
    adminType: string;
    sessionId: string;
    loginType: string;
    facilityAdmin?: FacilityAdminEntity[];
    userSetting?: UserSettingEntity;
    facility?: FacilityEntity[];
    adminRole?: AdminRoleEntity[];
    role?: RoleEntity[];
}

export interface AdminEntity extends IAdminEntity {}

export class AdminEntity {
    constructor(adminEntity: IAdminEntity) {
        this.adminId = adminEntity.adminId;
        this.firstName = adminEntity.firstName ? adminEntity.firstName.trim() : adminEntity.firstName;
        this.lastName = adminEntity.lastName ? adminEntity.lastName.trim() : adminEntity.lastName;
        this.email = adminEntity.email ? adminEntity.email.trim() : adminEntity.email;
        this.password = adminEntity.password;
        this.resetPasswordToken = adminEntity.resetPasswordToken;
        this.passwordResetOn = adminEntity.passwordResetOn;
        this.loginTries = adminEntity.loginTries;
        this.adminType = adminEntity.adminType ? adminEntity.adminType.toUpperCase() : DEFAULT_ACCESS_ROLE;
        this.sessionId = adminEntity.sessionId;
        this.loginType = adminEntity.loginType;
    }

    static create(adminEntity) {
        return new AdminEntity(adminEntity);
    }

    static publicFields(admin): Partial<AdminEntity> {
        const entity: Partial<AdminEntity> = new AdminEntity(admin);
        delete entity.password;
        delete entity.passwordResetOn;
        delete entity.resetPasswordToken;
        delete entity.loginTries;
        delete entity.sessionId;

        entity.id = admin.idAdmin ?? admin.id;

        return entity;
    }
}
