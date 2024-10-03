import fs from "fs";

import {Strategy as SamlStrategy} from "@node-saml/passport-saml";
import passport from "passport";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {RoleEntity} from "@entities/Role/RoleEntity";
import {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

import {LOGIN_TYPE} from "@constants/AuthConstant";
import {FILE_ENCODINGS} from "@constants/FileConstant";
import {SAML_CONFIG} from "@constants/SamlConstant";

import {SERVER_CONFIG} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import {adminRepository, logger} from "@infrastructure/DIContainer/Resolver";

import type {Profile, VerifiedCallback} from "@node-saml/passport-saml";

passport.serializeUser<Express.User>((expressUser, done) => {
    done(null, expressUser);
});

passport.deserializeUser<Express.User>((expressUser, done) => {
    done(null, expressUser);
});

const strategy = new SamlStrategy(
    {
        issuer: SAML_CONFIG.ISSUER,
        callbackUrl: `${SAML_CONFIG.ISSUER}/${SAML_CONFIG.PATH}`,
        entryPoint: SAML_CONFIG.ENTRY_POINT,
        idpCert: fs.readFileSync(SAML_CONFIG.CERT, FILE_ENCODINGS.UTF8),
        wantAuthnResponseSigned: false,
        wantAssertionsSigned: false
    },
    async (logInUser: Profile | null, done: VerifiedCallback) => {
        const searchFilters = {email: logInUser?.email as string};
        const admin = await adminRepository.fetchByQuery(searchFilters);
        if (!admin) {
            return done(null);
        }

        const adminEntity = AdminEntity.publicFields(admin);
        adminEntity.facility = admin.facilityAdmin
            .map((facilityAdmin) => FacilityEntity.create(facilityAdmin.facility))
            .sort((a, b) => a.facilityName.localeCompare(b.facilityName));
        adminEntity.userSetting = UserSettingEntity.create(admin.userSetting);
        adminEntity.role = admin.adminRole.map((adminRole) => RoleEntity.create(adminRole.role));
        const rbac = SharedUtils.setRoleServiceList(admin);

        if (adminEntity.loginType === LOGIN_TYPE.SAML || adminEntity.loginType === LOGIN_TYPE.HYBRID) {
            return done(null, {logInUser, adminEntity: adminEntity, appVersion: SERVER_CONFIG.APP_VERSION, rbac: rbac});
        }

        return done(null);
    },
    (logOutUser, done) => {
        logger.info(`${logOutUser}`, `${done}`);
    }
);

passport.use(strategy);
