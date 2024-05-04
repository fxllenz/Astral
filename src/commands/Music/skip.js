const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing song'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply({ content: `There is nothing in the queue right now!`, ephemeral: true });
    
    try {
      const song = await queue.skip();
      const embed =  new EmbedBuilder()
      .setColor('White')
      .setAuthor({ name: `Skipped The Playing Song`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236106607285501952/R.gif?ex=6636cd7c&is=66357bfc&hm=45774b5cecf68e7fe4dfbcd79151ccbccb8e476ddcb74c11b60aeda450f677be&'})
      await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      interaction.reply({ content: ` | ${e}`, ephemeral: true });
    }
  }
};
