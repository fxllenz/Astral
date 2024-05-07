const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

async function execute(interaction, client) {
  try {
   
  } catch (error) {
    console.log(`Error processing ping command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}

module.exports = {
  execute,
};