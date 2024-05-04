const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ChannelType } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server')
        .setDMPermission(false),
    async execute(interaction) {
        const { guild } = interaction;
        const text = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
        const voice = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
        const membersCount = guild.memberCount;
        const botsCount = guild.members.cache.filter(member => member.user.bot).size;
        const rolesCount = guild.roles.cache.size;
        const owner = await guild.fetchOwner();
        const createdDate = guild.createdAt.toLocaleDateString();
        const serverIcon = guild.iconURL({ dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(guild.name)
            .setThumbnail(serverIcon)
            .addFields(
                { name: 'Text Channels', value: `${text}`},
                { name: 'Voice Channels', value: `${voice}`},
                { name: 'Members', value: `${membersCount}`},
                { name: 'Roles', value: `${rolesCount}`},
                { name: 'Owner', value: `${owner}`},
                { name: 'Created At', value: `${createdDate}`},
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
