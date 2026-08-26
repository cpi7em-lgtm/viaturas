import { describe, test, expect } from "vitest";
import { validatorToType } from "./validator_helpers.js";

describe("validatorToType", () => {
  test("commitTs matches Infer<v.commitTs()>, valid in any generated file", () => {
    // Writes go through `db.vars.commitTs` (a `CommitTsPlaceholder`), so a
    // bigint-only type would reject the intended insert/patch value.
    expect(validatorToType({ type: "commitTs" }, false)).toEqual(
      'bigint | import("convex/values").CommitTsPlaceholder',
    );
  });

  test("commitTs composes into container types", () => {
    expect(
      validatorToType(
        {
          type: "object",
          value: {
            commitTs: { fieldType: { type: "commitTs" }, optional: false },
          },
        },
        false,
      ),
    ).toEqual(
      '{ commitTs: bigint | import("convex/values").CommitTsPlaceholder }',
    );
    expect(
      validatorToType({ type: "array", value: { type: "commitTs" } }, false),
    ).toEqual('Array<bigint | import("convex/values").CommitTsPlaceholder>');
  });
});
