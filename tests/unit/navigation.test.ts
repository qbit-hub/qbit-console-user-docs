import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const docIds = [
  "getting-started",
  "workspaces",
  "remote-servers",
  "remote-operations",
  "monitoring",
  "alerts-notifications",
  "billing",
  "settings",
  "security",
  "coming-soon",
  "troubleshooting",
] as const;

const faDoc = (id: string) => resolve(process.cwd(), "docs", `${id}.md`);
const enDoc = (id: string) =>
  resolve(process.cwd(), "i18n/en/docusaurus-plugin-content-docs/current", `${id}.md`);

describe("documentation navigation", () => {
  it("keeps Persian and English guide coverage in parity", () => {
    expect(docIds).toHaveLength(11);
    for (const id of docIds) {
      expect(existsSync(faDoc(id)), `fa:${id}`).toBe(true);
      expect(existsSync(enDoc(id)), `en:${id}`).toBe(true);
    }
  });

  it("keeps public guide routes stable across the Docusaurus migration", () => {
    const faRoutes = docIds.map((id) => `/guide/${id}`);
    const enRoutes = docIds.map((id) => `/en/guide/${id}`);

    expect(faRoutes[0]).toBe("/guide/getting-started");
    expect(enRoutes[0]).toBe("/en/guide/getting-started");
    expect(enRoutes.map((route) => route.replace(/^\/en/, ""))).toEqual(faRoutes);
  });

  it("keeps Persian as the root locale and English under /en", () => {
    expect(existsSync(resolve(process.cwd(), "src/pages/index.tsx"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "docusaurus.config.ts"))).toBe(true);
  });
});
