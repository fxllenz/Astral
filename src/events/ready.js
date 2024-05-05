const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`(CLIENT) Logging In...`);
        console.log(`(CLIENT) Logged In To: ${client.user.username}`);

        const statuses = [
            { name: `/help - ${client.guilds.cache.size} Servers`, type: ActivityType.Watching },
            { name: `/help - ${client.users.cache.size} Users`, type: ActivityType.Watching },
            { name: `/help - 24/7 Music Bot`, type: ActivityType.Watching }
        ];

        function pickPresence() {
            const randomIndex = Math.floor(Math.random() * statuses.length);
            const selectedStatus = statuses[randomIndex];

            client.user.setPresence({
                activities: [{ name: selectedStatus.name, type: selectedStatus.type }],
                status: 'online'
            });
        }

        pickPresence();
        setInterval(pickPresence, 5000);
    },
};
