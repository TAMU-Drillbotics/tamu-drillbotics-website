export interface FAQ {
  id: string;
  ref: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "q1",
    ref: "Q1",
    question: "Do I need prior engineering experience?",
    answer:
      "Most subteams take on first-year students. Curiosity and willingness to learn matter more than past projects.",
  },
  {
    id: "q2",
    ref: "Q2",
    question: "What's the time commitment?",
    answer:
      "Plan for 6 – 10 hours per week during the build cycle, more during competition lead-up. Project-based, not hours-tracked.",
  },
  {
    id: "q3",
    ref: "Q3",
    question: "When does recruitment open?",
    answer:
      "Each fall semester. Phase dates will be posted on this page once the 2026 – 27 cycle is set.",
  },
  {
    id: "q4",
    ref: "Q4",
    question: "What can I expect in the interview?",
    answer:
      "A 20 – 30 minute conversation with subteam leads. Bring questions; we'll ask about what you want to build.",
  },
  {
    id: "q5",
    ref: "Q5",
    question: "Can I join more than one subteam?",
    answer:
      "Members get assigned a primary subteam but often touch others as the project demands. Cross-discipline work is the norm.",
  },
  {
    id: "q6",
    ref: "Q6",
    question: "Is there a stipend?",
    answer:
      "No stipend, but the team covers expenses for travel, materials, and tools you need to ship your part of the project.",
  },
];
