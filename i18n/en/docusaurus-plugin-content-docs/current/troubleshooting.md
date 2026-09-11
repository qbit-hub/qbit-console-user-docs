# Troubleshooting

Use these checks to distinguish Console/API failures from the remote server's own state.

## The Console asks me to sign in again

- Review the active account session in **Settings**.
- Sign in through Qbit Account again if the token expired.
- With multiple accounts, confirm that the active account has access to the target Workspace.

## I cannot see a Workspace or server

- Verify the active Workspace in the application bar.
- Review your membership and role.
- After an account switch, navigate to a Workspace available to the new account.
- Remember that backend authorization can hide or reject resources even if you know their IDs.

## The Qbit API is unreachable

An API/network error is different from a remote server having an `Unavailable` connection state. Check the Console's connection to the Qbit API/service separately.

## The Agent or required capability is unavailable

If **Monitoring**, **Containers**, or **Terminal** reports that a feature is unsupported:

1. Check server connection and enrollment state.
2. Confirm the Agent bound to that server is online and compatible.
3. Check the required capability (`monitor`, Docker read/lifecycle, or `terminal`).
4. Do not fall back to raw shell execution; a missing capability means that operation should not be dispatched.

## No resource snapshot is shown

- Check server connection and enrollment state.
- Review the last accepted snapshot timestamp.
- `Stale` means the newest retained data is old; it does not mean the page performed a fresh poll.
- Without an accepted snapshot, the Console will not invent a real-time value.
- If `monitor` is supported and you need fresh data, use **Collect fresh metrics**; that action creates a typed operation.

## An operation is `Failed` or `Timed out`

- Review the operation type and state in **Operations**.
- Record the bounded result/safe error shown by the Console.
- Keep the correlation ID for a support report.
- For `Queued` or `Running` operations, submit **Cancel operation** only when the UI offers it.
- `Cancel requested` does not mean the operation has ended immediately; wait for the final state.
- Do not repeat the same operation by sending a raw shell or Docker command from the browser.

## A container action is unavailable

The UI limits actions by container state and lifecycle capability. `dead` or `unknown` has no lifecycle action. `start/stop/restart` is offered only for supported states. If an action is missing, check state and capability rather than bypassing the policy with a raw command.

## The terminal will not connect or disconnected

- Check that the server advertises the `terminal` capability.
- If the session is expired, create a new session.
- The current Agent runtime defaults close an idle local PTY after 10 minutes and cap the local PTY lifetime at 30 minutes; a control-plane-issued expiry can end it sooner.
- After a connection loss, check Agent/network state and create a new session.
- Never include a WebSocket ticket, credential, private key, or sensitive terminal output in a support report.

## A notification was not delivered

1. Confirm the rule is enabled.
2. Confirm the destination is bound to the rule.
3. Open delivery history.
4. Review attempt status and errors.
5. If authorized and appropriate, submit an administrative replay.

Replay retries notification delivery only and does not create a server operation.

## Dates do not follow the selected language

The calendar may have been explicitly overridden. In **Settings**, return to “follow language default” or select Gregorian/Jalali directly.

## Useful information for a support report

Include:

- the affected route/page;
- approximate time;
- non-secret Workspace/server identifier;
- operation ID and correlation ID when shown;
- operation state and the safe displayed error text;
- never passwords, tokens, private keys, WebSocket tickets, signing secrets, or sensitive terminal contents.

Related: [Remote operations and terminal](/en/guide/remote-operations) and [Security](/en/guide/security).
