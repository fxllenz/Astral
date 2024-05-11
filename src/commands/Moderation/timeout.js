const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { intersect } = require('mathjs');
const { duration } = require('moment');

function parseDuration(duration) {
  const regex = /^(\d+)([dDhHmMsS])$/;
  const match = duration.match(regex);

  if (!match) {
    return 0;
  }

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60;
    case 'h':
      return value * 60 * 60;
    case 'm':
      return value * 60;
    case 's':
      return value;
    default:
      return 0;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Mutes a user for a specified duration')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Which user would you like to mute?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('How long should the mute last (e.g., 3d, 2h, 90s)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute (optional)')
    ),
    async execute(interaction) {
    try {
      const target = interaction.options.getUser('target');
      const member = interaction.guild.members.cache.get(target.id);
      const reason = interaction.options.getString('reason') || 'None Specified'

      if (!member) {
        const embed = new EmbedBuilder()
        .setDescription('**That User Is Not In This Server.**')
        .setColor('DarkBlue')
        return interaction.reply({ embeds: [embed], ephemeral: true});
      }

      if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
        const embed = new EmbedBuilder()
        .setDescription('**You Do Not Have The \`\`ModerateMembers\`\` Permission.**')
        .setColor('DarkBlue')
        return interaction.reply({ embeds: [embed], ephemeral: true});
      }
      
      const totalSeconds = parseDuration(interaction.options.getString('duration'));

      if (totalSeconds <= 0) {
        const embed = new EmbedBuilder()
        .setDescription('**Please Provide A Valid Mute Duration.**')
        .setColor('DarkBlue')
        return interaction.reply({ embeds: [embed], ephemeral: true});
      }

      await member.timeout(totalSeconds * 1000);

      const embed = new EmbedBuilder()
        .setTitle('User Muted')
        .setColor("DarkBlue")
        .setDescription(`<:point:1236798131509923951> **Offender:** ${target.tag}\n<:time:1238267519794544753> **Duration:** ${interaction.options.getString('duration')}\n<:crvt:1238267518783586305> **Reason:** ${reason}\n<:mod:1236798128141897771> **Moderator:** ${interaction.user.username}`)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await member.timeout(null);
      }, totalSeconds * 1000);
    } catch (error) {
      console.error(error);
    }
  }
};