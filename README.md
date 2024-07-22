# Xbox Discord Presence

This project is a Discord Rich Presence client for Xbox. It uses the `xbdm.js` library to connect to an Xbox console and update the user's Discord presence based on the current game being played.

## Prerequisites

- Node.js
- An Xbox console with debugging enabled
- A Discord application for the Rich Presence feature

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/xbox-discord-presence.git
    cd xbox-discord-presence
    ```

2. Run `npm install` to install the required dependencies:

    ```bash
    npm install
    ```

## Setup Instructions

### Obtain Your Discord RPC Client ID

1. **Create a Discord Application**:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Log in with your Discord account if you aren’t already.
   - Click on the “New Application” button.
   - Enter a name for your application and click “Create” to create the application.

2. **Get the Client ID**:
   - On the application’s settings page, locate the “General Information” section.
   - Find the “Client ID” and click the “Copy” button to copy it to your clipboard.

### Configure Environment Variables

1. Edit the `.env`:

    ```env
    clientId=YOUR_DISCORD_CLIENT_ID
    IP=YOUR_XBOX_IP_ADDRESS
    showGamertag=true
    ```

   - Replace `YOUR_DISCORD_CLIENT_ID` with the Client ID you obtained from the Discord Developer Portal.
   - Replace `YOUR_XBOX_IP_ADDRESS` with your Xbox's IP address.
   - Set `showGamertag` to `true` if you want to display your gamertag in the Discord presence.

## Usage

1. Run the application:

    ```bash
    npm install
    node index.js
    ```

2. The script will connect to your Xbox and Discord client, then continuously check for changes in your current game. It will update your Discord presence with the game's name and optionally display your gamertag.

## Functions

- `startRPC()`: Connects to the Discord client and logs in with the provided client ID.
- `getTitleId()`: Retrieves the current Title ID from Xbox memory.
- `getProfileId()`: Retrieves the current Profile ID from Xbox memory.
- `getGamertag()`: Retrieves the current gamertag from Xbox memory.
- `updateGamePresence(titleId)`: Updates the Discord presence based on the current game title.
- `checkActivity()`: Periodically checks for changes in the Title ID and updates the Discord presence if necessary.
- `main()`: Connects to Xbox and Discord, then starts checking activity.

## Error Handling

- Ensure that your Xbox is connected and accessible.
- Verify that the `.env` file is correctly configured.
- Check the console for error messages if the application fails to run.

## Credits

- Professional C# Tool.
- Original Code: [Xbox360DiscordRichPresence](https://github.com/Deputies/Xbox360DiscordRichPresence)
