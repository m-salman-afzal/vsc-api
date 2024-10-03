import type sendGridMail from "@sendgrid/mail";

export type TEmailType = "text/html" | "text/plain";

export type TAttachment = {
    content: string;
    filename: string;
    type: string;
    disposition: string;
};

export type TEmailDataRequired = sendGridMail.MailDataRequired;

export type TEmailResponse = Promise<[sendGridMail.ClientResponse, Record<string, never>]>;
