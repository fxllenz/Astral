const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const axios = require('axios');
async function execute(interaction, client) {
  try {
    const { options, user: invoker } = interaction;
    const targetUser = options.getUser('user') || invoker;

    const avatarURL = targetUser.displayAvatarURL({ size: 512 });

    axios.get(`https://discord.com/api/users/${targetUser.id}`, {
        headers: {
            Authorization: `Bot ${client.config.Token}`,
        },
    })
    .then(res => {
        const { banner, accent_color } = res.data;

        if (banner) {
            const extension = banner.startsWith("a_") ? ".gif" : ".png";
            const bannerURL = `https://cdn.discordapp.com/banners/${targetUser.id}/${banner}${extension}?size=1024`;

            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle(`${targetUser.username}'s Info`)
                .setThumbnail(avatarURL)
                .setImage(bannerURL)
                .addFields(
                    { name: 'Username', value: targetUser.username, inline: true },
                    { name: 'Discriminator', value: targetUser.discriminator, inline: true },
                    { name: 'ID', value: targetUser.id, inline: true },
                    { name: 'Created At', value: targetUser.createdAt.toLocaleString(), inline: true },
                  {name : '**JOINED THIS SERVER**', value: `${targetUser.joinedAt ? user.joinedAt.toUTCString() : 'Unknown'}`}
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
                    new ButtonBuilder()
                        .setLabel('Banner')
                        .setStyle(ButtonStyle.Link)
                        .setURL(bannerURL)
                );

            interaction.reply({ embeds: [embed], components: [row] });
        }
        else {
            const embed = new EmbedBuilder()
                .setColor(accent_color || 'White')
                .setTitle(`${targetUser.username}'s Info`)
                .setThumbnail(avatarURL)
                .setImage('https://via.placeholder.com/1024x256')
                .addFields(
                    { name: 'Username', value: targetUser.username, inline: true },
                    { name: 'Discriminator', value: targetUser.discriminator, inline: true },
                    { name: 'ID', value: targetUser.id, inline: true },
                    { name: 'Created At', value: targetUser.createdAt.toLocaleString(), inline: true }
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
                    new ButtonBuilder()
                        .setLabel('Banner')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://via.placeholder.com/1024x256')
                );

            interaction.reply({ embeds: [embed], components: [row] });
        }
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🖼・User Banner')
                    .setDescription('An error occurred while fetching the user\'s banner information.')
                    .setColor('Red')
            ]
        });
    });
  } catch (error) {
    console.log(`Error processing user info command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}

module.exports = {
  execute,
};