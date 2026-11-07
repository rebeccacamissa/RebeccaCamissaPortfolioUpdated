/**
 * Certificate data for the Evidence Library — kept separate from UI code.
 * Titles, issuers, dates and verify links are taken from the certificate PDFs.
 *
 * category → must match a filter id in SITE_CONTENT.certificates.filters
 * issuer   → shown as the provider tag ("" = not set yet)
 * date     → ISO "YYYY-MM-DD" or "" if not listed
 * pdf      → path to the certificate PDF in assets/certificates/ ("" = viewer shows "coming soon")
 * source   → public Coursera verification URL
 */
window.SITE_CERTIFICATES = [
  /* --- AI & Machine Learning --- */
  {
    title: "AI For Everyone",
    issuer: "DeepLearning.AI", platform: "Coursera", date: "2026-08-11", category: "ai",
    pdf: "assets/certificates/ai-for-everyone.pdf",
    source: "https://coursera.org/verify/GEIPRIIFXN60",
  },
  {
    title: "Google AI Essentials",
    issuer: "Google", platform: "Coursera", date: "2026-06-23", category: "ai",
    pdf: "assets/certificates/google-ai-essentials.pdf",
    source: "https://coursera.org/verify/specialization/D8YIBKFEZAUH",
  },
  {
    title: "Introduction to Generative AI",
    issuer: "Google Cloud", platform: "Coursera", date: "2026-08-18", category: "ai",
    pdf: "assets/certificates/introduction-to-generative-ai.pdf",
    source: "https://coursera.org/verify/PCUMP3T3ECSJ",
  },
  {
    title: "Generative AI: Prompt Engineering Basics",
    issuer: "IBM", platform: "Coursera", date: "2026-08-11", category: "ai",
    pdf: "assets/certificates/prompt-engineering-basics.pdf",
    source: "https://coursera.org/verify/Z8YBDG8FH1HM",
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI & Stanford Online", platform: "Coursera", date: "2026-08-26", category: "ai",
    pdf: "assets/certificates/supervised-machine-learning.pdf",
    source: "https://coursera.org/verify/AU1AZSVU47MV",
  },
  {
    title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
    issuer: "DeepLearning.AI & Stanford Online", platform: "Coursera", date: "2026-09-01", category: "ai",
    pdf: "assets/certificates/unsupervised-learning-recommenders-reinforcement-learning.pdf",
    source: "https://coursera.org/verify/1VJHZD5MP8E7",
  },

  /* --- Web Development & Front-End --- */
  {
    title: "Introduction to Front-End Development",
    issuer: "Meta", platform: "Coursera", date: "2026-11-03", category: "web",
    pdf: "assets/certificates/introduction-to-front-end-development.pdf",
    source: "https://coursera.org/verify/VW0YJGMJAE5X",
  },
  {
    title: "Version Control",
    issuer: "Meta", platform: "Coursera", date: "2026-11-05", category: "web",
    pdf: "assets/certificates/version-control.pdf",
    source: "https://coursera.org/verify/7FSA9CR7QWOW",
  },
  {
    title: "HTML and CSS in depth",
    issuer: "Meta", platform: "Coursera", date: "2026-11-05", category: "web",
    pdf: "assets/certificates/html-and-css-in-depth.pdf",
    source: "https://coursera.org/verify/B52VNC1YI71V",
  },
  {
    title: "Principles of UX/UI Design",
    issuer: "Meta", platform: "Coursera", date: "2026-11-03", category: "web",
    pdf: "assets/certificates/principles-of-ux-ui-design.pdf",
    source: "https://coursera.org/verify/ABJOYAWS2NQL",
  },
  {
    title: "Front-End Developer Capstone",
    issuer: "Meta", platform: "Coursera", date: "2026-11-03", category: "web",
    pdf: "assets/certificates/front-end-developer-capstone.pdf",
    source: "https://coursera.org/verify/FITRGRCJ2O3O",
  },
  {
    title: "Coding Interview Preparation",
    issuer: "Meta", platform: "Coursera", date: "2026-11-06", category: "web",
    pdf: "assets/certificates/coding-interview-preparation.pdf",
    source: "https://coursera.org/verify/KNB3VGZ6SJ3V",
  },
  {
    title: "The Full Stack",
    issuer: "Meta", platform: "Coursera", date: "2026-11-06", category: "web",
    pdf: "assets/certificates/the-full-stack.pdf",
    source: "https://coursera.org/verify/KVWD1ECX8CQQ",
  },
  {
    title: "Introduction to HTML5",
    issuer: "University of Michigan", platform: "Coursera", date: "2026-09-22", category: "web",
    pdf: "assets/certificates/introduction-to-html5.pdf",
    source: "https://coursera.org/verify/JM20Y8EDRANR",
  },
  {
    title: "Introduction to CSS3",
    issuer: "University of Michigan", platform: "Coursera", date: "2026-09-29", category: "web",
    pdf: "assets/certificates/introduction-to-css3.pdf",
    source: "https://coursera.org/verify/GB5796OIYUQW",
  },
  {
    title: "Interactivity with JavaScript",
    issuer: "University of Michigan", platform: "Coursera", date: "2026-10-05", category: "web",
    pdf: "assets/certificates/interactivity-with-javascript.pdf",
    source: "https://coursera.org/verify/2VNH0G9OLPR6",
  },
  {
    title: "Advanced Styling with Responsive Design",
    issuer: "University of Michigan", platform: "Coursera", date: "2026-10-12", category: "web",
    pdf: "assets/certificates/advanced-styling-with-responsive-design.pdf",
    source: "https://coursera.org/verify/2W745NWOA3SW",
  },
  {
    title: "Web Design for Everybody Capstone",
    issuer: "University of Michigan", platform: "Coursera", date: "2026-10-12", category: "web",
    pdf: "assets/certificates/web-design-for-everybody-capstone.pdf",
    source: "https://coursera.org/verify/XGZX053VP12I",
  },

  /* --- Data Science & Engineering --- */
  {
    title: "Python for Data Science, AI & Development",
    issuer: "IBM", platform: "Coursera", date: "2026-08-18", category: "data",
    pdf: "assets/certificates/python-for-data-science-ai-and-development.pdf",
    source: "https://coursera.org/verify/34D0WRNMMG4A",
  },
];
