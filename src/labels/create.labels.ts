import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderLabel } from "./list.labels";

export const createLabel = new Command("create")
  .description("Create a new label")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-n, --name <name>", "Label's name")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const name = cmd.getOptionValue("name");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/labels/`,
      method: "POST",
      body: {
        name,
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 201) console.table(result);
      else console.table(renderLabel(result));
    }
  });
