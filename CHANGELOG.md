# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-10

### Added

#### Commands
- **Automation**: `remindme`
- **Knowledge**: `define`, `currency`, `iss`, `thesaurus`, `translate`, `wiki`
- **Moderation**: `purge`
- **Social**: `8ball`, `coinflip`, `diceroll`, `slap`, `wheelspin`
- **System**: `presence`, `status`
- **Utility**: `avatar`, `calc`, `color`, `echo`, `help`, `ping`, `qrcode`, `timestamp`, `uptime`

#### Platforms
- **Discord** adapter via discord.js
- **Fluxer** adapter via @fluxerjs/core

#### Deployment
- Docker multi-stage build (Node.js 24 Alpine)
- Docker Compose with profiles for SQLite and PostgreSQL backends