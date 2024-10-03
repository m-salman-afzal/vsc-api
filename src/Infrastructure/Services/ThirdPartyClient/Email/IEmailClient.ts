import type {TAttachment, TEmailResponse, TEmailType} from "@src/typings/EmailClient";

export interface IEmailClient {
    sendEmailWithoutAttachment(
        subject: string,
        content: string,
        toEmail: string | string[],
        emailType: TEmailType
    ): TEmailResponse;

    sendEmailWithAttachment(
        subject: string,
        content: string,
        toEmail: string,
        emailType: TEmailType,
        attachments: Array<TAttachment>
    ): TEmailResponse;
}
