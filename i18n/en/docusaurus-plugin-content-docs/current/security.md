# Security

Qbit Console is a control plane for third-party servers. Its security boundaries separate user identity, application authorization, and credential material.

## Authentication

Sign-in uses Qbit Account through OIDC Authorization Code with PKCE. Browser API requests use bearer authentication and explicitly omit cookie credentials for the Qbit API.

## Authorization

Backend authorization is authoritative. A route parameter, visible action, or known Workspace/server ID is not proof of permission.

For live server operations, Agent capabilities are also required to enable a feature, but capability advertisement does not replace tenant/user authorization. The control plane must still validate actor scope and permission before dispatch.

## Credentials

When registering a server, never enter a raw password, private key, access token, API key, or secret. If required, provide only an opaque **credential reference** managed by your operational environment.

Webhook destination endpoint/signing values are likewise treated as protected write-only or masked data.

## Multiple accounts

Additional account identity snapshots are stored in browser `sessionStorage`, not `localStorage`. Account switching partitions/recreates subject-scoped query state.

## Typed operations

Normal server automation uses typed, versioned APIs. The UI does not create raw shell commands for Docker lifecycle actions or fresh metrics collection. Operation history exposes durable state plus a bounded result/safe error, and a correlation ID can be used for troubleshooting.

Cancellation is also a controlled request. It is offered only for eligible states and is not equivalent to killing an unknown process directly from the browser.

## Privileged terminal

Terminal access is separate from typed automation and is intended for interactive troubleshooting of the selected customer server.

- the browser does not display the Agent machine credential or SSH private material;
- the one-time WebSocket ticket is short-lived and should never be copied into logs or support messages;
- terminal bytes are ephemeral and are not stored in the Console query cache;
- the session-creation audit path records sanitized metadata such as tenant, actor, server, correlation, and terminal-session ID;
- terminal input/output, command output, credentials, and secret tickets are not permitted audit payload material.

:::warning
The terminal can make real changes to the remote server. Verify the Workspace and server scope before connecting, and explicitly disconnect when troubleshooting is complete.
:::

## Remote-server actions

Viewing snapshots/history, managing alert metadata, or disabling a Qbit inventory record does not by itself execute a destructive command on the remote machine. In contrast, explicit actions such as **Collect fresh metrics**, container `start/stop/restart`, and connecting a terminal are real control-plane operations; review their confirmation/state before proceeding.

Qbit Console does not expose terminal or lifecycle access to Qbit's own internal hosts/containers. Internal Qbit operations remain in the independent Dokploy operations plane.

:::danger
Never store raw secrets in display names, remote references, tags, labels, or credential-reference fields, and never send raw secrets in support reports or terminal screenshots.
:::

Related: [Remote operations and terminal](/en/guide/remote-operations).
