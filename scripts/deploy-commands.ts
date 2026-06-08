#!/usr/bin/env node
/**
 * Standalone deploy script — calls the same deploy function used by auto-deploy.
 * Run manually: npm run deploy
 */
import { deployCommands } from '../src/core/deploy.js';

await deployCommands();