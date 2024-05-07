const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member-count')
        .setDescription('Get Server Member Count')
        .setDMPermission(false),
    async execute(interaction) {
        const { guild } = interaction;
        const membersCount = guild.memberCount;


        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle(`${guild.name} Total Members`)
            .setDescription(`> ${membersCount}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
