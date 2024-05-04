const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the currently playing song'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);

    if (!queue) return interaction.reply({ content: `There is nothing in the queue right now!`, ephemeral: true });

    if (queue.paused) {
      queue.resume();
      const embed = new EmbedBuilder()
        .setColor('White')
        .setAuthor({ name: 'The Song Has Been Resumed', iconURL: 'https://cdn.discordapp.com/attachments/1236024144232190033/1236063478456913990/2187-musicplayer.png?ex=6636a552&is=663553d2&hm=72255dde9768a852bf327b114951961855384de16b0b90e86c7e40e85a2b67aa&' })

      interaction.reply({ embeds: [embed], ephemeral: false });
    } else {
      queue.pause();
      const embed = new EmbedBuilder()
        .setColor('White')
        .setAuthor({ name: 'The Song Has Been Paused', iconURL: 'https://cdn.discordapp.com/attachments/1236024144232190033/1236063478456913990/2187-musicplayer.png?ex=6636a552&is=663553d2&hm=72255dde9768a852bf327b114951961855384de16b0b90e86c7e40e85a2b67aa&' }) 

      interaction.reply({ embeds: [embed], ephemeral: false });
    }
  }
};
