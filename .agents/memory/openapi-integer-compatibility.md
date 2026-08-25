---
name: OpenAPI integer compatibility
description: Compatibility note for generated Zod schemas in this workspace.
---

When generating API helpers, represent identifier and count fields as OpenAPI `number` rather than `integer` because the installed Zod 3 runtime cannot typecheck Orval's generated `z.int()` calls.

**Why:** The current Orval output maps OpenAPI integers to a Zod 4-only helper while this workspace resolves Zod 3.

**How to apply:** Keep numeric fields typed as numbers in the contract and rerun codegen after contract edits.