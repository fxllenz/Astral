const fs = require('fs');
const path = require('path');
function loadLevelData() {
    const filePath = path.resolve('leveldata.json');
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading level data:', error);
        return {};
    }
}
function saveLevelData(levelData) {
    const filePath = path.resolve('leveldata.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(levelData, null, 4));
    } catch (error) {
        console.error('Error saving level data:', error);
    }
}

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot || !message.guild) return;
        const levelData = loadLevelData();
        const userId = message.author.id;
        const guildId = message.guild.id;
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

        levelData[guildId][userId].xp += 2;

        const currentLevel = levelData[guildId][userId].level;
        const currentXP = levelData[guildId][userId].xp;
        if (currentXP >= 100) {
            levelData[guildId][userId].xp -= 100;
            levelData[guildId][userId].level++;
            if (levelData[guildId][userId].level === 100) {
                levelData[guildId][userId].level = 0;
                levelData[guildId][userId].prestige++;
                message.channel.send(`${message.author}, you've reached level 100! You've been reset to level 0 and gained a prestige level!`);
            } else {
                message.channel.send(`${message.author}, congratulations! You've reached level ${currentLevel + 1}!`);
            }
        }
        saveLevelData(levelData);
    },
};
