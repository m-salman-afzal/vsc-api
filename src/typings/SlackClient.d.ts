import type {Block, ChatPostMessageResponse, KnownBlock} from "@slack/web-api";

type TTextMessageParams = {
    messageType: "text";
    textMessage: string;
    blocks?: never;
};

type TBlockMessageParams = {
    messageType: "block";
    textMessage: string;
    blocks: (Block | KnownBlock)[];
};

export type TSendMessageParams = TTextMessageParams | TBlockMessageParams;

export type TSendMessageResponse = Promise<ChatPostMessageResponse>;
