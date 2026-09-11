# Resource monitoring

Qbit Console shows the latest accepted resource snapshot and retained snapshot history. Viewing snapshots/history is **passive**: opening the page or changing a history window does not trigger a new poll or command on the server. Alongside that passive behavior, the **Monitoring** tab has an explicit **Collect fresh metrics** action when the server advertises the `monitor` capability.

## Latest resource state

The server detail page can show:

- CPU usage;
- memory usage;
- disk usage;
- network received/transmitted counters;
- uptime;
- 1, 5, and 15 minute load averages;
- observation and acceptance timestamps;
- snapshot source and schema version.

A **Stale** snapshot is still the last accepted observation, but it should not be interpreted as the server's current real-time state. An `Unavailable` connection is a separate condition describing server/Agent connectivity.

## Resource history

Open **Resource history** from the server detail page. Current windows include the last hour, last 24 hours, and all retained snapshots. CPU, memory, and disk trends are rendered from the data already returned by the API and do not cause additional polling.

## Collect fresh metrics

In the server detail **Monitoring** tab, **Collect fresh metrics** is an explicit action separate from viewing snapshots/history. If the Agent advertises the `monitor` capability, Qbit creates a typed remote operation requesting a fresh Agent metrics collection. The request can be followed as an operation.

If `monitor` is not advertised, the Console reports the feature as unsupported instead of falling back to raw shell execution.

## Calendar presentation

Domain timestamps remain canonical ISO-8601 values. The Console can render dates using Gregorian or Jalali calendars; this only changes presentation/input behavior.

## When no snapshot is available

1. Check server connection and enrollment state.
2. Confirm the Agent and expected ingestion source are active.
3. Compare the latest observed and accepted timestamps.
4. If fresh data is required and `monitor` is supported, use **Collect fresh metrics**.
5. Distinguish a Qbit API/network error from the remote server's own availability state.

:::info
Refreshing the browser does not execute a command on the remote machine. Only the explicit **Collect fresh metrics** action creates a typed operation for a fresh collection.
:::

Related: [Remote operations and terminal](/en/guide/remote-operations).
