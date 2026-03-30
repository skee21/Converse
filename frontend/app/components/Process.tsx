"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import ProcessCard from "./ProcessCard";

type ProcessItem = {
  number: string;
  title: string;
  description: string;
};

const processItems: ProcessItem[] = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your free account in seconds. Set your native language and the language you want to practice. Your profile is anonymous — no personal info is shared with conversation partners.",
  },
  {
    number: "02",
    title: "Pick a Language",
    description:
      "Choose from dozens of supported languages. Tell us your current proficiency level so we can match you with the right partners — whether native speakers or fellow learners.",
  },
  {
    number: "03",
    title: "Match or Duel",
    description:
      "Hit 'Find a Match' to chat with a native speaker who will help you practice, or choose 'Duel' to compete against another learner. Both modes are graded to track your progress.",
  },
  {
    number: "04",
    title: "Start Chatting",
    description:
      "Converse in your target language. In Match mode, locals guide you naturally. In Duel mode, you respond to a prompt and are scored against your opponent. All conversations are anonymous and safe.",
  },
  {
    number: "05",
    title: "Get Graded",
    description:
      "After each session, our AI analyzes your conversation for grammar accuracy, vocabulary range, fluency, and natural expression. You receive a detailed scorecard with tips for improvement.",
  },
  {
    number: "06",
    title: "Climb the Leaderboard",
    description:
      "Your grades accumulate into XP points that determine your global rank. Compete with learners worldwide, maintain your streak, and earn badges as you level up your language skills.",
  },
];

export default function Process({ className }: { className?: string }) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div
      className={cn(
        "content-stretch flex flex-col gap-[30px] items-start px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto",
        className
      )}
      data-name="Process block"
      id="how-it-works"
    >
      {processItems.map((item, index) => (
        <ProcessCard
          key={index}
          number={item.number}
          title={item.title}
          description={item.description}
          isExpanded={expandedIndex === index}
          onToggle={() => handleToggle(index)}
          className="mx-[3px]"
        />
      ))}
    </div>
  );
}
