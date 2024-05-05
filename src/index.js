const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const { DisTube } = require('distube')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] }); 
client.commands = new Collection();
require('dotenv').config();
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const embedColor = 'White';
const ytSearch = require('yt-search');

client.distube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ]
  }),



  (async () => {
    try {
        for (file of functions) {
            require(`./functions/${file}`)(client);
        }
        
        const status = queue =>
            `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
                queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
            }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
        
        client.distube
            .on('playSong', async (queue, song) => {
                try {
                    const videoResult = await ytSearch(song.url);
                    const songInfo = {
                        title: videoResult.videos[0].title,
                        url: videoResult.videos[0].url,
                        duration: videoResult.videos[0].timestamp,
                        views: videoResult.videos[0].views,
                        thumbnail: videoResult.videos[0].thumbnail,
                        uploader: videoResult.videos[0].author.name
                    };
                    
                    const embed = new EmbedBuilder()
                        .setColor('White')
                        .setAuthor({ name: 'Xenos Music System - Now Playing', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236106607285501952/R.gif?ex=6636cd7c&is=66357bfc&hm=45774b5cecf68e7fe4dfbcd79151ccbccb8e476ddcb74c11b60aeda450f677be&'})
                        .setFooter({ text: '© Xenos 2024 - 2024', iconURL: 'https://cdn.discordapp.com/avatars/1233219148772016128/26e40f6b855b1b2b449d6cf3093c2f2f.webp?size=512'})
                        .setTitle(`${songInfo.title}`)
                        .setFields(
                            { name: 'Duration', value: `${songInfo.duration}`, inline: true },
                            { name: 'Views', value: `${songInfo.views}`, inline: true },
                            { name: 'Uploader', value: `${songInfo.uploader}`, inline: true },
                            { name: 'URL', value: `${songInfo.url}` }
                        )
                        .setImage(`${songInfo.thumbnail}`);
                    queue.textChannel.send({ embeds: [embed] });
                } catch (error) {
                    console.error('Error in playSong event:', error);
                }
            })
            // Add other event listeners with try-catch blocks as needed

        try {
            client.handleEvents(eventFiles, "./src/events");
            client.handleCommands(commandFolders, "./src/commands");
        } catch (error) {
            console.error('Error handling events and commands:', error);
        }

        client.login(process.env.TOKEN);
    } catch (error) {
        console.error('Unhandled error:', error);
    }
})();