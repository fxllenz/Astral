const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets the volume of the music')
    .addIntegerOption(option =>
      option.setName('volume')
        .setDescription('The volume level to set')
        .setRequired(true)),

  async execute(interaction, client) {
    const volume = interaction.options.getInteger('volume');
    const queue = client.distube.getQueue(interaction);

    if (!queue) return interaction.reply({ content: `There is nothing in the queue right now!`, ephemeral: true });
    if (isNaN(volume) || volume < 0 || volume > 100) return interaction.reply({ content: `Please enter a valid volume level between 0 and 100!`, ephemeral: true });

    queue.setVolume(volume);
    
    const embed = new EmbedBuilder()
      .setColor('White')
      .setAuthor({ name: `Volume Set To ${volume}`, iconURL: 'https://cdn.discordapp.com/attachments/1236024144232190033/1236063478456913990/2187-musicplayer.png?ex=6636a552&is=663553d2&hm=72255dde9768a852bf327b114951961855384de16b0b90e86c7e40e85a2b67aa&'}) // Setting author text and icon URL
    interaction.reply({ embeds: [embed], ephemeral: false });
  }
};
