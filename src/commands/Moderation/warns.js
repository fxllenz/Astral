const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Check a user\'s warnings')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member } = interaction;
        const targetUser = options.getUser('user');

        const warningsData = JSON.parse(fs.readFileSync('warnings.json', 'utf8'));

        const targetWarnings = warningsData[targetUser.id] || [];

        if (targetWarnings.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle(`Warnings for ${targetUser.username}`)
                .setDescription(`${targetUser.username} has no warnings.`)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: false
            });
            return;
        }

        const warningsEmbed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle(`Warnings for ${targetUser.username}`)
            .setTimestamp();

        targetWarnings.forEach((warning) => {
            const moderatorUser = interaction.client.users.cache.get(warning.moderatorId);
            warningsEmbed.addFields({
                name: `Warning ID: ${warning.id}`,
                value: `Reason: ${warning.reason}\nTimestamp: <t:${Math.floor(warning.timestamp / 1000)}:F>\nIssued by: ${userMention(moderatorUser.id)}`,
                inline: false
            });
        });

        await interaction.reply({
            embeds: [warningsEmbed],
            ephemeral: false
        });
    },
};