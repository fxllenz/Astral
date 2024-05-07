const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js')
const ping = require('./subcommands/ping')
const embed = require('./subcommands/embed')
const useri = require('./subcommands/user-info')
const calculator = require('./subcommands/calculator')
const sinfo = require('./subcommands/serverinfo')
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
                .setName('embed')
                .setDescription('generate beutiful embeds')
        )
      .addSubcommand(subcommand =>
          subcommand
              .setName('calculator')
              .setDescription('a calculator within discord?!!')
      )
       
        .addSubcommand(subcommand =>
            subcommand
                .setName('user-info')
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
  
        if (options.getSubcommand() === 'calculator') {
          calculator.execute(interaction, client)
        } else 
          if (options.getSubcommand() === 'embed') {
            embed.execute(interaction, client)
          } else 
        if (options.getSubcommand() === 'ping') {
          ping.execute(interaction, client)
        } else if (options.getSubcommand() === 'user-info') {
          useri.execute(interaction,client)
            
        } else if (options.getSubcommand() === 'serverinfo') {
            sinfo.execute(interaction, client)
        }     
    }  
};