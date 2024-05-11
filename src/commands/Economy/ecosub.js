const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Economy commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription('Check your balance')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('beg')
                .setDescription('Beg for money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bet')
                .setDescription('Bet on a 1/5 chance of winning')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of money to bet')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription('Deposit money into your bank account')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of money to deposit')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription('Withdraw money from your bank account')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of money to withdraw')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('work')
                .setDescription('Work and earn money')
        ),

    async execute(interaction) {
        const { options } = interaction;
        const subcommand = options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'balance') {
            fs.readFile('data.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('There was an error reading the data.');
                }
                const userData = JSON.parse(data);
                const userBalance = userData[userId] ? userData[userId].handheld : 0;
                const bankBalance = userData[userId] ? userData[userId].bank : 0;

                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username}'s Account Info`)
                    .setColor('DarkBlue')
                    .setDescription(`> **Handheld:** \`\`$${userBalance}\`\`\n> **Bank:** \`\`$${bankBalance}\`\``);

                interaction.reply({ embeds: [embed] });
            });
        } else if (subcommand === 'beg') {
            const amount = Math.floor(Math.random() * 91) + 10;
            fs.readFile('data.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('There was an error reading the data.');
                }
                let userData = JSON.parse(data);
                if (!userData[userId]) {
                    userData[userId] = {
                        bank: 0,
                        handheld: amount
                    };
                } else {
                    userData[userId].handheld += amount;
                }

                fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply('There was an error updating the data.');
                    }
                });

                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: `You Begged And Received $${amount}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
                interaction.reply({ embeds: [embed] });
            });
        } else if (subcommand === 'bet') {
            const amountBet = options.getInteger('amount');
            if (amountBet <= 0) {
                const embed = new EmbedBuilder()
                    .setColor('White')
                    .setAuthor({ name: 'Enter An Amount Greater Than 0', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                return interaction.reply({ embeds: [embed] });
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
                        .setAuthor({ name: 'You Do Not Have Enough For This', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                    return interaction.reply({ embeds: [embed] });
                }
                if (userData[userId].handheld < amountBet) {
                    const embed = new EmbedBuilder()
                        .setColor('White')
                        .setAuthor({ name: 'You Do Not Have Enough For This', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                    return interaction.reply({ embeds: [embed] });
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
                        .setColor('DarkBlue')
                        .setAuthor({ name: `You Won And Earned $${winnings}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
                    interaction.reply({ embeds: [embed] });
                } else {
                    userData[userId].handheld -= amountBet;
                    const embed = new EmbedBuilder()
                        .setColor('DarkBlue')
                        .setAuthor({ name: `You Lost! You Have Lost $${amountBet}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
                    interaction.reply({ embeds: [embed] });
                }
                fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply('There was an error updating the data.');
                    }
                });
            });
        } else if (subcommand === 'deposit') {
            const amount = options.getInteger('amount');
            if (amount <= 0) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: 'Enter An Amount Greater Than 0', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                return interaction.reply({ embeds: [embed] });
            }
            if (amount > 1000000) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: 'You Cannot Deposit More Than $1,000,000', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                return interaction.reply({ embeds: [embed] });
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
                if (userData[userId].handheld < amount) {
                    const embed = new EmbedBuilder()
                        .setColor('DarkBlue')
                        .setAuthor({ name: 'You Do Not Have Enough For This Transaction', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                    return interaction.reply({ embeds: [embed] });
                }
                userData[userId].handheld -= amount;
                userData[userId].bank += amount;
                fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply('There was an error updating the data.');
                    }
                });
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: `You Have Deposited $${amount}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
                interaction.reply({ embeds: [embed] });
            });
        } else if (subcommand === 'withdraw') {
            const amount = options.getInteger('amount');
            if (amount <= 0) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: 'Enter An Amount Greater Than 0', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                return interaction.reply({ embeds: [embed] });
            }
            if (amount > 1000000) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: 'You Cannot Withdraw More Than $1,000,000', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                return interaction.reply({ embeds: [embed] });
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
                        .setColor('DarkBlue')
                        .setAuthor({ name: 'You Do Not Have Enough For This Transaction', iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236431214043201627/6426-error.png?ex=6637fbcd&is=6636aa4d&hm=f3ccafbd018ff090301896e9e98b75e5493ee77c929f09efa4459a4d545b549e&' });
                    return interaction.reply({ embeds: [embed] });
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
                    .setColor('DarkBlue')
                    .setAuthor({ name: `You Have Withdrawn $${amount}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
                interaction.reply({ embeds: [embed] });
            });
        } else if (subcommand === 'work') {
            const amountEarned = Math.floor(Math.random() * 901) + 100;
            fs.readFile('data.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('There was an error reading the data.');
                }
                let userData = JSON.parse(data);
                if (!userData[userId]) {
                    userData[userId] = {
                        bank: 0,
                        handheld: amountEarned
                    };
                } else {
                    userData[userId].handheld += amountEarned;
                }
                fs.writeFile('data.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply('There was an error updating the data.');
                    }
                });
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setAuthor({ name: `You Have Earned $${amountEarned}`, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
                interaction.reply({ embeds: [embed] });
            });
        }
    },
};
