const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const executor = interaction.member; // The person running the command
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);

            // Check if the executor has the "High Rank" role
            if (!executor.roles.cache.some(role => role.name === "High Rank")) {
                return await interaction.reply({ 
                    content: '❌ You do not have permission to use this command.', 
                    ephemeral: true 
                });
            }

            // Check if the target is valid and if they are in the server
            if (!targetMember) {
                return await interaction.reply({
                    content: '❌ This user is not in the server.', 
                    ephemeral: true 
                });
            }

            // Check if the target user has a higher role than the executor
            if (targetMember.roles.highest.position >= executor.roles.highest.position) {
                return await interaction.reply({
                    content: '❌ You cannot ban a user with a higher or equal role than yours.', 
                    ephemeral: true 
                });
            }

            // Create the DM embed
            const dmEmbed = new EmbedBuilder()
                .setTitle('You have been banned')
                .setDescription('You have been banned from the server. Details below:')
                .addFields(
                    { name: 'Server', value: interaction.guild.name, inline: false },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setColor('#ff0000')
                .setTimestamp();

            // Attempt to DM the user
            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Could not send DM to user:', error);
            }

            // Ban the user from the server
            await targetMember.ban({ reason });

            // Send the confirmation message in the server
            await interaction.channel.send({
                content: `🚨 **${user.tag}** has been banned from the server.`
            });

        } catch (error) {
            console.error('Error in ban command:', error);
            await interaction.reply({ content: '❌ There was an error processing your command.', ephemeral: true });
        }
    },
};
