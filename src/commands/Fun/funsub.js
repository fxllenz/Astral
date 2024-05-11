const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const math = require('mathjs');
const canvacord = require('canvacord');
const weather = require('weather-js');
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const actionTitles = {
    highfive: '%s high-fived %s',
    handhold: '%s held hands with %s',
    kiss: '%s kissed %s',
    cuddle: '%s cuddled with %s',
    handshake: '%s shook hands with %s',
    pat: '%s patted %s',
    punch: '%s punched %s',
    feed: '%s fed %s',
    kick: '%s kicked %s',
    hug: '%s hugged %s',
    slap: '%s slapped %s',
};

const actionDescriptions = {
    highfive: 'A high-five between %s and %s',
    handhold: '%s and %s held hands',
    kiss: '%s kissed %s',
    cuddle: '%s and %s cuddled together',
    handshake: '%s and %s shook hands',
    pat: '%s patted %s',
    punch: '%s punched %s',
    feed: '%s fed %s',
    kick: '%s kicked %s',
    hug: '%s and %s shared a hug',
    slap: '%s slapped %s',
};
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
        .setName('fun')
        .setDescription('Fun commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('8ball')
                .setDescription('Ask the magic 8-ball a question')
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('Your question')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('action')
                .setDescription('Perform an action on someone')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The action to perform')
                        .setRequired(true)
                        .addChoices(
                            { name: 'highfive', value: 'highfive' },
                            { name: 'handhold', value: 'handhold' },
                            { name: 'kiss', value: 'kiss' },
                            { name: 'cuddle', value: 'cuddle' },
                            { name: 'handshake', value: 'handshake' },
                            { name: 'pat', value: 'pat' },
                            { name: 'punch', value: 'punch' },
                            { name: 'feed', value: 'feed' },
                            { name: 'kick', value: 'kick' },
                            { name: 'hug', value: 'hug' },
                            { name: 'slap', value: 'slap' }
                        )
                )
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user to perform the action on')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('calculate')
                .setDescription('Solve Some Maths!')
                .addStringOption(option =>
                    option.setName('expression')
                        .setDescription('Enter An Equation')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('howgay')
                .setDescription('How Gay Are You?')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Select a user')
                        .setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('random-number')
                .setDescription('Gives You A Random Number')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weather')
                .setDescription('Get weather information of a location')
                .addStringOption(option =>
                    option.setName('location')
                        .setDescription('The location to get weather information for')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('triggered')
                .setDescription('Generate a triggered image with your avatar')
        ),

    async execute(interaction) {
        const { options } = interaction;
        const subcommand = options.getSubcommand();

        if (subcommand === '8ball') {
            const question = options.getString('question');
            const response = getRandomResponse();
            const embed = new EmbedBuilder()
                .setTitle('8Ball')
                .addFields({ name: 'Question', value: question })
                .addFields({ name: 'Response', value: response })
                .setColor('DarkBlue');

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'action') {
            const action = options.getString('action');
            const target = options.getUser('target');

            const response = await axios.get(`https://nekos.best/api/v2/${action}`);

            if (!response.data || !response.data.results || !response.data.results[0].url) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription('Got an error! Try again later')
                    ],
                    ephemeral: true,
                });
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('DarkBlue')
                        .setImage(response.data.results[0].url)
                        .setTitle(actionTitles[action].replace('%s', interaction.user.username).replace('%s', target.username))
                        .setDescription(actionDescriptions[action].replace('%s', interaction.user.toString()).replace('%s', target.toString()))
                ],
            });
        } else if (subcommand === 'calculate') {
            const expression = options.getString('expression');

            try {
                const result = math.evaluate(expression);
                const embed = new EmbedBuilder()
                    .setTitle('Calculate')
                    .setDescription(`**Input:**\n\`\`${expression}\`\`\n**Output:**\n\`\`${result}\`\``)
                    .setColor('DarkBlue')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setTitle('Calculate')
                    .setDescription(`**Input:**\n\`\`${expression}\`\`\n**Output:**\n\`\`An Error Has Occured, Whilst Solving The Expression Or Equation.\`\``)
                    .setColor('DarkBlue')
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                console.error('(ERROR) calculate.js');
            }
        } else if (subcommand === 'howgay') {
            const user = options.getUser('user') || interaction.user;
            const gaynessLevel = getRandomInt(0, 100);
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('Howgay')
                .setDescription(`> **${user.username} Is ${gaynessLevel}% Gay!**`);

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'random-number') {
            const randomNumber = getRandomInt(0, 100);
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('Random Number')
                .setDescription(`> **Your Random Number Is:** \`\`${randomNumber}\`\``);

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'weather') {
            const location = options.getString('location');
            await interaction.deferReply();

            weather.find({ search: location, degreeType: 'C' }, function (err, result) {
                if (err) {
                    console.log(err);
                    return interaction.followUp('Failed to fetch weather information.');
                }

                if (!result || result.length === 0 || !result[0].current) {
                    return interaction.followUp('Failed to fetch weather information. Please provide a valid location.');
                }

                const current = result[0].current;
                const locationData = result[0].location;

                const embed = new EmbedBuilder()
                    .setTitle(`Weather in ${locationData.name}`)
                    .setColor('DarkBlue')
                    .setDescription(`**${current.skytext}**`)
                    .addFields(
                        { name: 'Temperature', value: `${current.temperature}°C / ${current.temperature * 9 / 5 + 32}°F`, inline: true },
                        { name: 'Feels Like', value: `${current.feelslike}°C / ${current.feelslike * 9 / 5 + 32}°F`, inline: true },
                        { name: 'Humidity', value: `${current.humidity}%`, inline: true }
                    )
                    .setThumbnail(current.imageUrl)
                    .setTimestamp();

                interaction.followUp({ embeds: [embed] });
            });
        } else if (subcommand === 'triggered') {
            const avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
            let image = await canvacord.Canvas.trigger(avatar);
            const attachment = new Discord.MessageAttachmentMessageAttachment(image, 'triggered.gif');

            interaction.reply({ files: [attachment] });
        }
    },
};
