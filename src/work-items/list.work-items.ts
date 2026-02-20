import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPi } from "../utils";

export const listWorkItems = new Command("list")
  .description("List work items")
  .argument("<projectId>", "Project ID")
  .action(async (projectId, __, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const result = await requestPlaneAPi({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/work-items`,
      method: "GET",
      params: {
        expand: "state,labels,assignees",
      },
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      console.table(result.results.map(renderWorkItem));
    }
  });

export const renderWorkItem = (workItem: any) => {
  return {
    id: workItem.id,
    name: workItem.name,
    state: (workItem.state && workItem.state.name) || null,
    labels:
      (workItem.labels && workItem.labels.map((label: any) => label.name)) ||
      [],
    assignees:
      (workItem.assignees &&
        workItem.assignees.map((user: any) =>
          `${user.first_name} ${user.last_name}`.trim(),
        )) ||
      [],
  };
};
