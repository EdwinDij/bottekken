const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  GuildChannelManager,
} = require("discord.js");
const dbConnect = require("./config/database");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  dbConnect;
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const command = client.commands.get(interaction.commandName);
//   console.log(interaction.commandName);
//   if (!command) return;

//   try {
//     // Vérifier les autorisations avant d'exécuter la commande
//     if (
//       command.permissions &&
//       !interaction.member.permissions.has(command.permissions)
//     ) {
//       await interaction.reply({
//         content: "Vous n'avez pas la permission d'utiliser cette commande.",
//         ephemeral: true,
//       });
//       return;
//     }

//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content:
//           "Une erreur s'est produite lors de l'exécution de cette commande!",
//         ephemeral: true,
//       });
//     } else {
//       await interaction.reply({
//         content:
//           "Une erreur s'est produite lors de l'exécution de cette commande!",
//         ephemeral: true,
//       });
//     }
//   }
// });
// Login
client.login(process.env.TOKEN_DISCORD);
