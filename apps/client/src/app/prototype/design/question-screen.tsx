import type { Question } from "@/data/types";
import type { Answer } from "@/engine/recommendation";
import { DetectiveDuck } from "./detective-duck";
import { ArrowLeftIcon, HomeIcon, IconButton, SpeechBubble } from "./ui";

type AnswerOption = {
  answer: Answer;
  label: string;
  dotClassName: string;
};

const answerOptions: AnswerOption[] = [
  { answer: "yes", label: "Yes", dotClassName: "bg-emerald-500" },
  { answer: "probably", label: "Probably", dotClassName: "bg-lime-400" },
  { answer: "dontKnow", label: "Don't know", dotClassName: "bg-neutral-300" },
  {
    answer: "probablyNot",
    label: "Probably not",
    dotClassName: "bg-orange-300",
  },
  { answer: "no", label: "No", dotClassName: "bg-rose-500" },
];

type QuestionScreenProps = {
  question: Question;
  questionNumber: number;
  categoryName: string;
  onAnswer: (answer: Answer) => void;
  onBack: () => void;
  onHome: () => void;
};

export const QuestionScreen = ({
  question,
  questionNumber,
  categoryName,
  onAnswer,
  onBack,
  onHome,
}: QuestionScreenProps) => (
  <main className="flex flex-1 flex-col px-5 pt-6 pb-28">
    <header className="flex items-center justify-between">
      <IconButton label="Back" icon={<ArrowLeftIcon />} onClick={onBack} />
      <span className="rounded-full border-2 border-ink bg-white px-4 py-1.5 font-heading font-semibold shadow-sticker-sm">
        {categoryName}
      </span>
      <IconButton label="Home" icon={<HomeIcon />} onClick={onHome} />
    </header>

    <section
      aria-live="polite"
      className="mt-10 grid grid-cols-[42%_1fr] items-start gap-3"
    >
      <DetectiveDuck mood="thinking" className="mt-10 w-full" />
      <SpeechBubble tail="left" className="pt-7">
        <span className="absolute -top-11 -left-3 grid size-10 place-items-center rounded-xl border-2 border-ink bg-ink font-heading text-lg font-bold text-duck">
          {questionNumber}
        </span>
        <h1 className="font-heading text-xl leading-snug font-semibold">
          {question.text}
        </h1>
      </SpeechBubble>
    </section>

    <fieldset className="mt-8 flex flex-col gap-3">
      <legend className="sr-only">Your answer</legend>
      {answerOptions.map((option) => (
        <button
          key={option.answer}
          type="button"
          onClick={() => onAnswer(option.answer)}
          className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white px-5 py-3.5 text-left font-heading text-lg font-semibold shadow-sticker-sm transition hover:bg-duck/40 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
        >
          <span
            aria-hidden="true"
            className={`size-3.5 rounded-full border-2 border-ink ${option.dotClassName}`}
          />
          {option.label}
        </button>
      ))}
    </fieldset>
  </main>
);
