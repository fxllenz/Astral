const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const fs = require('fs');

async function execute(interaction, client) {
  try {
   
        const userId = interaction.user.id;

  
        fs.readFile('economydata.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply('There was an error reading the data.');
            }

        
            let userData = JSON.parse(data);

        
            if (!userData[userId]) {
      
                userData[userId] = {
                    bank: 0,
                    handheld: 0
                };

                fs.writeFile('economydata.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply('There was an error updating the data.');
                    }
                });
            }

            const userBalance = userData[userId];
            const bankBalance = userBalance.bank;
            const handheldCash = userBalance.handheld;
            const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Account Info`)
            .setColor('White')
            .setDescription(`> **Handheld:** \`\`$${handheldCash}\`\`\n> **Bank:** \`\`$${bankBalance}\`\``)
            interaction.reply({ embeds: [embed]});
        });
  } catch (error) {
    console.log(`Error processing balance command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}

module.exports = {
  execute,
};