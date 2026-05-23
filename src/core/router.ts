import type { BotCommand, UnifiedMessage } from './types.js';
import { PingCommand } from './commands/ping.js';

const commands = new Map<string, BotCommand>();
commands.set(PingCommand.name, PingCommand);

/**
 * The Router: Now handles both text-based parsing and pre-parsed slash commands.
 */
export async function handleIncomingMessage(
  message: UnifiedMessage, 
  isSlashCommand: boolean = false
) {
  let commandName = '';
  let args: string[] = [];

  if (isSlashCommand) {
    // Slash command: Use the content as the command name directly.
    commandName = message.content.toLowerCase();
  } else {
    // Legacy Command: Strip the prefix and parse the command.
    const PREFIX = '!';
    if (!message.content.startsWith(PREFIX)) return;
    commandName = message.content.slice(PREFIX.length).trim().split(/ +/)[0]?.toLowerCase() ?? '';
  }

  if (!commandName) return;
  const command = commands.get(commandName);

  if (command) {
    console.log(`Executing '${commandName}' via ${isSlashCommand ? 'Slash' : 'Text'} command.`);
    await command.execute(message, args);
  } else {
    // Only reply if it was a text command (don't clutter Discord slash UI)
    if (!isSlashCommand) await message.reply("Command not found.");
  }
}