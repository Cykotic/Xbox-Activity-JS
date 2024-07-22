const CF = require("xbdm.js");
const fs = require('fs').promises;
const path = require('path');
const {
    Client
} = require('discord-rpc');
require('dotenv').config();

const titleIdsFile = 'TitleIDs.txt';
let currentTitleId = null;

const rpc = new Client({
    transport: "ipc"
});

rpc.setMaxListeners(300);

async function startRPC() {
    try {
        rpc.removeAllListeners();

        rpc.on('ready', () => {
            console.log("Connected to Discord client");
        });

        await rpc.login({
            clientId: process.env.clientId
        });
    } catch (err) {
        console.error('Failed to connect to Discord RPC:', err.message);
        process.exit(1);
    }
}
async function getTitleId() {
    try {
        const memory = await CF.getMemory(0xC0292070, 4); // Memory address for Title ID
        return memory.toString('hex').toUpperCase();
    } catch (err) {
        throw new Error('Failed to get Title ID: ' + err.message);
    }
}

async function getProfileId() {
    try {
        const memory = await CF.getMemory(0xC0291FF0, 7); // Memory address for Profile ID
        return memory.toString('hex').toUpperCase();
    } catch (err) {
        throw new Error('Failed to get Profile ID: ' + err.message);
    }
}

async function getGamertag() {
    try {
        const hexString = await CF.getMemory(0x81AA28FC, 16 * 2); // Memory address for Gamertag

        // Convert hexadecimal string to Buffer
        const buffer = Buffer.from(hexString, 'hex');

        // Convert Buffer to UTF-16 Big Endian string
        let gamertag = '';
        for (let i = 0; i < buffer.length; i += 2) {
            const charCode = buffer.readUInt16BE(i);
            if (charCode >= 32 && charCode <= 126) {
                gamertag += String.fromCharCode(charCode);
            }
        }

        return gamertag.trim();
    } catch (err) {
        throw new Error('Failed to get Gamertag: ' + err.message);
    }
}

//update Discord presence based on the current game being played
async function updateGamePresence(titleId) {
    try {
        const titleData = await fs.readFile(path.join(__dirname, titleIdsFile), 'utf-8');
        const lines = titleData.split('\n');
        const matchedLine = lines.find(line => line.split(',')[0].trim() === titleId.trim());

        if (matchedLine) {
            const [, GameName] = matchedLine.split(',');

            const presenceDetails = {
                state: `Playing ${GameName.trim()}`,
                largeImageKey: "main_menu",
                largeImageText: "Made By Aelithria",
                startTimestamp: new Date(),
                buttons: [{
                    label: "Stealth Server",
                    url: "https://discord.gg/xbninja"
                }]
            };

            if (process.env.showGamertag === 'true') {
                const gamertag = await getGamertag();
                if (gamertag) {
                    presenceDetails.details = `Gamertag: ${gamertag}`;
                }
            }

            rpc.setActivity(presenceDetails);
            console.log(`Updated activity: ${GameName.trim()}`);
        } else {
            console.error(`No matching game found for Title ID: ${titleId}`);
        }
    } catch (err) {
        console.error('Failed to update game presence:', err.message);
    }
}

async function checkActivity() {
    while (true) {
        try {
            const titleId = await getTitleId();
            const profileId = await getProfileId();

            // If either Title ID or Profile ID is not available, log an error messag
            if (!titleId || !profileId) {
                console.error('Unable to retrieve Title ID or Profile ID');
            } else if (titleId !== currentTitleId) {
                currentTitleId = titleId; // If the Title ID has changed, update the current Title ID
                await updateGamePresence(titleId);
            }
        } catch (err) {
            console.error('Error in activity check:', err.message);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 180000)); // checks every 3 mins
        }
    }
}

async function main() {
    try {
        await CF.connect(process.env.IP);
        console.log('Connected to Xbox');

        await startRPC();
        await checkActivity();
    } catch (err) {
        console.error('Failed to connect to Xbox', err);
    }
}

main();

/*
- Credit: Professional for the c# tool
*/