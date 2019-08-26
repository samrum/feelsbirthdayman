# feelsbirthdayman

Use the [Google Cloud Translation API](https://cloud.google.com/translate/docs/) to translate "Happy Birthday!" into a random language and then use the [Slack API](https://api.slack.com/) to post it into a Slack channel along with some emoji.

Supports mentioning users via command arguments (comma delimited).

![Slack output](https://i.imgur.com/JwavnB5.png)

# Usage

## Setup

1.  Install required packages

        yarn install

1.  Add required variables to `.env.sample` file and drop the `.sample` extension.
1.  Add google cloud credentials file `googleApplicationCredentials.json` to project root

## Run

    yarn send @Ruben Medina,@samrum
