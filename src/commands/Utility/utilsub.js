const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
const axios = require('axios');
const { translate } = require("bing-translate-api");

const languages = [
    { name: "Arabic", value: "ar" },
    { name: "Chinese (Simplified)", value: "zh" },
    { name: "English", value: "en" },
    { name: "French", value: "fr" },
    { name: "German", value: "de" },
    { name: "Hindi", value: "hi" },
    { name: "Italian", value: "it" },
    { name: "Japanese", value: "ja" },
    { name: "Korean", value: "ko" },
    { name: "Portuguese (Brazil)", value: "pt" },
    { name: "Russian", value: "ru" },
    { name: "Spanish", value: "es" },
    { name: "Turkish", value: "tr" },
    { name: "Vietnamese", value: "vi" },
    { name: "Chinese (Traditional)", value: "zh-TW" },
    { name: "Dutch", value: "nl" },
    { name: "Greek", value: "el" },
    { name: "Hebrew", value: "he" },
    { name: "Indonesian", value: "id" },
    { name: "Malay", value: "ms" },
    { name: "Polish", value: "pl" },
    { name: "Romanian", value: "ro" },
    { name: "Swedish", value: "sv" },
    { name: "Thai", value: "th" },
    { name: "Ukrainian", value: "uk" },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription(`Various subcommands for different functionalities`)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription(`Fetch a user's avatar from the server`)
                .addUserOption(option => option
                    .setName('user')
                    .setDescription(`The user's avatar to fetch`)
                    .setRequired(false)
                )
                .addStringOption(option => option
                    .setName('id')
                    .setDescription(`If the user has left, you can enter the user ID`)
                    .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('member-count')
                .setDescription('Get Server Member Count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription(`Get The Bot's Latency`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('serverinfo')
                .setDescription('Get detailed information about the server')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('translate')
                .setDescription("Translate text from one language to another")
                .addStringOption(option => option.setName("text").setDescription("The text to translate").setRequired(true))
                .addStringOption(option => option.setName("source_language").setDescription("The language to translate from").setRequired(true).addChoices(...languages))
                .addStringOption(option => option.setName("target_language").setDescription("The language to translate to").setRequired(true).addChoices(...languages))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('userinfo')
                .setDescription('Get detailed information about a user')
                .addUserOption(option => option.setName('user').setDescription('The user to get information about').setRequired(false))
        ),
    async execute(interaction) {
        const { options } = interaction;

        switch (options.getSubcommand()) {
            case 'avatar':
                await fetchAvatar(interaction);
                break;
            case 'member-count':
                await getMemberCount(interaction);
                break;
            case 'ping':
                await getPing(interaction);
                break;
            case 'serverinfo':
                await getServerInfo(interaction);
                break;
            case 'translate':
                await translateText(interaction);
                break;
            case 'userinfo':
                await getUserInfo(interaction);
                break;
            default:
                await interaction.reply('Unknown subcommand.');
        }
    },
};

async function fetchAvatar(interaction) {
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
}

async function getMemberCount(interaction) {
    const { guild } = interaction;
    const membersCount = guild.memberCount;

    const embed = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle(`${guild.name} Total Members`)
        .setDescription(`> ${membersCount}`)
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: false });
}

async function getPing(interaction) {
    const { client, options, member } = interaction;
    const embed = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle('Astral Network Stats')
        .setDescription(`> **API Latency:** ${client.ws.ping}ms\n`)
        .setTimestamp();
    await interaction.reply({
        embeds: [embed],
        ephemeral: false
    });
}

async function getServerInfo(interaction) {
    const { guild } = interaction;
    const textChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
    const membersCount = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size || 0;
    const idleMembers = guild.members.cache.filter(member => member.presence?.status === 'idle').size || 0;
    const dndMembers = guild.members.cache.filter(member => member.presence?.status === 'dnd').size || 0;
    const offlineMembers = membersCount - onlineMembers - idleMembers - dndMembers;
    const botsCount = guild.members.cache.filter(member => member.user.bot).size || 0;
    const rolesCount = guild.roles.cache.size;
    const owner = await guild.fetchOwner() || null;
    const createdDate = guild.createdAt.toLocaleDateString();
    const serverIcon = guild.iconURL({ dynamic: true }) || null;
    const serverRegion = guild.region || 'Unknown';
    const verificationLevel = guild.verificationLevel.toString().replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
    const features = getFormattedFeatures(guild.features);
    const boostLevel = guild.premiumTier ? `Tier ${guild.premiumTier}` : 'None';
    const boostCount = guild.premiumSubscriptionCount || 0;

    const embed = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle(`Server Information for ${guild.name}`)
        .setDescription(`This server was created on ${createdDate}.`)
        .setThumbnail(serverIcon || undefined)
        .addFields(
            { name: 'Text Channels', value: `${textChannels}`, inline: true },
            { name: 'Voice Channels', value: `${voiceChannels}`, inline: true },
            { name: 'Members', value: `${membersCount} (Online: ${onlineMembers}, Offline: ${offlineMembers}, Idle: ${idleMembers}, DND: ${dndMembers})`, inline: true },
            { name: 'Bots', value: `${botsCount}`, inline: true },
            { name: 'Roles', value: `${rolesCount}`, inline: true },
            { name: 'Owner', value: `${owner ? owner.user.tag : 'Unknown'}`, inline: true },
            { name: 'Region', value: `${serverRegion}`, inline: true },
            { name: 'Verification Level', value: `${verificationLevel}`, inline: true },
            { name: 'Features', value: `${features}`, inline: true },
            { name: 'Boost Level', value: `${boostLevel}`, inline: true },
            { name: 'Boosts', value: `${boostCount}`, inline: true },
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: false });
}

async function translateText(interaction) {
    const inputText = interaction.options.getString("text");
    const sourceLanguage = interaction.options.getString("source_language");
    const targetLanguage = interaction.options.getString("target_language");

    try {
        const { translation, language } = await translate(inputText, sourceLanguage, targetLanguage);
        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setAuthor({ name: `${interaction.user.username} says`, iconURL: interaction.user.avatarURL() })
            .addFields(
                { name: 'Original Text', value: inputText, inline: false },
                { name: 'Translated Text', value: translation, inline: false },
                { name: 'Detected Language', value: language.from, inline: false },
                { name: 'Translated To', value: language.to, inline: false }
            );
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error translating text:", error);
        await interaction.reply("Failed to translate your text");
    }
}

async function getUserInfo(interaction) {
    const { options } = interaction;
    const targetUser = options.getUser('user') || interaction.user;

    try {
        const [userResponse, guildMember] = await Promise.all([
            axios.get(`https://japi.rest/discord/v1/user/${targetUser.id}`),
            interaction.guild.members.fetch(targetUser.id),
        ]);

        const userData = userResponse.data.data;
        const { username, discriminator, id, created_at, avatarURL, bannerURL } = userData;
        const { joinedAt, roles, presence } = guildMember;

        const presenceStatus = presence?.status || 'offline';

        const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTitle(`${username}#${discriminator}`)
            .setThumbnail(avatarURL)
            .setImage(bannerURL)
            .addFields(
                { name: 'ID', value: id, inline: true },
                { name: 'Nickname', value: guildMember.nickname || 'None', inline: true },
                { name: 'Joined Server', value: moment(joinedAt).format('LLLL'), inline: true },
                { name: 'Created At', value: moment(created_at).format('LLLL'), inline: true },
                { name: 'Roles', value: roles.cache.map(role => role.toString()).join(', ') || 'None', inline: false },
                { name: 'Presence', value: getPresenceStatus(presenceStatus), inline: true },
            )
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar (128px)')
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetUser.displayAvatarURL({ size: 128 })),
                new ButtonBuilder()
                    .setLabel('Avatar (256px)')
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetUser.displayAvatarURL({ size: 256 })),
                new ButtonBuilder()
                    .setLabel('Avatar (512px)')
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetUser.displayAvatarURL({ size: 512 })),
                new ButtonBuilder()
                    .setLabel('Avatar (1024px)')
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetUser.displayAvatarURL({ size: 1024 })),
            );

        if (bannerURL) {
            row.addComponents(
                new ButtonBuilder()
                    .setLabel('Banner')
                    .setStyle(ButtonStyle.Link)
                    .setURL(bannerURL)
            );
        }

        await interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error('Error fetching user information:', error);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🖼・User Information')
                    .setDescription('An error occurred while fetching the user\'s information.')
                    .setColor('Red')
            ]
        });
    }
}

function getPresenceStatus(status) {
    const statusMap = {
        online: '🟢 Online',
        idle: '🟡 Idle',
        dnd: '🔴 Do Not Disturb',
        offline: '⚫ Offline',
    };

    return statusMap[status] || '⚫ Offline';
}

function getFormattedFeatures(features) {
    const featureMap = {
        ANIMATED_ICON: 'Animated Icon',
        BANNER: 'Banner',
        COMMERCE: 'Commerce',
        COMMUNITY: 'Community',
        DISCOVERABLE: 'Discoverable',
        FEATURABLE: 'Featurable',
        INVITE_SPLASH: 'Invite Splash',
        MEMBER_VERIFICATION_GATE_ENABLED: 'Member Verification Gate Enabled',
        NEWS: 'News Channel',
        PARTNERED: 'Partnered',
        PREVIEW_ENABLED: 'Preview Enabled',
        PRIVATE_THREADS: 'Private Threads',
        ROLE_ICONS: 'Role Icons',
        SEVEN_DAY_THREAD_ARCHIVE: '7-Day Thread Archive',
        THREAD_CREATION: 'Thread Creation',
        TICKETED_EVENTS: 'Ticketed Events',
        VANITY_URL: 'Vanity URL',
        VERIFIED: 'Verified',
        VIP_REGIONS: 'VIP Regions',
        WELCOME_SCREEN_ENABLED: 'Welcome Screen Enabled',
    };

    return features.map(feature => featureMap[feature] || feature).join(', ') || 'None';
}
