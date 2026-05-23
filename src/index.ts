import { startDiscordBot } from './adapters/discord.js';
import { startFluxerBot } from './adapters/fluxer.js';

console.log("Spacecat is starting...");

// Validate tokens
if (!process.env.DISCORD_TOKEN || !process.env.FLUXER_TOKEN) {
  console.error("Missing required tokens in .env");
  process.exit(1);
}

// Start multiple adapters
startDiscordBot();
startFluxerBot();

console.log("All adapters connected.");  