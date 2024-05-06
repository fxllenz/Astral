require('dotenv').config();

module.exports = (client) => {
  return {
    Token: process.env.Token,
    clientId: process.env.CLIENT_ID,
    statuses: [
      { name: `/help - ${client.guilds.cache.size} Servers`, type: 3 },
      { name: `/help - ${client.users.cache.size} Users`, type: 3 }
    ],
    color: '#ffffff',
    
  };
};
/*
<======status======>
v14 v14 value
ActivityType.Competing 5
ActivityType.Custom 4
ActivityType.Listening 2
ActivityType.Playing 0
ActivityType.Streaming 1
ActivityType.Watching 3
*/
