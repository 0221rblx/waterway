const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sessionvote')
        .setDescription('Starts a vote to begin an ER:LC session.'),

    async execute(interaction) {
        try {
            // First embed (Banner Only)
            const bannerEmbed = new EmbedBuilder()
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524902505156678/Waterfront_Roleplay_Session_Banner_1.png?ex=67a07bfd&is=679f2a7d&hm=9e114fdf746ce0576f8d309f4a1e03ac1d16e1d68df43b5619f32dc9151882d8&')
                .setColor('2c2d31');

            // Second embed (Voting)
            const voteEmbed = new EmbedBuilder()
                .setTitle('Session Vote')
                .setDescription(
                    'Our staff team has deemed it necessary to initiate a session vote! Vote if you want to experience innovative roleplays! 5 votes are required to initiate a session.\n' +
                    '**Total Votes**: 0\n\n' +
                    '``🏎️`` **Server Info**\n' +
                    '**Server Name**: Waterfront Roleplay\n' +
                    '**Server Owner**: Baby_Draxy\n' +
                    '**Server Code**: WaterFRP'
                )
                .setColor('2c2d31')
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a07bf7&is=679f2a77&hm=a1684051b4ecca010c373142f276567995547564a627d5cebce6f7262f24f937&');

            // Voting Button
            const voteButton = new ButtonBuilder()
                .setCustomId('vote')
                .setLabel('Vote')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(voteButton);

            // Send the initial message with @everyone ping
            const targetChannel = interaction.client.channels.cache.get('1335385442752925731');
            const message = await targetChannel.send({
                content: '@everyone || <@1335385325681250498>',
                embeds: [bannerEmbed, voteEmbed],
                components: [row]
            });

            // Set to track users who have voted
            const votedUsers = new Set();
            let voteCount = 0;
            const voteThreshold = 2; // Change this to 5 to require 5 votes

            // Button interaction collector
            const filter = i => i.customId === 'vote' && i.message.id === message.id;
            const collector = targetChannel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (votedUsers.has(i.user.id)) {
                    await i.reply({ content: 'You have already voted! You cannot remove your vote after voting.', ephemeral: true });
                    return;
                }

                // Register vote
                votedUsers.add(i.user.id);
                voteCount++;

                await i.reply({ content: `✅ You voted! **Total Votes: ${voteCount}**`, ephemeral: true });

                // Update the embed with the new vote count
                const updatedVoteEmbed = new EmbedBuilder()
                    .setTitle('Session Vote')
                    .setDescription(
                        'Our staff team has deemed it necessary to initiate a session vote! Vote if you want to experience innovative roleplays! 5 votes are required to initiate a session.\n' +
                        `**Total Votes**: ${voteCount}\n\n` +
                        '``🏎️``**Server Info**\n' +
                        '**Server Name**: Waterfront Roleplay\n' +
                        '**Server Owner**: Baby_Draxy\n' +
                        '**Server Code**: WaterFRP'
                    )
                    .setColor('2c2d31')
                    .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a07bf7&is=679f2a77&hm=a1684051b4ecca010c373142f276567995547564a627d5cebce6f7262f24f937&');

                if (voteCount >= voteThreshold) {
                    // Disable the vote button
                    const disabledVoteButton = new ButtonBuilder()
                        .setCustomId('vote')
                        .setLabel('Vote')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);

                    const rowDisabled = new ActionRowBuilder().addComponents(disabledVoteButton);

                    // Edit message to disable button
                    await message.edit({
                        embeds: [bannerEmbed, updatedVoteEmbed],
                        components: [rowDisabled]
                    });

                    // Notify the server that the session will begin
                    await message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription('**Thanks for voting!** The session will commence in a moment.')
                                .setColor('2c2d31')
                        ]
                    });

                    collector.stop(); // Stop collecting votes once threshold is met
                } else {
                    // Continue updating the vote count in the original message
                    await message.edit({ embeds: [bannerEmbed, updatedVoteEmbed] });
                }
            });

        } catch (error) {
            console.error('Error in sessionvote command:', error);
            await interaction.reply({ content: 'There was an error processing your vote command.', ephemeral: true });
        }
    },
};



