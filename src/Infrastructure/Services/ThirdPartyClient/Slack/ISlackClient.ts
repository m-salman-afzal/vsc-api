import type {TSendMessageParams, TSendMessageResponse} from "@typings/SlackClient";

export interface ISlackClient {
    sendMessage(params: TSendMessageParams): TSendMessageResponse;
}
