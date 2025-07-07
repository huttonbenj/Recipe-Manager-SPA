#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PROTECTED_BRANCHES = ['main', 'develop'];
const VALID_PREFIXES = ['feature', 'hotfix', 'release'];

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function getCurrentBranch() {
  return execCommand('git branch --show-current');
}

function isWorkingDirectoryClean() {
  try {
    execCommand('git diff --quiet && git diff --staged --quiet');
    return true;
  } catch (error) {
    return false;
  }
}

function validateBranchName(branchName) {
  if (PROTECTED_BRANCHES.includes(branchName)) {
    return true;
  }
  
  const parts = branchName.split('/');
  if (parts.length !== 2) {
    return false;
  }
  
  const [prefix, name] = parts;
  return VALID_PREFIXES.includes(prefix) && name.length > 0;
}

function updateBranch() {
  const currentBranch = getCurrentBranch();
  
  console.log('\\n🔍 Current branch:', currentBranch);
  
  if (!validateBranchName(currentBranch)) {
    console.error('❌ Invalid branch name format! Should be: feature/name, hotfix/name, or release/name');
    process.exit(1);
  }

  if (!isWorkingDirectoryClean()) {
    console.error('❌ Working directory is not clean. Please commit or stash changes first.');
    process.exit(1);
  }

  console.log('\\n📥 Fetching latest changes...');
  execCommand('git fetch origin --prune');

  if (PROTECTED_BRANCHES.includes(currentBranch)) {
    console.log(`\\n🔄 Updating ${currentBranch} branch...`);
    execCommand(`git pull origin ${currentBranch}`);
  } else {
    console.log('\\n🔄 Updating develop branch...');
    execCommand('git fetch origin develop:develop');
    
    console.log('\\n🔄 Rebasing current branch on develop...');
    execCommand('git rebase develop');
  }

  console.log('\\n✅ Branch is up to date!');
}

function checkoutBranch() {
  rl.question('\\n📝 Enter branch name (feature/name, hotfix/name, or release/name): ', async (branchName) => {
    if (!validateBranchName(branchName)) {
      console.error('❌ Invalid branch name format!');
      rl.close();
      process.exit(1);
    }

    if (!isWorkingDirectoryClean()) {
      console.error('❌ Working directory is not clean. Please commit or stash changes first.');
      rl.close();
      process.exit(1);
    }

    console.log('\\n📥 Fetching latest changes...');
    execCommand('git fetch origin --prune');

    const branches = execCommand('git branch -a').split('\\n');
    const exists = branches.some(b => b.trim().replace('* ', '') === branchName);

    if (exists) {
      console.log(`\\n🔄 Checking out existing branch: ${branchName}`);
      execCommand(`git checkout ${branchName}`);
      execCommand('git fetch origin develop:develop');
      console.log('\\n🔄 Rebasing on develop...');
      execCommand('git rebase develop');
    } else {
      console.log(`\\n🌱 Creating new branch: ${branchName}`);
      execCommand('git checkout develop');
      execCommand('git pull origin develop');
      execCommand(`git checkout -b ${branchName}`);
    }

    console.log('\\n✅ Branch checkout complete!');
    rl.close();
  });
}

const command = process.argv[2];

switch (command) {
  case 'update':
    updateBranch();
    break;
  case 'checkout':
    checkoutBranch();
    break;
  default:
    console.error('❌ Please specify a command: update or checkout');
    process.exit(1);
}