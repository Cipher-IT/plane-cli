#!/usr/bin/env node
import { Command } from "commander";
import {
  createProject,
  deleteProject,
  listProjectMembers,
  listProjects,
  updateProject,
} from "./projects";
import {
  createWorkItem,
  deleteWorkItem,
  listWorkItems,
  listWorkItemTypes,
  updateWorkItem,
} from "./work-items";
import { createState, deleteState, listStates, updateState } from "./states";
import { createLabel, deleteLabel, listLabels, updateLabel } from "./labels";
import {
  createCycle,
  deleteCycle,
  listCycles,
  listCyclesWorkItems,
  updateCycle,
} from "./cycles";
import { getCurrentUser } from "./users";
import { listEstimates } from "./estimates";

const program = new Command();
program.name("plane").description("CLI for api.plane.so").version("1.0.0");

program
  .command("projects")
  .description("Manage projects")
  .addCommand(listProjects)
  .addCommand(createProject)
  .addCommand(updateProject)
  .addCommand(deleteProject)
  .addCommand(listProjectMembers);

program
  .command("work-items")
  .description("Manage work items")
  .addCommand(listWorkItems)
  .addCommand(createWorkItem)
  .addCommand(updateWorkItem)
  .addCommand(deleteWorkItem);

program
  .command("work-item-types")
  .description("Manage work item types")
  .addCommand(listWorkItemTypes);

program
  .command("states")
  .description("Manage states")
  .addCommand(listStates)
  .addCommand(createState)
  .addCommand(updateState)
  .addCommand(deleteState);

program
  .command("labels")
  .description("Manage labels")
  .addCommand(listLabels)
  .addCommand(createLabel)
  .addCommand(updateLabel)
  .addCommand(deleteLabel);

program
  .command("cycles")
  .description("Manage cycles")
  .addCommand(listCycles)
  .addCommand(listCyclesWorkItems)
  .addCommand(createCycle)
  .addCommand(updateCycle)
  .addCommand(deleteCycle);

program.command("users").description("Manage users").addCommand(getCurrentUser);

program
  .command("estimates")
  .description("Manage estimates")
  .addCommand(listEstimates);

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
