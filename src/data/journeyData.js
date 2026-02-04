export const journeyPhases = [
  {
    id: "origin",
    order: 1,
    state: "completed",

    phase: {
      title: "Exploration & Curiosity",
      shortLabel: "Origin",
    },

    preview: {
      headline: "Learning how things work",
      summary: "Early exploration into problem-solving and systems thinking.",
    },

    details: {
      description:
        "This phase focused on discovering interests, understanding basic concepts, and building curiosity-driven learning habits.",
      highlights: [
        "Exploration mindset",
        "Research-driven learning",
        "Goal clarity",
      ],
    },
  },

  {
    id: "foundation",
    order: 2,
    state: "completed",

    phase: {
      title: "Foundational Thinking",
      shortLabel: "Base",
    },

    preview: {
      headline: "Building strong fundamentals",
      summary: "Established core technical and logical foundations.",
    },

    details: {
      description:
        "Focused on understanding fundamentals deeply and creating a strong base for future growth.",
      highlights: [
        "Core concepts",
        "System fundamentals",
        "Consistency and discipline",
      ],
    },
  },

  {
    id: "execution",
    order: 3,
    state: "current",

    phase: {
      title: "Applied Building",
      shortLabel: "Execution",
    },

    preview: {
      headline: "Turning ideas into reality",
      summary: "Learning through hands-on implementation and iteration.",
    },

    details: {
      description:
        "This phase emphasizes building real systems, experimenting, learning from failures, and improving through feedback.",
      highlights: [
        "Project execution",
        "Iteration mindset",
        "Debugging and refinement",
      ],
    },
  },

  {
    id: "refinement",
    order: 4,
    state: "future",

    phase: {
      title: "System Refinement",
      shortLabel: "Polish",
    },

    preview: {
      headline: "Sharpening quality and clarity",
      summary: "Improving structure, performance, and design decisions.",
    },

    details: null,
  },

  {
    id: "expansion",
    order: 5,
    state: "future",

    phase: {
      title: "Growth & Expansion",
      shortLabel: "Scale",
    },

    preview: {
      headline: "Expanding impact and depth",
      summary: "Exploring advanced systems and broader problem spaces.",
    },

    details: null,
  },
];
