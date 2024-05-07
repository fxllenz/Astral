const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');


module.exports = (client) => {
  const config = require('../settings/config')(client);
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
        }).setToken(config.Token);

        (async () => {
            try {
                client.logger.debug('(EVENT) Refreshed application {/} commands.');

                await rest.put(
                    Routes.applicationCommands(config.clientId), {
                        body: client.commandArray
                    },
                );

                client.logger.debug('(EVENT) Reloaded application {/} commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};