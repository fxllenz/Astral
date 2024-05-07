const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

const balance = require('./subcommands/balance');
const beg = require('./subcommands/beg');
const work = require('./subcommands/work');
const deposit = require('./subcommands/deposit');
const withdraw = require('./subcommands/withdraw');
const bet = require('./subcommands/bet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('economy')
        .addSubcommand(subcommand =>
            subcommand
                .setName('work')
                .setDescription('earn some money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription('deposit money to the bank')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of money to deposit')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('beg')
                .setDescription('beg for money from Rich people')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription('Check your current balance')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription('Withdraw money from the bank')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of money to withdraw')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bet')
                .setDescription('Bet on a coin flip')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of money to bet')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const { client, options, member, guild } = interaction;

        if (options.getSubcommand() === 'work') {
            work.execute(interaction, client);
        } else if (options.getSubcommand() === 'deposit') {
            deposit.execute(interaction, client, options);
        } else if (options.getSubcommand() === 'beg') {
            beg.execute(interaction, client);
        } else if (options.getSubcommand() === 'balance') {
            balance.execute(interaction, client, member);
        } else if (options.getSubcommand() === 'withdraw') {
            withdraw.execute(interaction, client, options);
        } else if (options.getSubcommand() === 'bet') {
            bet.execute(interaction, client, options);
        }
    }
};