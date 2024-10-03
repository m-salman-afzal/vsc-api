import type {Block, KnownBlock} from "@slack/web-api";

export const errorBlock = (errorMessage: {serviceName: string; methodName: string; error: string; payload: string}) => {
    return [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "Error"
            }
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Service:*\n${errorMessage.serviceName}`
                },
                {
                    type: "mrkdwn",
                    text: `*Method:*\n${errorMessage.methodName}`
                }
            ]
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Error:*\n ${errorMessage.error}`
                },
                {
                    type: "mrkdwn",
                    text: `*Payload:*\n ${errorMessage.payload}`
                }
            ]
        }
    ];
};

export const fileNotFoundBlock = (service: string, process: string, filenames: string): (Block | KnownBlock)[] => {
    return [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "Warning :warning:"
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "@channel"
            }
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Service:* ${service}\n*Process:* ${process}`
                }
            ]
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*File not found:*\n- ${filenames}`
            }
        }
    ];
};
