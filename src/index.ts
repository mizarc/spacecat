import { startDiscordBot } from './adapters/discord.js';

console.log("🚀 Spacecat is launching...");

// Validate tokens
if (!process.env.DISCORD_TOKEN) {
  console.error(process.env.DISCORD_TOKEN);
  console.error("DISCORD_TOKEN is missing");
  process.exit(1);
}

// Start the adapters
startDiscordBot();
console.log("✅ Discord adapter connected.");