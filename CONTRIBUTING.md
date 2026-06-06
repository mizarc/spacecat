# Contributing to Astrokat

Thanks for your interest in contributing! Whether it's fixing a bug, adding a command, improving translations, or refining docs, all contributions are welcome so long as you follow our set of guidelines.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Adding a New Command](#adding-a-new-command)
- [Localization (i18n)](#localization-i18n)
- [Testing](#testing)
- [Coding Conventions](#coding-conventions)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Docker](#docker)

## Getting Started

### Prerequisites

- **Node.js 24+** (the project uses modern JS features)
- **npm**
- **Git**
- (Optional) [Docker](https://docs.docker.com/engine/install/) & [Docker Compose](https://docs.docker.com/compose/install/) for containerised development

### Setup

```bash
# Clone the repo
git clone https://github.com/mizarc/astrokat.git
cd astrokat

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env — at minimum set DISCORD_TOKEN and/or FLUXER_TOKEN

# (Optional) Deploy Discord slash commands
npm run deploy
```

### Key Design Decisions

- **Multi-platform** - Astrokat normalises messages from Discord & Fluxer into a `UnifiedMessage` type so commands only need to be written once.
- **Shared command system** - Commands live under `src/core/commands/<category>/` and are auto-loaded by the router.
- **i18n first** - All user-facing strings should live in `locales/en.json`.

## Development Workflow

### Run in development mode

```bash
npm run dev
```

This starts the bot with `tsx watch` — files are auto-reloaded on change.

### Run in production mode

```bash
npm start
```

### Lint / type-check

```bash
npm run build    # runs tsc to type-check
```

## Adding a New Command

### 1. Create the command file

Pick the right category folder inside `src/core/commands/`:

| Category | Folder | Examples |
|---|---|---|
| `automation` | `commands/automation/` | remindme |
| `knowledge` | `commands/knowledge/` | wiki, thesaurus, translate |
| `social` | `commands/social/` | coinflip, diceroll, slap, wheelspin |
| `utility` | `commands/utility/` | ping, echo, calc, color, qrcode |

Create a file named after your command, e.g. `src/core/commands/utility/foo.ts`.

### 2. Export a `BotCommand` object

```typescript
import type { BotCommand } from '../../types.js';
import { t } from '../../i18n.js';

export const FooCommand: BotCommand = {
  name: 'foo',
  description: 'Does a foo thing',
  category: 'utility',

  async execute(message, args) {
    await message.reply('Bar!');
  },
};
```

The router auto-discovers your command by looking for an export named `{Name}Command` matching the filename.

### 3. Add translations

Add strings to `locales/en.json` under the appropriate key, e.g.:

```json
{
  "commands": {
    "foo": {
      "result": "Bar!"
    }
  }
}
```

### 4. (Discord only) Register a slash command

Add a `SlashCommandBuilder` entry in `scripts/deploy-commands.ts`, then run:

```bash
npm run deploy
```

### 5. Write tests

See [Testing](#testing) below.

## Localization (i18n)

All user-facing text must go through the `t()` function.

```typescript
import { t } from '../../i18n.js';

// Simple string
t('wiki.noSearchTerm')

// With interpolation (use {paramName} in the locale JSON)
t('ping.result', { latency: 42 })
```

### Locale keys use dot notation

```
module.submodule.keyName
```

- Commands are nested under `commands` — e.g. `commands.foo.result`
- Non-command sections are top-level — e.g. `system.starting`, `deploy.success`

### Adding translations for a new language

1. Copy `locales/en.json` to `locales/{lang}.json`
2. Translate all string values (leave keys unchanged)
3. Call `loadLocale('{lang}')` at startup in `src/index.ts`

### Best practices

- Keep strings short and reuse keys where possible.
- When adding a new command, add its locale entries in the same PR.

## Testing

We use [Vitest](https://vitest.dev/). Test files live next to their implementation and use the `.test.ts` suffix (e.g. `slap.test.ts` next to `slap.ts`).

### Running tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Writing tests

Tests are auto-discovered by Vitest. Here's a minimal example:

```typescript
import { describe, it, expect } from 'vitest';
import { FooCommand } from './foo.js';

describe('foo', () => {
  it('should reply with "Bar!"', async () => {
    // Arrange — create a mock UnifiedMessage
    const reply = vi.fn();
    const message = { reply } as any;

    // Act
    await FooCommand.execute(message, []);

    // Assert
    expect(reply).toHaveBeenCalledWith('Bar!');
  });
});
```

Try to keep tests:
- **Focused** - one behaviour per test.
- **Readable** - use Arrange / Act / Assert comments for longer tests.
- **Fast** - avoid network calls; mock external dependencies.

## Coding Conventions

- **Language**: TypeScript with `nodenext` module resolution.
- **Imports**: Use `import` with `.js` extensions (e.g. `import { foo } from './bar.js'`).
- **Types**: Prefer `interface` over `type` for object shapes. Use the shared types in `src/core/types.ts`.
- **Error handling**: Catch errors gracefully and log via `console.error`. Don't silently swallow.
- **Platform agnostic**: Commands should use the `UnifiedMessage` API (`message.reply()`, `message.edit()`) and not directly call Discord / Fluxer APIs.

## Commit Messages

We encourage the use of Conventional Commits with prefixes to indicate that goal of the commit and a clear message to define what the commit is aiming to do.

Examples include:
```
feat: add foo command
fix: handle missing avatar in embed
refactor: extract locale loading logic
docs: update README with PostgreSQL instructions
```

## Pull Request Process

1. **Open an issue first** (optional but encouraged) to discuss significant changes before investing time.
2. **Fork the repo** and create a branch from `main`.
3. **Make your changes** - keep PRs focused on a single concern.
4. **Add or update tests** to cover your changes.
5. **Ensure all tests pass** - run `npm test`.
6. **Update documentation** if your change affects the API, configuration, or deployment.
7. **Open a pull request** against `main`. The title should summarise the change at a glance.
8. A maintainer will review - expect constructive feedback. Don't take it personally!

## Docker

If you're working on Docker-related changes:

```bash
# Build without cache
docker compose build --no-cache

# Run with SQLite
docker compose up

# Run with PostgreSQL
docker compose --profile postgres up
```

The Dockerfile uses a multi-stage-like pattern (single stage, but with layer caching for `npm ci`). If you change dependencies, add a `--no-cache` flag to rebuild.

## Questions?

Open a [Discussion](https://github.com/mizarc/astrokat/discussions) or reach out to the maintainer through one of the below:

- **Email:** contact@mizarc.dev
- **Fluxer:** Mizarc#0521
- **Discord:** mizarc

Happy contributing! 🚀
