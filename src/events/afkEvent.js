const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const AFK_DATA_FILE = 'afkdata.json';

function loadAFKData() {
    try {
        const data = fs.readFileSync(AFK_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('(ERROR) afkData.js');
        return {};
    }
}

function saveAFKData(data) {
    try {
        fs.writeFileSync(AFK_DATA_FILE, JSON.stringify(data, null, 4), 'utf8');
    } catch (err) {
        console.error('(ERROR) afkData.js');
    }
}

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            if (!message.guild || message.author.bot) return;

            const mentionedUsers = message.mentions.members;
            const guildId = message.guild.id;

            let afkData = loadAFKData();

            mentionedUsers.forEach(member => {
                if (member.id in afkData[guildId]) {
                    const reason = afkData[guildId][member.id];
                    const embed = new EmbedBuilder()
                        .setColor('DarkBlue')
                        .setDescription(`**${member.user.tag} is AFK. Reason: ${reason}**`);
                    try {
                        message.reply({ embeds: [embed] });
                    } catch (error) {
                        console.error('(ERROR) afkData.js');
                    }
                }
            });

            if (message.author.id in afkData[guildId]) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setDescription(`**Welcome Back ${message.author.tag}, I Have Removed Your AFK!**`);
                try {
                    message.reply({ embeds: [embed] });
                    delete afkData[guildId][message.author.id];
                    saveAFKData(afkData);
                } catch (error) {
                    console.error('(ERROR) afkData.js');
                }
            }
        } catch (error) {
            console.error('(ERROR) afkData.js');
        }
    },
};
