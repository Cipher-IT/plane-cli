#!/usr/bin/env node
import { Command, Option } from "commander";
import { listProjects } from "./projects";

const program = new Command();
program.name("plane").description("CLI for api.plane.so").version("1.0.0");

program
  .command("projects")
  .description("Manage projects")
  .addCommand(listProjects);

program.commands.forEach((cmd) => {
  cmd.requiredOption(
    "--api-key <key>",
    "Plane API key",
    process.env.PLANE_API_KEY,
  );
  cmd.requiredOption(
    "--api-base <url>",
    "Plane API base",
    process.env.PLANE_API_BASE || "api.plane.so",
  );
  cmd.requiredOption(
    "--workspace-slug <slug>",
    "Workspace slug",
    process.env.PLANE_WORKSPACE_SLUG,
  );
  cmd.addOption(new Option("-j, --json", "Print in JSON format"));
});

program.parse();
