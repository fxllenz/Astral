const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        if (message.content === "hi") {
            console.log('Hi');
            const button = new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://google.com');
            const button2 = new ButtonBuilder()
                .setLabel('Bot Invite')
                .setStyle(ButtonStyle.Link)
                .setURL('https://google.com');
            const row = new ActionRowBuilder().addComponents(button).addComponents(button2);
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription(`**Hello! You appear to have mentioned me.**\n\n**Need help? Run /help For My Commands!**`);
            message.channel.send({ embeds: [embed], components: [row] });
        }
    }
};
