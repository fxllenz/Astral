const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-number')
        .setDescription('Gives You A Random Number'),
    async execute(interaction) {
        const gaynessLevel = getRandomInt(0, 100);
        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle('Random Number')
            .setDescription(`> **Your Random Number Is:** \`\`${gaynessLevel}\`\``)
        await interaction.reply({ embeds: [embed]});
    },
};
