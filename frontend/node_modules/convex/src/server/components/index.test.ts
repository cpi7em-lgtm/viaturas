import { expect, test } from "vitest";

import { v } from "../../values/index.js";
import { defineApp, defineComponent } from "./index.js";

test("app.use throws on empty component name", () => {
  const app = defineApp() as any;

  const importedComponentDefinition = {
    componentDefinitionPath: "components/workflow",
    defaultName: "workflow",
  } as any;

  expect(() => app.use(importedComponentDefinition, { name: "" })).toThrow(
    /component name cannot be empty/i,
  );
});

test("app.use requires the options arg only when a component declares required env vars", () => {
  const app = defineApp();
  const requiredEnv = defineComponent("requiredEnv", {
    env: { THING_I_NEED: v.string() },
  });
  const optionalEnv = defineComponent("optionalEnv", {
    env: { THING_I_WANT: v.optional(v.string()) },
  });
  const emptyEnv = defineComponent("emptyEnv", { env: {} });

  // Type-only assertions. Never invoked: `app.use` needs a runtime component
  // with a `componentDefinitionPath`, which these plain definitions lack.
  void (() => {
    // @ts-expect-error a required env var means the options arg can't be dropped
    app.use(requiredEnv);
    // @ts-expect-error nor can `env` itself be omitted
    app.use(requiredEnv, {});
    app.use(requiredEnv, { env: { THING_I_NEED: "a string" } });

    // With only optional env vars, both forms are allowed.
    app.use(optionalEnv);
    app.use(optionalEnv, { env: {} });
    app.use(optionalEnv, { env: { THING_I_WANT: "a string" } });

    // A component declaring no env vars needs no `env` (and `env: {}` is fine).
    app.use(emptyEnv);
    app.use(emptyEnv, {});
    app.use(emptyEnv, { env: {} });
  });
});
