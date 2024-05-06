const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const simplydjs = require('simply-djs');
/*<<====== embed definitions start=====>>*/
const startEmbed = new EmbedBuilder()
                .setTitle(`❓ Help Menu`)
                .setDescription('select a category from the following dropdown')
                .setTimestamp()
                .setColor('White')
const utilembed = new EmbedBuilder()
                .setTitle("Utility Commands")
                .setDescription('**Command Count:** 5')
                .setTimestamp()
                .addFields({ name: "/help", value: `shows this message`, inline: true})
                .addFields({ name: "/ping", value: `shows the bots ping`, inline: true})
                .addFields({ name: "/avatar", value: `shows a users avatar`, inline: true})
                .addFields({ name: "/userinfo", value: `shows info about a user`, inline: true})
                .addFields({ name: "/serverinfo", value: `shows info about a server`, inline: true})
                .setColor('White')
const ecoembed = new EmbedBuilder()
                .setTitle("Economy Commands")
                .setColor('White')
                .setDescription('**Command Count:** 6')
                .setTimestamp()
                .addFields({ name: "<a:emoji_1:1236500252215873687> /work", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /beg", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /deposit", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /withdraw", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /bet", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /balance", value: ` `, inline: true})
/*<<======= embed definitions end ======>*/
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ Feeling A Little Lost?'),
    async execute (interaction, client) {
simplydjs.menuPages(interaction, {
  strict: true,
  type: 'Send',
  placeHolder: 'Select an command category',
  embed: startEmbed,
  data: [
    {
      label: "utily",
      description: "commands related to utility ",
      embed: utilembed,
      emoji: '🛠'
      
    },
    {
      label: "economy",
      description: "commads realted to economy ",
      embed: ecoembed,
      emoji: { id: '1236500252215873687', name: 'emoji_1', animated: true},
    }
  ],

  delete: {
    enable: true,
    label: "Delete message",
    description: "Delete this message"
  }
})
    }
}