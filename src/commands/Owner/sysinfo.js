const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const os = require('os');

const ALLOWED_USER_ID = '1156012026510966794';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('systeminfo')
        .setDescription('Get system information of the bot\'s machine'),

    async execute(interaction) {
        if (interaction.user.id !== ALLOWED_USER_ID) {
            const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('**You Are Not Authorized To Use This Command**')

            return interaction.reply({ embeds: [embed]});
        }
        const em = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle('System Info')
        .setDescription(`**Platform:** ${os.platform()}\n**Architecture:** ${os.arch()}\n**CPU Model:** ${os.cpus()[0].model}\n**Total Memory:** ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)}GB\n**Free Memory:** ${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)}GB`)
        return interaction.reply({ embeds: [em]});
    },
};
