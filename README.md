# plane-cli

A small CLI for interacting with the Plane API (api.plane.so).

This repository provides a minimal command-line tool built with commander that currently exposes project-related commands under the `projects` namespace.

## Requirements

- Node.js >= 18
- pnpm (recommended) or npm

## Install

Install dependencies:

`pnpm install`

Or with npm:

`npm install`

## Development

Run the TypeScript source directly (requires ts-node):

`pnpm run dev`

Build the TypeScript and run the compiled CLI:

```
pnpm run build
node dist/plane.js projects list --api-key <KEY> --workspace-slug <SLUG>
```

## Configuration / Authentication

The CLI accepts required options on every subcommand (they can also be provided via environment variables):

- `--api-key <key>` or PLANE_API_KEY - Your Plane API key (required)
- `--api-base <url>` or PLANE_API_BASE - API base host (defaults to `api.plane.so`)
- `--workspace-slug <slug>` or PLANE_WORKSPACE_SLUG - Workspace slug to scope requests (required)
- `-j, --json` - Print raw JSON output instead of a human-readable table

## Commands

- `projects list` — Lists projects for the configured workspace.
  - Example:
    - JSON output: `plane projects list --api-key $KEY --workspace-slug my-workspace -j`
    - Table output: `plane projects list --api-key $KEY --workspace-slug my-workspace`

The `projects list` command calls the Plane API endpoint `/api/v1/workspaces/{workspaceSlug}/projects` and prints either a JSON blob or a table of projects (id, name, description, total_members).

## Implementation notes

- The CLI uses `commander` for option and subcommand parsing.
- HTTP requests are made with fetch (node's global fetch); the request helper sets `X-API-Key` header and a JSON body when needed.
- Utility helpers validate required options and read defaults from environment variables.

## Contributing

Contributions are welcome — open an issue or PR to add more commands (tasks, comments, etc.).

```

```
