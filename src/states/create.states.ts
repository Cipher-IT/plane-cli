import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderState } from "./list.states";

export const createState = new Command("create")
  .description("Create a new state")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-n, --name <name>", "State's name")
  .requiredOption("-c, --color <color>", "State's color")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const name = cmd.getOptionValue("name");
    const color = cmd.getOptionValue("color");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/states/`,
      method: "POST",
      body: {
        name,
        color,
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 201) console.table(result);
      else console.table(renderState(result));
    }
  });
