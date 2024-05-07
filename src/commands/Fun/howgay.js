const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('howgay')
        .setDescription('How Gay Are You?')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const gaynessLevel = getRandomInt(0, 100);
        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle('Howgay')
            .setDescription(`> **${user.username} Is ${gaynessLevel}% Gay!**`)
        await interaction.reply({ embeds: [embed]});
    },
};
