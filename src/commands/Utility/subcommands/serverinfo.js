const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

async function execute(interaction, client) {
  try {
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
                { name: 'Text Channels', value: `${text}`, inline: true},
                { name: 'Voice Channels', value: `${voice}`, inline: true},
                { name: 'Members', value: `${membersCount}`, inline: true},
                { name: 'Roles', value: `${rolesCount}`, inline: true},
                { name: 'Owner', value: `${owner}`, inline: true},
                { name: 'Created At', value: `${createdDate}`, inline: true},
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
  } catch (error) {
    console.log(`Error processing server info command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}

module.exports = {
  execute,
};