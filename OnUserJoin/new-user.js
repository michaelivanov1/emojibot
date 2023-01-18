// module.exports = (client) => {
//     client.on('guildMemberAdd', member => {
//         // assign a role on join
//         var role = member.guild.roles.cache.find(role => role.name === "Member");
//         if(role) member.roles.add(role);
//         else console.log('could not assign role. check if role exists');

//         // welcome new member // numbers are channel id (#general)
//         member.guild.channels.cache.get('786083247817228299').send(`${member} joined`);
//     });
// }