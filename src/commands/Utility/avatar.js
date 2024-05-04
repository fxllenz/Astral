const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(`Fetch a user's avatar from the server`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription(`The users avatar to fetch`)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('id')
            .setDescription(`If the user has left, you can enter the user ID`)
            .setRequired(false)
        ),
    async execute(interaction) {
        const { client, options, member } = interaction;
        const userOption = interaction.options.getUser('user');
        const idOption = interaction.options.getString('id');

        let user;
        if (userOption) {
            user = userOption;
        } else if (idOption) {
            const userById = await client.users.fetch(idOption);
            if (userById) {
                user = userById;
            } else {
                await interaction.reply('Invalid user ID or user has direct messages turned off.');
                return;
            }
        } else {
            user = member;
        }

        const userAvatar = user.displayAvatarURL({ size: 512 });

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(userAvatar)
            .setTimestamp();

        const button = new ButtonBuilder()
            .setLabel('Avatar Label')
            .setStyle(ButtonStyle.Link)
            .setURL(user.avatarURL({ size: 512 }));

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            ephemeral: false, 
            components: [row],
        });
    },
};