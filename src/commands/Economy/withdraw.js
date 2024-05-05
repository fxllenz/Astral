const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

const MAX_BALANCE = 1000000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from your bank account')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of money to withdraw')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: 'Enter An Amount Greater Than 0', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&'})
            return interaction.reply({ embeds: [embed]});
        }

        if (amount > MAX_BALANCE) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: 'You Cannot Withdraw More Than $1,000,000', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&'})
            return interaction.reply({ embeds: [embed]});
        }

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
            }

            if (userData[userId].bank < amount) {
                const embed = new EmbedBuilder()
                    .setColor('White')
                    .setAuthor({ name: 'You Do Not Have Enough For This Transaction', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&'})
                return interaction.reply({ embeds: [embed]});
            }

            userData[userId].handheld += amount;
            userData[userId].bank -= amount;

            fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('There was an error updating the data.');
                }
            });
            const embed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: `You Have Withdrawn $${amount}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&'})
            interaction.reply({ embeds: [embed]});
        });
    },
};
