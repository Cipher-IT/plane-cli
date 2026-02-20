#!/usr/bin/env node
import { Command } from "commander";
import { listProjects } from "./projects";
import { createWorkItem, listWorkItems } from "./work-items";
import { listStates } from "./states";
import { listLabels } from "./labels";
import { createCycle, listCycles, listCyclesWorkItems } from "./cycles";
import { getCurrentUser } from "./users";

const program = new Command();
program.name("plane").description("CLI for api.plane.so").version("1.0.0");

program
  .command("projects")
  .description("Manage projects")
  .addCommand(listProjects);

program
  .command("work-items")
  .description("Manage work items")
  .addCommand(listWorkItems)
  .addCommand(createWorkItem);

program.command("states").description("Manage states").addCommand(listStates);
program.command("labels").description("Manage labels").addCommand(listLabels);
program
  .command("cycles")
  .description("Manage cycles")
  .addCommand(listCycles)
  .addCommand(listCyclesWorkItems)
  .addCommand(createCycle);

program.command("users").description("Manage users").addCommand(getCurrentUser);

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
  cmd.option("-j, --json", "Print in JSON format");
});

program.parse();
