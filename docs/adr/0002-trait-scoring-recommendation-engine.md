# Trait-scoring recommendation engine, framework-free

Recommendations are computed by scoring every activity in the category against the answers given so far, one trait per question, and choosing the next question as the one that best splits the remaining candidates. We rejected a hand-built decision tree: it grows unmanageably, cannot absorb "Don't know" or "Probably" honestly, and yields a single leaf where we want a ranked recommendation. The engine is plain TypeScript with no React or Next.js imports, so it can move to `apps/server` unchanged; it is logic, not a mock.

## Consequences

The engine is a pure function of (activities, questions, answers), which makes undoing an answer a recompute and keeps it testable with `node:test`.
