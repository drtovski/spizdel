const { CommandInteraction, Client, InteractionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
    run: async (client, interaction) => {
        
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;
            
            const embed = new EmbedBuilder()
            .setColor('Red')
            
            if (command.botPerms) {
              if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                embed.setDescription(`I don't have **\`${command.botPerms}\`** permission in ${interaction.channel.toString()} to execute this **\`${command.name}\`** command.`);
                return interaction.reply({ embeds: [embed] });
              }
            }

            if (command.userPerms) {
              if (!interaction.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                embed.setDescription(`You don't have **\`${command.userPerms}\`** permission in ${interaction.channel.toStrinf()} to execute this **\`${command.name}\`** command.`);
                return interaction.reply({ embeds: [embed] });
              }
            } 
            
            const player = interaction.client.manager.get(interaction.guildId);
            if (command.player && !player) {
                if (interaction.replied) {
                    return await interaction.editReply({ content: `There is no player for this guild.`, ephemeral: true
                    }).catch(() => { });
                } else {
                    return await interaction.reply({
                        content: `There is no player for this guild.`, ephemeral: true
                    }).catch(() => { });
                }
            }
            if (command.inVoiceChannel && !interaction.member.voice.channel) {
                if (interaction.replied) {
                    return await interaction.editReply({
                        content: `You must be in a voice channel!`, ephemeral: true
                    }).catch(() => { });
                } else {
                    return await interaction.reply({
                        content: `You must be in a voice channel!`, ephemeral: true
                    }).catch(() => { });
                }
            }
            if (command.sameVoiceChannel) {
                if (interaction.guild.members.me.voice.channel) {
                    if (interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
                        return await interaction.reply({
                            content: `You must be in the same ${interaction.guild.members.me.voice.channel.toString()} to use this command!`, ephemeral: true
                        }).catch(() => { });
                    }
                }
            }
            

            try {
                await command.run(client, interaction, prefix);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                } else {
                    await interaction.reply({
                        ephemeral: true,
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                }
                console.error(error);
            };
            
        } 

        
    }
};
