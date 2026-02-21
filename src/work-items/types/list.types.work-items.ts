import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../../utils";

// WARN: THIS ENDPOINT IS WIP
export const listWorkItemTypes = new Command("list")
  .description("List work item types")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/`,
      method: "GET",
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(result.results.map(renderWorkItemType));
    }
  });

export const renderWorkItemType = (workItemType: any) => {
  return {
    id: workItemType.id,
    name: workItemType.name,
    description: workItemType.description,
    is_epic: workItemType.is_epic,
    is_default: workItemType.is_default,
    is_active: workItemType.is_active,
    level: workItemType.level,
  };
};
