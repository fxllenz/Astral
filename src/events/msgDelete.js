const { WebhookClient, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(deletedMessage, webhookURL) {
        if (deletedMessage.author) {
            let messageContent = `**Message Deleted**\n`;
            messageContent += `Author: ${deletedMessage.author.tag}\n`;
            messageContent += `Content: ${deletedMessage.content}\n`;

            if (deletedMessage.attachments.size > 0) {
                const attachment = deletedMessage.attachments.first();
                messageContent += `Image: ${attachment.url}\n`;
            }
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(messageContent);
            const webhookURL = 'https://discord.com/api/webhooks/';
            const webhook = new WebhookClient({ url: webhookURL });
            webhook.send({ embeds: [embed] })
                .catch(error => console.error('Error sending deleted message log:', error));
        }
    },
};
