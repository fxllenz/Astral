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
                .setDescription('**Command Count:** 7')
                .setTimestamp()
                .addFields({ name: "</help:1236794937626984465>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</ping:1237517673877868576>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</avatar:1237517673877868575>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</userinfo:1237517673877868578>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</serverinfo:1237517673877868577>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</member-count:1237526017325928458>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</afk-set:1237588829494313060>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
              
                .setColor('DarkBlue')
                


                const embed4 = new EmbedBuilder()
                .setTitle("Economy Commands")
                .setColor('DarkBlue')
                .setDescription('**Command Count:** 6')
                .setTimestamp()
                .addFields({ name: "</work:1236794937626984463>", value: `**Status:** <:on:1236814914656407562>`, inline: true})
                .addFields({ name: "</beg:1236794937626984459>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</deposit:1236794937626984461>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</withdraw:1236794937626984462>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</bet:1236794937626984460>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</balance:1236794937626984458>", value: `**Status:** <:on:1236814914656407562> `, inline: true})


                const fun = new EmbedBuilder()
                .setTitle("Fun Commands")
                .setColor('DarkBlue')
                .setDescription('**Command Count:** 4')
                .setTimestamp()
                .addFields({ name: "</howgay:1237478186669834293>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</random-number:1237480302709047316>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</8ball:1237532348715761756>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                .addFields({ name: "</weather:1237555843449229363>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
                


                const owner = new EmbedBuilder()
                .setTitle("Owner Commands")
                .setColor('DarkBlue')
                .setDescription('**Command Count:** 1')
                .setTimestamp()
                .addFields({ name: "</systeminfo:1237545231415644200>", value: `**Status:** <:on:1236814914656407562> `, inline: true})
               
                



                const select = new StringSelectMenuBuilder()
                .setCustomId("guild")
                .setPlaceholder("Select A Category")
                .addOptions(

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Home Page")
                    .setEmoji({ id: '1237589752870338560', name: 'home', animated: false})
                    .setDescription(`Go Back To The Home Page`)
                    .setValue("home"),

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Utility Commands")
                    .setEmoji({ id: '1236798128141897771', name: 'mod', animated: false})
                    .setDescription(`Shows All Utility Commands`)
                    .setValue("support-server"),


                    new StringSelectMenuOptionBuilder()
                    .setLabel("Fun Commands")
                    .setEmoji({ id: '1237521479390986311', name: 'fun', animated: false})
                    .setDescription(`Shows All Fun Commands`)
                    .setValue("fun"),


                  


                    new StringSelectMenuOptionBuilder()
                    .setLabel("Economy Commands")
                    .setEmoji({ id: '1236798133279658035', name: 'economy', animated: false})
                    .setDescription(`Shows All Economy Commands`)
                    .setValue("economy-cmds"),



                    new StringSelectMenuOptionBuilder()
                    .setLabel("Owner Commands")
                    .setEmoji({ id: '1236798125885096119', name: 'owner', animated: false})
                    .setDescription(`Shows The Commands Only The Owner Can Use`)
                    .setValue("owner"),
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
                                case 'fun':
                       				responseEmbed = fun;
                        		break;

                                case 'owner':
                       				responseEmbed = owner;
                        		break;
                                case 'home':
                       				responseEmbed = startEmbed;
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