import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderCycle } from "./list.cycles";

// BUG: THIS ENDPOINT IS BROKEN FROM THE APP ITSELF. HOWEVER, THE CODE IS IN PLACE FOR IT TO WORK IF UPDATED
export const createCycle = new Command("create")
  .description("Create a new cycle")
  .argument("<projectId>", "Project ID")
  .argument("<name>", "Cycle's name")
  .argument("[description]", "Cycle's description")
  .action(async (projectId, name, description, __, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const result = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/cycles`,
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
      console.table(renderCycle(result));
    }
  });
