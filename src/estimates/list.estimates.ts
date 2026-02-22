import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

// WARN: THIS ENDPOINT IS WIP
export const listEstimates = new Command("list")
  .description("List estimates")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/estimates/`,
      method: "GET",
      no_v1: true,
      params: {
        expand: "points",
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(result.results.map(renderEstimate));
    }
  });

export const renderEstimate = (estimate: any) => {
  return {
    id: estimate.id,
    name: estimate.name,
    points:
      (estimate.points &&
        estimate.map((point: any) => ({
          id: point.id,
          value: point.value,
        }))) ||
      [],
  };
};
