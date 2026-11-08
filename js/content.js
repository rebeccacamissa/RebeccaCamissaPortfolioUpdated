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
    photo: {
      src: "assets/rebecca-adams.jpg",
      alt: "Portrait of Rebecca Adams smiling, wearing a black collared shirt and a plum headscarf",
      width: 840,
      height: 1417,
      caption: "Rebecca · Cape Town",
    },
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

  /* ------------------------- Footer · fun fact ------------------------- */
  // Measured 8 Nov 2026: first visit ≈ 227 KB total (77 KB gzipped HTML/CSS/JS,
  // 82 KB photo, 69 KB fonts). Re-measure if you add heavy images or libraries.
  funFact: {
    label: "Fun fact",
    headline: "This site barely sips your data.",
    text: "The whole page loads in about 230 KB — roughly a tenth of an average web page. On a 1 GB data bundle, you could open it around 4,500 times.",
    how: "How? No heavy frameworks, just two font files and one photo. Certificates and the CV only download when you ask for them.",
  },

  /* ------------------------ Adam · cat site guide ---------------------- */
  // Answers are assembled from this file + projects.js + certificates.js,
  // so Adam stays in sync when content changes. These are his lines.
  adam: {
    name: "Adam",
    role: "Rebecca's site guide",
    sleepAfterMs: 18000,
    // Welcome bubble shown once per visit, shortly after the page opens.
    nudgeDelayMs: 2500,
    nudgeDurationMs: 10000,
    placeholder: "Ask Adam about Rebecca…",

    quickReplies: [
      { label: "Show me her best projects", intent: "projects" },
      { label: "What are her top skills?", intent: "skills" },
      { label: "How do I contact her?", intent: "contact" },
      { label: "Download her CV", intent: "cv" },
      { label: "Tell me about CAPACITI", intent: "capaciti" },
      { label: "Give me a quick tour", intent: "tour" },
    ],

    text: {
      greeting: "Oh, hi! My name is Adam 🐾 How can I help you explore Rebecca's work today?",
      nudge: "Hi there, welcome! I'm Adam 🐾 I can help you explore Rebecca's work — just tap me!",
      hello: "Hello again! 😺 Pick a question below, or type your own.",
      thanks: "You're very welcome! *happy purr* 🐾",
      who: "I'm Adam — a fluffy white cat with a pink bowtie and a very important job: helping you find your way around Rebecca's portfolio. I know her projects, skills, journey and how to reach her.",
      fallback: "Hmm, I'm only a small cat, so I don't know that one yet 😿 Try one of the questions below — or send Rebecca a message and she'll answer herself.",
      projectsIntro: "Here's what Rebecca has been building:",
      projectAsk: "Tell me about",
      skillsIntro: "A few highlights from Rebecca's toolkit:",
      contactIntro: "Rebecca would love to hear from you! The quickest routes:",
      cvIntro: "Here's Rebecca's CV — one tap and it's yours:",
      certsIntro: "Rebecca's Coursera learning record has",
      capacitiIntro: "Rebecca is currently on CAPACITI's",
      backgroundIntro: "Rebecca's path so far — every step added a layer:",
      testimonialsIntro: "Here's what colleagues say about her:",
      locationIntro: "Rebecca is based in",
      tourOffer: "Want the 60-second tour? I'll walk you through everything 🐾",
      tourDone: "That's the tour! Thanks for walking with me 🐾 Tap me any time you have a question.",
      party: "Meow meow! 🎉 You found my secret party!",
      petted: "*purrrr* … that's the spot 😻",
      yarn: "Adam is chasing the yarn ball!",
      explorer: "You've explored every section — here's your Explorer badge! 🏅",
      doodles: "You found the doodles! Rebecca loves to sketch ✏️",
    },

    // Guided tour stops: `target` is a section id. {certs} / {projects} are filled in.
    tour: [
      { target: "hero", text: "Hi! This is Rebecca — a junior web developer in Cape Town, building through CAPACITI." },
      { target: "story", text: "Her story: from customer service to creative tech. Hover the numbers to see what backs them up." },
      { target: "pivot", text: "The pivot — every role added a layer. Scroll the timeline from 2024 to now." },
      { target: "voices", text: "Colleagues' reflections. Press Play and I'll let them speak for themselves." },
      { target: "toolkit", text: "Her toolkit — human and technical. Tap a skill tag to light up matching projects." },
      { target: "work", text: "Selected work: {projects} projects, including a live feed of her GitHub." },
      { target: "certificates", text: "{certs} certificates, each one readable right here on the page." },
      { target: "contact", text: "Like what you see? Send Rebecca a message — it goes straight to her inbox." },
    ],

    // One short line the first time a visitor reaches each section.
    reactions: {
      story: "Ooh, Rebecca's story! Hover a number to see the proof 🐾",
      pivot: "This is where things got interesting… the pivot!",
      voices: "My favourite part — kind words from colleagues 😻",
      toolkit: "Psst — tap a skill tag below and watch the projects light up.",
      work: "Projects! Bantu Connect is my favourite 🐾",
      certificates: "{certs} certificates! She's been busy 📚",
      contact: "Say hello to Rebecca — she'd love to hear from you!",
    },
  },

  /* ------------------------ Fun extras (footer) ------------------------ */
  fun: {
    explorerLabel: "Sections explored",
    explorerDone: "Explorer badge earned!",
    eggHint: "Psst — type “meow” anywhere on the page 🐾",
    stickerHint: "psst — drag the stickers",
  },
};
