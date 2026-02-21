import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const listProjects = new Command("list")
  .description("List projects")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const { result } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects`,
      method: "GET",
    });
    if (json) {
      console.log(JSON.stringify(result));
    } else {
      console.table(result.results.map(renderProject));
    }
  });

export const renderProject = (project: any) => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    total_members: project.total_members,
  };
};
