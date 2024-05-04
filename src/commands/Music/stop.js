const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music and clears the queue'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply({ content: ` | There is nothing in the queue right now!`, ephemeral: false });
    
    queue.stop();
    interaction.reply({ content: ` | Stopped!`, ephemeral: false });
  }
};
