require('dotenv').config();

// 3 params: instance of the bot, command name/aliases, what happens when someone runs the command 
module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') aliases = [aliases]

    client.on('messageCreate', message => {
        const { content } = message;
        // if i want to create a chat filter
        // console.log(content);

        aliases.forEach(alias => {
            const command = `${process.env.prefix}${alias}`

            if (content.startsWith(`${command} `) || content === command) {
                console.log(`running command ${command}`);
                callback(message);
            }
        });
    });
}