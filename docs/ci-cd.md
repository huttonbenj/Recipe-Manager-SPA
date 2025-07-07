# CI/CD Pipeline

## Overview

The CI/CD pipeline is implemented using GitHub Actions to automate the process of testing, building, and deploying the application.

## Pipeline Steps

1. **Lint**: Check code quality using ESLint.
2. **Test**: Run unit tests with Jest and end-to-end tests with Playwright.
3. **Build**: Compile the frontend using Vite.
4. **Deploy**: Deploy the frontend to Vercel and the backend to Render.

## Configuration

- **Trigger**: The pipeline runs on every push to the `main` branch and on pull requests.
- **Environment Variables**: Securely store and access environment variables using GitHub Secrets.

## Workflow File

Create a `.github/workflows/ci-cd.yml` file with the following content:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run ESLint
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
      - name: Deploy to Render
        run: render deploy
