import { Command } from "commander";
import { checkRequiredOptionsAndReturn, requestPlaneAPI } from "../utils";

export const getCurrentUser = new Command("me")
  .description("Get current user")
  .action(async (__, cmd: Command) => {
    if (cmd.parent == null) return;
    const { apiKey, apiBase, json } = checkRequiredOptionsAndReturn(cmd);
    const { result, status } = await requestPlaneAPI({
      apiBase,
      apiKey,
      endpoint: `users/me/`,
      method: "GET",
    });
    if (json) console.log(JSON.stringify(result));
    else {
      if (status !== 200) console.table(result);
      else console.table(renderUser(result));
    }
  });

export const renderUser = (user: any) => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    display_name: user.display_name,
  };
};
