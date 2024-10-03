import {FCH} from "./FchConstant";

export const DATE_VALIDATION = new RegExp("^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$");

export const EMAIL_VALIDATION = new RegExp(`${FCH.ALLOWED_EMAIL_DOMAINS}*$`);

export const APP_VERSION_VALIDATION = /([0-9]+)\.([0-9]+)\.([0-9]+)$/gm;

export const IMAGE_VALIDATION = new RegExp("^data:image/(png|jpeg|heic);base64,([a-zA-Z0-9+/]+={0,2})$");

export const TIME_VALIDATION = new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$");

export const USER_DATE_VALIDATION = new RegExp("^(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])\\/(19|20)\\d{2}$");

export const MDY_DATE_VALIDATION = new RegExp(/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/((19|20)?\d{2})/);
