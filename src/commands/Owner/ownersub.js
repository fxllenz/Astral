const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

const ALLOWED_USER_ID = '1156012026510966794';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Admin commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('totalservers')
                .setDescription('[Owner Only] Total Servers')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('serverinfo')
                .setDescription('[Owner Only] Serverinfo')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('systeminfo')
                .setDescription('[Owner Only] System Info')
        ),

    async execute(interaction) {
        const { member, options } = interaction;
        const subcommand = options.getSubcommand();

        if (member.user.id !== ALLOWED_USER_ID) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('**You are not authorized to use this command**');
            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'totalservers') {
            const totalServers = interaction.client.guilds.cache.size;
            return interaction.reply(`Total servers: ${totalServers}`);
        }
        if (subcommand === 'serverinfo') {
            const guilds = interaction.client.guilds.cache;
            const inviteLinks = [];
        for (const guild of guilds) {
            try {
                const invite = await guild.invites.create(guild.systemChannel, {
                    unique: true,
                    maxUses: 1,
                    maxAge: 0,
                });
                inviteLinks.push(`Server: ${guild.name} - Invite: ${invite.url}`);
            } catch (error) {
                console.error(`Error generating invite for server "${guild.name}":`, error.message);
            }
        }
            const content = inviteLinks.length > 0 ? inviteLinks.join('\n') : 'No invite links generated';
            return interaction.reply({ content: `${content}`, ephemeral: true });
        }

        if (subcommand === 'systeminfo') {
            const em = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTitle('System Info')
                .setDescription(`**Platform:** ${os.platform()}\n**Architecture:** ${os.arch()}\n**CPU Model:** ${os.cpus()[0].model}\n**Total Memory:** ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)}GB\n**Free Memory:** ${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)}GB`);
            return interaction.reply({ embeds: [em] });
        }
    },
};
