import {WebClient} from "@slack/web-api";
import {injectable} from "tsyringe";

import {slack} from "@infraConfig/index";

import type {ISlackClient} from "./ISlackClient";
import type {TSendMessageParams} from "@typings/SlackClient";

@injectable()
export class SlackClient implements ISlackClient {
    private slackWeb: WebClient;

    constructor() {
        this.slackWeb = new WebClient(slack.SLACK_TOKEN);
    }

    async sendMessage(params: TSendMessageParams) {
        return await this.slackWeb.chat.postMessage({
            channel: slack.SLACK_CHANNEL_NAME,
            text: params.textMessage ?? "",
            blocks: params.blocks ?? []
        });
    }
}
