import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderProject } from "./list.projects";

export const createProject = new Command("create")
  .description("Create a new project")
  .requiredOption("-n, --name <name>", "Project's name")
  .requiredOption("-i, --identifier <identifier>", "Project' identifier")
  .option("-d, --description [description]", "Project's description")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const name = cmd.getOptionValue("name");
    const identifier = cmd.getOptionValue("identifier");
    const description = cmd.getOptionValue("description");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/`,
      method: "POST",
      body: {
        name,
        identifier,
        description,
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 201) console.table(result);
      else console.table(renderProject(result));
    }
  });
