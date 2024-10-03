import {UserSettingValidationSchema} from "@validations/Schemas/UserSettingValidationSchema";

export class UserSettingValidation {
    static addUserSettingValidation(body: unknown) {
        const addUserSetting = UserSettingValidationSchema.required({
            adminId: true,
            setting: true
        });

        return addUserSetting.parse(body);
    }

    static getUserSettingValidation(body: unknown) {
        const getUserSetting = UserSettingValidationSchema.partial({
            adminId: true,
            userSettingId: true
        });

        return getUserSetting.parse(body);
    }

    static updateUserSettingValidation(body: unknown) {
        const updateUserSetting = UserSettingValidationSchema.required({
            userSettingId: true
        }).partial({
            defaultFacilityId: true
        });

        return updateUserSetting.parse(body);
    }

    static removeUserSettingValidation(body: unknown) {
        const removeUserSetting = UserSettingValidationSchema.required({
            userSettingId: true
        });

        return removeUserSetting.parse(body);
    }
}
