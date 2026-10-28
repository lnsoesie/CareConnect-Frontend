# CareConnect Patient Portal

## Normal Development

### Prerequisites

Make sure the following are installed:

- Node.js
- pnpm

Check the installed versions:

```bash
node --version
pnpm --version
```

### Install Dependencies

From the CareConnect project directory, run:

```bash
pnpm install
```

This installs the dependencies defined by the project.

## Production Build

To create a production build:

```bash
pnpm run build
```

The generated production files are placed in:

```text
dist/
```

The `dist` directory is generated during the build and should not be manually edited as part of normal development.

### Start the Development Server

Run:

```bash
pnpm run dev
```

Vite will display the local development URL in the terminal.

Open the displayed URL in your web browser to run the CareConnect application.

## Useful Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install project dependencies |
| `pnpm run dev` | Start the normal development server |
| `pnpm run build` | Create the production build |
