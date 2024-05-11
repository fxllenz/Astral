const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        try {
            if (message.content === "<@1236793738211233863>") {
                const button3 = new ButtonBuilder()
                    .setLabel('Top.gg Page')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://top.gg/bot/1236793738211233863');
                const button = new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/wcBDyZTUzT');
                const button2 = new ButtonBuilder()
                    .setLabel('Bot Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/oauth2/authorize?client_id=1236793738211233863&permissions=8&scope=bot');
                const row = new ActionRowBuilder().addComponents(button).addComponents(button2).addComponents(button3);
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setDescription(`**Hello! You appear to have mentioned me.**\n\n**Need help? Run </help:1236794937626984465> For My Commands!**`);
                message.channel.send({ embeds: [embed], components: [row] });
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // You can handle the error further as needed.
        }
    }
};
