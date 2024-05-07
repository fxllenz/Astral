const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

const fs = require('fs');
async function execute(interaction, client) {
  try {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const amount = Math.floor(Math.random() * 91) + 10;

    const messages = [
      `Wow, look at you, begging like a professional! You managed to scrounge up a whopping $${amount}. Congratulations, you're officially a master of the art of freeloading!`,
      `Ah, the age-old technique of "puppy dog eyes and a sad story" has paid off! You've been gifted $${amount} by some poor, unsuspecting soul. Way to work that charm, you smooth-talking beggar!`,
      `Ah, the sweet smell of success! You've somehow convinced someone to hand over $${amount} to you. I'm impressed by your ability to manipulate the kindness of others.`,
      `Well, well, well, if it isn't our resident professional mooch! You've managed to weasel your way into another $${amount}. Bravo, you shameless freeloader!`,
      `Ah, the age-old art of "I'm so poor, please help me" has struck again! You've been gifted $${amount} by someone with more money than sense. Nicely done, you crafty beggar!`,
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    fs.readFile('economydata.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return interaction.reply('There was an error reading the data.');
      }
      let userData = JSON.parse(data);
      if (!userData[userId]) {
        userData[userId] = {
          bank: 0,
          handheld: amount,
        };
      } else {
        userData[userId].handheld += amount;
      }

      fs.writeFile('economydata.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return interaction.reply('There was an error updating the data.');
        }
      });

      const embed = new EmbedBuilder()
        .setColor('White')
        .setAuthor({ name: randomMessage, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
      interaction.reply({ embeds: [embed] });
    });
  } catch (error) {
    console.log(`Error processing beg command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}
module.exports = {
  execute,
}; 