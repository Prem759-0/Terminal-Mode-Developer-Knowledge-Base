import { KnowledgeEntry } from '@/types';

export const seedEntries: KnowledgeEntry[] = [
  {
    id: '0001',
    title: 'React useCallback vs useMemo',
    content: `## useCallback vs useMemo

Both hooks memoize values between renders, but serve different purposes.

**useCallback** memoizes a *function reference*:
\`\`\`
const handleClick = useCallback(() => {
  doSomething(dep);
}, [dep]);
\`\`\`

**useMemo** memoizes a *computed value*:
\`\`\`
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);
\`\`\`

Key rule: use \`useCallback\` when passing callbacks to optimized child components. Use \`useMemo\` when the computation itself is expensive. Don't over-optimize — profile first.

*Reference: React docs, Kent C. Dodds blog*`,
    tags: ['react', 'hooks', 'performance', 'javascript'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0002',
    title: 'Git Bisect — Binary Search for Bugs',
    content: `## Git Bisect Workflow

\`git bisect\` performs a binary search through commit history to find the commit that introduced a bug.

**Start session:**
\`\`\`
git bisect start
git bisect bad          # current commit is broken
git bisect good v2.1.0  # last known good tag
\`\`\`

Git will checkout a midpoint commit. Test it, then mark it:
\`\`\`
git bisect good   # or
git bisect bad
\`\`\`

Repeat until Git identifies the culprit commit. End with:
\`\`\`
git bisect reset
\`\`\`

**Automate it:**
\`\`\`
git bisect run npm test
\`\`\`

Git will run the command automatically and mark commits good/bad based on exit code.`,
    tags: ['git', 'debugging', 'workflow', 'cli'],
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0003',
    title: 'CSS Container Queries — Component-Level Responsiveness',
    content: `## Container Queries

Unlike media queries (which respond to viewport width), container queries respond to the **parent container's size**.

**Setup:**
\`\`\`css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

This allows components to be truly self-contained — they adapt to wherever they're placed, not the viewport.

*Browser support: Chrome 105+, Firefox 110+, Safari 16+*

**Key insight:** Design systems should use container queries for component-level breakpoints. Viewport breakpoints remain relevant for page-level layout only.`,
    tags: ['css', 'responsive', 'frontend', 'design-systems'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0004',
    title: 'TypeScript Discriminated Unions Pattern',
    content: `## Discriminated Unions

A powerful pattern for type-safe state modeling. Each union member has a *discriminant* — a literal type property.

\`\`\`typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };
\`\`\`

TypeScript narrows the type inside switch/if blocks:

\`\`\`typescript
function render(state: LoadingState) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'success': return <List data={state.data} />;
    case 'error': return <Error msg={state.error} />;
    default: return null;
  }
}
\`\`\`

This eliminates impossible states — you can never access \`state.data\` when status is 'loading'.

*Related: "Making impossible states impossible" — Richard Feldman*`,
    tags: ['typescript', 'patterns', 'type-safety'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0005',
    title: 'PostgreSQL EXPLAIN ANALYZE — Query Debugging',
    content: `## Reading Query Plans

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id;
\`\`\`

**Key terms:**
- **Seq Scan** — full table scan, often bad on large tables
- **Index Scan** — using an index, good
- **Nested Loop** — good for small datasets, bad for large ones
- **Hash Join** — better for large dataset joins
- **cost=X..Y** — estimated rows, actual rows, time

**Red flags:**
- Rows estimate wildly different from actual (stale statistics → run \`ANALYZE\`)
- Seq Scan on a large table where you expect indexed access
- Sort node without an index to back it

**Fix slow query:**
1. Add missing index: \`CREATE INDEX CONCURRENTLY idx_orders_user ON orders(user_id);\`
2. Run \`ANALYZE tablename;\` if estimates are off
3. Consider partial indexes for filtered queries`,
    tags: ['postgresql', 'databases', 'performance', 'sql'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0006',
    title: 'Vim Motions Cheat Sheet — Core Movements',
    content: `## Essential Vim Motions

**Word movements:**
- \`w\` / \`b\` — next/prev word start
- \`e\` / \`ge\` — next/prev word end
- \`W\` / \`B\` / \`E\` — same, WORD (whitespace-delimited)

**Line movements:**
- \`0\` / \`^\` / \`$\` — start / first non-blank / end
- \`f{char}\` / \`F{char}\` — jump to next/prev occurrence of char on line
- \`t{char}\` / \`T{char}\` — jump just before/after char

**Block movements:**
- \`{\` / \`}\` — prev/next paragraph (empty line)
- \`%\` — matching bracket/paren/brace
- \`gg\` / \`G\` — top / bottom of file
- \`{n}G\` — jump to line n

**Text objects (use with operators):**
- \`iw\` / \`aw\` — inner / around word
- \`i"\` / \`a"\` — inner / around quotes
- \`ip\` / \`ap\` — inner / around paragraph
- \`it\` / \`at\` — inner / around HTML tag

*Pro tip: combine operators + motions: \`ci"\` = change inside quotes, \`da}\` = delete around braces*`,
    tags: ['vim', 'editor', 'productivity', 'cli'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0007',
    title: 'Docker Multi-Stage Builds for Node.js',
    content: `## Optimized Node.js Dockerfile

\`\`\`dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Runtime (minimal image)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

**Why multi-stage?**
- Final image contains no build tools (no TypeScript, webpack, etc.)
- Dramatically smaller image (often 200MB → 50MB)
- No development dependencies in production
- Non-root user for security

*Verify with:* \`docker build -t myapp . && docker images myapp\``,
    tags: ['docker', 'devops', 'nodejs', 'security'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0008',
    title: 'Event Loop — Microtasks vs Macrotasks',
    content: `## JavaScript Event Loop Priority

Execution order in a single tick:

1. **Call stack** — synchronous code runs first
2. **Microtask queue** — Promises (.then/.catch), queueMicrotask(), MutationObserver
3. **Macrotask queue** — setTimeout, setInterval, I/O callbacks, requestAnimationFrame

\`\`\`javascript
console.log('1');              // sync

setTimeout(() => {
  console.log('4');            // macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3');            // microtask
});

console.log('2');              // sync
// Output: 1, 2, 3, 4
\`\`\`

**Critical insight:** ALL microtasks drain before the next macrotask. If you add microtasks inside a microtask handler, they run before any macrotask — this can starve the event loop.

\`\`\`javascript
// This will block rendering indefinitely!
function infiniteMicrotasks() {
  Promise.resolve().then(infiniteMicrotasks);
}
\`\`\`

*Use queueMicrotask() as a lighter alternative to Promise.resolve().then()*`,
    tags: ['javascript', 'async', 'performance', 'fundamentals'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0009',
    title: 'SSH Config — Simplify Remote Connections',
    content: `## ~/.ssh/config Tricks

Instead of typing \`ssh -i ~/.ssh/prod-key.pem ubuntu@203.0.113.42 -p 2222\` every time:

\`\`\`
Host prod
  HostName 203.0.113.42
  User ubuntu
  IdentityFile ~/.ssh/prod-key.pem
  Port 2222
  ServerAliveInterval 60
  ServerAliveCountMax 3

Host bastion
  HostName 10.0.0.5
  User ec2-user
  IdentityFile ~/.ssh/bastion.pem
  
Host internal-db
  HostName 10.0.1.20
  User ubuntu
  ProxyJump bastion
  IdentityFile ~/.ssh/internal.pem
\`\`\`

Now: \`ssh prod\` / \`ssh internal-db\` (tunneled through bastion automatically).

**Useful options:**
- \`ProxyJump\` — jump host / bastion tunneling
- \`LocalForward\` — local port forwarding: \`LocalForward 5432 localhost:5432\`
- \`ControlMaster auto\` + \`ControlPath\` — connection multiplexing (reuse TCP connection)
- \`AddKeysToAgent yes\` + \`UseKeychain yes\` — macOS keychain integration`,
    tags: ['ssh', 'cli', 'devops', 'productivity'],
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '0010',
    title: 'Zustand — Minimal React State Management',
    content: `## Why Zustand Over Redux

Zustand is 1KB (gzipped), requires zero boilerplate, and works outside React components.

**Basic store:**
\`\`\`typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => ({ items: [...s.items, item] })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      total: () => get().items.reduce((sum, i) => sum + i.price, 0),
    }),
    { name: 'cart-storage' }
  )
);
\`\`\`

**Access outside React:**
\`\`\`typescript
const { addItem } = useCartStore.getState();
\`\`\`

**Subscriptions:**
\`\`\`typescript
const unsub = useCartStore.subscribe(
  (state) => state.items.length,
  (count) => console.log('Cart count:', count)
);
\`\`\``,
    tags: ['react', 'state-management', 'zustand', 'javascript'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
