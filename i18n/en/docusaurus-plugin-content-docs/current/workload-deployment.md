# Deploy an image workload

Qbit can create and operate a **container-image workload** on a remote server that you own or control. Qbit does not provide the server or hosted compute for this workflow; the deployment server must already be registered in the Workspace and have an active Agent.

## Prerequisites

Before creating the workload, verify that:

- the destination server belongs to the same Workspace, has active enrollment, and is not disabled;
- the Agent advertises the `deploy` capability;
- the destination server can pull the image;
- for a private image, Registry access is entered only through the Console's write-only credential input and is never copied into the workload name, description, or a support report.

:::info
During Phase 1, workloads execute only on **customer-owned third-party remote servers**. Qbit-hosted compute is not part of this workflow.
:::

## 1. Create the workload

Open **Workloads** in the Workspace and choose **Create workload**.

For an image-based application:

1. Enter a workload name and optional description.
2. Choose the **Deployment server** from the remote servers in the Workspace.
3. Set **Source** to **Container image**.
4. Enter the image reference. Documentation and tests should use non-customer placeholders such as `registry.example.invalid/team/web:1.2.3`.
5. Change Runtime Compose files only when your runtime definition requires a different file list.
6. Create the workload.

An image workload does not run a separate build step. The image source becomes part of the workload revision model and the current runtime is Docker Compose based.

## 2. Configure values and secrets

The workload page includes **Managed configuration**. Saving changes creates a new configuration revision.

The current value-upsert format is:

```text
scope|name|true-or-false|value
```

Supported scopes are:

- `interpolation`
- `runtime_environment`
- `build_argument`
- `build_secret`

The third field marks the value as private or non-private. A `build_secret` must be private, while a `build_argument` cannot be private.

To remove a value:

```text
scope|name
```

:::warning
Private values are not returned in plaintext after they are saved. Existing secrets are represented only by safe metadata such as configured state and an opaque reference. Never repeat a secret in a workload name, description, route, log, or support ticket.
:::

### Private Registry access

Under **Registry access**, you can keep the current configuration, set username-based or identity-based access, or clear stored access.

**Registry private value** is a write-only input. After saving, the Console exposes only safe configuration state and the Registry host; it does not provide the private value for read-back.

## 3. Ports, domains, and TLS

Workload routes use the following configuration format:

```text
component|domain|path|port|tls_mode|optional_certificate_ref
```

Current rules are:

- `path` starts with `/`;
- port is between 1 and 65535;
- `tls_mode` is `disabled`, `automatic`, or `certificate_ref`;
- when using `certificate_ref`, provide a valid reference rather than raw certificate or secret material;
- use the actual component key from the workload/effective definition.

Illustrative placeholder only:

```text
<component-key>|app.example.invalid|/|8080|automatic|
```

Qbit does not provide authoritative DNS hosting in this workflow. DNS outside Qbit must point the domain to the appropriate server/path; the route defines workload behavior in the control plane.

## 4. Volumes and resource limits

The current image-workload UI does not expose a separate volume or CPU/RAM editor. Advanced runtime changes are entered through **Qbit Compose override** and become part of the next configuration revision.

Before changing storage or resource settings:

- inspect the current effective definition;
- define mounts/volumes and limits for the actual runtime on your server;
- validate the new revision after every change;
- do not assume stopping or deleting a workload automatically deletes persistent data. Data lifecycle follows the resulting Compose/volume definition and storage on your own server.

For important data, review your independent backup policy before destructive configuration changes or workload deletion.

## 5. Validate before deployment

After creating or changing source/configuration, choose **Validate current revisions**.

Validation checks the current source and configuration revisions and, when successful, makes a **redacted effective definition** available to the Console. If validation fails:

- inspect the displayed diagnostics;
- correct the image reference, Registry access, routes, or configuration;
- validate the resulting new revisions again.

The current revisions must have a successful validation before the deploy action becomes available.

## 6. Deploy, observe, and stop

After successful validation, choose **Deploy validated revision**.

Each lifecycle action creates a deployment attempt. Current states are:

- `queued`
- `running`
- `succeeded`
- `failed`
- `cancelled`
- `timed_out`

The workload page also shows observed runtime and drift state. **Stop** queues a stop action for that workload on its registered server; stopping does not delete the workload or imply deletion of persistent data.

## 7. History, logs, retry, and rollback

**Deployment history** retains:

- deployment attempts;
- immutable deployment revisions.

Each attempt can expose details and **redacted workload logs**. When available, the Console also displays correlation, operation, and job identifiers for troubleshooting.

Depending on state/result, you can:

- cancel a queued or running attempt;
- **Retry exact revision** when an attempt is retryable;
- **Roll back** to an earlier immutable deployment revision.

Retrying targets the same previous revision snapshot. If you changed source or configuration, validate and deploy the new revision instead; retry is not a substitute for validating new changes.

## 8. Delete a workload

**Delete** is a real lifecycle action. Before deleting:

- verify the Workspace and workload;
- check active deployment attempts;
- independently review persistent storage/volumes and backups.

Do not assume that deleting the workload also removes every persistent volume or data set from your server.

## Troubleshooting

### Image pull fails

- verify the image reference;
- confirm the destination server has network access to the Registry;
- for a private Registry, re-enter the host and write-only credential configuration;
- never paste the credential into logs or support messages.

### The server cannot be used for deployment

Check Agent enrollment/connectivity and the advertised `deploy` capability. Knowing a server ID or reaching a route is not sufficient authority or runtime capability.

### Domain or TLS does not work

Check the route format, component key, port, path, and `tls_mode`. For `certificate_ref`, use a valid reference. Also verify DNS configuration outside Qbit.

### Deployment fails

Open deployment details and the redacted logs first. Keep correlation/operation/job IDs for investigation. Retry the exact revision only for a retryable/transient failure; after changing configuration, validate and deploy the new revision.

## Security notes

- workload operations target customer-owned remote servers only;
- enter secrets only through write-only fields;
- effective definitions and workload logs are redacted, but still review troubleshooting output before sharing it;
- verify tenant/Workspace and server target before deploy, stop, rollback, or delete;
- never place Agent machine credentials, private keys, tokens, raw certificate material, or secrets in documentation or support tickets.

Related guides: [Remote servers](/en/guide/remote-servers), [Remote operations and terminal](/en/guide/remote-operations), [Security](/en/guide/security), and [Troubleshooting](/en/guide/troubleshooting).
