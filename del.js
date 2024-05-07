const { REST, Routes } = require('discord.js');


const rest = new REST({ version: '9' }).setToken(process.env.Token);

async function deleteAllGlobalCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    // Fetch all global commands
    const commands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));

    // Delete each command
    for (const command of commands) {
      await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command.id));
      console.log(`Deleted command: ${command.name}`);
    }

    console.log('Successfully deleted all global commands.');
  } catch (error) {
    console.error(error);
  }
}

deleteAllGlobalCommands();