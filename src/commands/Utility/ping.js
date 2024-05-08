const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(`Get The Bots Latency`)
        .setDMPermission(false),
    async execute(interaction) {
        const { client, options, member } = interaction;
        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle('Astral Network Stats')
            .setDescription(`> **API Latency:** ${client.ws.ping}ms\n`)
            .setTimestamp();
        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    },
}; 