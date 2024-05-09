const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

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

module.exports = {
    data: new SlashCommandBuilder()
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
        ),
    async execute(interaction) {
        const { options } = interaction;
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
    },
};