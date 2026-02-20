import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPi } from "../utils";
import { renderWorkItem } from "./list.work-items";

export const createWorkItem = new Command("create")
  .description("Create a new work-item")
  .argument("<projectId>", "Project ID")
  .argument("<name>", "Work item's name")
  .argument("[description_html]", "Work item's description in HTML")
  .action(async (projectId, name, description, __, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const result = await requestPlaneAPi({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/issues/`,
      method: "POST",
      no_v1: true,
      body: {
        name,
        description,
        project_id: projectId,
      },
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      console.table(renderWorkItem(result));
    }
  });
