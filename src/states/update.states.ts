import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderState } from "./list.states";

export const updateState = new Command("update")
  .description("Update a state")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-s, --state-id <stateId>", "State's ID")
  .requiredOption("-n, --name <name>", "State's name")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const stateId = cmd.getOptionValue("stateId");
    const name = cmd.getOptionValue("name");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}/`,
      method: "PATCH",
      body: {
        name,
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(renderState(result));
    }
  });
