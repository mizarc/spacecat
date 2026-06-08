import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';
import type { BotCommand, CommandParameter } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandsDir = join(__dirname, 'commands');
const HASH_FILE = resolve(__dirname, '..', '..', 'data', '.command-hash.json');

/**
 * Map our CommandParameterType to the correct SlashCommandBuilder method.
 */
function addOption(builder: SlashCommandBuilder, opt: CommandParameter): void {
  const cb = (sub: any) => {
    sub.setName(opt.name);
    sub.setDescription(opt.description);
    if (opt.required !== undefined) sub.setRequired(opt.required);
    if (opt.minValue !== undefined) sub.setMinValue(opt.minValue);
    if (opt.maxValue !== undefined) sub.setMaxValue(opt.maxValue);
    return sub;
  };

  switch (opt.type) {
    case 'string':    builder.addStringOption(cb); break;
    case 'integer':   builder.addIntegerOption(cb); break;
    case 'number':    builder.addNumberOption(cb); break;
    case 'boolean':   builder.addBooleanOption(cb); break;
    case 'user':      builder.addUserOption(cb); break;
    case 'channel':   builder.addChannelOption(cb); break;
    case 'role':      builder.addRoleOption(cb); break;
    case 'mentionable': builder.addMentionableOption(cb); break;
    case 'attachment': builder.addAttachmentOption(cb); break;
  }
}

/**
 * Dynamically discover all command files and return their SlashCommandBuilder definitions.
 */
async function buildSlashCommands(): Promise<SlashCommandBuilder[]> {
  const builders: SlashCommandBuilder[] = [];

  async function loadFromDirectory(dirPath: string): Promise<void> {
    const files = readdirSync(dirPath);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        await loadFromDirectory(filePath);
        continue;
      }

      const ext = extname(file);
      if ((ext !== '.ts' && ext !== '.js') || file.endsWith('.test.ts') || file.endsWith('.test.js')) {
        continue;
      }

      try {
        const fileUrl = pathToFileURL(filePath).href;
        const module = await import(fileUrl);

        const commandName = file.replace(/\.(ts|js)$/, '');
        const exportKey = `${commandName.charAt(0).toUpperCase()}${commandName.slice(1)}Command`;
        const command: BotCommand | undefined = module[exportKey];

        if (command?.name) {
          const builder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

          if (command.parameters) {
            for (const opt of command.parameters) {
              addOption(builder, opt);
            }
          }

          builders.push(builder);
        }
      } catch (error) {
        console.error(`[DEPLOY] Failed to load command from ${file}:`, error);
      }
    }
  }

  await loadFromDirectory(commandsDir);
  return builders;
}

/**
 * Compute a SHA-256 hash of the serialised command definitions.
 */
function computeHash(builders: SlashCommandBuilder[]): string {
  const payload = builders.map(b => b.toJSON());
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Read the previously stored hash from disk (if any).
 */
function readStoredHash(): string | null {
  try {
    if (existsSync(HASH_FILE)) {
      const data = JSON.parse(readFileSync(HASH_FILE, 'utf-8'));
      return data.hash ?? null;
    }
  } catch {
    // Ignore — treat missing/corrupt file as "never deployed"
  }
  return null;
}

/**
 * Write the current hash to disk so future starts can skip re-deploying.
 */
function writeStoredHash(hash: string): void {
  try {
    writeFileSync(HASH_FILE, JSON.stringify({ hash, updatedAt: new Date().toISOString() }, null, 2), 'utf-8');
  } catch (error) {
    console.error('[DEPLOY] Failed to write command hash:', error);
  }
}

/**
 * Deploy slash commands to Discord if they have changed since the last deployment.
 * Called automatically on bot startup when the Discord adapter is active.
 */
export async function deployCommands(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_ID;

  if (!token || !clientId) {
    console.log('[DEPLOY] Skipping — DISCORD_TOKEN or DISCORD_ID not set.');
    return;
  }

  console.log('[DEPLOY] Discovering commands...');
  const builders = await buildSlashCommands();

  if (builders.length === 0) {
    console.log('[DEPLOY] No commands found — nothing to deploy.');
    return;
  }

  const newHash = computeHash(builders);
  const storedHash = readStoredHash();

  if (storedHash === newHash) {
    console.log('[DEPLOY] Commands unchanged — skipping deployment.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const payload = builders.map(b => b.toJSON());

  console.log(`[DEPLOY] Registering ${payload.length} slash command(s)...`);

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: payload });
    writeStoredHash(newHash);
    console.log('[DEPLOY] Slash commands deployed successfully.');
  } catch (error) {
    console.error('[DEPLOY] Failed to deploy slash commands:', error);
  }
}
