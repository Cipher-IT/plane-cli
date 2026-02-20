import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPi } from "../utils";

export const listStates = new Command("list")
  .description("List states")
  .argument("<projectId>", "Project ID")
  .action(async (projectId, __, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const result = await requestPlaneAPi({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/states`,
      method: "GET",
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      console.table(result.results.map(renderState));
    }
  });

export const renderState = (state: any) => {
  return {
    id: state.id,
    name: state.name,
    description: state.description,
  };
};
