# Security Policy

## Supported Versions

Astrokat is under active development on the `main` branch. Only the latest release receives security patches at this point in time.

## Reporting a Vulnerability

If you discover a security issue, **please do not open a public issue**. Instead, contact the maintainer directly:

**Mizarc** - [contact@mizarc.dev](mailto:contact@mizarc.dev)

You should receive a response **within 48 hours**. If you don't, feel free to follow up.

### What to include

- A brief description of the issue
- Steps to reproduce (if applicable)
- Potential impact
- Any suggested mitigation (if you have one)

## Scope

The following are in scope for our security policy:

- **Token leakage** - Exposure of `DISCORD_TOKEN`, `FLUXER_TOKEN`, or `DATABASE_URL` through logs, errors, or the bot's output.
- **Command injection** - Exploiting bot commands to execute arbitrary code or access the host system.
- **Privilege escalation** - Using bot commands to access data or functionality the user should not have access to.
- **Dependency vulnerabilities** - Known CVEs in Astrokat's runtime dependencies.

The following are **out of scope**:

- Self-inflicted exposure (e.g. committing `.env` to a public repo).
- Vulnerabilities in the platforms Astrokat connects to (Discord, Fluxer).
- Social engineering of the bot operator.

## Best Practices for Deployment

When running Astrokat, follow these guidelines to keep things secure:

1. **Never commit your `.env` file** - The `.gitignore` already excludes it, but double-check before pushing.
2. **Use dedicated tokens** - Create bot tokens scoped to a single application, not your personal account.
3. **Rotate tokens periodically** - If you suspect a token is compromised, regenerate it immediately via the platform's developer portal.
4. **Run with least privilege** - The bot does not need root access. The Docker image runs as a non-root user by default.
5. **Keep dependencies updated** - Regularly run `npm audit` and apply patch updates.
6. **Use Docker secrets or environment managers** - Avoid hardcoding secrets in shell history or config files.
