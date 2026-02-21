import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";
import { renderCycle } from "./list.cycles";

export const createCycle = new Command("create")
  .description("Create a new cycle")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .requiredOption("-n, --name <name>", "Cycle's name")
  .option("-d, --description [description]", "Cycle's description")
  .option("-sd, --start-date [startDate]", "Cycle's start date")
  .option("-ed, --end-date [endDate]", "Cycle's end date")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const name = cmd.getOptionValue("name");
    const description = cmd.getOptionValue("description");
    const startDate = cmd.getOptionValue("startDate");
    const endDate = cmd.getOptionValue("endDate");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/cycles/`,
      method: "POST",
      body: {
        name,
        description,
        project_id: projectId,
        start_date: startDate,
        end_date: endDate,
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 201) console.table(result);
      else console.table(renderCycle(result));
    }
  });
