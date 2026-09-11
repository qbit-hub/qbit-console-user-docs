# Remote operations and terminal

Qbit performs live actions against **your customer-owned third-party server** from that server's detail page. These features do not move the server into Qbit infrastructure and are not used to manage Qbit's own hosts or containers.

Open the Workspace, go to **Infrastructure → Servers**, open the server, and use the **Monitoring**, **Containers**, **Operations**, **Terminal**, and **Alerts & deliveries** tabs.

## Prerequisite: Agent and capabilities

Live features are enabled from capabilities advertised by the Agent bound to that server. If the Console reports that a feature is unsupported, check connection/enrollment and the server's advertised capabilities first. Knowing a server ID or being able to see a route is not authorization to execute an action.

- `monitor` is required to request a fresh metrics collection;
- Docker read access is required to view containers;
- Docker lifecycle access is required for `start` / `stop` / `restart`;
- `terminal` is required for the interactive terminal.

An `Unavailable` connection is different from a `Stale` snapshot: the former describes server/Agent connectivity, while the latter only means the newest retained observation is old.

## Typed remote operations

Normal Qbit automation creates a **typed remote operation**. The browser does not submit raw shell text or raw Docker commands. Each operation has an explicit type, ID, creation time, durable state, and a bounded result or safe error visible in the **Operations** tab.

Current states are:

- `Queued`;
- `Running`;
- `Succeeded`;
- `Failed`;
- `Cancelled`;
- `Timed out`.

Cancellation is offered only for `Queued` or `Running` operations that do not already have a cancellation request. Choosing **Cancel operation** records a cancellation request; the final state may not change immediately while that request is processed.

## Collect fresh metrics

Snapshot and history views remain passive: opening them or changing a history window does not poll or execute on the server.

The **Monitoring** tab also has an explicit **Collect fresh metrics** action. When the server advertises the `monitor` capability, Qbit creates a typed operation to request a fresh Agent metrics collection. Its state can be followed in the UI and operation history.

See [Resource monitoring](/en/guide/monitoring) for snapshot, history, and stale-data behavior.

## Docker containers

The **Containers** tab exposes a safe container projection and the currently allow-listed lifecycle actions for the selected server. In the current Console:

- `running`, `paused`, or `restarting`: **Stop** and **Restart**;
- `created` or `exited`: **Start** and **Restart**;
- `dead` or `unknown`: no lifecycle action is offered by the UI.

A confirmation is shown before an action. Confirming it creates a typed remote operation; the browser does not submit a raw Docker command.

:::info
Application deployment, Compose, and database-workload features are not treated as operational in this guide. This page documents only the currently merged server/container behavior.
:::

## Privileged terminal

Terminal access is a **separate privileged surface** from typed automation. When the server advertises the `terminal` capability, you can create a short-lived interactive session, resize it, send input, and explicitly disconnect it.

Current UI dimensions are limited to:

- 20–400 columns;
- 10–200 rows.

The current Agent runtime defaults for the local PTY are:

- close an idle session after 10 minutes;
- cap the local PTY lifetime at 30 minutes;
- a control-plane-issued expiry can end the session sooner.

These are **current runtime defaults**, not a permanent protocol promise. If the session expires or disconnects, create a new session to reconnect.

### Terminal security and audit

- the browser does not display the Agent machine credential, SSH private material, or the one-time WebSocket ticket;
- terminal bytes are ephemeral and are not stored in the Console query cache;
- the session-creation audit path records sanitized metadata such as tenant, actor, server, correlation, and terminal-session ID;
- terminal input/output, command output, credentials, and secret tickets are not permitted audit payload material.

:::danger
The terminal is for troubleshooting the selected customer server and can make real changes to that machine. Verify the Workspace and server scope before running a command. Qbit's own production hosts/containers are not exposed here; internal Qbit operations remain in the independent Dokploy operations plane.
:::

## What to check after a failure

- `Unavailable`: check Agent/server connectivity;
- missing capability: check the Agent/version and advertised capabilities;
- `Failed` or `Timed out`: keep the safe operation result and correlation ID for troubleshooting;
- `Cancel requested`: wait for the operation's final state;
- terminal expired/disconnected: create a new session;
- never include passwords, tokens, private keys, WebSocket tickets, or secrets in a support report.

Related: [Troubleshooting](/en/guide/troubleshooting) and [Security](/en/guide/security).
