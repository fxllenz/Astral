const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

const fs = require('fs');

async function execute(interaction, client) {
  try {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    const workTypes = [
      {
        name: 'manual labor',
        amountRange: [200, 500],
        messages: [
          `Looks like you've been putting in some hard work, ${username}. You earned $%AMOUNT% from your manual labor today. Keep that hustle going!`,
          `Ah, the life of a blue-collar worker. You managed to rake in $%AMOUNT% from your manual labor, ${username}. Nicely done!`,
          `${username}, you're a regular working-class hero! You earned $%AMOUNT% from your manual labor. Don't ever stop grinding.`
        ]
      },
      {
        name: 'office job',
        amountRange: [300, 800],
        messages: [
          `Nice work at the office, ${username}! You earned $%AMOUNT% from your desk job today. Keep that 9-to-5 grind up.`,
          `Looks like the corporate life is treating you well, ${username}. You managed to earn $%AMOUNT% from your office work. Well done!`,
          `${username}, you're really making that desk job pay off! You brought home $%AMOUNT% from your office duties. Keep up the good work.`
        ]
      },
      {
        name: 'freelance gig',
        amountRange: [400, 1100],
        messages: [
          `Freelancing is treating you well, ${username}! You earned $%AMOUNT% from your latest gig. Keep that entrepreneurial spirit alive!`,
          `Look at you, ${username}, the freelance master! You raked in $%AMOUNT% from your latest project. Nicely done, freelancer!`,
          `${username}, you're really killing it as a freelancer! You managed to earn $%AMOUNT%. Keep that hustle going strong.`
        ]
      },
      {
        name: 'entrepreneurial venture',
        amountRange: [500, 1500],
        messages: [
          `Wow, ${username}, your business savvy is really paying off! You earned $%AMOUNT% from your latest venture. Keep that entrepreneurial spirit high!`,
          `${username}, you're a regular business mogul! You managed to rake in $%AMOUNT% from your latest endeavors. Nicely done, boss!`,
          `Look at you, ${username}, the resident entrepreneur! You earned $%AMOUNT% from your latest project. Keep that hustle alive and well.`
        ]
      },
      {
        name: 'side hustle',
        amountRange: [250, 650],
        messages: [
          `Ah, the side hustle life. You earned $%AMOUNT% from your extra work, ${username}. Keep that grind going, my friend!`,
          `${username}, you're really making that side hustle pay off! You managed to earn $%AMOUNT%. Nicely done, hustler!`,
          `Look at you, ${username}, the master of the side gig! You raked in $%AMOUNT% from your extra work. Keep that hustle alive and kicking.`
        ]
      },
      {
        name: 'odd jobs',
        amountRange: [150, 400],
        messages: [
          `Ah, the life of a jack-of-all-trades. You earned $%AMOUNT% from your odd jobs, ${username}. Keep that versatility going, my friend!`,
          `${username}, you're really making the most of those odd jobs! You managed to earn $%AMOUNT%. Nicely done, handyman!`,
          `Look at you, ${username}, the resident handyman! You raked in $%AMOUNT% from your various odd jobs. Keep that hustle alive and well.`
        ]
      },
      {
        name: 'street performer',
        amountRange: [250, 650],
        messages: [
          `${username}, you really put on a show today! You earned $%AMOUNT% from your street performance. Keep that entertainment value high, performer!`,
          `Ah, the life of a street performer. You managed to earn $%AMOUNT%, ${username}. Your talent is truly impressive, my friend!`,
          `Look at you, ${username}, the resident street entertainer! You raked in $%AMOUNT% from your performance. Keep that showmanship going strong.`
        ]
      },
      {
        name: 'online influencer',
        amountRange: [450, 1250],
        messages: [
          `${username}, your online influence is really paying off! You earned $%AMOUNT% from your digital endeavors. Keep that social media game strong, influencer!`,
          `Ah, the life of an online influencer. You managed to rake in $%AMOUNT%, ${username}. Your digital presence is truly impressive, my friend!`,
          `Look at you, ${username}, the resident social media star! You earned $%AMOUNT% from your online work. Keep that influencer status high and mighty.`
        ]
      },
      {
        name: 'professional gamer',
        amountRange: [350, 950],
        messages: [
          `${username}, your gaming skills are really paying off! You earned $%AMOUNT% from your professional gaming endeavors. Keep that controller in hand, champion!`,
          `Ah, the life of a pro gamer. You managed to rake in $%AMOUNT%, ${username}. Your gaming prowess is truly impressive, my friend!`,
          `Look at you, ${username}, the resident gaming champion! You earned $%AMOUNT% from your professional gaming work. Keep that competitive spirit alive and kicking.`
        ]
      },
      {
        name: 'dog walker',
        amountRange: [200, 500],
        messages: [
          `${username}, you really know how to wrangle those pups! You earned $%AMOUNT% from your dog walking services. Keep those furry friends happy and healthy!`,
          `Ah, the life of a dog walker. You managed to earn $%AMOUNT%, ${username}. Your canine care skills are truly admirable, my friend!`,
          `Look at you, ${username}, the resident dog whisperer! You raked in $%AMOUNT% from your dog walking work. Keep those tails wagging with pride.`
        ]
      },
      {
        name: 'janitor',
        amountRange: [200, 500],
        messages: [
          `${username}, you really know how to keep things clean and tidy! You earned $%AMOUNT% from your janitorial work. Keep that place spotless, champion!`,
          `Ah, the life of a janitor. You managed to earn $%AMOUNT%, ${username}. Your cleaning skills are truly impressive, my friend!`,
          `Look at you, ${username}, the resident cleaning champion! You raked in $%AMOUNT% from your janitorial duties. Keep that place sparkling with pride.`
        ]
      },
      {
        name: 'delivery driver',
        amountRange: [250, 650],
        messages: [
          `${username}, you really know how to get those packages delivered! You earned $%AMOUNT% from your delivery driving. Keep those wheels turning, courier!`,
          `Ah, the life of a delivery driver. You managed to earn $%AMOUNT%, ${username}. Your transportation skills are truly admirable, my friend!`,
          `Look at you, ${username}, the resident courier extraordinaire! You raked in $%AMOUNT% from your delivery driving. Keep those packages moving with efficiency.`
        ]
      },
      {
        name: 'barista',
        amountRange: [200, 500],
        messages: [
          `${username}, you really know how to brew up a mean cup of coffee! You earned $%AMOUNT% from your barista work. Keep those caffeine levels high, my friend!`,
          `Ah, the life of a barista. You managed to earn $%AMOUNT%, ${username}. Your coffee-making skills are truly impressive, my friend!`,
          `Look at you, ${username}, the resident coffee connoisseur! You raked in $%AMOUNT% from your barista duties. Keep those customers caffeinated and happy.`
        ]
      },
      {
        name: 'retail worker',
        amountRange: [250, 650],
        messages: [
          `${username}, you really know how to provide top-notch customer service! You earned $%AMOUNT% from your retail work. Keep those customers happy and satisfied!`,
          `Ah, the life of a retail worker. You managed to earn $%AMOUNT%, ${username}. Your sales skills are truly admirable, my friend!`,
          `Look at you, ${username}, the resident retail champion! You raked in $%AMOUNT% from your customer service duties. Keep that store running smoothly and efficiently.`
        ]
      },
      {
        name: 'prostitute',
        amountRange: [250, 650],
        messages: [
          `I see you've been using your, uh, "unique" skills to earn some extra cash, ${username}. You managed to rake in $%AMOUNT% from your work. I hope you're staying safe out there.`,
          `Looks like your "services" are in demand, ${username}. You earned $%AMOUNT% from your work. Just be careful and take care of yourself, alright?`,
          `Ah, the life of a sex worker. You managed to earn $%AMOUNT%, ${username}. I know it's not the most glamorous job, but you got skill issues and cant do anything else.`
        ]
      }
    ];

    const randomWorkType = workTypes[Math.floor(Math.random() * workTypes.length)];
    const [minAmount, maxAmount] = randomWorkType.amountRange;
    const amountEarned = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

    fs.readFile('economydata.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return interaction.reply('There was an error reading the data.');
      }

      let userData = JSON.parse(data);

      if (!userData[userId]) {
        userData[userId] = {
          bank: 0,
          handheld: amountEarned,
        };
      } else {
        userData[userId].handheld += amountEarned;
      }

      fs.writeFile('economydata.json', JSON.stringify(userData, null, 4), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return interaction.reply('There was an error updating the data.');
        }

        const randomMessage = randomWorkType.messages[Math.floor(Math.random() * randomWorkType.messages.length)].replace('%AMOUNT%', amountEarned.toFixed(2));
        const embed = new EmbedBuilder()
          .setColor('White')
          .setAuthor({ name: randomMessage, iconURL: 'https://cdn.discordapp.com/attachments/1236106561944948806/1236428834090520606/8627-diamond.gif?ex=6637f995&is=6636a815&hm=38eebc5b7419504d9068c2540ad85bee421a7633ad8b0b788ee4667f20c36dfc&' });
        interaction.reply({ embeds: [embed] });
      });
    });
  } catch (error) {
    console.log(`Error processing ping command for user ${interaction.user.username}: ${error}`);
    await interaction.channel.send(`[ERROR] Oh no, my dear friend, it seems there was an issue with your request. Please try again, and I'll do my best to assist you.`);
  }
}

module.exports = {
  execute,
};