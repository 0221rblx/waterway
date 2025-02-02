const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sessionshutdown')
        .setDescription('Shuts down the current session and notifies members.'),
    async execute(interaction) {
        try {
            // Banner embed (Shutting Down Session)
            const bannerEmbed = new EmbedBuilder()
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524885799243777/Waterfront_Roleplay_Session_Banner_5.png?ex=67a07bf9&is=679f2a79&hm=f7f601cd0fe7ca0e3d03783531b22c9fd1d076e4b7383cd22f00fb757a49c1c9&')
                .setColor('2c2d31');

            // Session shutdown details
            const shutdownEmbed = new EmbedBuilder()
                .setTitle('Session Shutdown')
                .setDescription(
                    'The server has officially been shut down! Thank you to all who participated. We hope you enjoyed the experience and we will see you in the next one!'
                )
                .setColor('2c2d31')
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a07bf7&is=679f2a77&hm=a1684051b4ecca010c373142f276567995547564a627d5cebce6f7262f24f937&');

            // Send the banner embed and shutdown info to the channel
            await interaction.channel.send({
                embeds: [bannerEmbed, shutdownEmbed],
            });

            await interaction.reply({ content: 'The session has been shut down and all members have been notified.', ephemeral: true });

        } catch (error) {
            console.error('Error in sessionshutdown command:', error);
            await interaction.reply({ content: 'There was an error processing the session shutdown command.', ephemeral: true });
        }
    },
};

