/**
 * Site content — edit text here, not in the markup.
 * Loaded as a classic script (works from file:// without a server)
 * and exposed as window.SITE_CONTENT for the section renderers.
 */
window.SITE_CONTENT = {
  name: "Rebecca Adams",
  firstName: "Rebecca",

  nav: [
    { label: "Story", href: "#story" },
    { label: "Selected Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  email: "camissa.adams17@gmail.com",

  social: {
    github: "https://github.com/rebeccacamissa",
    linkedin: "https://www.linkedin.com/in/rebecca-adams-tech",
  },

  cv: {
    href: "assets/rebecca-adams-cv.pdf",
    fileName: "Rebecca-Adams-CV.pdf",
  },

  /* ----------------------------- 01 · Hero ----------------------------- */
  hero: {
    location: "Cape Town, South Africa",
    availability: "Available for junior roles",

    greeting: "Hello, I'm Rebecca",
    role: "Junior Web Developer",
    subtitle:
      "An emerging tech professional bringing creative, solution-based web development from a strong customer service foundation.",

    ctas: {
      primary: { label: "View Selected Work", href: "#work" },
      resume: { label: "Download Resume" },
      plainText: { label: "Plain-Text Version", activeLabel: "Styled Version" },
      story: { label: "My Story", href: "#story" },
    },

    program: {
      lead: "Currently building through",
      name: "CAPACITI",
      detail: "12-month programme",
    },

    codeTag: "</>",
    tags: [
      "HTML / CSS / PEOPLE",
      "Creative Tech",
      "People-first problem solver",
      "Systems & Stories",
    ],
  },

  /* --------------------------- 02 · Profile ---------------------------- */
  story: {
    eyebrow: "01 — PROFILE / A CAREER STORY IN PROGRESS",

    // `id` links a metric to any element on the page with data-proof="<id>".
    // `hint` is the tooltip text — placeholder copy, edit freely.
    metrics: [
      { id: "concepts", value: 3, label: "concepts completed", hint: "Concept builds designed and shipped — see Selected Work." },
      { id: "learning", value: 11, label: "learning records", hint: "Courses and certificates logged through CAPACITI." },
      { id: "skills", value: 15, label: "skills in practice", hint: "From HTML & CSS to listening before solving." },
    ],
    metricsNote: "Small proof points. Real momentum.",
    metricsHelp: "Hover or tap a number to see where it shows up.",

    headline: "I build with care, clarity, and a belief that every new skill can open a door.",
    headlineHighlight: "can open a door.",

    // `proof` = which metric ids this paragraph supports.
    paragraphs: [
      {
        text: "I entered the workforce straight after matriculating in 2024 to help support my family. That beginning taught me resilience, real-world accountability, and the value of listening carefully before offering a solution.",
        proof: ["skills"],
      },
      {
        text: "Customer service and claims processing sharpened my ability to move calmly through changing priorities. Then I discovered the creative logic of technology: design a better path, build it thoughtfully, and make someone's day easier.",
        proof: ["skills", "concepts"],
      },
      {
        text: "Today, I am growing rapidly through CAPACITI. I bring a grounded work ethic to web development — and a fresh eye for experiences that feel capable, clear, and human.",
        proof: ["learning", "concepts"],
      },
    ],

    cta: { label: "Download CV PDF" },

    quote: {
      mark: "“",
      text: "Creative solutions work best when they are built around the person using them.",
      attribution: "R.A.",
    },
  },

  /* --------------------------- 03 · The Pivot -------------------------- */
  pivot: {
    eyebrow: "02 — THE PIVOT / CUSTOMER SERVICE - CREATIVE TECHNOLOGY",
    headline: "Transferable skills, new terrain.",
    headlineHighlight: "new terrain.",
    subtitle:
      "Every role has added a layer: responsive communication, accurate systems work, then technical curiosity. Together, they shape how I approach the web.",

    milestones: [
      {
        era: "2024",
        label: "The Starting Point",
        title: "Matriculated — then stepped into the working world.",
        description:
          "After matriculating from Groote Schuur High School, I entered the workforce to support my family. It became an early lesson in commitment, responsibility, and meeting people where they are.",
      },
      {
        era: "2025",
        label: "Customer Service Foundation",
        title: "Built calm in fast-moving service environments.",
        description:
          "At Shift Espresso Bar, I coordinated busy service moments, adopted POS tools quickly, and learned how thoughtful communication keeps a team moving under pressure.",
      },
      {
        era: "2025–26",
        label: "Operations & Claims",
        title: "Turned accuracy into a professional habit.",
        description:
          "As a Claims Specialist at EXL | Hollard, I handled high-volume enquiries, maintained precise digital records, and used structured problem-solving to navigate complex cases.",
      },
      {
        era: "Now",
        label: "Career Acceleration",
        title: "Growing into creative technology through CAPACITI.",
        description:
          "I am accelerating my career through the CAPACITI 12-month programme, building modern web experiences that bring practical solutions and human insight together.",
      },
    ],

    banner: "Customer Insight → Digital Problem-Solving",
  },

  /* ---------------------- 04 · Mentorship & Growth --------------------- */
  voices: {
    eyebrow: "03 — MENTORSHIP & GROWTH",
    label: "Room for real voices",
    headline: "What people say:",
    subtitle:
      "A few verified reflections from colleagues who have worked alongside Rebecca — sharing the qualities they have seen in practice: reliability, initiative, clarity, and generous collaboration.",

    controls: { previous: "Previous", next: "Next", play: "Play", pause: "Pause" },
    autoplayMs: 5000,

    // Add a full https:// LinkedIn URL to `linkedin` to show the profile badge.
    testimonials: [
      {
        name: "Princely M.",
        role: "CAPACITI programme colleague",
        headline: "Professional, reliable, supportive.",
        quote: "I've really enjoyed working with Rebecca. She's professional, reliable, supportive, and always brings a positive attitude to the team. I'd happily recommend her to any organisation.",
        linkedin: "https://www.linkedin.com/in/princely-makhwara-096285197/",
      },
      {
        name: "Laverne R.",
        role: "CAPACITI programme colleague",
        headline: "An absolute driving force.",
        quote: "An absolute driving force in our group. Rebecca consistently brings innovative ideas to the table and ensures our deliverables are always top-tier.",
        linkedin: "",
      },
      {
        name: "Musa N.",
        role: "CAPACITI programme colleague",
        headline: "Dependable and insightful.",
        quote: "Dependable, insightful, and incredibly hardworking. Becca is the kind of team member who elevates everyone else's work just by being part of the process.",
        linkedin: "https://www.linkedin.com/in/musa-nkosi-243a09308/",
      },
      {
        name: "Sinalo K.",
        role: "CAPACITI programme colleague",
        headline: "Dedication and clear communication.",
        quote: "I am always amazed by her dedication and clear communication. Rebecca has a unique talent for keeping the team focused and moving forward.",
        linkedin: "https://www.linkedin.com/in/sinalo-kekana-b97116249",
      },
    ],
  },

  /* ----------------------------- 06 · Toolkit -------------------------- */
  toolkit: {
    eyebrow: "05 — TOOLKIT",
    headline: "What I bring to the table.",
    subtitle:
      "My toolkit is both technical and human. I'm attentive to the details inside a system — and to the people moving through it.",

    categories: [
      {
        id: "human",
        label: "Human & Workplace",
        skills: [
          { name: "Teamwork & Collaboration", value: 94 },
          { name: "Time Management", value: 88 },
          { name: "Adaptability", value: 96 },
          { name: "Rapid learning - high attention to detail", value: 91 },
          { name: "Professional verbal / written English", value: 93 },
          { name: "Customer enquiry handling", value: 97 },
        ],
      },
      {
        id: "tools",
        label: "Tools & Technical",
        skills: [
          { name: "Responsive UI", value: 78 },
          { name: "Data Analysis", value: 72 },
          { name: "Advanced Excel", value: 82 },
          { name: "Google Workspace", value: 92 },
          { name: "Microsoft 365", value: 88 },
          { name: "GitHub", value: 68 },
        ],
      },
    ],

    // Clicking a badge highlights matching bars, badges and project cards.
    // A badge can be a string or { name, note } — notes appear as a footnote.
    badges: [
      "Responsive UI", "GitHub", "Data Analysis", "Advanced Excel",
      "Google Workspace", "Microsoft 365",
      {
        name: "HubSpot CRM",
        note: "Self-taught: I do not hold a formal Coursera certificate for HubSpot CRM. I built this skill entirely in my own time through self-directed learning and hands-on practice.",
      },
      "UX Thinking", "Problem-solving", "Teamwork & Collaboration", "Time Management", "Adaptability",
    ],
    badgesHelp: "Tap a skill to highlight where it shows up in my work.",
  },

  /* -------------------------- 07 · Selected Work ----------------------- */
  // Project details live in js/projects.js.
  work: {
    eyebrow: "06 — SELECTED WORK",
    headline: "Ideas, made useful.",
    headlineHighlight: "made useful.",
    subtitle:
      "Three concept-to-interface studies that bring together product empathy, practical constraints, and clear digital journeys.",
  },

  /* -------------------------- 08 · Certificates ------------------------ */
  // Certificate records live in js/certificates.js.
  certificates: {
    eyebrow: "07 — CERTIFICATES",
    kicker: "Coursera Learning Record",
    headline: "Credentials, on display.",
    headlineHighlight: "on display.",
    subtitle:
      "Select a certificate to read it directly on the page. Each card is ready for its dedicated source document, creating a clear, employer-friendly evidence library.",
    filters: [
      { id: "all", label: "All" },
      { id: "ai", label: "AI", long: "AI & Machine Learning" },
      { id: "web", label: "Web Development", long: "Web Development & Front-End" },
      { id: "data", label: "Data", long: "Data Science & Engineering" },
    ],
  },

  /* --------------------------- 09 · Contact ---------------------------- */
  contact: {
    eyebrow: "08 — SAY HELLO",
    headline: "Ask Rebecca.",
    headlineHighlight: "Rebecca.",
    // Placeholder intro copy — edit freely.
    subtitle:
      "Have a question, an opportunity, or a project in mind? Send a message and it lands straight in my inbox.",
    channels: { emailLabel: "Email me", linkedinLabel: "LinkedIn" },

    // Formspree endpoint — submissions are forwarded to the email on the Formspree account.
    formEndpoint: "https://formspree.io/f/xnpqaoby",
    form: {
      title: "Send a message",
      name: "Your Name",
      email: "Email Address",
      message: "Message",
      submit: "Send Message",
      sending: "Sending…",
      success: "Thank you — your message is on its way. I'll reply as soon as I can.",
      error: "Something went wrong sending your message. Please try again, or email me directly.",
    },
  },
};
