const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Set repeat mode for the music queue')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('The repeat mode')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: 'off'},
            { name: 'Song', value: 'song'},
            { name: 'Queue', value: 'queue'},
        )),
  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction);
    if (!queue) return interaction.reply({ content: 'There is nothing playing!', ephemeral: true });
    
    const modeOption = interaction.options.getString('mode');
    let mode = null;
    
    switch (modeOption) {
      case 'off':
        mode = 0;
        break;
      case 'song':
        mode = 1;
        break;
      case 'queue':
        mode = 2;
        break;
    }
    
    mode = queue.setRepeatMode(mode);
    mode = mode ? (mode === 2 ? 'Queue' : 'Song') : 'Off';
    const embed =  new EmbedBuilder()
    .setColor('White')
    .setAuthor({ name: `Set Repeat Mode To ${mode}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236106607285501952/R.gif?ex=6636cd7c&is=66357bfc&hm=45774b5cecf68e7fe4dfbcd79151ccbccb8e476ddcb74c11b60aeda450f677be&'})
    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
