const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sessionstart')
        .setDescription('Starts a session and displays session details.'),
    async execute(interaction) {
        try {
            // First embed (Updated Banner Image)
            const bannerEmbed = new EmbedBuilder()
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524902928646215/Waterfront_Roleplay_Session_Banner_2.png?ex=67a07bfd&is=679f2a7d&hm=b7137b58f960b3744692e97bf03f3a3139733d1d694e94cc55218963bb9ea0c3&')
                .setColor('2c2d31');

            // Second embed (Voting Information, Image is the same blank.png)
            const sessionEmbed = new EmbedBuilder()
                .setTitle('Session Started')
                .setDescription(
                    'The session has officially begun! Join now for an exciting and innovative roleplay experience. You must join within 15 minutes to avoid moderation.\n\n' +
                    '``🚢`` **Session Info**\n' +
                    '**Server Name**: Waterfront Roleplay\n' +
                    '**Server Owner**: Baby_Draxy\n' +
                    '**Server Code**: WaterFRP'
                )
                .setColor('2c2d31')
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a07bf7&is=679f2a77&hm=a1684051b4ecca010c373142f276567995547564a627d5cebce6f7262f24f937&');

            // Send @here mention and both embeds to the specific channel
            const targetChannel = interaction.client.channels.cache.get('1335385442752925731'); // Target the channel by ID
            await targetChannel.send({
                content: '@here', // This will ping @here
                embeds: [bannerEmbed, sessionEmbed],
            });

        } catch (error) {
            console.error('Error in sessionstart command:', error);
            await interaction.reply({ content: 'There was an error processing the session start command.', ephemeral: true });
        }
    },
};



