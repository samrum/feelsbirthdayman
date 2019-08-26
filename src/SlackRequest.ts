import fetch from "node-fetch";
import { SlackUser } from "./types";

const METHOD_GET = "get";
const METHOD_POST = "post";

class SlackRequestError extends Error {
  constructor(message?: string, public response?: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SlackRequest {
  constructor(private slackToken: string) {}

  private async makeSlackRequest(
    apiMethod: string,
    method: string = METHOD_GET,
    body: object = {},
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.slackToken}`,
      "Content-type": "application/json; charset=utf-8",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    };

    const response = await fetch(`https://slack.com/api/${apiMethod}`, {
      method,
      headers,
      ...(method === METHOD_POST ? { body: JSON.stringify(body) } : {}),
    });

    if (!(response && response.ok && typeof response.json === "function")) {
      throw new SlackRequestError(
        `Slack ${apiMethod} request failed`,
        response,
      );
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.ok) {
      throw new SlackRequestError(
        `Slack ${apiMethod} request failed`,
        jsonResponse,
      );
    }

    return jsonResponse;
  }

  async postMessage(channel: string, text: string): Promise<any> {
    return this.makeSlackRequest("chat.postMessage", METHOD_POST, {
      channel,
      text,
      as_user: true,
      link_names: true,
    });
  }

  async getSlackUsers(): Promise<SlackUser[]> {
    const { members = [] } = await this.makeSlackRequest("users.list");

    return members;
  }
}

export default SlackRequest;
export { SlackRequestError };
