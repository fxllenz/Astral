const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Shows Xenos' Commands`)
        .setDMPermission(false),
    async execute(interaction) {
        const { client, options, member } = interaction;
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Xenos Help Menu')
            .setDescription(`**Music Commands**\n\`\`play\`\` - *plays a song from url or search*\n\`\`skip\`\` - *skips the playing song*\n\`\`stop\`\` - *stops the player*\n\`\`pause\`\` - *pauses the current song*\n\`\`volume\`\` - *set the player volume*\n\`\`shuffle\`\` - *shuffle the current queue*\n\`\`forward\`\` - *forwards the current song*\n\`\`resume\`\` - *resumes the player*\n\`\`repeat\`\` - *repeat the song/queue/off*\n**Utility Commands**\n\`\`help\`\` - *shows this message*\n\`\`ping\`\` - *shows bot latency info*\n`)
            .setTimestamp();


        const button = new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/FyMxKmubRp');

        const row = new ActionRowBuilder().addComponents(button);
        await interaction.reply({
            embeds: [embed],
            ephemeral: false,
            components: [row]
        });
    },
};