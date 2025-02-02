const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sessionstart')
        .setDescription('Starts a session and displays session details.'),
    async execute(interaction) {
        try {
            // Fetch data from the PRC API
            const response = await fetch(`https://api.policeroleplay.community/v1/server`, {
                headers: {
                    "Server-Key": process.env.serverToken
                }
            });
            const data = await response.json();

            // Check for rate-limiting or errors
            if (data.message) {
                if (data.message === 'You are being rate limited!') {
                    return interaction.reply(`Error: You are being rate limited! Retry in ${data.retry_after} seconds.`);
                }
                if (data.message !== "Success") {
                    return interaction.reply(`Error: ${data.message}`);
                }
            }

            // Extract necessary information
            const pcc = data.CurrentPlayers || 0;  // Current player count
            const serverName = "Waterfront Roleplay";  // Example server name
            const serverOwner = "Baby_Draxy";  // Example owner
            const serverCode = "WaterFRP";  // Example server code

            // Get current timestamp for "Last Updated"
            const currentTime = Math.floor(Date.now() / 1000);  // Get current time in seconds

            // First embed (Updated Banner Image)
            const bannerEmbed = new EmbedBuilder()
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524902928646215/Waterfront_Roleplay_Session_Banner_2.png?ex=67a07bfd&is=679f2a7d&hm=b7137b58f960b3744692e97bf03f3a3139733d1d694e94cc55218963bb9ea0c3&')
                .setColor('2c2d31');

            // Second embed (Session Info with Player Count)
            const sessionEmbed = new EmbedBuilder()
                .setTitle('Session Started')
                .setDescription(
                    `The session has officially begun! Join now for an exciting and innovative roleplay experience. You must join within 15 minutes to avoid moderation.\n\n` +
                    `Player Count: **${pcc}**\n\n` + 
                    '``🚢`` **Session Info**\n' +
                    `**Server Name**: ${serverName}\n` +
                    `**Server Owner**: ${serverOwner}\n` +
                    `**Server Code**: ${serverCode}`
                )
                .setColor('2c2d31')
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a07bf7&is=679f2a77&hm=a1684051b4ecca010c373142f276567995547564a627d5cebce6f7262f24f937&')
                .addFields({ name: 'Last Updated', value: `<t:${currentTime}:R>` }); // Add "Last Updated" field

            // Send @here mention and both embeds to the specific channel
            const targetChannel = interaction.client.channels.cache.get('1335385442752925731'); // Target the channel by ID
            const message = await targetChannel.send({
                content: '@here || <@1335385325681250498>', // This will ping @here
                embeds: [bannerEmbed, sessionEmbed],
            });

            // Update the embed every 2 minutes
            setInterval(async () => {
                try {
                    // Fetch updated data from the PRC API every 2 minutes
                    const updateResponse = await fetch(`https://api.policeroleplay.community/v1/server`, {
                        headers: {
                            "Server-Key": process.env.serverToken
                        }
                    });
                    const updateData = await updateResponse.json();

                    // Check if the data is valid
                    if (updateData.message && updateData.message !== "Success") {
                        console.log(`Error: ${updateData.message}`);
                        return;
                    }

                    // Extract the updated player count
                    const updatedPcc = updateData.CurrentPlayers || 0;

                    // Get updated timestamp for "Last Updated"
                    const updatedTime = Math.floor(Date.now() / 1000);  // Get updated time in seconds

                    // Create the updated embed with the new "Last Updated" field
                    const updatedSessionEmbed = new EmbedBuilder()
                        .setTitle('Session Started')
                        .setDescription(
                            `The session has officially begun! Join now for an exciting and innovative roleplay experience. You must join within 15 minutes to avoid moderation.\n\n` +
                            `Player Count: **${updatedPcc}**\n\n` + 
                            '``🚢`` **Session Info**\n' +
                            `**Server Name**: ${serverName}\n` +
                            `**Server Owner**: ${serverOwner}\n` +
                            `**Server Code**: ${serverCode}`
                        )
                        .setColor('2c2d31')
                        .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a07bf7&is=679f2a77&hm=a1684051b4ecca010c373142f276567995547564a627d5cebce6f7262f24f937&')
                        .addFields({ name: 'Last Updated', value: `<t:${updatedTime}:R>` }); // Update "Last Updated" field

                    // Update the message embed with the new player count and timestamp
                    await message.edit({
                        content: '@here || <@1335385325681250498>', // Ping @here again if desired
                        embeds: [bannerEmbed, updatedSessionEmbed],
                    });
                } catch (updateError) {
                    console.error('Error updating session information:', updateError);
                }
            }, 120000); // 2 minutes in milliseconds

        } catch (error) {
            console.error('Error in sessionstart command:', error);
            await interaction.reply({ content: 'There was an error processing the session start command.', ephemeral: true });
        }
    },
};

