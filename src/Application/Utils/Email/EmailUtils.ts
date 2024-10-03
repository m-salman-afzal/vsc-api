import {inject, injectable} from "tsyringe";

import {SAFE_REPORT_NOTIFICATION_TYPES} from "@constants/SafeReportNotificationConstant";

import * as EmailTemplates from "@appUtils/Email/EmailTemplates";
import SharedUtils from "@appUtils/SharedUtils";

import {ErrorLog} from "@logger/ErrorLog";

import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {FacilityEntity} from "@entities/Facility/FacilityEntity";
import type {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {IEmailClient} from "@infraServices/ThirdPartyClient/Email/IEmailClient";

type TAlert = {date: string; time: string; count: number; duplicate: number};

@injectable()
export class EmailUtils {
    constructor(@inject("IEmailClient") private emailClient: IEmailClient) {}

    async adminRegistrationEmail(params: {admin: AdminEntity; resetPasswordLink: string; appName: string}) {
        try {
            const {email, firstName, resetPasswordToken} = params.admin;
            const {subject, body, emailType} = EmailTemplates.adminRegistrationTemplate(
                firstName,
                params.resetPasswordLink,
                resetPasswordToken,
                params.appName
            );

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, email, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async suspiciousActivityEmail(params: {admin: AdminEntity; resetPasswordLink: string; appName: string}) {
        try {
            const {email, resetPasswordToken, firstName} = params.admin;
            const {subject, body, emailType} = EmailTemplates.suspiciousActivityTemplate(
                params.resetPasswordLink,
                resetPasswordToken,
                firstName,
                params.appName
            );

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, email, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async forgotPasswordEmail(params: {admin: AdminEntity; resetPasswordLink: string; appName: string}) {
        try {
            const {email, resetPasswordToken, firstName} = params.admin;
            const {subject, body, emailType} = EmailTemplates.forgotPasswordTemplate(
                params.resetPasswordLink,
                resetPasswordToken,
                firstName,
                params.appName
            );

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, email, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async sendServiceDisruptionEmail(params: {
        alert: TAlert;
        serviceDisruptions: ServiceDisruptionEntity[];
        facilityName: string;
        firstName: string;
        toEmail: string;
    }) {
        try {
            const disruptions = params.serviceDisruptions.map((sd) => {
                const dateTime = SharedUtils.convertEasternDateTimeToUtc(sd.date, sd.time).split(" ");
                const {date, time} = SharedUtils.convertDateTimeToEastern(dateTime[0] as string, dateTime[1] as string);

                return {...sd, date: date, time: time};
            });
            const {subject, body, emailType} = EmailTemplates.sendServiceDisruptionTemplate(
                params.alert,
                disruptions,
                params.firstName,
                params.facilityName
            );

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, params.toEmail, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async safeReportEmailNotification(params: {
        facility: FacilityEntity;
        toEmail: string | string[];
        appUrl: string;
        admin?: AdminEntity | undefined;
        isOwner?: boolean | undefined;
        type?: string | undefined;
        reportType?: string | undefined;
    }) {
        const {facility, toEmail, appUrl, isOwner, type, reportType} = params;
        try {
            if (type === SAFE_REPORT_NOTIFICATION_TYPES.IN_REVIEW) {
                const {subject, body, emailType} = EmailTemplates.safeReportReviewNotification({
                    facilityName: facility.facilityName,
                    toEmail,
                    admin: params.admin,
                    appUrl,
                    isOwner
                });

                return await this.emailClient.sendEmailWithoutAttachment(subject, body, toEmail, emailType);
            }

            if (type === SAFE_REPORT_NOTIFICATION_TYPES.RETURNED_SENDER) {
                const {subject, body, emailType} = EmailTemplates.safeReportReturnedNotification({
                    facilityName: facility.facilityName,
                    toEmail,
                    admin: params.admin,
                    appUrl,
                    isOwner,
                    reportType
                });

                return await this.emailClient.sendEmailWithoutAttachment(subject, body, toEmail, emailType);
            }

            const {subject, body, emailType} = EmailTemplates.safeReportNotification({
                facilityName: facility.facilityName,
                toEmail,
                admin: params.admin,
                appUrl,
                isOwner,
                reportType
            });

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, toEmail, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async safeReportAwarenessEmailNotification(params: {
        facility: FacilityEntity;
        toEmail: string;
        firstName: string;
        appUrl: string;
    }) {
        const {facility, firstName, toEmail, appUrl} = params;
        try {
            const {subject, body, emailType} = EmailTemplates.safeReportAwarenessNotification({
                firstName,
                toEmail,
                facilityName: facility.facilityName,
                appUrl
            });

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, toEmail, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async issueReportAwarenessEmailNotification(params: {
        facility: FacilityEntity;
        toEmail: string | string[];
        appUrl: string;
    }) {
        const {facility, toEmail, appUrl} = params;
        try {
            const {subject, body, emailType} = EmailTemplates.issueReportAwarenessNotification({
                facilityName: facility.facilityName,
                toEmail,
                appUrl
            });

            return await this.emailClient.sendEmailWithoutAttachment(subject, body, toEmail, emailType);
        } catch (error) {
            return ErrorLog(error);
        }
    }
}
