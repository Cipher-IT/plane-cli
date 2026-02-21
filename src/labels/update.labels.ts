import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderLabel } from "./list.labels";

export const updateLabel = new Command("update")
  .description("Update a label")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-l, --label-id <labelId>", "Label's ID")
  .requiredOption("-n, --name <name>", "Label's name")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const labelId = cmd.getOptionValue("labelId");
    const name = cmd.getOptionValue("name");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}/`,
      method: "PATCH",
      body: {
        name,
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(renderLabel(result));
    }
  });
