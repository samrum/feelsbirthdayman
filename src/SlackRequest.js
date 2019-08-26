const fetch = require("node-fetch");

const METHOD_GET = "get";
const METHOD_POST = "post";

class SlackRequest {
  constructor(slackToken) {
    this.slackToken = slackToken;
  }

  async makeSlackRequest(apiMethod, method = METHOD_GET, body = {}) {
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
      const error = new Error(`Slack ${apiMethod} request failed`);
      error.response = response;

      throw error;
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.ok) {
      const error = new Error(`Slack ${apiMethod} request failed`);
      error.response = jsonResponse;

      throw error;
    }

    return jsonResponse;
  }

  async postMessage(channel, text) {
    return this.makeSlackRequest("chat.postMessage", METHOD_POST, {
      channel,
      text,
      as_user: true,
      link_names: true,
    });
  }

  async getSlackUsers() {
    const { members = [] } = await this.makeSlackRequest("users.list");

    return members;
  }
}

module.exports = SlackRequest;
