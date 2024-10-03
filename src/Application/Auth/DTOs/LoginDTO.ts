import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TLoginDTO = Pick<IAdminEntity, "email" | "password"> & {appVersion: string; appName: string};

interface LoginDTO extends TLoginDTO {}

class LoginDTO {
    constructor(body: TLoginDTO) {
        this.email = body.email;
        this.password = body.password;
        this.appVersion = body.appVersion;
        this.appName = body.appName;
    }

    static create(body: TLoginDTO) {
        return new LoginDTO(body);
    }
}

export default LoginDTO;
