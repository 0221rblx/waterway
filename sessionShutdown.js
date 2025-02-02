const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
            const message = await interaction.channel.send({
                embeds: [bannerEmbed, shutdownEmbed],
            });

            // Create a button with the custom emoji
            const sessionButton = new ButtonBuilder()
                .setCustomId('session_shutdown_button')
                .setEmoji('<:Sessions:1332818899867013272>') // Replace with your custom emoji
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(sessionButton);

            // Send the button to the channel
            await message.edit({
                content: 'Click the button to proceed with the session shutdown.',
                components: [row],
            });

            // Track the number of clicks by the user
            const buttonClicks = new Map();  // Maps user IDs to the number of button clicks

            const filter = i => i.customId === 'session_shutdown_button';
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                const userId = i.user.id;
                if (!buttonClicks.has(userId)) {
                    buttonClicks.set(userId, 0);
                }

                buttonClicks.set(userId, buttonClicks.get(userId) + 1);

                const clickCount = buttonClicks.get(userId);

                if (clickCount === 1) {
                    // Grant the user the role upon first click
                    const role = interaction.guild.roles.cache.find(r => r.name === 'Session Ping'); // Replace with actual role name
                    const member = interaction.guild.members.cache.get(userId);

                    if (member && role) {
                        await member.roles.add(role);
                        await i.reply({
                            content: `You've been granted the "Session Ping" role.`,
                            ephemeral: true,
                        });
                    } else {
                        await i.reply({
                            content: 'Could not find the role or the member.',
                            ephemeral: true,
                        });
                    }

                } else if (clickCount === 2) {
                    // Prompt for removing the role after second click
                    const yesButton = new ButtonBuilder()
                        .setCustomId('yes_remove_role')
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Success);

                    const noButton = new ButtonBuilder()
                        .setCustomId('no_remove_role')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger);

                    const rowButtons = new ActionRowBuilder().addComponents(yesButton, noButton);

                    await i.reply({
                        content: 'You clicked the button twice! Do you want to remove your role?',
                        components: [rowButtons],
                        ephemeral: true,
                    });

                    const responseFilter = response => ['yes_remove_role', 'no_remove_role'].includes(response.customId) && response.user.id === userId;
                    const responseCollector = i.channel.createMessageComponentCollector({ filter: responseFilter, time: 15000, max: 1 });

                    responseCollector.on('collect', async response => {
                        if (response.customId === 'yes_remove_role') {
                            const role = interaction.guild.roles.cache.find(r => r.name === 'Session Ping'); // Replace with actual role name
                            const member = interaction.guild.members.cache.get(userId);
                            if (member && role) {
                                await member.roles.remove(role);
                                await response.reply({
                                    content: `Your "Session Ping" role has been removed.`,
                                    ephemeral: true,
                                });
                            } else {
                                await response.reply({
                                    content: 'Could not find your role or user.',
                                    ephemeral: true,
                                });
                            }
                        } else {
                            await response.reply({
                                content: 'Role removal canceled.',
                                ephemeral: true,
                            });
                        }
                    });

                    buttonClicks.delete(userId);  // Reset the click count after the response
                } else {
                    // If more than two clicks, reset
                    buttonClicks.delete(userId);
                }
            });

            await interaction.reply({ content: 'The session has been shut down and all members have been notified.', ephemeral: true });
        } catch (error) {
            console.error('Error in sessionshutdown command:', error);
            await interaction.reply({ content: 'There was an error processing the session shutdown command.', ephemeral: true });
        }
    },
