const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(client.config.Token);

        (async () => {
            try {
                console.log("\x1b[31m%s\x1b[0m", '(EVENT)', '\x1b[37m\x1b[0m', 'Refreshed application {/} commands.');

                await rest.put(
                    Routes.applicationCommands(client.config.clientId), {
                        body: client.commandArray
                    },
                );

                console.log("\x1b[31m%s\x1b[0m", '(EVENT)', '\x1b[37m\x1b[0m', 'Reloaded application {/} commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};