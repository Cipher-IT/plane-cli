import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const listCycles = new Command("list")
  .description("List cycles")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/cycles/`,
      method: "GET",
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(result.results.map(renderCycle));
    }
  });

export const renderCycle = (cycle: any) => {
  return {
    id: cycle.id,
    name: cycle.name,
    description: cycle.description,
    total_issues: cycle.total_issues,
    cancelled_issues: cycle.cancelled_issues,
    completed_issues: cycle.completed_issues,
    started_issues: cycle.started_issues,
    unstarted_issues: cycle.unstarted_issues,
    backlog_issues: cycle.backlog_issues,
  };
};
