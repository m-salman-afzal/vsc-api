import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TResetPasswordDTO = Pick<IAdminEntity, "password"> & {confirmPassword: string; resetPasswordToken: string};

interface ResetPasswordDTO extends TResetPasswordDTO {}

class ResetPasswordDTO {
    constructor(body: TResetPasswordDTO) {
        this.password = body.password;
        this.confirmPassword = body.confirmPassword;
        this.resetPasswordToken = body.resetPasswordToken;
    }

    static create(body: TResetPasswordDTO) {
        return new ResetPasswordDTO(body);
    }
}

export default ResetPasswordDTO;
