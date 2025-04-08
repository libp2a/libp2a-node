#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { call, chat } from './index.js';
import { version } from '../package.json';

const program = new Command();

// Helper function to handle prompts
const handlePrompt = async (prompt: string, mode: 'call' | 'chat' = 'call') => {
  try {
    const { value } = await (mode === 'call' ? call(prompt) : chat(prompt));
    console.log(mode === 'call' ? JSON.stringify(value, null, 2) : value);
  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

program
  .name('p2a')
  .description('CLI for P2A (Prompt to Action) service')
  .version(version)
  // Default command when no command is specified
  .argument('[prompt]', 'The prompt to execute (uses call mode by default)')
  .action(async (prompt?: string) => {
    if (prompt) {
      await handlePrompt(prompt, 'call');
    } else {
      program.help();
    }
  });

program
  .command('call')
  .description('Execute a function based on the prompt')
  .argument('<prompt>', 'The prompt to execute')
  .action(async (prompt: string) => {
    await handlePrompt(prompt, 'call');
  });

program
  .command('chat')
  .description('Chat with the service and get processed results')
  .argument('<prompt>', 'The prompt to process')
  .action(async (prompt: string) => {
    await handlePrompt(prompt, 'chat');
  });

program.parse(process.argv);
