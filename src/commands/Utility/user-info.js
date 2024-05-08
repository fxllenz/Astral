const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get detailed information about a user')
        .addUserOption(option => option.setName('user').setDescription('The user to get information about').setRequired(false)),
    async execute(interaction, client) {
        const { options, user: invoker } = interaction;
        const targetUser = options.getUser('user') || invoker;

        try {
            const [userResponse, presenceResponse] = await Promise.all([
                axios.get(`https://japi.rest/discord/v1/user/${targetUser.id}`),
                client.users.fetch(targetUser.id, { force: true }),
            ]);

            const userData = userResponse.data.data;
            const { username, discriminator, id, created_at, avatarURL, bannerURL } = userData;

            const guildMember = await interaction.guild.members.fetch(targetUser.id);
            const { joinedAt, roles, presence } = guildMember;

            const presenceStatus = presence?.status || 'offline';

            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle(`${username}#${discriminator}`)
                .setThumbnail(avatarURL)
                .setImage(bannerURL ? `${bannerURL}?size=1024` : 'https://cdn.discordapp.com/attachments/1237087939679486014/1237807195102642196/Screenshot_2024_0508_220810.jpg?ex=663cfd48&is=663babc8&hm=96820faf0bfaf96497b1c864513772eccca0f672c1d502af2d2d2a3008f3586c&')
                .addFields(
                    { name: 'ID', value: id, inline: true },
                    { name: 'Nickname', value: guildMember.nickname || 'None', inline: true },
                    { name: 'Joined Server', value: moment(joinedAt).format('LLLL'), inline: true },
                    { name: 'Created At', value: moment(created_at).format('LLLL'), inline: true },
                    { name: 'Roles', value: roles.cache.map(role => role.toString()).join(', ') || 'None', inline: false },
                    { name: 'Presence', value: getPresenceStatus(presenceStatus), inline: true },
                )
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Avatar (128px)')
                        .setStyle(ButtonStyle.Link)
                        .setURL(targetUser.displayAvatarURL({ size: 128 })),
                    new ButtonBuilder()
                        .setLabel('Avatar (256px)')
                        .setStyle(ButtonStyle.Link)
                        .setURL(targetUser.displayAvatarURL({ size: 256 })),
                    new ButtonBuilder()
                        .setLabel('Avatar (512px)')
                        .setStyle(ButtonStyle.Link)
                        .setURL(targetUser.displayAvatarURL({ size: 512 })),
                    new ButtonBuilder()
                        .setLabel('Avatar (1024px)')
                        .setStyle(ButtonStyle.Link)
                        .setURL(targetUser.displayAvatarURL({ size: 1024 })),
                );

            if (bannerURL) {
                row.addComponents(
                    new ButtonBuilder()
                        .setLabel('Banner')
                        .setStyle(ButtonStyle.Link)
                        .setURL(bannerURL)
                );
            }

            await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error fetching user information:', error);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🖼・User Information')
                        .setDescription('An error occurred while fetching the user\'s information.')
                        .setColor('Red')
                ]
            });
        }
    },
};

function getPresenceStatus(status) {
    const statusMap = {
        online: '🟢 Online',
        idle: '🟡 Idle',
        dnd: '🔴 Do Not Disturb',
        offline: '⚫ Offline',
    };

    return statusMap[status] || '⚫ Offline';
}