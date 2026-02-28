import { Command, Option } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const createWorkItem = new Command("create")
  .description("Create a new work-item")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-n, --name <name>", "Work item's name")
  .option(
    "-d, --description [description_html]",
    "Work item's description in HTML",
  )
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
    const name = cmd.getOptionValue("name");
    const description_html = cmd.getOptionValue("description");
    const state = cmd.getOptionValue("state");
    const assignees = cmd.getOptionValue("assignees");
    const priority = cmd.getOptionValue("priority");
    const labels = cmd.getOptionValue("labels");
    const parent_id = cmd.getOptionValue("parent");
    const estimate_point = cmd.getOptionValue("estimatePoint");
    const start_date = cmd.getOptionValue("startDate");
    const target_date = cmd.getOptionValue("targetDate");
    const module_id = cmd.getOptionValue("module");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/issues/`,
      method: "POST",
      body: {
        name,
        description_html,
        project_id: projectId,
        state,
        assignee_ids: (assignees && assignees.split(",")) || [],
        priority,
        label_ids: (labels && labels.split(",")) || [],
        parent_id,
        estimate_point,
        start_date,
        target_date,
        module: module_id,
      },
      params: {
        expand: "state,labels,assignees",
      },
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      if (status !== 201) console.table(result);
      else console.table(renderNewWorkItem(result));
    }
  });

export const renderNewWorkItem = (workItem: any) => {
  return {
    id: workItem.id,
    name: workItem.name,
    created: true,
  };
};
