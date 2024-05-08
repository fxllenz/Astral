const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const AFK_DATA_FILE = 'afkdata.json';


function loadAFKData() {
    try {
        const data = fs.readFileSync(AFK_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading AFK data:', err);
        return {};
    }
}

function saveAFKData(data) {
    fs.writeFileSync(AFK_DATA_FILE, JSON.stringify(data, null, 4), 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk-set')
        .setDescription('Set yourself as AFK')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for going AFK')
                .setRequired(true)),

    async execute(interaction) {
        const reason = interaction.options.getString('reason');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        let afkData = loadAFKData();
        afkData[guildId] = afkData[guildId] || {};
        afkData[guildId][userId] = reason;
        saveAFKData(afkData);
        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle('AFK Set')
            .setDescription(`**You Have Been Set As AFK.** Reason: ${reason}`)

        await interaction.reply(`You have been set as AFK. Reason: ${reason}`);
    },
};
