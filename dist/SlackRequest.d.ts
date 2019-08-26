import { SlackUser } from "./types";
declare class SlackRequestError extends Error {
    response?: any;
    constructor(message?: string, response?: any);
}
declare class SlackRequest {
    private slackToken;
    constructor(slackToken: string);
    private makeSlackRequest;
    postMessage(channel: string, text: string): Promise<any>;
    getSlackUsers(): Promise<SlackUser[]>;
}
export default SlackRequest;
export { SlackRequestError };
