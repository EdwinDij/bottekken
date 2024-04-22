import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { dbConnect } from "./config/database.js";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
dbConnect;
client.login(process.env.TOKEN_DISCORD);
