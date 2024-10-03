import sendGridMail from "@sendgrid/mail";
import {injectable} from "tsyringe";

import {sendGrid} from "@infraConfig/index";

import type {IEmailClient} from "./IEmailClient";
import type {TAttachment, TEmailDataRequired, TEmailResponse, TEmailType} from "@typings/EmailClient";

sendGridMail.setApiKey(sendGrid.SENDGRID_API_KEY);

@injectable()
export class EmailClient implements IEmailClient {
    private readonly fromEmail: string;
    private readonly fromName: string;

    constructor() {
        this.fromEmail = sendGrid.SENDGRID_FROM_EMAIL;
        this.fromName = sendGrid.SENDGRID_FROM_NAME;
    }

    async sendEmailWithoutAttachment(
        subject: string,
        content: string,
        toEmail: string | string[],
        emailType: TEmailType
    ): TEmailResponse {
        const msg = {
            ...this.commonFields(subject, content, toEmail, emailType)
        };

        return await sendGridMail.send(msg);
    }

    async sendEmailWithAttachment(
        subject: string,
        content: string,
        toEmail: string,
        emailType: TEmailType,
        attachments: Array<TAttachment>
    ): TEmailResponse {
        const msg = {
            ...this.commonFields(subject, content, toEmail, emailType),
            attachments: attachments.map((x) => {
                return {
                    content: x.content,
                    filename: x.filename,
                    type: x.type,
                    disposition: "attachment"
                };
            })
        };

        return await sendGridMail.send(msg);
    }

    private commonFields(
        subject: string,
        content: string,
        toEmail: string | string[],
        emailType: TEmailType
    ): TEmailDataRequired {
        return {
            to: toEmail,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            subject: subject,
            content: [
                {
                    type: emailType,
                    value: content
                }
            ]
        };
    }
}
