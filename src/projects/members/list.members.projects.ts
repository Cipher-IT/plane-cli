import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../../utils";

export const listProjectMembers = new Command("list-members")
  .description("List project's members")
  .requiredOption("-p, --project-id <projectId>", "Project's ID")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, workspaceSlug, json } =
      checkRequiredOptionsAndReturn(cmd);
    const projectId = cmd.getOptionValue("projectId");
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `workspaces/${workspaceSlug}/projects/${projectId}/members/`,
      method: "GET",
      params: {
        expand: "member",
      },
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(result.map(renderProjectMember));
    }
  });

export const renderProjectMember = (member: any) => {
  return {
    id: member.id,
    name: `${member.first_name} ${member.last_name}`,
    display_name: member.display_name,
  };
};
