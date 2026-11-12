/**
 * Codex-style model-facing descriptions for the tools shipped with DSH.
 * The tool names and parameter schemas remain DSH's originals.
 */
export const TOOL_DESCRIPTIONS = {
  bash:
    'Runs a shell command and returns its output. Prefer dedicated file tools when they can perform the action. Always choose an explicit workdir instead of using `cd` when possible.',
  pwsh:
    'Runs a PowerShell command and returns its output. Prefer dedicated file tools when they can perform the action. Always choose an explicit workdir instead of using `Set-Location` when possible.',
  read:
    'Read a file from disk. Read enough surrounding context before editing, and prefer targeted reads for very large files.',
  write:
    'Write a complete file. Use this for new files or intentional full-file rewrites; prefer `edit` for small changes.',
  edit:
    'Edit an existing file with exact, minimal replacements. Read the target first and preserve unrelated user changes.',
  read_image:
    'Attach a local image to the conversation so it can be inspected visually.',
  glob:
    'Find files by name or glob pattern. Prefer this over recursive shell commands when locating files.',
  grep:
    'Search file contents by pattern. Prefer this over raw terminal search for repository exploration.',
  todo_write:
    'Maintain a concise execution plan for multi-step work. Keep exactly one current step in progress unless the work is genuinely parallel.',
  skill:
    'Load the full instructions for a skill. Call it before acting when the task names or clearly matches an available skill.',
  ask_user_question:
    'Ask the user a focused question only when a missing decision materially blocks safe progress. Prefer reasonable assumptions for ordinary implementation details.',
  web_search:
    'Search the web for current information. Use it when facts may have changed or when the user asks for up-to-date sources.',
  web_fetch:
    'Fetch a specific web page and return its readable content for inspection.',
  terminal_open:
    'Open a persistent terminal session for interactive commands, REPLs, watchers, or long-running processes.',
  terminal_send:
    'Send input to an existing persistent terminal session.',
  terminal_read:
    'Read recent output from a persistent terminal session without starting a new command.',
  terminal_signal:
    'Send a signal to a persistent terminal session, such as interrupting a running process.',
  terminal_close:
    'Close a persistent terminal session and release its resources.',
  terminal_list:
    'List active persistent terminal sessions and their identifiers.',
  job_output:
    'Read output from a background job.',
  job_list:
    'List background jobs started by the agent.',
  job_kill:
    'Stop a background job that is no longer needed.',
  list_agents:
    'List available sub-agents and their current status.',
  list_subagent_models:
    'Inspect model routes that can be assigned to a sub-agent. Use returned provider and model ids when delegating.',
  subagent:
    'Start an independently managed sub-agent for parallel or isolated work. Provide a self-contained task and use the returned id for follow-up.',
  subagent_fork:
    'Fork the current conversation into a sub-agent when the child needs the current context. Provide a focused task and avoid duplicating work.',
  send_message:
    'Send a follow-up instruction to a running or paused sub-agent.',
  interrupt_agent:
    'Interrupt a sub-agent when its current work is no longer needed.',
  workflow:
    'Run a multi-agent workflow script only when the user explicitly asks for a workflow or large-scale orchestration. Prefer direct work or one sub-agent for smaller tasks.',
  get_goal:
    'Read the current goal, including status, budgets, usage, and remaining work.',
  create_goal:
    'Create a goal only when the user explicitly asks for a persistent objective. Do not infer goals from ordinary tasks.',
  update_goal:
    'Update an existing goal only when the user requests its status change or the objective is fully achieved, blocked, or paused under the goal rules.',
  schedule_create:
    'Create a reminder or recurring automation only when the user asks to schedule future work or be notified later.',
  schedule_list:
    'List existing reminders and scheduled tasks.',
  schedule_delete:
    'Delete a scheduled task only when the user asks to remove it.',
  schedule_update:
    'Update an existing scheduled task while preserving settings the user did not ask to change.',
  present:
    'Present existing files as final deliverables. Use it when the user needs a separate file artifact; do not create a marketing mockup instead of the requested output.',
  working_directory:
    'Inspect or update the working directory used by subsequent file and shell operations.',
}
