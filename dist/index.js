'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fetch = _interopDefault(require('node-fetch'));
var translate = require('@google-cloud/translate');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class FeelsBirthdayMan {
    constructor(slackRequest, translateRequest) {
        this.slackRequest = slackRequest;
        this.translateRequest = translateRequest;
    }
    static mentionMatchesUser(mention, user) {
        return [
            user.profile.display_name_normalized,
            user.profile.display_name,
            user.profile.real_name_normalized,
            user.profile.real_name,
        ].includes(mention);
    }
    postBirthdayMessage(channel, usersToMention = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentions = yield this.getMentions(usersToMention);
            const { language, message } = yield this.getBirthdayMessage(mentions);
            const postResponse = yield this.slackRequest.postMessage(channel, message);
            return {
                language,
                message,
                postResponse,
            };
        });
    }
    getMentions(usersToMention) {
        return __awaiter(this, void 0, void 0, function* () {
            const userList = yield this.slackRequest.getSlackUsers();
            const mentionBits = this.getMentionBits(usersToMention, userList);
            return mentionBits.length > 0 ? `${mentionBits.join(" ")} ` : "";
        });
    }
    getMentionBits(usersToMention, userList) {
        const mentionBits = [];
        usersToMention.forEach(user => {
            if (user.indexOf("@") === 0) {
                const mention = user.substring(1);
                const mentionedUser = userList.find(user => {
                    return FeelsBirthdayMan.mentionMatchesUser(mention, user);
                });
                mentionBits.push(mentionedUser ? `<@${mentionedUser.id}>` : user);
            }
            else {
                mentionBits.push(user);
            }
        });
        return mentionBits;
    }
    getBirthdayMessage(mentions = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const { language, translation, } = yield this.translateRequest.getRandomTranslation("Happy Birthday!");
            return {
                language,
                message: `${translation} ${mentions}:feelsbirthdayman: :balloon:`,
            };
        });
    }
}

const METHOD_GET = "get";
const METHOD_POST = "post";
class SlackRequestError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class SlackRequest {
    constructor(slackToken) {
        this.slackToken = slackToken;
    }
    makeSlackRequest(apiMethod, method = METHOD_GET, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${this.slackToken}`,
                "Content-type": "application/json; charset=utf-8",
                Accept: "application/json",
                "Accept-Charset": "utf-8",
            };
            const response = yield fetch(`https://slack.com/api/${apiMethod}`, Object.assign({ method,
                headers }, (method === METHOD_POST ? { body: JSON.stringify(body) } : {})));
            if (!(response && response.ok && typeof response.json === "function")) {
                throw new SlackRequestError(`Slack ${apiMethod} request failed`, response);
            }
            const jsonResponse = yield response.json();
            if (!jsonResponse.ok) {
                throw new SlackRequestError(`Slack ${apiMethod} request failed`, jsonResponse);
            }
            return jsonResponse;
        });
    }
    postMessage(channel, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeSlackRequest("chat.postMessage", METHOD_POST, {
                channel,
                text,
                as_user: true,
                link_names: true,
            });
        });
    }
    getSlackUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { members = [] } = yield this.makeSlackRequest("users.list");
            return members;
        });
    }
}

class TranslateRequest {
    constructor(projectId) {
        this.projectId = projectId;
    }
    getRandomTranslation(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const translate$1 = new translate.Translate({
                projectId: this.projectId,
            });
            let [languages] = yield translate$1.getLanguages();
            languages = languages.filter(language => language.code !== "en");
            const targetLanguage = languages[Math.floor(Math.random() * languages.length)];
            const [translation] = yield translate$1.translate(message, targetLanguage.code);
            return {
                translation,
                language: targetLanguage.name,
            };
        });
    }
}

require("dotenv").config();
const usersToMention = process.argv
    .slice(2)
    .join(" ")
    .split(",")
    .map(user => user.trim());
if (!(process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.SLACK_TOKEN &&
    process.env.SLACK_CHANNEL)) {
    throw new Error("Missing configuration in .env file");
}
new FeelsBirthdayMan(new SlackRequest(process.env.SLACK_TOKEN), new TranslateRequest(process.env.GOOGLE_CLOUD_PROJECT_ID))
    .postBirthdayMessage(process.env.SLACK_CHANNEL, usersToMention)
    .then(console.log)
    .catch(console.error);
