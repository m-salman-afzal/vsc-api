import path from "path";

import {saml} from "@infraConfig/saml";

export const SAML_CONFIG = {
    CERT: path.resolve(__dirname, `../../Infrastructure/Services/ThirdPartyClient/Credentials/${saml.SAML_CERT}`),
    PROTOCOL: saml.SAML_PROTOCOL,
    ENTRY_POINT: saml.SAML_ENTRYPOINT,
    PATH: saml.SAML_PATH,
    ISSUER: saml.SAML_ISSUER
};
