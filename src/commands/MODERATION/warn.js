const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');
const fs = require('fs');

function generateWarningId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let warningId = '';
    for (let i = 0; i < 6; i++) {
        warningId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return warningId;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Manage user warnings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a warning to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to warn')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the warning')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user\'s warning')
                .addStringOption(option =>
                    option.setName('warning_id')
                        .setDescription('The ID of the warning to remove')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const { options, member } = interaction;
        const subcommand = options.getSubcommand();

        if (!member.permissions.has('KICK_MEMBERS')) {
            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('Insufficient Permissions')
                .setDescription('You do not have the required permissions to use this command.')
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        if (subcommand === 'add') {
            const targetUser = options.getUser('user');
            const reason = options.getString('reason');

            const warningsData = JSON.parse(fs.readFileSync('warnings.json', 'utf8'));
            const targetWarnings = warningsData[targetUser.id] || [];
            const warningId = generateWarningId();

            const newWarning = { id: warningId, reason, timestamp: Date.now(), moderatorId: interaction.user.id };
            targetWarnings.push(newWarning);
            warningsData[targetUser.id] = targetWarnings;

            fs.writeFileSync('warnings.json', JSON.stringify(warningsData, null, 2));

            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle(`Warning for ${targetUser.username}`)
                .setDescription(`${targetUser.username} has been warned for: ${reason}\nWarning ID: \`${warningId}\`\nWarned by: ${userMention(interaction.user.id)}`)
                .setTimestamp(newWarning.timestamp);

            await interaction.reply({
              content: `${userMention(targetUser.id)}`,
                embeds: [embed],
                ephemeral: false
            });
        } else if (subcommand === 'remove') {
            const warningId = options.getString('warning_id');
            const warningsData = JSON.parse(fs.readFileSync('warnings.json', 'utf8'));

            let targetUser, targetWarning, moderatorUser;
            for (const [userId, warnings] of Object.entries(warningsData)) {
                const warning = warnings.find(w => w.id === warningId);
                if (warning) {
                    targetUser = interaction.client.users.cache.get(userId);
                    targetWarning = warning;
                    moderatorUser = interaction.client.users.cache.get(warning.moderatorId);
                    break;
                }
            }

            if (!targetWarning) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setTitle(`Warning Removal Failed`)
                    .setDescription(`The warning ID you provided is invalid.`)
                    .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false
                });
                return;
            }

            const targetUserWarnings = warningsData[targetUser.id];
            const warningIndex = targetUserWarnings.findIndex(w => w.id === warningId);

            if (warningIndex === -1) {
                const embed = new EmbedBuilder()
                    .setColor('DarkBlue')
                    .setTitle(`Warning Removal Failed`)
                    .setDescription(`The warning ID you provided is not found for ${targetUser.username}.`)
                    .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false
                });
                return;
            }

            targetUserWarnings.splice(warningIndex, 1);
            warningsData[targetUser.id] = targetUserWarnings;

            fs.writeFileSync('warnings.json', JSON.stringify(warningsData, null, 2));

            const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle(`Warning Removed`)
                .setDescription(`The warning for "${targetWarning.reason}" has been removed from ${targetUser.username}. The warning was issued by ${userMention(moderatorUser.id)}.`)
                .setTimestamp(targetWarning.timestamp);

            await interaction.reply({
              content: `${userMention(targetUser.id)}`,
                embeds: [embed],
                ephemeral: false
            });
        }
    },
};