const fs = require('fs').promises;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let levelData = {};

async function loadLevelData() {
    try {
        const data = await fs.readFile('leveldata.json');
        levelData = JSON.parse(data);
    } catch (error) {
        console.error('Error loading level data:', error);
    }
}

async function saveLevelData() {
    try {
        await fs.writeFile('leveldata.json', JSON.stringify(levelData, null, 4));
    } catch (error) {
        console.error('Error saving level data:', error);
    }
}

function initializeUserData(guildId, userId) {
    if (!levelData[guildId]) {
        levelData[guildId] = {};
    }
    if (!levelData[guildId][userId]) {
        levelData[guildId][userId] = {
            xp: 0,
            level: 1,
            prestige: 0
        };
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Get your XP, level, and prestige'),
    async execute(interaction) {
        await loadLevelData();

        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        initializeUserData(guildId, userId);

        const userData = levelData[guildId][userId];
        const { xp, level, prestige } = userData;
        function calculate_xp_to_next_level(xp) {
            return 100 - xp;
        }
        const xp_for_next_level = calculate_xp_to_next_level(level);
        const progress_percentage = xp / xp_for_next_level;
        const total_blocks = 20;
        const filled_blocks = Math.floor(progress_percentage * total_blocks);
        const progress_bar = "█".repeat(filled_blocks) + "░".repeat(total_blocks - filled_blocks);

        

        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle(`${interaction.user.username}'s Level Info`)
            .setDescription(`<:xp:1238716028784087081> **XP:** \`\`${xp.toString()}/100\`\`\n<:level:1238716030369402930> **Level:** \`\`${level.toString()}\`\`\n<:pres:1238716031615242250> **Prestige Level:** \`\`${prestige.toString()}\`\``)
            .addFields({ name: 'Progress:', value: `\`${progress_bar}\``});

        await interaction.reply({ embeds: [embed] });
    },
};
