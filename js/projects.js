/**
 * Project data for Selected Work — kept separate from UI code.
 *
 * kind    → label in the card's colour band.
 * tags    → shown on the card; tapping one highlights matching skills/projects.
 * skills  → toolkit skills this project demonstrates (must match a toolkit
 *           badge or bar name to cross-highlight). Edit to taste.
 * links   → add full https:// URLs; empty links are not rendered.
 * feed    → GitHub username: the card shows a live feed of recent repos/commits.
 */
window.SITE_PROJECTS = [
  {
    title: "Bantu Connect",
    category: "Community Beauty Platform",
    kind: "Concept study",
    problem:
      "Independent beauty professionals face a fragmented client journey: pricing, availability, reliable power, and booking all live in separate conversations.",
    solution:
      "A people-first platform concept that brings discovery and decision-making into one place, centred on a Smart Budget Matcher and a Power-Ready toggle.",
    result:
      "A more empowered route for solopreneurs — giving clients a clear match and enabling zero-friction WhatsApp booking.",
    tags: ["Product thinking", "User flows", "Mobile-first", "GitHub"],
    skills: ["Responsive UI", "UX Thinking", "Problem-solving", "GitHub"],
    links: { github: "https://github.com/rebeccacamissa/BANTU_CONNECT", live: "" },
  },
  {
    title: "Youth Opportunity Portal",
    category: "Career Access Platform",
    kind: "Web build",
    problem:
      "Young job seekers often struggle to find entry-level employment, learnerships, and skills opportunities because listings are scattered across confusing platforms.",
    solution:
      "A centralized, responsive portal designed to connect youth directly to career opportunities, application resources, and community guidance.",
    result:
      "Streamlined access to opportunities, reducing friction for applicants looking to start their professional journeys.",
    tags: ["Portal UX", "Community impact", "Responsive web", "GitHub", "Live"],
    skills: ["Responsive UI", "UX Thinking", "Problem-solving", "GitHub"],
    // Add the deployed URL to `live` to show the Live demo button.
    links: { github: "https://github.com/rebeccacamissa/youth-opportunity-portal", live: "" },
  },
  {
    title: "Public GitHub Feed & Projects Hub",
    category: "Work in Public",
    kind: "Live feed",
    problem:
      "Recruiters and engineering managers need transparent, verifiable proof of active coding habits rather than static claims.",
    solution:
      "Direct integration with a public GitHub feed displaying recent commit notes, active repositories, and ongoing code shipments.",
    result:
      "Complete transparency into everyday development progress, proving consistency, reliability, and continuous learning in public.",
    tags: ["Work in public", "Version control", "Open source", "GitHub"],
    skills: ["GitHub", "Time Management", "Adaptability"],
    links: { github: "https://github.com/rebeccacamissa", live: "" },
    feed: "rebeccacamissa",
  },
];
