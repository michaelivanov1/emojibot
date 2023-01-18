// private message a user based on if they type a trigger word
module.exports = (client, triggerText, replyText) => {
    client.on('messageCreate', message => {
        if (message.content.toLowerCase() === triggerText.toLowerCase()) 
                message.author.send(replyText);     
    });
}