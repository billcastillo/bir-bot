const Discord = require("discord.js");
const config = require("./config.json");
const { token } = require('./config');
const helper = require('./helper');
const { exactMessages, containsMessages, copyPasta } = require('./constants');

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "!";

// invite link: https://discord.com/oauth2/authorize?client_id=954006309286584380&permissions=8&scope=bot
// album https://imgur.com/a/1nqPe1l
// sugapa: https://i.imgur.com/plWP3NV.png
// sugapa; https://imgur.com/plWP3NV
// sugapa smol https://i.imgur.com/SllrkXp.png
// magandang lahi https://i.imgur.com/h8fOeQz.png
// bday mo: https://i.imgur.com/bsbv5vo.jpg

const channel = client.channels.cache.get('id');

client.once('ready', () => {
	console.log('Ready!');
});

const isMessageValid = function(message) {
  return exactMessages.includes(message)
}

const isContainsMessage = function(message) {
  return containsMessages.some(msg => message.includes(msg));
}

client.on("messageCreate", function(message) {
  console.log('message: ', message.content);
  if (message.author.bot) return;

  const messageObj = helper.isMessageValid(message.content);
  if (
    !message.content.startsWith(prefix) &&
    !isMessageValid(message.content) &&
    !isContainsMessage(message.content) &&
    !messageObj
  ) {
    return;
  } 

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // if (command === "ping") {
  //   const timeTaken = Date.now() - message.createdTimestamp;
  //   message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  // }

  // else if (command === "sum") {
  //   const numArgs = args.map(x => parseFloat(x));
  //   const sum = numArgs.reduce((counter, x) => counter += x);
  //   message.reply(`The sum of all the arguments you provided is ${sum}!`);
  // }

  if (message.content.includes("gold") || command === "gold") {
    const msgEmbed = new Discord.MessageEmbed();
    msgEmbed
      .setTitle('GOLD?? AKIN YAN!!!!')
      .setImage('https://i.imgur.com/SllrkXp.png')

    // message.channel.send({ embeds: [msgEmbed] });
    // message.channel.send("My Bot's message", {files: ["https://i.imgur.com/plWP3NV.png"]});
    message.reply({ embeds: [msgEmbed] });
  }

  else if (message.content === "wanted list") {
    const msgEmbed = new Discord.MessageEmbed();
    msgEmbed
      .setTitle('paki-report sa awtoridad')
      .setImage('https://i.imgur.com/IswCwxq.jpg')

    message.reply({ embeds: [msgEmbed] });
  }

  else if (message.content === "pinakamagandang lahi") {
    const msgEmbed = new Discord.MessageEmbed();
    msgEmbed
      .setImage('https://i.imgur.com/h8fOeQz.png')
    message.reply({ embeds: [msgEmbed] });
  }

  else if (message.content.startsWith("birthday ko")) {
    const msgEmbed = new Discord.MessageEmbed();
    msgEmbed
      .setImage('https://i.imgur.com/bsbv5vo.jpg')
    message.reply({ embeds: [msgEmbed] });
  }

  else {
    const msg = messageObj.message?.substring(0, 2000) || '';
    if (messageObj.isReply) {
      message.reply(msg);
    } else {      
      message.channel.send(msg);
    }
  }
});


// client.login(config.BOT_TOKEN);
client.login(token);