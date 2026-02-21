import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../../utils";

export const listCyclesWorkItems = new Command("list-work-items")
  .description("List cycle work items")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-c, --cycle-id <cycleId>", "Cycle's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const cycleId = cmd.getOptionValue("cycleId");
    const { result } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/cycle-issues`,
      method: "GET",
      params: {
        expand: "state,labels,assignees",
      },
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      console.table(result.results.map(renderCycleWorkItem));
    }
  });

export const renderCycleWorkItem = (workItem: any) => {
  return {
    id: workItem.id,
    name: workItem.name,
    state: workItem.state.name,
    labels: workItem.labels.map((label: any) => label.name),
    assignees: workItem.assignees.map((user: any) =>
      `${user.first_name} ${user.last_name}`.trim(),
    ),
  };
};
