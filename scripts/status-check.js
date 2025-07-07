#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');

// ANSI color codes
const COLORS = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m',
  white: '\\x1b[37m',
  bold: '\\x1b[1m'
};

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    return '';
  }
}

function getCurrentBranch() {
  return execCommand('git branch --show-current');
}

function getUncommittedChanges() {
  const staged = execCommand('git diff --staged --name-only');
  const unstaged = execCommand('git diff --name-only');
  return {
    staged: staged.split('\\n').filter(Boolean),
    unstaged: unstaged.split('\\n').filter(Boolean)
  };
}

function getUnpushedCommits() {
  const branch = getCurrentBranch();
  return execCommand(`git log origin/${branch}..HEAD --oneline`).split('\\n').filter(Boolean);
}

function getDevelopStatus() {
  execCommand('git fetch origin develop:develop');
  const behindCount = execCommand('git rev-list --count HEAD..develop');
  return parseInt(behindCount) || 0;
}

function printHeader() {
  console.log('\\n===========================================');
  console.log(`${COLORS.bold}Recipe Manager SPA - Status Check${COLORS.reset}`);
  console.log('===========================================\\n');
}

function printBranchStatus(branch) {
  console.log(`${COLORS.bold}Current Branch:${COLORS.reset} ${COLORS.cyan}${branch}${COLORS.reset}`);
}

function printChanges(changes) {
  if (changes.staged.length > 0) {
    console.log(`\\n${COLORS.yellow}Staged Changes:${COLORS.reset}`);
    changes.staged.forEach(file => console.log(`  + ${file}`));
  }

  if (changes.unstaged.length > 0) {
    console.log(`\\n${COLORS.red}Unstaged Changes:${COLORS.reset}`);
    changes.unstaged.forEach(file => console.log(`  * ${file}`));
  }
}

function printUnpushedCommits(commits) {
  if (commits.length > 0) {
    console.log(`\\n${COLORS.magenta}Unpushed Commits:${COLORS.reset}`);
    commits.forEach(commit => console.log(`  → ${commit}`));
  }
}

function printDevelopStatus(behindCount) {
  if (behindCount > 0) {
    console.log(`\\n${COLORS.red}⚠ Your branch is ${behindCount} commits behind develop${COLORS.reset}`);
  }
}

function printSummary(isClean) {
  console.log('\\n===========================================');
  if (isClean) {
    console.log(`${COLORS.green}✓ Working directory is clean and up to date${COLORS.reset}`);
  } else {
    console.log(`${COLORS.yellow}! Action needed - see details above${COLORS.reset}`);
  }
  console.log('===========================================\\n');
}

function printStatus() {
  const branch = getCurrentBranch();
  const changes = getUncommittedChanges();
  const unpushedCommits = getUnpushedCommits();
  const behindDevelop = getDevelopStatus();

  printHeader();
  printBranchStatus(branch);
  printChanges(changes);
  printUnpushedCommits(unpushedCommits);
  printDevelopStatus(behindDevelop);

  const isClean = changes.staged.length === 0 &&
    changes.unstaged.length === 0 &&
    unpushedCommits.length === 0 &&
    behindDevelop === 0;
  printSummary(isClean);
}

printStatus();