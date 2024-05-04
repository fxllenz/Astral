const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing song'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply({ content: ` | There is nothing in the queue right now!`, ephemeral: true });
    
    try {
      const song = await queue.skip();
      interaction.reply({ content: ` | Skipped! Now playing:\n${song.name}`, ephemeral: false });
    } catch (e) {
      interaction.reply({ content: ` | ${e}`, ephemeral: true });
    }
  }
};
