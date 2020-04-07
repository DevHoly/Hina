import { MessageEmbed } from 'discord.js'
import * as moment from 'moment'
module.exports.run = async (prefix, cmd, client, args, message) => {
    let user = message.mentions.members.first()
    if(!user) { user = message.member }

    let compare = (a, b) => {
        if (a.position > b.position) return -1;
        if (a.position < b.position) return 1;
        return 0;
    }

    let embed = new MessageEmbed()
    .setTitle(user.user.username)
    .setColor("#3b7fff")
    .addField("Name + Tag", user.user.tag, true)
    .addField("ID", user.id, true)
    .addField("Status", user.user.presence.status, true)
    if(user.user.presence.activities != false) {
        embed.addField("Game", user.user.presence.activities)
    } else {
        embed.addField("Game", "-")
    }
    embed.addField(await client.string(message.guild.id, "userinfo.roles"), user.roles.cache.sort(compare).map(roles => roles).join(", ").substr(0, 900) || `-`, false)
    embed.addField(await client.string(message.guild.id, "userinfo.created"), moment(user.joinedAt).format("dddd, Do MMMM YYYY, HH:mm:ss"),)
    .setFooter(await client.string(message.guild.id, "requested") + message.author.username)
    .setTimestamp()
    return message.channel.send(embed)
}