import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const deleteLabel = new Command("delete")
  .description("Delete a label")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-l, --label-id <labelId>", "Label's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const labelId = cmd.getOptionValue("labelId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}/`,
      method: "DELETE",
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 204) console.table(result);
      else console.table(result);
    }
  });
