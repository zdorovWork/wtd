# wtd (what to do)

wtd helps a person pick something to do by asking them questions, Akinator-style, and recommending the activities that fit their answers best.

## Language

**Activity**:
A single thing a person can do that wtd can recommend, such as one specific game or one specific movie. Each activity belongs to exactly one category and has its own page.
_Avoid_: Entity, item, product, title

**Category**:
A kind of activity the person chooses before answering questions. It has a name and how many activities belong to it, and it limits both the questions asked and the activities recommended. Currently: games and movies.
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

**Tag**:
A characteristic of activities within one category that a question asks about, such as "co-op" or "under two hours". An activity either has a tag or lacks it.
_Avoid_: Trait, attribute, property, feature

**Session**:
One run of questions and answers within a single chosen category, from the first question until the person leaves or starts over.
_Avoid_: Quiz, game, round

**Recommendation**:
The session's remaining leaders, shown as at most five cards. Five is the card cap, not the stop: wtd keeps asking while more than one leader remains and a question can still split them. It recommends when one leader stands out, when 15 answers have been given (top five of the ranking), or when no remaining question would split the leaders (the leftover pack, even if fewer than five). The person may reject it and keep answering in the same session.
_Avoid_: Result, match, suggestion

**Activity wish**:
The free-text a person writes about the activity they wanted after Keep asking, when no remaining question would split the leaders. The first time questions run out, that is still a recommendation of leftover leaders. wtd asks for the wish in a modal over the last question or recommendation, not on a separate screen.
_Avoid_: Description, meant activity, request, suggestion, feedback, activity-wish step
