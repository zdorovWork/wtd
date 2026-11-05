# Recommendations computed by a stateless server

The recommendation engine runs on `apps/server`, not in the browser: on every step the client sends the category, all answers given so far, and the rejection point, and the server replies with the next question or the recommendation. The server keeps no session state, so a session lives entirely in the client and undoing an answer stays a recompute (`0002-tag-scoring-recommendation-engine.md`). We chose this over keeping the engine in the client, which would keep shipping the whole category catalogue to the browser, and over server-stored sessions, which add storage, ids, and expiry for no product gain today.

## Consequences

Every answer is a network request, so the session UI needs a pending state. Activities reach the browser only as a recommendation or an activity page, never as a full catalogue.
