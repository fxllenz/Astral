const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences] });
client.commands = new Collection();
require('dotenv').config();
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const handleErrors = (error) => {
    console.error('(ERROR) ', error);
};

(async () => {
    try {
        for (file of functions) {
            require(`./functions/${file}`)(client);
        }
        try {
            client.handleEvents(eventFiles, "./src/events");
            client.handleCommands(commandFolders, "./src/commands");
        } catch (error) {
            console.error('(ERROR) ', error);
        }
        client.on('error', handleErrors);

        client.login(process.env.TOKEN);
    } catch (error) {
        handleErrors(error);
    }
})();
