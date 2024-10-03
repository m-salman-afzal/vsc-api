import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TForgotPasswordDTO = Pick<IAdminEntity, "email"> & {appVersion: string; appName: string};

interface ForgotPasswordDTO extends TForgotPasswordDTO {}

class ForgotPasswordDTO {
    constructor(body: TForgotPasswordDTO) {
        this.email = body.email;
        this.appVersion = body.appVersion;
        this.appName = body.appName;
    }

    static create(body: TForgotPasswordDTO) {
        return new ForgotPasswordDTO(body);
    }
}

export default ForgotPasswordDTO;
