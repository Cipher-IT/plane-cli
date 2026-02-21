import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderProject } from "./list.projects";

export const updateProject = new Command("update")
  .description("Update a project")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .option("-n, --name [name]", "Project's name")
  .option("-d, --description [description]", "Project's description")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const name = cmd.getOptionValue("name");
    const description = cmd.getOptionValue("description");
    const body: any = {};
    if (name !== undefined) body.name = name;
    if (description !== undefined) body.description = description;
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/`,
      method: "PATCH",
      body,
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(renderProject(result));
    }
  });
