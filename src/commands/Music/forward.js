const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forward')
    .setDescription('Forwards the current playing song by a specified amount of time (in seconds)')
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('The amount of time (in seconds) to forward')
        .setRequired(true)),

  async execute(interaction, client) {
    const time = interaction.options.getInteger('time');
    const queue = client.distube.getQueue(interaction);

    if (!queue) return interaction.reply({ content: `There is nothing in the queue right now!`, ephemeral: true });
    if (isNaN(time) || time <= 0) return interaction.reply({ content: `Please enter a valid positive number for the time to forward!`, ephemeral: true });

    queue.seek(queue.currentTime + time);

    const embed = new EmbedBuilder()
      .setColor('White')
      .setAuthor({ name: `Song Forwarded By ${time} Seconds`, iconURL: 'https://cdn.discordapp.com/attachments/1236024144232190033/1236063478456913990/2187-musicplayer.png?ex=6636a552&is=663553d2&hm=72255dde9768a852bf327b114951961855384de16b0b90e86c7e40e85a2b67aa&' })
    

    interaction.reply({ embeds: [embed], ephemeral: false });
  }
};
