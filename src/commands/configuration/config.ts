import { Message, MessageEmbed } from "discord.js";
import { IHinaClient } from "../../hina/HinaClient";

module.exports.run = async (prefix: string, cmd: string, client: IHinaClient, args: string[], message: Message) => {
    const db = client.con;
    if (!message.member.hasPermission("MANAGE_GUILD")) {
        const embed = new MessageEmbed()
            .setTitle(`Hina - Config: ${message.guild.name}`)
            .setColor("#3b7fff")
            .setDescription(await client.string(message.guild.id, "noperms"))
            .setFooter(await client.string(message.guild.id, "requested") + message.author.username)
            .setTimestamp();
        return message.channel.send(embed);
    }
    const values = ["set", "delete"];
    const values2 = ["modlog", "welcomechannel", "leavechannel", "welcomemessage", "leavemessage"];
    const value = args[0];
    const value2 = args[1];
    if (!values.includes(value)) {
        db.query("SELECT * FROM `settings` WHERE id = ?", [message.guild.id], async (error, result) => {
            console.log(error);
            if (result.length === 0) {
                const embed = new MessageEmbed()
                    .setTitle(`Hina - Config: ${message.guild.name}`)
                    .setColor("#3b7fff")
                    .setDescription(await client.string(message.guild.id, "config.info"))
                    .setThumbnail(message.guild.iconURL())
                    .addField("Modlog", "None")
                    .addField("WelcomeChannel", "None")
                    .addField("LeaveChanel", "None")
                    .addField("WelcomeMessage", "none")
                    .addField("LeaveMessage", "none")
                    .setFooter(await client.string(message.guild.id, "requested") + message.author.username)
                    .setTimestamp();
                db.query("INSERT INTO settings (id) VALUES(?)", [message.guild.id]);
                return message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                    .setTitle(`Hina - Config: ${message.guild.name}`)
                    .setColor("#3b7fff")
                    .setDescription(await client.string(message.guild.id, "config.info"))
                    .setThumbnail(message.guild.iconURL())
                    .addField("Modlog", result[0].modlog)
                    .addField("WelcomeChannel", result[0].welcomechannel)
                    .addField("LeaveChanel", result[0].leavechannel)
                    .addField("WelcomeMessage", result[0].welcomemessage)
                    .addField("LeaveMessage", result[0].leavemessage)
                    .setFooter(await client.string(message.guild.id, "requested") + message.author.username)
                    .setTimestamp();
                return message.channel.send(embed);
            }
        });
    } else {
        if (!values2.includes(value2)) { return message.channel.send(await client.string(message.guild.id, "config.error")); }
        db.query("SELECT * FROM `settings` WHERE id = ?", [message.guild.id], async (error, result) => {
            if (result.length !== 1) {
                if (value.includes("set")) {
                    if (value2.includes("modlog")) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const text = message.mentions.channels.first();
                        if (!text) { return message.channel.send(await client.string(message.guild.id, "config.nochannel")); }
                        db.query("INSERT INTO settings (id, modlog) VALUES(?, ?)", [message.guild.id, text.id]);
                        return message.react("✅");
                    }
                    if (value2.includes("welcomechannel")) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const text = message.mentions.channels.first();
                        if (!text) { return message.channel.send(await client.string(message.guild.id, "config.nochannel")); }
                        db.query("INSERT INTO settings (id, welcomechannel) VALUES(?, ?)", [message.guild.id, text.id]);
                        return message.react("✅");
                    }
                    if (value2.includes("leavechannel")) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const text = message.mentions.channels.first();
                        if (!text) { return message.channel.send(await client.string(message.guild.id, "config.nochannel")); }
                        db.query("INSERT INTO settings (id, leavechannel) VALUES(?, ?)", [message.guild.id, text.id]);
                        return message.react("✅");
                    }
                    const text = args.slice(2).join(" ");
                    db.query("INSERT INTO settings (id, " + value2 + ") VALUES(?, ?)", [message.guild.id, text]);
                    return message.react("✅");
                } else {
                    if (value2.includes("modlog")) {

                        db.query("INSERT INTO settings (id, modlog) VALUES(?, ?)", [message.guild.id, "none"]);
                        return message.react("✅");
                    }
                    if (value2.includes("welcomechannel")) {

                        db.query("INSERT INTO settings (id, welcomechannel) VALUES(?, ?)", [message.guild.id, "none"]);
                        return message.react("✅");
                    }
                    if (value2.includes("leavechannel")) {

                        db.query("INSERT INTO settings (id, leavechannel) VALUES(?, ?)", [message.guild.id, "none"]);
                        return message.react("✅");
                    }

                    db.query("INSERT INTO settings (id, " + value2 + ") VALUES(?, ?)", [message.guild.id, "none"]);
                    return message.react("✅");
                }
            } else {

                if (value.includes("set")) {
                    if (value2.includes("modlog")) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const text = message.mentions.channels.first();
                        if (!text) { return message.channel.send(await client.string(message.guild.id, "config.nochannel")); }
                        db.query("UPDATE settings SET modlog = ? WHERE id = ?", [text.id, message.guild.id]);
                        return message.react("✅");
                    }
                    if (value2.includes("welcomechannel")) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const text = message.mentions.channels.first();
                        if (!text) { return message.channel.send(await client.string(message.guild.id, "config.nochannel")); }
                        db.query("UPDATE settings SET welcomechannel = ? WHERE id = ?", [text.id, message.guild.id]);
                        return message.react("✅");
                    }
                    if (value2.includes("leavechannel")) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const text = message.mentions.channels.first();
                        if (!text) { return message.channel.send(await client.string(message.guild.id, "config.nochannel")); }
                        db.query("UPDATE settings SET leavechannel = ? WHERE id = ?", [text.id, message.guild.id]);
                        return message.react("✅");
                    }
                    const text = args.slice(2).join(" ");
                    if (!text) { return message.channel.send(await client.string(message.guild.id, "config.notext")); }
                    db.query("UPDATE settings SET " + value2 + " = ? WHERE id = ?", [text, message.guild.id]);
                    return message.react("✅");
                } else {
                    if (value2.includes("modlog")) {

                        db.query("UPDATE settings SET modlog = ? WHERE id = ?", ["none", message.guild.id]);
                        return message.react("✅");
                    }
                    if (value2.includes("welcomechannel")) {

                        db.query("UPDATE settings SET welcomechannel = ? WHERE id = ?", ["none", message.guild.id]);
                        return message.react("✅");
                    }
                    if (value2.includes("leavechannel")) {

                        db.query("UPDATE settings SET leavechannel = ? WHERE id = ?", ["none", message.guild.id]);
                        return message.react("✅");
                    }
                    db.query("UPDATE settings SET " + value2 + " WHERE id = ?", ["none", message.guild.id]);
                    return message.react("✅");
                }
            }
        });
    }
};
