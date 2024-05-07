const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const simplydjs = require('simply-djs');
async function execute(interaction, client) {
  try {
       simplydjs.calculator(interaction, {
  strict: true,
  embed: {
    title: "Calculator",
    color: simplydjs.toRgb("#406dbc"),
    footer: {text: "calc"}
    
  }
})
  } catch (error) {
    console.log(`Error processing calculator command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}

module.exports = {
  execute,
};