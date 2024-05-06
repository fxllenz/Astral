const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const simplydjs = require('simply-djs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-builder')
        .setDescription('the name says everything'),
    async execute(interaction, client) {

      simplydjs.embedCreator(interaction, { 
        strict: true,
        embed: {
          title: "Embed generator",
          description: "Select any option from the Menu to create a custom embed.",
          color: simplydjs.toRgb("#406dbc"),
          footer: {text: "Astral development"},
          image: 'https://cdn.discordapp.com/attachments/1236004427530375301/1237088516786229439/Screenshot_2024_0506_223737.jpg?ex=663a5ff6&is=66390e76&hm=93166169ce01fc6bb290049ba7bc7bb3334b8a72ec6c8ccd8288066dd595b671&',
          thumbnail: `${client.user.displayAvatarURL()}`
        }
      })
  

    }
};