const { SlashCommandBuilder, MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays detailed information about the user.')
        .addUserOption(option => option
            .setName('user')
            .setDescription(`The users avatar to fetch`)
            .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`${user.username}'s Info`)
            .setDescription(`**Username:** ${user.username}\n**User ID:** ${user.id}\n**Display Name:** ${user.displayName}\n**User Mention:** <@${user.id}>\n**Joined Discord:** ${user.createdAt ? user.createdAt.toUTCString() : 'Unknown'}\n**Joined Server:** ${user.joinedAt ? user.joinedAt.toUTCString() : 'Unknown'}`)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
