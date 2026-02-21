import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const deleteState = new Command("delete")
  .description("Delete a state")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-s, --state-id <stateId>", "State's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const stateId = cmd.getOptionValue("stateId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}/`,
      method: "DELETE",
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 204) console.table(result);
      else console.table(result);
    }
  });
