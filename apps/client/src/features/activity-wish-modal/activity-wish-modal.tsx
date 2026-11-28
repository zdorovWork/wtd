"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  ACTIVITY_WISH_MAX_LENGTH,
  sessionReturnFocusId,
  useQuizSession,
} from "@/modules/quiz-session";
import { IconButton } from "@/shared/components/icon-button";
import { CloseIcon, SendIcon } from "@/shared/components/icons";
import { Typography } from "@/shared/components/typography";

const focusableSelector =
  'button:not([disabled]), [href], textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const ActivityWishModal = () => {
  const headingId = useId();
  const textareaId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismissRef = useRef<() => void>(() => {});
  const [text, setText] = useState("");
  const { isActivityWishOpen, saveActivityWish, dismissActivityWish } =
    useQuizSession();

  dismissRef.current = dismissActivityWish;

  useEffect(() => {
    if (!isActivityWishOpen) {
      return;
    }

    setText("");
    const dialog = dialogRef.current;
    const focusables = () =>
      dialog
        ? [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
        : [];

    focusables()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const items = focusables();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.getElementById(sessionReturnFocusId)?.focus();
    };
  }, [isActivityWishOpen]);

  if (!isActivityWishOpen) {
    return null;
  }

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveActivityWish(text);
  };

  const handleOverlayClick = () => {
    dismissActivityWish();
  };

  const handleCloseClick = () => {
    dismissActivityWish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        className="absolute inset-0 bg-ink/40"
        onClick={handleOverlayClick}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative w-full max-w-[430px] rounded-3xl border-2 border-ink bg-cream p-4 shadow-sticker"
      >
        <div className="flex justify-end">
          <IconButton
            label="Close"
            icon={<CloseIcon />}
            onClick={handleCloseClick}
          />
        </div>
        <Typography
          as="h2"
          id={headingId}
          size="xl"
          font="heading"
          weight="semibold"
        >
          I ran out of useful questions.
        </Typography>
        <Typography as="p" size="sm" color="muted" className="mt-1">
          Describe the activity you had in mind.
        </Typography>
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor={textareaId}>
            <Typography as="span" className="sr-only">
              Describe the activity you had in mind.
            </Typography>
          </label>
          <div className="flex items-end gap-2 rounded-2xl border-2 border-ink bg-white p-2 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-beak">
            <textarea
              id={textareaId}
              value={text}
              onChange={handleTextChange}
              maxLength={ACTIVITY_WISH_MAX_LENGTH}
              rows={3}
              placeholder="The game or movie you were hoping for"
              className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-ink/40"
            />
            <button
              type="submit"
              aria-label="Save activity wish"
              className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-beak text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
