/*
    dependencies for bot to work:
    1) node.js 
    2) npm i to install discord.js, nodemon, dotenv

    create a .env file & set token/prefix
    ex:
        token = "tokenhere"
        prefix = "!" 
    
to run:
    type: nodemon index.js in root folder
*/


// required imports
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
require('dotenv').config();

// surpress too many listeners warning 
client.setMaxListeners(15);

// class imports
const command = require('./Commands/command');
const privateMessage = require('./PrivateMessages/private-message');
// const onUserJoin = require('./OnUserJoin/new-user');
// when new user joins
// onUserJoin(client);

// client, triggerText, replyText
privateMessage(client, 'test', 'd');

client.on('ready', () => {
    // client.user.setActivity("!help", { type: "WATCHING" }); // STREAMING, WATCHING, PLAYING, COMPETING (default is playing)
    client.user.setActivity("!help");
    console.log('Emoji bot online');

    command(client, ['help', 'commands'], message => {
        message.channel.send(`
        **Servers Commands:**
        
**EVERYONE**     
!emoji {text}
!emoji -animals
!emoji -food

!membercount
!userinfo
!help
!jefferydog

**ADMIN**
!botstatus
!kick
!ban
!mute 
!unmute
!clearchat
        `);
    });


    // command to list server member count (including bot)
    command(client, 'membercount', (message) => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has ${guild.memberCount} members`);
        });
    });

    // jeffery dog ...
    command(client, 'jefferydog', message => {
        message.channel.send(`i telled you not copy jeffery dog but you copy him anyway even though Christmas time! 
Jeffery dog only gotted clothes for Christmas and you only clothes too! I tell you no copy Jeffrey dog but you copy anyway 
I have no choice I must extermination of copy. If you no stop copy jefrey dog I will ban you from this discord. do not temp 
me I already ban person who speak Spanish to me say Nani. if ban you not stop you copy jefrey dog on Christmas time, 
you’re life = done`);
    });

    // can only delete messages that are under 14 days old  
    command(client, ['cc', 'clearchat'], message => {
        const { member } = message;
        const tag = `<@${member.id}>`;
        if (message.member.permissions.has('ADMINISTRATOR')) {
            async function clear() {
                message.delete();
                const fetched = await message.channel.messages.fetch({ limit: 99 });
                message.channel.bulkDelete(fetched);
            }
            clear();
        } else {
            message.channel.send(`${tag} no perms to use command`);
        }
    });

    // change the bots status 
    command(client, 'botstatus', message => {
        const { member } = message;
        const tag = `<@${member.id}>`;
        if (message.member.permissions.has('ADMINISTRATOR')) {
            // access the text after !status 
            const content = message.content.replace('!botstatus ', '');
            if (content != '!botstatus') {
                client.user.setPresence({
                    activity: {
                        name: content,
                        type: 0,
                    },
                })
                message.channel.send('bot status updated');
            } else {
                message.channel.send(`${tag} usage: !botstatus {status}`);
            }
        } else {
            message.channel.send(`${tag} no perms to use command`);
        }
    });

    // ban
    command(client, 'ban', message => {
        // destructor member and mentions from the message 
        const { member, mentions } = message;
        const tag = `<@${member.id}>`;
        if (member.permissions.has('ADMINISTRATOR') || member.permissions.has('BAN_MEMBERS')) {
            const target = mentions.users.first();
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id);
                targetMember.ban();
                message.channel.send(`${targetMember} has been banned`);
            } else {
                message.channel.send(`${tag} tag someone to ban`);
            }
        } else {
            message.channel.send(`${tag} no perms to use command`);
        }
    });

    // kick
    command(client, 'kick', message => {
        // destructor member and mentions from the message 
        const { member, mentions } = message;
        const tag = `<@${member.id}>`;
        if (member.permissions.has('ADMINISTRATOR') || member.permissions.has('KICK_MEMBERS')) {
            const target = mentions.users.first();
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id);
                targetMember.kick();
                message.channel.send(`${targetMember} has been kicked`);
            } else {
                message.channel.send(`${tag} tag someone to kick`);
            }
        } else {
            message.channel.send(`${tag} no perms to use command`);
        }
    });

    // mute 
    command(client, 'mute', message => {
        const { member } = message;
        const tag = `<@${member.id}>`;
        if (message.member.permissions.has('ADMINISTRATOR')) {
            const target = message.mentions.members.first();
            if (target) {
                const mutedRole = message.guild.roles.cache.find((role) => role.name === 'Muted');
                if (!mutedRole) return message.channel.send(`${tag} could not assign muted role. check if role exists`);
                else {
                    target.roles.add(mutedRole);
                    message.channel.send(`${target} has been muted`);
                }
            }
            else message.channel.send(`${tag} tag a user to mute`);
        } else {
            message.channel.send(`${tag} no perms to use command`);
        }
    });

    // unmute
    command(client, 'unmute', message => {
        const { member } = message;
        const tag = `<@${member.id}>`;
        if (message.member.permissions.has('ADMINISTRATOR')) {
            const target = message.mentions.members.first();
            if (target) {
                const mutedRole = message.guild.roles.cache.find((role) => role.name === 'Muted');
                if (!mutedRole) return message.channel.send(`${tag} could not find muted role. check if role exists`);
                else {
                    target.roles.remove(mutedRole);
                    message.channel.send(`${target} has been unmuted`);
                }
            }
            else message.channel.send(`${tag} tag a user to unmute`);
        } else {
            message.channel.send(`${tag} no perms to use command`);
        }
    });

    // command to convert text to discord emoji's
    command(client, 'emoji', message => {

        // all discord emojis: https://getemoji.com/#animals-nature

        if (message.content == '!emoji -animals') {
            message.channel.send(`🐶 🐱 🐭 🐹 🐰 🦊 🐼 🐻 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 
🐧 🐦🐤🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 
🦈 🐊 🐅 🐆 🦓 🦍 🦧 🦣 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🦬 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐈‍ 🐓 🦃 🦚 🦜 🦢 🦩 🕊 🐇 
🦝 🦨 🦡 🦫 🦦 🦥 🐁 🐀 🐿 🦔 🐾 🐉 🐲`);
        }
        else if (message.content == '!emoji -food') message.channel.send(`🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 
🥬 🥒 🌶 🌽 🥕 🧄 🧅 🥔 🍠 🥐 🥯 🍞 🥖 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🦴 🌭 🍔 🍟 🍕 🫓 🥪 🥙 🧆 🌮 🌯 🥗 🥘 🥫 
🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 🍼 ☕️ 🍵 🧃 🥤
🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🧉 🍾 🧊 🥄 🍴 🍽 🥣 🥡 🥢 🧂`);
        else {
            let letterArray = [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let afterEmoji = [' ', ':regional_indicator_a: ', ':regional_indicator_b: ', ':regional_indicator_c: ', ':regional_indicator_d: ',
                ':regional_indicator_e: ', ':regional_indicator_f: ', ':regional_indicator_g: ', ':regional_indicator_h: ', ':regional_indicator_i: ',
                ':regional_indicator_j: ', ':regional_indicator_k: ', ':regional_indicator_l: ', ':regional_indicator_m: ', ':regional_indicator_n: ',
                ':regional_indicator_o: ', ':regional_indicator_p: ', ':regional_indicator_q: ', ':regional_indicator_r: ', ':regional_indicator_s: ',
                ':regional_indicator_t: ', ':regional_indicator_u: ', ':regional_indicator_v: ', ':regional_indicator_w: ', ':regional_indicator_x: ',
                ':regional_indicator_y: ', ':regional_indicator_z: ', ':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:',
                ':eight:', ':nine:'];
            // get rid of !emoji 
            const afterCommand = message.content.replace('!emoji ', '');

            var newArray = [];
            newArray.push(afterCommand);

            // split each character into individual elements
            var splitArray = newArray.toString();
            var finalArray = [];

            // check to see if input isn't empty 
            if (splitArray != '!emoji') {
                for (let i = 0; i < splitArray.length; i++) {
                    // push spaces to finalArray 
                    if (splitArray[i].includes(letterArray[0])) finalArray.push(afterEmoji[0]);

                    // return character code
                    var charCode = splitArray.charCodeAt(i);

                    // uppercase chars (65-90)
                    for (var k = 65; k < 91; k++) {
                        if (charCode == k) {
                            for (var j = 1; j < letterArray.length; j++) {
                                // push corresponding emoji onto finalArray
                                if (splitArray[i].includes(letterArray[j].toUpperCase())) finalArray.push(afterEmoji[j]);
                            }
                        }
                    }

                    // lowercase chars (97-122)
                    for (var k = 97; k < 123; k++) {
                        if (charCode == k) {
                            for (var j = 1; j < letterArray.length; j++) {
                                // push corresponding emoji onto finalArray
                                if (splitArray[i].includes(letterArray[j])) finalArray.push(afterEmoji[j]);
                            }
                        }
                    }

                    // numbers
                    for (var k = 48; k < 58; k++) {
                        if (charCode == k) {
                            for (var j = 1; j < letterArray.length; j++) {
                                // push corresponding emoji onto finalArray
                                if (splitArray[i].includes(letterArray[j])) finalArray.push(afterEmoji[j]);
                            }
                        }
                    }

                    // random symbols 
                    for (var k = 33; k < 48; k++) {
                        if (charCode == k) finalArray.push(splitArray[i]);
                    }

                    for (var k = 58; k < 65; k++) {
                        if (charCode == k) finalArray.push(splitArray[i]);
                    }

                    for (var k = 91; k < 97; k++) {
                        if (charCode == k) finalArray.push(splitArray[i]);
                    }

                    for (var k = 123; k < 256; k++) {
                        if (charCode == k) finalArray.push(splitArray[i]);
                    }
                } // end for
                message.channel.send(finalArray.join(''));
            } else {
                message.channel.send('usage: !emoji {text}');
            }
        }
    });

    // command to view any users basic info
    // command(client, ['userinfo', 'uinfo'], message => {

    //     const { member } = message;
    //     const tag = `<@${member.id}>`;

    //     var user = message.mentions.users.first();
    //     var members = message.guild.member(message.mentions.users.first());

    //     if (user) {
    //         var discordCreated = new Date(user.createdTimestamp).toLocaleDateString();
    //         var joinedServer = new Date(members.joinedAt).toLocaleDateString();
    //         const info = new Discord.MessageEmbed()
    //             .setColor("BLUE")
    //             .setTitle(user.tag)
    //             .setDescription(`Info from ${message.guild.name}`)
    //             .setThumbnail(user.avatarURL({ dynamic: true }))
    //             .setFooter('requested at: ')
    //             .setTimestamp()
    //             .addFields(
    //                 {
    //                     name: `User ID`,
    //                     value: user.id,
    //                     inline: false
    //                 },
    //                 {
    //                     name: `Member Info`,
    //                     value: `\nAccount created: ${discordCreated}\nJoined server: ${joinedServer}`,
    //                     inline: false
    //                 },
    //                 {
    //                     name: `Roles`,
    //                     value: members.roles.cache.map(roles => roles).join(' | ') + "",
    //                     inline: false
    //                 },
    //             )
    //         return message.channel.send(info);
    //     } else message.channel.send(`${tag} usage: !userinfo {@user}`);
    // });
});

// log the bot in 
client.login(process.env.token);