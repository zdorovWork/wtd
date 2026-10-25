# wtd (what to do)

wtd helps a person pick something to do by asking them questions, Akinator-style, and recommending the activities that fit their answers best.

## Language

**Activity**:
A single thing a person can do that wtd can recommend, such as one specific game or one specific movie. Each activity belongs to exactly one category and has its own page.
_Avoid_: Entity, item, product, title

**Category**:
A kind of activity the person chooses before answering questions; it limits both the questions asked and the activities recommended. Currently: games and movies.
_Avoid_: Type, section, vertical

**Game**:
An activity in the games category.

**Movie**:
An activity in the movies category.
_Avoid_: Film

**Question**:
Something wtd asks the person to narrow down which activities in the chosen category fit them. Every question belongs to one category.

**Answer**:
The person's reply to a question, on a five-point scale: Yes, Probably, Don't know, Probably not, No.
_Avoid_: Response, option

**Trait**:
A characteristic of activities within one category that a question asks about, such as "co-op" or "under two hours". An activity either has a trait, lacks it, or leaves it unknown.
_Avoid_: Attribute, tag, property, feature

**Session**:
One run of questions and answers within a single chosen category, from the first question until the person leaves or starts over.
_Avoid_: Quiz, game, round

**Recommendation**:
The ranked set of up to five activities that best fit the answers given so far in a session. The person may reject it and keep answering in the same session.
_Avoid_: Result, match, suggestion
