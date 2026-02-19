#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_PATH = path.join(os.homedir(), '.plane-cli-config.json');
const API_BASE = 'https://api.plane.so/v1';

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), { mode: 0o600 });
}

async function request(method, endpoint, body, params) {
  const cfg = loadConfig();
  const apiKey = cfg.apiKey;
  if (!apiKey) {
    console.error('No API key configured. Run: plane config set <API_KEY>');
    process.exit(1);
  }
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }
  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

function usage() {
  console.log(`Usage:\n  plane config set <API_KEY>\n  plane list workspaces|projects|tasks [--project <id>]\n  plane show task <id>\n  plane create task --title <title> [--project <id>] [--description <desc>]\n  plane update task <id> [--title <title>] [--description <desc>] [--status <status>]\n  plane comment task <id> --body <text>\n  plane assign task <id> --assignee <userId>\n  plane delete task <id>\n`);
}

function parseArgs(argv) {
  const args = { _: [] };
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i+1];
      if (next && !next.startsWith('--')) { args[key] = next; i += 2; }
      else { args[key] = true; i += 1; }
    } else {
      args._.push(a); i += 1;
    }
  }
  return args;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) { usage(); process.exit(0); }
  const args = parseArgs(argv);
  const cmd = args._[0];

  if (cmd === 'config') {
    if (args._[1] === 'set' && args._.length >= 3) {
      const apiKey = args._[2];
      const cfg = loadConfig(); cfg.apiKey = apiKey; saveConfig(cfg);
      console.log('API key saved to', CONFIG_PATH);
      process.exit(0);
    }
    usage(); process.exit(1);
  }

  if (cmd === 'list') {
    const what = args._[1];
    if (what === 'workspaces') {
      const res = await request('GET', '/workspaces');
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    }
    if (what === 'projects') {
      const res = await request('GET', '/projects');
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    }
    if (what === 'tasks') {
      const params = {};
      if (args.project) params.project = args.project;
      const res = await request('GET', '/tasks', null, params);
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    }
    usage(); process.exit(1);
  }

  if (cmd === 'show' && args._[1] === 'task') {
    const id = args._[2]; if (!id) { usage(); process.exit(1); }
    const res = await request('GET', `/tasks/${id}`);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  }

  if (cmd === 'create' && args._[1] === 'task') {
    const title = args.title || args._[2];
    if (!title) { console.error('Missing title'); usage(); process.exit(1); }
    const body = { title };
    if (args.project) body.project = args.project;
    if (args.description) body.description = args.description;
    const res = await request('POST', '/tasks', body);
    console.log(JSON.stringify(res, null, 2)); process.exit(0);
  }

  if (cmd === 'update' && args._[1] === 'task') {
    const id = args._[2]; if (!id) { usage(); process.exit(1); }
    const body = {};
    if (args.title) body.title = args.title;
    if (args.description) body.description = args.description;
    if (args.status) body.status = args.status;
    const res = await request('PATCH', `/tasks/${id}`, body);
    console.log(JSON.stringify(res, null, 2)); process.exit(0);
  }

  if (cmd === 'comment' && args._[1] === 'task') {
    const id = args._[2]; if (!id || !args.body) { console.error('Missing id or body'); usage(); process.exit(1); }
    const res = await request('POST', `/tasks/${id}/comments`, { body: args.body });
    console.log(JSON.stringify(res, null, 2)); process.exit(0);
  }

  if (cmd === 'assign' && args._[1] === 'task') {
    const id = args._[2]; if (!id || !args.assignee) { console.error('Missing id or assignee'); usage(); process.exit(1); }
    const res = await request('PATCH', `/tasks/${id}`, { assignee: args.assignee });
    console.log(JSON.stringify(res, null, 2)); process.exit(0);
  }

  if (cmd === 'delete' && args._[1] === 'task') {
    const id = args._[2]; if (!id) { usage(); process.exit(1); }
    const res = await request('DELETE', `/tasks/${id}`);
    console.log(JSON.stringify(res, null, 2)); process.exit(0);
  }

  usage(); process.exit(1);
}

main();
