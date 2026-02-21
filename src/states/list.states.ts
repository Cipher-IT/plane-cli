import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const listStates = new Command("list")
  .description("List states")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const { result } = await requestPlaneAPI({
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
