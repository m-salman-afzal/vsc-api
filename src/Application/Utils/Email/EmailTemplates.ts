import {APP_NAME} from "@constants/AuthConstant";

import {ASSETS_URL, EMAIL_TYPES} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import type {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {TEmailType} from "@src/typings/EmailClient";

type TAlert = {date: string; time: string; count: number; duplicate: number};

type TEmailTemplate = {
    subject: string;
    body: string;
    emailType: TEmailType;
};

const EMAIL_FOOTER = {
    FCH: `<br><br>Sincerely,<br>FirstClass Healthcare<br><p><img width=150 src=${ASSETS_URL.FCH_LOGO_HORIZONTAL}></p>`
};

export const adminRegistrationTemplate = (
    firstName: string,
    resetPasswordLink: string,
    resetPasswordToken: string,
    appName: string
): TEmailTemplate => {
    if (appName === APP_NAME.SHERIFF_PORTAL_APP) {
        return {
            subject: "You have been invited to use the FirstClass Healthcare Sheriff's Office Metrics Portal",
            body: `Hello ${firstName},<br><br>You have been invited to use the FirstClass Healthcare Sheriff's Office Metrics Portal. Please set your password by clicking <a clicktracking=off href="${resetPasswordLink}/${resetPasswordToken}?setPassword=true">here</a>.${EMAIL_FOOTER.FCH}`,
            emailType: EMAIL_TYPES.HTML
        };
    }

    return {
        subject: "FCH App - Set Password",
        body: `Hi ${firstName},<br><br>You've been invited to use the FCH App. Please click <a clicktracking=off href="${resetPasswordLink}/${resetPasswordToken}?setPassword=true">here</a> to set your password.${EMAIL_FOOTER.FCH}`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const suspiciousActivityTemplate = (
    resetPasswordLink: string,
    resetPasswordToken: string,
    firstName: string,
    appName: string
): TEmailTemplate => {
    if (appName === APP_NAME.SHERIFF_PORTAL_APP) {
        return {
            subject: "Password Deactivated - FirstClass Healthcare Sheriff's Office Metrics Portal",
            body: `Hello ${firstName},<br><br>Your password has been deactivated due to suspicious activity and multiple login attempts. In order to access the FirstClass Healthcare Sheriff's Office Metrics Portal, please reset your password by clicking <a clicktracking=off href="${resetPasswordLink}/${resetPasswordToken}">here</a>.${EMAIL_FOOTER.FCH}`,
            emailType: EMAIL_TYPES.HTML
        };
    }

    return {
        subject: "FCH App - Suspicious Activity Detected",
        body: `Hi ${firstName},<br><br>Your password has been deactivated due to suspicious activity and multiple login attempts. Please click <a clicktracking=off href="${resetPasswordLink}/${resetPasswordToken}">here</a> to reset your password.${EMAIL_FOOTER.FCH}`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const forgotPasswordTemplate = (
    resetPasswordLink: string,
    resetPasswordToken: string,
    firstName: string,
    appName: string
): TEmailTemplate => {
    if (appName === APP_NAME.SHERIFF_PORTAL_APP) {
        return {
            subject: "Reset Password - FirstClass Healthcare Sheriff's Office Metrics Portal",
            body: `Hello ${firstName},<br><br>We received your request to reset your password to access the FirstClass Healthcare Sheriff's Office Metrics Portal, please reset your password by clicking <a clicktracking="off" href="${resetPasswordLink}/${resetPasswordToken}">here</a>.${EMAIL_FOOTER.FCH}`,
            emailType: EMAIL_TYPES.HTML
        };
    }

    return {
        subject: "FCH App - Reset Password",
        body: `Hi ${firstName},<br><br>Please click <a clicktracking="off" href="${resetPasswordLink}/${resetPasswordToken}">here</a> to reset your password.${EMAIL_FOOTER.FCH}`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const safeReportTemplate = (
    report: string,
    reportType: string,
    isAnonymous: boolean,
    submissionDate: string,
    submissionTime: string,
    firstName: string,
    lastName: string,
    facility: string
): TEmailTemplate => {
    return {
        subject: `${reportType} Report - ${submissionDate} - ${
            isAnonymous ? "Anonymous" : `${firstName} ${lastName}`
        } - ${facility}`,
        body: `The following report was submitted at ${submissionTime}.<br><br>${report}${EMAIL_FOOTER.FCH}`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const sendServiceDisruptionTemplate = (
    alert: TAlert,
    serviceDisruptions: ServiceDisruptionEntity[],
    firstName: string,
    facility: string
): TEmailTemplate => {
    return {
        subject: `Service Disruption Report - ${alert.date} - ${facility}`,
        body: `Hi ${firstName},<br><br>A Service Disruption report was submitted at ${facility} on ${alert.date} at ${alert.time}.
        <br><br>${serviceDisruptionsList(serviceDisruptions)} ${EMAIL_FOOTER.FCH}`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const serviceDisruptionsList = (serviceDisruptions) => {
    const text = serviceDisruptions.map(
        (sd) =>
            `${sd.service}, ${sd.reason}, ${sd.individuals} individual${sd.individuals === 1 ? "" : "s"} affected (${
                sd.date
            } ${sd.time})`
    );

    return `Details of disrupted services: <br>${text.join("<br>")}`;
};

export const safeReportNotification = (safeReportNotification): TEmailTemplate => {
    const assignees =
        safeReportNotification.toEmail.length > 1
            ? "Team"
            : `${safeReportNotification.admin?.firstName} ${safeReportNotification.admin?.lastName}`;
    const context = safeReportNotification.isOwner ? "action" : "attention";

    return {
        subject: `${safeReportNotification.reportType === "ISSUE" ? "Issue" : "SAFE"} Report - ${SharedUtils.toCapitalize(context)} Required for ${safeReportNotification.facilityName}`,
        body: `Hi ${assignees}, <br/><br/> ${safeReportNotification.reportType === "ISSUE" ? "An Issue" : "A SAFE"} Report has been submitted at ${safeReportNotification.facilityName} that requires your ${context}. Please <a clicktracking=off href="${safeReportNotification.appUrl}">log in</a> to the FCH app and update the report accordingly.<br/><br>Thank you,<br>FirstClass Healthcare<br><p><img width=150 src=${ASSETS_URL.FCH_LOGO_HORIZONTAL}></p>`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const safeReportReturnedNotification = (safeReportNotification): TEmailTemplate => {
    const assignees =
        safeReportNotification.toEmail.length > 1
            ? "Team"
            : `${safeReportNotification.admin?.firstName} ${safeReportNotification.admin?.lastName}`;

    return {
        subject: `Your ${safeReportNotification.reportType === "ISSUE" ? "Issue" : "SAFE"} Report - Additional Information Required (${safeReportNotification.facilityName})`,
        body: `Hi ${assignees}, <br/><br/> The ${safeReportNotification.reportType === "ISSUE" ? "Issue" : "SAFE"} report that you submitted requires additional information. Please <a clicktracking=off href="${safeReportNotification.appUrl}">log in</a> to the FCH app and update the report accordingly.<br/><br>Thank you,<br>FirstClass Healthcare<br><p><img width=150 src=${ASSETS_URL.FCH_LOGO_HORIZONTAL}></p>`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const safeReportReviewNotification = (safeReportNotification): TEmailTemplate => {
    const assignees =
        safeReportNotification.toEmail.length > 1
            ? "Team"
            : `${safeReportNotification.admin?.firstName} ${safeReportNotification.admin?.lastName}`;

    return {
        subject: `SAFE Report Investigation Review - ${safeReportNotification.facilityName}`,
        body: `Hi ${assignees}, <br/><br/> A SAFE Report investigation has been submitted for review at ${safeReportNotification.facilityName}. Please <a clicktracking=off href="${safeReportNotification.appUrl}">log in</a> to the FCH app to review and close the report.<br/><br>Thank you,<br>FirstClass Healthcare<br><p><img width=150 src=${ASSETS_URL.FCH_LOGO_HORIZONTAL}></p>`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const safeReportAwarenessNotification = (safeReportNotification): TEmailTemplate => {
    return {
        subject: `SAFE Report - Awareness: ${safeReportNotification.facilityName}`,
        body: `Hi ${safeReportNotification.firstName}, <br/><br/> A SAFE Report has been submitted at ${safeReportNotification.facilityName}, Please <a clicktracking=off href="${safeReportNotification.appUrl}">log in</a> to the FCH app for further detail.<br/><br/>Thank you,<br>FirstClass Healthcare<br><p><img width=150 src=${ASSETS_URL.FCH_LOGO_HORIZONTAL}></p>`,
        emailType: EMAIL_TYPES.HTML
    };
};

export const issueReportAwarenessNotification = (issueReportNotification): TEmailTemplate => {
    return {
        subject: `Issue Report Submitted at ${issueReportNotification.facilityName} - Awareness`,
        body: `Hi Team, <br/><br/> An Issue report was submitted at ${issueReportNotification.facilityName}. Please <a clicktracking=off href="${issueReportNotification.appUrl}">log in</a> to the FCH app for more detail.<br/><br/>Thank you,<br>FirstClass Healthcare<br><p><img width=150 src=${ASSETS_URL.FCH_LOGO_HORIZONTAL}></p>`,
        emailType: EMAIL_TYPES.HTML
    };
};
