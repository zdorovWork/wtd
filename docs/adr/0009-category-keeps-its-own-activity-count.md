# A category keeps its own activity count

A category is its name and how many activities belong to it. It does not load games or movies. We rejected a catalogue module inside categories that switches on the category slug: another category would be another condition, and the category would depend on every activity module. Games and movies own their controllers. When they write their activities, they set the category count to the number of rows left. The session step stays `getNextStep`, which receives the activities the controller already loaded.

## Consequences

`GET /api/categories` returns the slug, the name, and the count. One activity and the next step are `GET /api/games/activities/:slug`, `POST /api/games/next-step`, and the same pair for movies. The list of every slug goes away. The client renders every category the server sends. Adding a category is still a new activity table, a new join table, and a new controller (`0008-one-table-per-category.md`); that controller updates the count.

## Considered options

One catalogue module that dispatches to a games adapter and a movies adapter. Rejected, because the category module would know every activity module.
