"use client";

import { type FormEvent, useId, useState } from "react";
import { DetectiveDuck } from "./detective-duck";
import { SendIcon } from "./ui";

type Reaction = {
  id: string;
  label: string;
};

const reactions: Reaction[] = [
  { id: "nailed", label: "🎯 Nailed it" },
  { id: "close", label: "🤔 Close" },
  { id: "missed", label: "👎 Missed" },
];

type PostedComment = {
  text: string;
  reactionLabel: string | undefined;
};

export const FeedbackComment = () => {
  const textareaId = useId();
  const [text, setText] = useState("");
  const [reactionId, setReactionId] = useState<string>();
  const [postedComment, setPostedComment] = useState<PostedComment>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim() && !reactionId) return;

    setPostedComment({
      text: text.trim(),
      reactionLabel: reactions.find((reaction) => reaction.id === reactionId)
        ?.label,
    });
    setText("");
    setReactionId(undefined);
  };

  return (
    <section
      aria-labelledby={`${textareaId}-heading`}
      className="rounded-3xl border-2 border-ink bg-white p-4 shadow-sticker"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink bg-duck/50">
          <DetectiveDuck className="mt-2 w-12" />
        </span>
        <div>
          <h2
            id={`${textareaId}-heading`}
            className="font-heading text-lg leading-tight font-semibold"
          >
            Did I crack the case?
          </h2>
          <p className="text-xs text-ink/60">
            Leave a note, it helps me get smarter.
          </p>
        </div>
      </div>

      {postedComment && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="ml-8 rounded-2xl rounded-tr-sm border-2 border-ink bg-duck/40 px-3 py-2 text-sm">
            {postedComment.reactionLabel && (
              <p className="font-bold">{postedComment.reactionLabel}</p>
            )}
            {postedComment.text && <p>{postedComment.text}</p>}
          </div>
          <p className="mr-8 rounded-2xl rounded-tl-sm border-2 border-ink bg-cream px-3 py-2 text-sm">
            Noted in my case file. Thanks, partner!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              aria-pressed={reaction.id === reactionId}
              onClick={() => setReactionId(reaction.id)}
              className="rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition aria-pressed:bg-ink aria-pressed:text-white"
            >
              {reaction.label}
            </button>
          ))}
        </div>
        <label htmlFor={textareaId} className="sr-only">
          Comment
        </label>
        <div className="flex items-end gap-2 rounded-2xl border-2 border-ink bg-cream p-2 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-beak">
          <textarea
            id={textareaId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={2}
            placeholder="What did you think of the recommendation?"
            className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-ink/40"
          />
          <button
            type="submit"
            aria-label="Send comment"
            className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-beak text-white"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  );
};
