const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const responses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];


function getRandomResponse() {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const response = getRandomResponse();
        const embed = new EmbedBuilder()
        .setTitle('8Ball')
        .addFields({ name: 'Question', value: question})
        .addFields({ name: 'Response', value: response})
        .setColor('DarkBlue')

        await interaction.reply({ embeds: [embed]});
    },
};
