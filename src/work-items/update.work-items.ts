import { Command, Option } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const updateWorkItem = new Command("update")
  .description("Update a work-item")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-w, --work-item-id <workItemId>", "Work item's ID")
  .option("-n, --name [name]", "Work item's name")
  .option("-d, --description [description]", "Work item's description in HTML")
  .option("-s, --state <state>", "Work item's state ID")
  .option(
    "-a, --assignees <assignees>",
    "Work item's assignees IDs (comma seperated)",
  )
  .addOption(
    new Option("-u, --priority <priority>", "Work item's priority").choices([
      "none",
      "urgent",
      "high",
      "medium",
      "low",
    ]),
  )
  .option("-l, --labels <labels>", "Work item's labels IDs (comma seperated)")
  .option("--parent <parentId>", "Work item's parent ID")
  .option("-ep, --estimate-point <estimatePoint>", "Work item's estimate point")
  .option("-sd, --start-date <startDate>", "Work item's start date")
  .option("-td, --target-date <targetDate>", "Work item's target date")
  .option("-m, --module <moduleId>", "Work item's module id")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const workItemId = cmd.getOptionValue("workItemId");
    const name = cmd.getOptionValue("name");
    const description = cmd.getOptionValue("description");
    const state = cmd.getOptionValue("state");
    const assignees = cmd.getOptionValue("assignees");
    const priority = cmd.getOptionValue("priority");
    const labels = cmd.getOptionValue("labels");
    const parent_id = cmd.getOptionValue("parent");
    const estimate_point = cmd.getOptionValue("estimatePoint");
    const start_date = cmd.getOptionValue("startDate");
    const target_date = cmd.getOptionValue("targetDate");
    const module_id = cmd.getOptionValue("module");
    const body: any = {};
    if (name !== undefined) body.name = name;
    if (description !== undefined) body.description = description;
    if (state !== undefined) body.state = state;
    if (assignees !== undefined) body.assignees = assignees;
    if (priority !== undefined) body.priority = priority;
    if (labels !== undefined) body.labels = labels;
    if (parent_id !== undefined) body.parent = parent_id;
    if (estimate_point !== undefined) body.estimate_point = estimate_point;
    if (start_date !== undefined) body.start_date = start_date;
    if (target_date !== undefined) body.target_date = target_date;
    if (module_id !== undefined) body.module = module_id;
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/`,
      method: "PATCH",
      body,
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(renderUpdatedWorkItem(result));
    }
  });

export const renderUpdatedWorkItem = (workItem: any) => {
  return {
    id: workItem.id,
    name: workItem.name,
    updated: true,
  };
};
