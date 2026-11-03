import type { Answer } from "@/engine/recommendation";
import { Button } from "@/shared/components/button";

type AnswerStyle = {
  label: string;
  dotClassName: string;
};

export const answerOrder: Answer[] = [
  "yes",
  "probably",
  "dontKnow",
  "probablyNot",
  "no",
];

const answerStyles: Record<Answer, AnswerStyle> = {
  yes: { label: "Yes", dotClassName: "bg-emerald-500" },
  probably: { label: "Probably", dotClassName: "bg-lime-400" },
  dontKnow: { label: "Don't know", dotClassName: "bg-neutral-300" },
  probablyNot: { label: "Probably not", dotClassName: "bg-orange-300" },
  no: { label: "No", dotClassName: "bg-rose-500" },
};

type AnswerOptionProps = {
  answer: Answer;
  onSelect: (answer: Answer) => void;
};

export const AnswerOption = ({ answer, onSelect }: AnswerOptionProps) => {
  const { label, dotClassName } = answerStyles[answer];

  const handleSelect = () => onSelect(answer);

  return (
    <Button variant="option" onClick={handleSelect}>
      <span
        aria-hidden="true"
        className={`size-3.5 shrink-0 rounded-full border-2 border-ink ${dotClassName}`}
      />
      {label}
    </Button>
  );
};
