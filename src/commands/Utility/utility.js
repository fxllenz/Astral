const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('Utility commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription('Get the bot\'s latency')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription('Fetch a user\'s avatar from the server')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user\'s avatar to fetch')
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('If the user has left, you can enter the user ID')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('userinfo')
                .setDescription('Displays detailed information about the user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user\'s info to fetch')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('serverinfo')
                .setDescription('Get information about the server')
        ),
    async execute(interaction) {
        const { client, options, member, guild } = interaction;

        if (options.getSubcommand() === 'ping') {
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('Astral Network Stats')
                .setDescription(`> **API Latency:** ${client.ws.ping}ms`)
                .setTimestamp();
            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
            });
        } else if (options.getSubcommand() === 'avatar') {
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
                .setColor('DarkBlue')
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
        } else if (options.getSubcommand() === 'serverinfo') {
            const text = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
            const voice = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
            const membersCount = guild.memberCount;
            const rolesCount = guild.roles.cache.size;
            const owner = await guild.fetchOwner();
            const createdDate = guild.createdAt.toLocaleDateString();
            const createdTimestamp = guild.createdAt.getTime();
            const serverIcon = guild.iconURL({ dynamic: true });
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle(guild.name)
                .setThumbnail(serverIcon)
                .addFields(
                    { name: 'Text Channels', value: `${text}`, inline: true },
                    { name: 'Voice Channels', value: `${voice}`, inline: true },
                    { name: 'Members', value: `${membersCount}`, inline: true },
                    { name: 'Roles', value: `${rolesCount}`, inline: true },
                    { name: 'Owner', value: `${owner}`, inline: true },
                )
                
                .addFields({ name: "Server Created", value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`, inline: true })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: false });

        } else if (options.getSubcommand() === 'userinfo') {
            const userOption = interaction.options.getUser('user');
            const user = userOption || member.user;
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle(`${user.username}'s Info`)
                .setDescription(`**Username:** ${user.username}\n**User ID:** ${user.id}\n**Display Name:** ${user.displayName}\n**User Mention:** <@${user.id}>\n**Joined Discord:** ${user.createdAt ? user.createdAt.toUTCString() : 'Unknown'}\n**Joined Server:** ${user.joinedAt ? user.joinedAt.toUTCString() : 'Unknown'}`)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp();
            await interaction.reply({ embeds: [embed]});
        };    
    }  
};
