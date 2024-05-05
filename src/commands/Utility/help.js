const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, PermissionsBitField, ComponentType, StringSelectMenuOptionBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ Feeling A Little Lost?'),
    async execute (interaction, client) {
        const { options } = interaction;
                const icon = "https://cdn.discordapp.com/attachments/1205662250158006343/1221682980125413436/standard.gif?ex=661377f0&is=660102f0&hm=bb95425cea57b5f402214971ed8bc0fc149594ae65e90f866589a7fb9b77833a&";
        
                const startEmbed = new EmbedBuilder()
                .setTitle(`❓ Help Menu`)
                .setDescription(' ')
                .setTimestamp()
                .setColor('White')
        
                const embed3 = new EmbedBuilder()
                .setTitle("Utility Commands")
                .setDescription('**Command Count:** 5')
                .setTimestamp()
                .addFields({ name: "/help", value: `shows this message`, inline: true})
                .addFields({ name: "/ping", value: `shows the bots ping`, inline: true})
                .addFields({ name: "/avatar", value: `shows a users avatar`, inline: true})
                .addFields({ name: "/userinfo", value: `shows info about a user`, inline: true})
                .addFields({ name: "/serverinfo", value: `shows info about a server`, inline: true})
                .setColor('White')
                


                const embed4 = new EmbedBuilder()
                .setTitle("Economy Commands")
                .setColor('White')
                .setDescription('**Command Count:** 6')
                .setTimestamp()
                .addFields({ name: "<a:emoji_1:1236500252215873687> /work", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /beg", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /deposit", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /withdraw", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /bet", value: ` `, inline: true})
                .addFields({ name: "<a:emoji_1:1236500252215873687> /balance", value: ` `, inline: true})




                const select = new StringSelectMenuBuilder()
                .setCustomId("guild")
                .setPlaceholder("Select A Category")
                .addOptions(

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Utility Commands")
                    .setEmoji('🛠')
                    .setDescription(`Shows All Utility Commands`)
                    .setValue("support-server"),



                    new StringSelectMenuOptionBuilder()
                    .setLabel("Economy Commands")
                    .setEmoji({ id: '1236500252215873687', name: 'emoji_1', animated: true})
                    .setDescription(`Shows All Economy Commands`)
                    .setValue("economy-cmds"),
                )
        
                    const row = new ActionRowBuilder().addComponents(select)
        
                    const msg = await interaction.reply({
                        embeds: [startEmbed],
                        components: [row]
                    })
        
                    const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect });
        			collector.on('collect', async (i) => {
            			if (i.customId === 'guild' && i.user.id === interaction.user.id) {
                			const selectedValue = i.values[0];

                			let responseEmbed;

                			switch (selectedValue) {
                                case 'economy-cmds':
                        			responseEmbed = embed4;
                        		break;
                    			case 'support-server':
                       				responseEmbed = embed3;
                        		break;
                    			default:
                        			responseEmbed = startEmbed;
                        		break;
                		}

                await i.update({ embeds: [responseEmbed], components: [row] });
            } else {
                await i.reply({ content: 'You Cannot Use This Select Menu.', ephemeral: true });
            }
        });
    }
}