const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your balance'),

    async execute(interaction) {
        const userId = interaction.user.id;

  
        fs.readFile('data.json', 'utf8', (err, data) => {
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

                fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
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
    },
};
