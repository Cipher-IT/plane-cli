import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderWorkItem } from "./list.work-items";

export const createWorkItem = new Command("create")
  .description("Create a new work-item")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-n, --name <name>", "Work item's name")
  .option(
    "-d, --description [description_html]",
    "Work item's description in HTML",
  )
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const name = cmd.getOptionValue("name");
    const description = cmd.getOptionValue("description");
    const { result } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/issues/`,
      method: "POST",
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
