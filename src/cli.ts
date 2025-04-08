#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { call, chat } from './index.js';

const program = new Command();

program
  .name('p2a')
  .description('CLI for P2A (Prompt to Action) service')
  .version('0.1.5');

program
  .command('call')
  .description('Execute a function based on the prompt')
  .argument('<prompt>', 'The prompt to execute')
  .action(async (prompt: string) => {
    try {
      const { value } = await call(prompt);
      console.log(chalk.green('Result:'));
      console.log(JSON.stringify(value, null, 2));
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('chat')
  .description('Chat with the service and get processed results')
  .argument('<prompt>', 'The prompt to process')
  .action(async (prompt: string) => {
    try {
      const { value } = await chat(prompt);
      console.log(chalk.green('Result:'));
      console.log(value);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse(process.argv);
