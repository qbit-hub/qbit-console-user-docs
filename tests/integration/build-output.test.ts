import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const dist = resolve(process.cwd(), "build");
const read = (path: string) => readFileSync(resolve(dist, path), "utf8");
const findSearchIndex = (localeDir = "") => {
  const dir = resolve(dist, localeDir);
  const file = readdirSync(dir).find((entry) => /^search-index-[a-f0-9]+\.json$/.test(entry));
  if (!file) throw new Error(`search index missing for ${localeDir || "fa"}`);
  return readFileSync(resolve(dir, file), "utf8");
};

describe("Docusaurus production output", () => {
  it("builds Persian and English home pages with locale metadata", () => {
    const fa = read("index.html");
    const en = read("en/index.html");

    expect(fa).toContain('lang=fa-IR');
    expect(fa).toContain('dir=rtl');
    expect(fa).toContain("مستندات Qbit Console");
    expect(en).toContain('lang=en-US');
    expect(en).toContain('dir=ltr');
    expect(en).toContain("Qbit Console Docs");
  });

  it("preserves representative public guide routes", () => {
    expect(read("guide/remote-servers.html")).toContain("سرورهای ریموت");
    expect(read("guide/remote-operations.html")).toContain("عملیات ریموت و ترمینال");
    expect(read("guide/security.html")).toContain("هیچ secret خامی");
    expect(read("en/guide/remote-servers.html")).toContain("Remote servers");
    expect(read("en/guide/remote-operations.html")).toContain("Remote operations and terminal");
    expect(read("en/guide/security.html")).toContain("Never store raw secrets");
  });

  it("ships local search indexes and locally bundled brand assets", () => {
    expect(findSearchIndex()).toContain("سرورهای ریموت");
    expect(findSearchIndex()).toContain("عملیات ریموت و ترمینال");
    expect(findSearchIndex("en")).toContain("Remote servers");
    expect(findSearchIndex("en")).toContain("Remote operations and terminal");
    expect(read("favicon.svg")).toContain("svg");
    expect(read("index.html")).toContain("favicon.svg");
  });
});
