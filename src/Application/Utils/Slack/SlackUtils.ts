import {inject, injectable} from "tsyringe";

import * as SlackTemplates from "./SlackTemplates";

import type {ISlackClient} from "@infraServices/ThirdPartyClient/Slack/ISlackClient";

@injectable()
export class SlackUtils {
    constructor(@inject("ISlackClient") private slackClient: ISlackClient) {}

    async fileNotFound(service: string, process: string, filename: string | string[]) {
        const fileNotFoundBlock = SlackTemplates.fileNotFoundBlock(
            service,
            process,
            `${Array.isArray(filename) ? filename.join("\n- ") : filename}`
        );

        return await this.slackClient.sendMessage({
            messageType: "block",
            textMessage: `${this.fileNotFound.name}`,
            blocks: fileNotFoundBlock
        });
    }
}
