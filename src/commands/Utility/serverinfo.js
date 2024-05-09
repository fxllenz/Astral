const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get detailed information about the server')
        .setDMPermission(false),
    async execute(interaction) {
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
    },
};

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