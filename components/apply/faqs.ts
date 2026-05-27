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
      "Curiosity and willingness to learn matter more than past projects or prior knowledge, but some experience is helpful.",
  },
  {
    id: "q2",
    ref: "Q2",
    question: "What's the time commitment?",
    answer:
      "Plan for 5 – 7 hours per week during the research cycle (fall semester), and 7 – 12 hours per week during competition lead-up(spring semester). task-based, not hours-tracked.",
  },
  {
    id: "q3",
    ref: "Q3",
    question: "When does recruitment open?",
    answer:
      "Once a year in the fall semester. Phase dates will be posted on this page once the 2026 – 27 cycle is set.",
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
      "No. Members get assigned a primary subteam but cross-discipline work is *highly* encouraged.",
  },
  {
    id: "q6",
    ref: "Q6",
    question: "Is there a stipend?",
    answer:
      "No stipend, but the team covers expenses for travel, materials, and tools you need to ship your part of the project.",
  },
];
