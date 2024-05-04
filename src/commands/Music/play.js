const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play A Song From URL / Search Query')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The song URL or query to search.')
        .setRequired(true)),
  async execute(interaction, client) {
    const query = interaction.options.getString('query');

    if (!query) {
        const embed = new EmbedBuilder()
        .setTitle('Music Error')
        .setDescription('**Please Enter A URL Or Query To Search**')
      return interaction.reply({ embeds: [embed], ephemeral: false });
    }

    const member = interaction.member;
    const voiceChannel = member.voice.channel;
    const textChannel = interaction.channel;

    if (!voiceChannel) {
        const embed = new EmbedBuilder()
        .setTitle('Music Error')
        .setDescription('**You Need To Be In A VC To Use This Command**')
      return interaction.reply({ embeds: [embed], ephemeral: false });
    }

    const videoResult = await ytSearch(query);
    if (videoResult.videos.length === 0) {
        const embed = new EmbedBuilder()
        .setTitle('Music Error')
        .setDescription('**No video results found.**')
      return interaction.reply({ embeds: [embed], ephemeral: false });
    }

    const song = {
        title: videoResult.videos[0].title,
        url: videoResult.videos[0].url,
        duration: videoResult.videos[0].timestamp,
        views: videoResult.videos[0].views,
        thumbnail: videoResult.videos[0].thumbnail,
        uploader: videoResult.videos[0].author.name
    };

    const queue = client.distube.getQueue(voiceChannel);

    if (queue && queue.songs.length > 0) {
        client.distube.play(voiceChannel, song.url, { member, textChannel, interaction });
        const embed = new EmbedBuilder()
        .setColor('White')
        .setAuthor({ name: 'Xenos Music System', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236106607285501952/R.gif?ex=6636cd7c&is=66357bfc&hm=45774b5cecf68e7fe4dfbcd79151ccbccb8e476ddcb74c11b60aeda450f677be&'})
        .setFooter({ text: '© Xenos 2024 -2024', iconURL: 'https://cdn.discordapp.com/avatars/1233219148772016128/26e40f6b855b1b2b449d6cf3093c2f2f.webp?size=512'})
        .setTitle(`${song.title}`)
        .setFields(
            { name: 'Duration', value: `${song.duration}`, inline: true },
            { name: 'Views', value: `${song.views}`, inline: true }, 
            { name: 'Uploader', value: `${song.uploader}`, inline: true },
            { name: 'URL', value: `${song.url}`} 
        )
        .setImage(`${song.thumbnail}`)
        return interaction.reply({ embeds: [embed], ephemeral: false });
    } else {
        client.distube.play(voiceChannel, song.url, { member, textChannel, interaction });
        const embed = new EmbedBuilder()
            .setColor('White')
            .setAuthor({ name: 'Xenos Music System', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236106607285501952/R.gif?ex=6636cd7c&is=66357bfc&hm=45774b5cecf68e7fe4dfbcd79151ccbccb8e476ddcb74c11b60aeda450f677be&'})
            .setFooter({ text: '© Xenos 2024 -2024', iconURL: 'https://cdn.discordapp.com/avatars/1233219148772016128/26e40f6b855b1b2b449d6cf3093c2f2f.webp?size=512'})
            .setTitle(`${song.title}`)
            .setFields(
                { name: 'Duration', value: `${song.duration}`, inline: true },
                { name: 'Views', value: `${song.views}`, inline: true }, 
                { name: 'Uploader', value: `${song.uploader}`, inline: true },
                { name: 'URL', value: `${song.url}`} 
            )
            .setImage(`${song.thumbnail}`)
        return interaction.reply({ embeds: [embed], ephemeral: false });
    }
  },   
};
