module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.logger.debug(`(CLIENT) Logging In...`);
    client.logger.info(`(CLIENT) Logged In To: ${client.user.username}`);

    async function pickPresence() {
      const randomIndex = Math.floor(Math.random() * client.config.statuses.length);
      const selectedStatus = client.config.statuses[randomIndex];

      await client.user.setPresence({
        activities: [{ name: selectedStatus.name, type: selectedStatus.type }],
        status: 'online',
      });
    }

    await pickPresence();
    setInterval(pickPresence, 30000);
  },
};