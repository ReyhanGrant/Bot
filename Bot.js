const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const queue = new Map();
var prefix="*";
const bot=client;
const ms = require("ms");
//                                             roles
//const Humans=message.guild.roles.get("726723362360918027");
//const Ayrons=message.guild.roles.get("726722767797485592");
////const Tenebrites=message.guild.roles.get("726723092323368970");
//const Atlanteans=message.guild.roles.get("726722770741887028");
//const Magmatites=message.guild.roles.get("726722759345831956");
//const Icenites=message.guild.roles.get("726723097486688276");
//                                             roles

//                                              Functions



//                                              Functions



client.on('ready', () => {
  console.log('We are ready!');
  const Jake = client.users.cache.get('345443080654290945');
  //Jake.send("<@345443080654290945>, We are ready!")
});
//                                           SHPION
client.on('message', message=>{
  let user = message.author;
  if(message.content!="-0" && !user.bot){
  const channel = client.channels.cache.get('674272756694646789');
  //channel.send(user.tag + ' send "' + message.content+ '"');
  console.log(user.tag + ' send "' + message.content+ '"');
}
});
//                                           SHPION


//                                            MUSIC
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    //message.channel.send("You need to enter a valid command!");
  }
});
async function execute(message, serverQueue) {
  const args = message.content.split(" ");
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };
  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 1.3,
      playing: true
    };
    queue.set(message.guild.id, queueContruct);
    queueContruct.songs.push(song);
    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();}
function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
//                                                                            New Member
client.on('guildMemberAdd', member => {
  member.roles.add('641334458812727314');
  member.send("Read the rules in <#663331400778252290>")
});
//                                                                            New Member
//                                            MUSIC

client.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}hi`){
      return message.channel.send("Hello")
  }

  if(cmd === `${prefix}clear`){
      if (message.deletable) {
          message.delete();
      }

      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
          return message.reply("Missing Permissions!")
      }

      if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
          return message.reply("This is not a number")
      }

      let deleteAmount;
      if (parseInt(args[0]) > 100) {
          deleteAmount = args[0];
      } else {
          deleteAmount = parseInt(args[0]);
      }

      message.channel.bulkDelete(deleteAmount, true)
      .catch(err => message.reply(`Something went wrong... ${err}`));}});

bot.on('message', message => {
  let args = message.content.substring(prefix.length).split(" ");
if (
  message.member.hasPermission("MANAGE_ROLES") 
  ){
  switch (args[0]) {
      case 'mute':
          var guildmember  = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
          var person=guildmember
          if(!person) return  message.reply("I CANT FIND THE USER " + person)
          let time = args[2];
          if(!time){
              return message.reply("You didnt specify a time!");
          }


          guildmember.roles.remove('641334458812727314')
          guildmember.roles.add('663334444974866463');


          message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`)
          message.mentions.users.first().send(`You have been muted for ${ms(ms(time))}`);

          setTimeout(function(){
             
              guildmember.roles.add('641334458812727314')
              guildmember.roles.remove('663334444974866463');
              //console.log(role.id)
              message.channel.send(`@${person.user.tag} has been unmuted.`)
              message.mentions.users.first().send("You have been unmuted");
          }, ms(time));


 
      break;
  }
  


}
else{
  message.reply("You not administartor or moderator")
}
}
);
client.login("Njc2NDU2OTg0NDU4OTUyNzU0.XveCXQ.bfFTsCeF-cnYjQzSNwA5kBZcXW4");