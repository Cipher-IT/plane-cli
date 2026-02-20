import { Command } from "commander";

export const checkApiKey = (apiKey: any) => {
  if (!apiKey) {
    console.error(
      "No API key provided. Use: plane <command> --api-key <API_KEY> or set PLANE_API_KEY environment variable",
    );
    process.exit(1);
  }
};

export const checkApiBase = (apiBase: any) => {
  if (!apiBase) {
    console.error(
      "No API base provided. Use: plane <command> --api-base <API_BASE> or set PLANE_API_BASE environment variable",
    );
    process.exit(1);
  }
};

export const checkWorkspaceSlug = (workspaceSlug: any) => {
  if (!workspaceSlug) {
    console.error(
      "No workspace slug provided. Use: plane <command> --workspace-slug <SLUG> or set PLANE_WORKSPACE_SLUG environment variable",
    );
    process.exit(1);
  }
};

export const checkRequiredOptionsAndReturn = (cmd: Command) => {
  const apiKey = cmd.parent.getOptionValue("apiKey");
  const apiBase = cmd.parent.getOptionValue("apiBase");
  const workspaceSlug = cmd.parent.getOptionValue("workspaceSlug");
  checkApiKey(apiKey);
  checkApiBase(apiBase);
  checkWorkspaceSlug(workspaceSlug);
  const json = cmd.args.indexOf("--json") != -1 || cmd.args.indexOf("-j") != -1;
  return {
    apiKey,
    apiBase,
    workspaceSlug,
    json,
  };
};

export const requestPlaneAPI = async ({
  apiKey,
  apiBase,
  endpoint,
  method,
  body,
  params,
  no_v1,
}: {
  apiKey: string;
  apiBase: string;
  endpoint: string;
  method: string;
  body?: any;
  params?: any;
  no_v1?: boolean;
}) => {
  let url = `${apiBase}/api${(!!!no_v1 && "/v1") || ""}/${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }
  const headers = {
    "X-API-Key": apiKey,
    "Content-Type": "application/json",
  };
  const opts = { method, headers, body };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(url, opts);
    return await res.json();
  } catch (err) {
    console.error("Request failed:", err.message);
    process.exit(1);
  }
};
