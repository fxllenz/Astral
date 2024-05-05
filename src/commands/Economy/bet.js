const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Bet on a 1/5 chance of winning')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of money to bet')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const amountBet = interaction.options.getInteger('amount');


        if (amountBet <= 0) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: 'Enter An Amount Greater Than 0', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&'})
                return interaction.reply({ embeds: [embed]});
        }


        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply('There was an error reading the data.');
            }

            let userData = JSON.parse(data);


            if (!userData[userId]) {
            
                const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: 'You Do Not Have Enough For This', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&'})
                return interaction.reply({ embeds: [embed]});
            }

        
            if (userData[userId].handheld < amountBet) {
                const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: 'You Do Not Have Enough For This', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&'})
                return interaction.reply({ embeds: [embed]});
            }

            const random = Math.random();
            let win = false;

            if (random < 0.2) {
                win = true;
            }

            if (win) {
           
                const winnings = amountBet * 2;
                userData[userId].handheld += winnings;
                const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: `You Won And Earned $${winnings}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&'})
            interaction.reply({ embeds: [embed]});
            } else {
     
                userData[userId].handheld -= amountBet;
                const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: `You Lost! You Have Lost $${amountBet}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&'})
            interaction.reply({ embeds: [embed]});
            }

      
            fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('There was an error updating the data.');
                }
            });
        });
    },
};
