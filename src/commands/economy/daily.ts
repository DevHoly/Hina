import { MessageEmbed } from 'discord.js'
module.exports.run = async (prefix, cmd, client, args, message) => {
    let reward = 500
    let db = client.con;
    let user = message.author
    let embed = new MessageEmbed()
    .setTitle(await client.string(message.guild.id, "daily.title"))
    .setColor("#3b7fff")
    .setDescription(await client.string(message.guild.id, "daily.get"))
    .setFooter(await client.string(message.guild.id, "requested") + message.author.username)
    .setTimestamp()

    let embed1 = new MessageEmbed()
    .setTitle(await client.string(message.guild.id, "daily.title"))
    .setColor("#3b7fff")
    .setDescription(await client.string(message.guild.id, "daily.already"))
    .setFooter(await client.string(message.guild.id, "requested") + message.author.username)
    .setTimestamp()

    db.query("SELECT * FROM `cooldowns` WHERE id = ? LIMIT 1", [user.id], async (error, result) => {
        if(!result[0]){
            let date = new Date();
            db.query("INSERT INTO `cooldowns` (id, date) VALUES (?, ?)", [user.id, date])
            db.query("SELECT * FROM credits WHERE id = ? LIMIT 1;", [user.id], (error, result) => {
                if(result.length == 0){

                    db.query("INSERT INTO credits(id, credits) VALUES(?, ?)", [user.id, reward])
                    message.channel.send(embed)
                } else {
                    db.query("SELECT * FROM credits WHERE id = ? LIMIT 1;", [user.id], (error, result) => {
                    db.query("UPDATE credits SET credits = ? WHERE id = ?", [result[0]["credits"] + reward, user.id]);
                    message.channel.send(embed)
                    })
                }
            })
            
        } else {
            let difference = new Date().getTime() - result[0].date;
            if(difference >= 86400000) {
                db.query("SELECT * FROM credits WHERE id = ? LIMIT 1;", [user.id], (error, result) => {
                db.query("UPDATE cooldowns SET date = ? WHERE id = ?", [new Date(), user.id]);
                db.query("UPDATE credits SET credits = ? WHERE id = ?", [result[0]["credits"] + reward, user.id]);
                message.channel.send(embed)
                })

            } else {
                message.channel.send(embed1)
            }
        }
    });
}