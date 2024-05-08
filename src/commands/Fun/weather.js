const { SlashCommandBuilder } = require('@discordjs/builders');
const weather = require('weather-js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get weather information of a location')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The location to get weather information for')
                .setRequired(true)),

    async execute(interaction) {
        const location = interaction.options.getString('location');
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
                .addFields({ name: 'Temperature', value: `${current.temperature}°C / ${current.temperature * 9 / 5 + 32}°F`, inline: true})
                .addFields({ name: 'Feels Like', value: `${current.feelslike}°C / ${current.feelslike * 9 / 5 + 32}°F`, inline: true})
                .addFields({ name: 'Humidity', value: `${current.humidity}%`, inline: true})
                .setThumbnail(current.imageUrl)
                .setTimestamp();

            interaction.followUp({ embeds: [embed]});
        });
    },
};
