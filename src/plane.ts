import { Command } from "commander";
import { homedir } from "os";

const program = new Command();
const API_BASE = "https://api.plane.so/v1";

async function request(method: string, endpoint: string, body?: any, params?: Record<string,string>, apiKey?: string) {
  apiKey = apiKey || process.env.PLANE_API_KEY;
  if (!apiKey) {
    console.error(
      "No API key provided. Use: plane <command> --api-key <API_KEY> or set PLANE_API_KEY environment variable",
    );
    process.exit(1);
  }
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }
  const headers: Record<string,string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const opts: any = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err: any) {
    console.error("Request failed:", err?.message ?? err);
    process.exit(1);
  }
}

program
  .name("plane")
  .description("CLI for api.plane.so")
  .option("--api-key <key>", "Plane API key");

program
  .command("list <what>")
  .option("--project <id>")
  .action(async (what: string, options: any) => {
    const opts = program.opts();
    if (what === "workspaces") {
      const res = await request("GET", "/workspaces", null, null, opts.apiKey);
      console.log(JSON.stringify(res, null, 2));
      return;
    }
    if (what === "projects") {
      const res = await request("GET", "/projects", null, null, opts.apiKey);
      console.log(JSON.stringify(res, null, 2));
      return;
    }
    if (what === "tasks") {
      const params: Record<string,string> = {};
      if (options.project) params.project = options.project;
      const res = await request("GET", "/tasks", null, params, opts.apiKey);
      console.log(JSON.stringify(res, null, 2));
      return;
    }
    console.error("Unknown list target:", what);
    process.exit(1);
  });

program
  .command("show <type> <id>")
  .action(async (type: string, id: string) => {
    const opts = program.opts();
    if (type !== "task") {
      console.error("Unsupported show type", type);
      process.exit(1);
    }
    const res = await request("GET", `/tasks/${id}`, null, null, opts.apiKey);
    console.log(JSON.stringify(res, null, 2));
  });

program
  .command("create <type> [title]")
  .option("--title <title>")
  .option("--project <id>")
  .option("--description <desc>")
  .action(async (type: string, titlePos: string | undefined, options: any) => {
    const opts = program.opts();
    if (type !== "task") {
      console.error("Unsupported create type", type);
      process.exit(1);
    }
    const title = options.title || titlePos;
    if (!title) {
      console.error("Missing title");
      process.exit(1);
    }
    const body: any = { title };
    if (options.project) body.project = options.project;
    if (options.description) body.description = options.description;
    const res = await request("POST", "/tasks", body, null, opts.apiKey);
    console.log(JSON.stringify(res, null, 2));
  });

program
  .command("update <type> <id>")
  .option("--title <title>")
  .option("--description <desc>")
  .option("--status <status>")
  .action(async (type: string, id: string, options: any) => {
    const opts = program.opts();
    if (type !== "task") {
      console.error("Unsupported update type", type);
      process.exit(1);
    }
    const body: any = {};
    if (options.title) body.title = options.title;
    if (options.description) body.description = options.description;
    if (options.status) body.status = options.status;
    const res = await request("PATCH", `/tasks/${id}`, body, null, opts.apiKey);
    console.log(JSON.stringify(res, null, 2));
  });

program
  .command("comment <type> <id>")
  .requiredOption("--body <text>")
  .action(async (type: string, id: string, options: any) => {
    const opts = program.opts();
    if (type !== "task") {
      console.error("Unsupported comment type", type);
      process.exit(1);
    }
    const res = await request("POST", `/tasks/${id}/comments`, { body: options.body }, null, opts.apiKey);
    console.log(JSON.stringify(res, null, 2));
  });

program
  .command("assign <type> <id>")
  .requiredOption("--assignee <userId>")
  .action(async (type: string, id: string, options: any) => {
    const opts = program.opts();
    if (type !== "task") {
      console.error("Unsupported assign type", type);
      process.exit(1);
    }
    const res = await request("PATCH", `/tasks/${id}`, { assignee: options.assignee }, null, opts.apiKey);
    console.log(JSON.stringify(res, null, 2));
  });

program
  .command("delete <type> <id>")
  .action(async (type: string, id: string) => {
    const opts = program.opts();
    if (type !== "task") {
      console.error("Unsupported delete type", type);
      process.exit(1);
    }
    const res = await request("DELETE", `/tasks/${id}`, null, null, opts.apiKey);
    console.log(JSON.stringify(res, null, 2));
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
