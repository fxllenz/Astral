const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const simplydjs = require('simply-djs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('calulater')
        .setDescription('the name says everything'),
    async execute(interaction, client) {
      simplydjs.calculator(interaction, {
  strict: true,
  embed: {
    title: "Calculator",
    color: simplydjs.toRgb("#406dbc"),
    footer: {text: "calc"}
    
  }
})
    }
};