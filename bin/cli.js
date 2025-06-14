#!/usr/bin/env node

import { Command } from 'commander';
import { build, edit } from '../lib/interpreter.js';
import { serve } from '../lib/server.js';
import { upload } from '../lib/uploader.js';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('portfolio-gen')
  .description('🛠 CLI to generate, preview, and deploy a personal portfolio')
  .version('1.0.0');

program
  .command('init')
  .description('Create a starter portfolio.yaml')
  .action(() => {
    const sample = path.join(import.meta.dirname, '../portfolio.sample.yaml');
    fs.copyFileSync(sample, './portfolio.yaml');
    console.log('✅ Created starter portfolio.yaml');
  });

program
  .command('build')
  .description('Build portfolio from portfolio.yaml')
  .action(async () => {
    await build();
  });

program
  .command('preview')
  .description('Preview portfolio locally on http://localhost:3000')
  .action(() => {
    serve();
  });

program
  .command('deploy')
  .description('Upload the portfolio to 0x0.st')
  .action(() => {
    upload();
  });

program
  .command('edit')
  .description('Interactively update your portfolio.yaml')
  .action(async () => {
    await edit();
  });

program.parse(process.argv);
