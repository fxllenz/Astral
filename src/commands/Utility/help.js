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
                .setDescription(`🔗 **Links:**\n[Add Astral](https://discord.com/oauth2/authorize?client_id=1236793738211233863&permissions=1375396554838&scope=bot)\n[Astral Support](https://discord.gg/UnbQujK4MV)\n\n👋 **About Astral**\n*Astral Is A Discord Bot, With Fun, Economy, Utility & More!*\n\n<a:ping:1236105773998931979> **Astral Network**\n**Bot Ping:** ${client.ws.ping}ms\n**Shard Count:** \`\`0\`\`\n**Shard ID: ** \`\`N/A\`\``)
                .setTimestamp()
                .setFooter({ text: '© | Astral Development | 2024 - 2024'})
                .setColor('DarkBlue')
        
                const embed3 = new EmbedBuilder()
                .setTitle("Utility Commands")
                .setDescription('**Command Count:** 5\n')
                .setTimestamp()
                .addFields({ name: "</help:1236794937626984465>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</ping:1236794937626984466>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</avatar:1236794937626984464>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</userinfo:1236794937807212615>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</serverinfo:1236794937626984467>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .setColor('DarkBlue')
                


                const embed4 = new EmbedBuilder()
                .setTitle("Economy Commands")
                .setColor('DarkBlue')
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
                    .setEmoji({ id: '1236798128141897771', name: 'mod', animated: false})
                    .setDescription(`Shows All Utility Commands`)
                    .setValue("support-server"),



                    new StringSelectMenuOptionBuilder()
                    .setLabel("Economy Commands")
                    .setEmoji({ id: '1236798133279658035', name: 'economy', animated: false})
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
                const e = new EmbedBuilder()
                .setColor('DarkBlue')
                .setDescription('**You Cannot Use This Select Menu**')
                await i.reply({ embeds: [e], ephemeral: true });
            }
        });
    }
}