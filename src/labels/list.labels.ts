import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPi } from "../utils";

export const listLabels = new Command("list")
  .description("List labels")
  .argument("<projectId>", "Project ID")
  .action(async (projectId, __, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const result = await requestPlaneAPi({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/labels`,
      method: "GET",
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      console.table(result.results.map(renderLabel));
    }
  });

export const renderLabel = (label: any) => {
  return {
    id: label.id,
    name: label.name,
    description: label.description,
  };
};
