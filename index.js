const Discord = require('discord.js')
const config = require('./config.json')
const { token } = require('./config')
const helper = require('./helper')
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require('@discordjs/voice')
const { exactMessages, containsMessages } = require('./constants')

const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'],
})

const DAMAudioFiles = ['dam.mp3', 'dam2.mp3', 'dam3.mp3', 'dam4.mp3']

const playDAM = (member) => {
  const guildID = member.guild.id
  const channelID = member.voice.channelId

  const connection = joinVoiceChannel({
    channelId: channelID,
    guildId: guildID,
    adapterCreator: member.guild.voiceAdapterCreator,
  })

  const audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  })
  // Subscribe the connection to the audio player (will play audio on the voice connection)
  const subscription = connection.subscribe(audioPlayer)

  // // subscription could be undefined if the connection is destroyed!
  // if (subscription) {
  //   // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
  //   setTimeout(() => subscription.unsubscribe(), 5_000)
  // }

  const randomAudioFile = helper.getRandomMessage(DAMAudioFiles)
  const resource = createAudioResource(`audio/${randomAudioFile}`, {
    inlineVolume: true,
  })

  resource.volume.setVolume(0.5)
  audioPlayer.play(resource)

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connection.destroy()
  })
}

// play sound
// disconnect from voice
// connection.destroy();

const prefix = '!'

// invite link: https://discord.com/oauth2/authorize?client_id=954006309286584380&permissions=8&scope=bot
// album https://imgur.com/a/1nqPe1l
// sugapa: https://i.imgur.com/plWP3NV.png
// sugapa; https://imgur.com/plWP3NV
// sugapa smol https://i.imgur.com/SllrkXp.png
// magandang lahi https://i.imgur.com/h8fOeQz.png
// bday mo: https://i.imgur.com/bsbv5vo.jpg

// const channel = client.channels.cache.get('id');

client.once('ready', () => {
  console.log('Ready!')
})

const isMessageValid = function (message) {
  return exactMessages.includes(message)
}

const isContainsMessage = function (message) {
  return containsMessages.some((msg) => message.includes(msg))
}

// client.on('guildMemberAdd', function(member) {
// 	const generalChannel = member.guild.channels.cache.find(channel => channel.name === 'general');
// 	const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome') || generalChannel;

// 	if (!welcomeChannel) return;

// 	const memberID = member.user.id;
// 	const mentionMember = `<@${memberID}>`;
// 	const randomWelcomeMessage = helper.getRandomMessage(welcomeMessage);

// 	welcomeChannel.send(`${mentionMember} ${randomWelcomeMessage}`);
// });

client.on('messageCreate', function (message) {
  console.log('message: ', message.content)
  if (message.author.bot) return

  const messageObj = helper.isMessageValid(message.content.toLowerCase())
  if (
    !message.content.startsWith(prefix) &&
    !isMessageValid(message.content.toLowerCase()) &&
    !isContainsMessage(message.content.toLowerCase()) &&
    !messageObj
  ) {
    return
  }

  if (message.content.includes('dam')) {
    console.log('joinned')
    playDAM(message.member)
  }

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()

  // message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);

  if (message.content.includes('gold') || command === 'gold') {
    const msgEmbed = new Discord.MessageEmbed()
    msgEmbed
      .setTitle('GOLD?? AKIN YAN!!!!')
      .setImage('https://i.imgur.com/SllrkXp.png')

    if (helper.isRandomSuccess(20)) {
      message.reply({ embeds: [msgEmbed] })
    }
  } else if (message.content === 'wanted list') {
    const msgEmbed = new Discord.MessageEmbed()
    msgEmbed
      .setTitle('paki-report sa awtoridad')
      .setImage('https://i.imgur.com/IswCwxq.jpg')

    message.reply({ embeds: [msgEmbed] })
  } else if (message.content === 'pinakamagandang lahi') {
    const msgEmbed = new Discord.MessageEmbed()
    msgEmbed.setImage('https://i.imgur.com/h8fOeQz.png')
    message.reply({ embeds: [msgEmbed] })
  } else if (command === 'birthday') {
    const msgEmbed = new Discord.MessageEmbed()
    msgEmbed.setImage('https://i.imgur.com/bsbv5vo.jpg')
    message.reply({ embeds: [msgEmbed] })
  } else {
    const msg = helper.formatMessage(messageObj)

    if (msg) {
      if (messageObj.isReply) {
        message.reply(msg)
      } else {
        message.channel.send(msg)
      }

      console.log('reply:', msg)
    }
  }
})

// client.login(config.BOT_TOKEN);
client.login(token)
