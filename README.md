# feelsbirthdayman

Translates a birthday message using Google Cloud's Translate API into a supported language and posts it to a slack channel.

Supports pinging specific users via command line arguments.

# Usage

## Setup

1.  Install required packages

        yarn install

1.  Add required variables to `.env.sample` file and drop the `.sample` extension.
1.  Add google cloud credentials file `googleApplicationCredentials.json` to project root

## Usage

    yarn send @ruben @samrum
