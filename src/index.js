const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates,         GatewayIntentBits.GuildPresences] }); 
client.commands = new Collection();
const config = require('./config.js')
require('dotenv').config();
client.config = config;
require('dotenv').config();
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

  (async () => {
    try {
        for (file of functions) {
            require(`./functions/${file}`)(client);
        }
        try {
            client.handleEvents(eventFiles, "./src/events");
            client.handleCommands(commandFolders, "./src/commands");
        } catch (error) {
            console.error('Error handling events and commands:', error);
        }

        client.login(client.config.Token);
    } catch (error) {
        console.error('Unhandled error:', error);
    }
})();