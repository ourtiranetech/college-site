# Convex server-side patterns

## CLI project selection

`npx convex dev` and `npx convex deploy` must be run in a terminal **interactive** session (not a background job). The CLI reads:

- `convex.json` — project config (functions path, node externals, codegen, …). Without it the CLI shows "Project config not found".
- `.convex.local.json` — the selected project:
  ```json
  { "team": "karim-ourtirane", "project": "college-site-038d3" }
  ```
  - `team` — your team slug (e.g. `karim-ourtirane`)
  - `project` — the project slug (e.g. `college-site-038d3`)

Run `npx convex dev` once interactively to auto-select the project. After that, the CLI remembers it.

## Server query definition: `getMessages`

The server query `convex/messages.ts` must accept `paginationOpts` the same shape the client passes.

### Server args (convex/messages.ts)

```ts
export const getMessages = query({
  args: {
    salle: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { salle, paginationOpts } = args
    return await ctx.db
      .query("messages")
      .withIndex("by_salle", (q) => q.eq("salle", salle))
      .order("desc")
      .paginate(paginationOpts)
  },
})
```

### Validation rule: paginationOpts must be REQUIRED

The client `usePaginatedQuery` **always** injects `paginationOpts` into the args object. The server validator must therefore declare it as required, not optional:

```ts
// ✗ WRONG — runtime "extra field paginationOpts"
paginationOpts: v.optional(v.any()),

// ✗ WRONG — missing id; hook injects id
paginationOpts: v.object({ numItems: v.number(), cursor: v.string() }),

// ✓ CORRECT — use the server-provided validator
import { paginationOptsValidator } from "convex/server"
paginationOpts: paginationOptsValidator
```

The `convex/server` export `paginationOptsValidator` is pre-built for exactly this shape:

```ts
export const paginationOptsValidator = v.object({
  numItems: v.number(),
  cursor: v.union(v.string(), v.null()),
  endCursor: v.optional(v.union(v.string(), v.null())),
  id: v.optional(v.number()),
  maximumRowsRead: v.optional(v.number()),
  maximumBytesRead: v.optional(v.number()),
})
```

### `paginate()` call

The handler must call `ctx.db.query("messages").paginate(paginationOpts)` — **not** `.take().skip()`. The old `skip()` pattern was unsupported in this SDK version; `skip` must be passed as a query arg.

## Client hook: usePaginatedQuery

```ts
import { usePaginatedQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

function ChatPage() {
  const messagesQuery = usePaginatedQuery(
    api.messages.getMessages,
    { salle },
    { initialNumItems: 50 }
  )
  return (
    messagesQuery.status === "Exhausted"
      ? messagesQuery.results.map(...)
      : messagesQuery.status === "LoadingFirstPage"
        ? <div>Chargement...</div>
        : null
  )
}
```

Do **not** pass `paginationOpts` as a client arg — the hook injects it.

## Convex CLI

```bash
cd <project>
npx tsc --noEmit --skipLibCheck   # type-check (exit 0 = clean)
npx convex dev                    # interactive: select project, watch & deploy
npx convex deploy                 # push to production/dev
```
