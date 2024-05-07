const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("\x1b[31m%s\x1b[0m", '(CLIENT)', '\x1b[37m\x1b[0m', `Logged In...`);
        console.log("\x1b[31m%s\x1b[0m", '(CLIENT)', '\x1b[37m\x1b[0m', `Logged Into: ${client.user.username}`);

        const statuses = [
            { name: `/help - ${client.guilds.cache.size} Servers`, type: ActivityType.Watching },
            { name: `/help - Astral Dev Team`, type: ActivityType.Watching },
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
