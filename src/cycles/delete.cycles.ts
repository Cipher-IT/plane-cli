import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const deleteCycle = new Command("delete")
  .description("Delete a cycle")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-c, --cycle-id <cycleId>", "Cycle's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const cycleId = cmd.getOptionValue("cycleId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/`,
      method: "DELETE",
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 204) console.table(result);
      else console.table(result);
    }
  });
