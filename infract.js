const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infract')
        .setDescription('Issue an infraction against a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to issue the infraction to')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('punishment')
                .setDescription('Type of punishment (e.g., warning, strike, notice, etc.)')
                .setRequired(true)
                .addChoices(
                    { name: 'Warning', value: 'warning' },
                    { name: 'Strike', value: 'strike' },
                    { name: 'Notice', value: 'notice' },
                    { name: 'Termination', value: 'termination' },
                    { name: 'Blacklist', value: 'blacklist' }
                )
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the infraction')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('notes')
                .setDescription('Additional notes for the infraction')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const punishment = interaction.options.getString('punishment');
            const reason = interaction.options.getString('reason');
            const notes = interaction.options.getString('notes') || 'No additional notes provided.';

            // Create the banner embed
            const bannerEmbed = new EmbedBuilder()
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335741026333229096/Waterfront_Roleplay_Staff_Infraction_Banner.png?ex=67a14545&is=679ff3c5&hm=b5358da2e56355e8629706bbf4266c895d487b0213e0f85ba793eb9216a30a45&')
                .setColor('#2c2d31');

            // Create the embed for the infraction details
            const infractionEmbed = new EmbedBuilder()
                .setTitle('Staff Infraction')
                .setDescription(
                    '> Our management+ team has deemed it necessary to take actions against your behavior. Read below to see what punishment you have been given. If you want to appeal your infraction, open a ticket.'
                )
                .addFields(
                    { name: 'User', value: `<@${user.id}>`, inline: true },
                    { name: 'Punishment', value: punishment, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Notes', value: notes, inline: true }
                )
                .setColor('#2c2d31')
                .setImage('https://cdn.discordapp.com/attachments/1335524781252149319/1335524876479369236/blank.png?ex=67a124b7&is=679fd337&hm=d38502def3f4a1a73d8e32a7cdea288889547f8ef4ef5497f9fa06dd0d592aa8&')
                .setTimestamp();

            // Send the embeds in the same channel
            await interaction.channel.send({
                content: `<@${user.id}>`,
                embeds: [bannerEmbed, infractionEmbed]
            });

            // Acknowledge the command
            await interaction.reply({
                content: 'The infraction has been issued.',
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in infract command:', error);
            await interaction.reply({ content: 'There was an error processing your command.', ephemeral: true });
        }
    },
};


