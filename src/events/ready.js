module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`(CLIENT) Logging In...`);
    console.log(`(CLIENT) Logged In To: ${client.user.username}`);

    async function pickPresence() {
      const randomIndex = Math.floor(Math.random() * client.config.statuses.length);
      const selectedStatus = client.config.statuses[randomIndex];

      await client.user.setPresence({
        activities: [{ name: selectedStatus.name, type: selectedStatus.type }],
        status: 'online',
      });
      console.log(`(CLIENT) Status changed`);
    }

    await pickPresence();
    setInterval(pickPresence, 30000);
  },
};