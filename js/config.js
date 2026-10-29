/**
 * ==============================================================================
 * CENTRAL CONFIGURATION FILE: Get Knowledge
 * ==============================================================================
 * 
 * UPDATE ALL YOUR BUSINESS DETAILS, COURSES, FEES, PAYMENT INFO, AND GOOGLE FORMS
 * IN THIS SINGLE FILE. Everything across the website updates automatically!
 */

const SITE_CONFIG = {
  // ----------------------------------------------------------------------------
  // 1. ORGANIZATION & BRANDING DETAILS
  // ----------------------------------------------------------------------------
  org: {
    name: "Get Knowledge",
    shortName: "Get Knowledge",
    tagline: "Learn New Skills. Build Your Future.",
    subheading: "Live, interactive 20-day cohort-based online training. Backend engineering, LLMs, Vector Databases, RAG, and Agentic AI for just ₹199.",
    foundedYear: "2024",
    email: "getknowledge2026@gmail.com",
    supportEmail: "getknowledge2026@gmail.com",
    phone: "+91 96262 61123",
    whatsappNumber: "919626261123",
    whatsappDefaultMessage: "Hello Get Knowledge, I am interested in joining the AI Development 20-day course. Could you please share admission details?",
    address: "Bengaluru, Karnataka, India",
    workingHours: "Monday to Saturday: 9:30 AM - 7:30 PM IST",
    socialLinks: {
      youtube: "",
      linkedin: "",
      instagram: "",
      telegram: "",
      twitter: ""
    }
  },

  // ----------------------------------------------------------------------------
  // 2. PAYMENT DETAILS (UPI QR & DIRECT TRANSFER)
  // ----------------------------------------------------------------------------
  payment: {
    // Official UPI QR & ID Details
    upiId: "9384955009@airtel",
    payeeName: "Get Knowledge",
    qrImagePath: "assets/images/getknowledge-upi-qr.png",
    courseFee: 199,
    
    // Bank Transfer (IMPS / NEFT / RTGS) Details
    bankDetails: {
      accountHolder: "Get Knowledge",
      bankName: "Airtel Payments Bank",
      accountNumber: "9384955009",
      accountType: "Savings / Current",
      ifscCode: "AIRP0000001",
      branch: "Online Transfer"
    },

    // Important notices for students
    verificationTurnaround: "12 to 24 hours",
    securityNotice: "We will NEVER ask for your UPI PIN, ATM PIN, OTP, net banking password, or card CVV. To pay ₹199, enter your UPI PIN only inside your own UPI app.",
    manualNotice: "Enrollment is verified before your Google Meet batch invite is sent."
  },

  // ----------------------------------------------------------------------------
  // 2.1 GOOGLE SHEET REAL-TIME INTEGRATION
  // ----------------------------------------------------------------------------
  googleSheet: {
    scriptUrl: "",
    autoSaveLocal: true
  },

  // ----------------------------------------------------------------------------
  // 3. GOOGLE FORMS INTEGRATION
  // ----------------------------------------------------------------------------
  googleForms: {
    applicationFormUrl: "",
    applicationCourseEntryId: "",
    paymentProofFormUrl: "",
    paymentCourseEntryId: "",
    paymentAmountEntryId: ""
  },

  // ----------------------------------------------------------------------------
  // 4. CURRENT AVAILABLE COURSES
  // ----------------------------------------------------------------------------
  courses: [
    {
      id: "ai-development",
      title: "AI Development",
      badge: "20-Day Live Cohort",
      category: "ai",
      categoryName: "Artificial Intelligence",
      shortDescription: "Master modern AI development in an intensive 20-day live program. Learn Python Backend APIs, LLMs, Document Ingestion, Vector Databases, Search, RAG pipelines, and Agentic AI for just ₹199.",
      fullDescription: "The AI Development 20-Day Live Cohort by Get Knowledge is a hands-on, engineering-driven program designed to take you from backend fundamentals to building and deploying production-grade AI systems. Guided live on Google Meet by Nandha Prakash (Software Developer at Slate AI), you will learn how to build scalable backend APIs, connect and prompt Large Language Models (LLMs), build automated document ingestion pipelines, implement vector similarity search, build production RAG systems with hybrid search, and develop autonomous Agentic AI workflows with tool use. Zero fluff, 100% practical coding, and personal doubt resolution.",
      fee: 199,
      currency: "INR",
      currencySymbol: "₹",
      duration: "20 Days (Intensive Live Program)",
      level: "Beginner Friendly",
      classFormat: "Live Online on Google Meet",
      schedule: "Daily Live Sessions (Mon – Fri), 7:30 PM – 9:00 PM IST",
      nextBatchDate: "Starting Next Cohort",
      language: "English & Tamil / Hindi (Interactive)",
      featured: true,
      instructor: {
        name: "Nandha Prakash",
        title: "Software Developer at Slate AI",
        experience: "AI & Backend Systems Engineer",
        avatar: "assets/images/instructor-nandha.svg",
        bio: "Software Developer at Slate AI specializing in scalable backend architectures, LLM integration, Vector Search, production RAG pipelines, and Agentic AI workflows."
      },
      learningOutcomes: [
        "Build scalable, asynchronous AI backend microservices using Python & FastAPI",
        "Master Large Language Model (LLM) APIs, structured outputs, and prompt engineering patterns",
        "Build automated Document Ingestion pipelines to parse PDFs, Markdown, and raw text",
        "Generate embeddings and perform high-speed similarity search using Vector Databases (ChromaDB, Pinecone)",
        "Architect production-grade RAG (Retrieval-Augmented Generation) with hybrid search & re-ranking",
        "Develop autonomous Agentic AI systems capable of multi-step reasoning, tool execution, and memory",
        "Deploy and monitor end-to-end full-stack AI applications with real-time response streaming"
      ],
      syllabus: [
        {
          module: "Phase 1 (Days 1 - 4)",
          title: "Backend Foundations & Asynchronous AI APIs",
          duration: "Days 1 to 4",
          topics: [
            "Day 1: Modern Python for AI engineering: virtual environments, async/await, and backend structure",
            "Day 2: High-performance REST APIs with FastAPI: route handling, request models, and Pydantic validation",
            "Day 3: Backend data persistence, database connections, and error handling for AI microservices",
            "Day 4: Real-time AI streaming: Server-Sent Events (SSE) and token-by-token streaming backends"
          ]
        },
        {
          module: "Phase 2 (Days 5 - 8)",
          title: "Large Language Models (LLMs) & Function Calling",
          duration: "Days 5 to 8",
          topics: [
            "Day 5: LLM Foundations: Tokens, context windows, API integrations (OpenAI, Anthropic & open models via Groq/Ollama)",
            "Day 6: Advanced Prompt Engineering: System prompts, Few-shot prompting, and Chain-of-Thought (CoT)",
            "Day 7: Structured JSON Outputs: Enforcing reliable response schemas with Pydantic and JSON mode",
            "Day 8: Function Calling & Tool Use: Connecting LLMs to backend APIs, calculation tools, and external services"
          ]
        },
        {
          module: "Phase 3 (Days 9 - 12)",
          title: "Document Ingestion & Vector Databases",
          duration: "Days 9 to 12",
          topics: [
            "Day 9: Document Ingestion Pipelines: Extracting, cleaning, and preprocessing PDFs, DOCX, and web pages",
            "Day 10: Advanced Text Chunking: Recursive character splitting, semantic chunking, and token-aware overlap",
            "Day 11: Text Embeddings: High-dimensional vector representations, distance metrics (Cosine/Euclidean), and embedding models",
            "Day 12: Vector Databases & Similarity Search: Setting up ChromaDB, Pinecone, and Qdrant with HNSW vector indexing"
          ]
        },
        {
          module: "Phase 4 (Days 13 - 16)",
          title: "Production RAG (Retrieval-Augmented Generation)",
          duration: "Days 13 to 16",
          topics: [
            "Day 13: Core RAG Pipeline: Query embedding, top-k vector retrieval, prompt construction, and context synthesis",
            "Day 14: Search & Retrieval Optimization: Hybrid Search (BM25 keyword search + dense vector search) and re-ranking",
            "Day 15: Reducing Hallucinations: Grounding responses, source citation extraction, verification, and evaluation",
            "Day 16: Multi-Document Q&A System: Building a production enterprise knowledge base search engine"
          ]
        },
        {
          module: "Phase 5 (Days 17 - 20)",
          title: "Agentic AI, Autonomous Workflows & Capstone",
          duration: "Days 17 to 20",
          topics: [
            "Day 17: Introduction to Agentic AI: Autonomous reasoning loops, the ReAct pattern, and goal decomposition",
            "Day 18: Multi-Tool Agents: Equipping agents with search tools, database queries, and automated actions with memory",
            "Day 19: Capstone Project: Building a full-stack Agentic RAG Assistant with live streaming, document upload & memory",
            "Day 20: Cloud Deployment, production observability & tracing, resume/portfolio tips, and certificate distribution"
          ]
        }
      ],
      requirements: [
        "A laptop or desktop computer (Windows, Mac, or Linux) with internet access",
        "Basic programming knowledge in any language (Python fundamentals will be covered)",
        "Google Chrome browser and VS Code installed",
        "Dedication to attend the 1.5-hour daily live class and spend 1 hour on daily hands-on practice"
      ],
      faqs: [
        {
          q: "What is the fee for this course?",
          a: "The full 20-day AI Development course fee is only ₹199 (one-time fee, all-inclusive, zero hidden charges)."
        },
        {
          q: "Who is the mentor for this cohort?",
          a: "The course is mentored live by Nandha Prakash, Software Developer at Slate AI, with direct interactive doubt resolution on Google Meet."
        },
        {
          q: "What if I miss a live session?",
          a: "Every single class is recorded. The private Google Drive recording link is shared with all enrolled students within 12 hours."
        },
        {
          q: "Do I need previous AI or Machine Learning experience?",
          a: "No prior deep learning or advanced math background is required. We start with Python backend APIs and LLM integration, guiding you step-by-step through Vector Databases, RAG, and Agentic AI."
        },
        {
          q: "Will I get a certificate?",
          a: "Yes! Students who complete the 20-day cohort and submit their capstone AI project will receive a verified Certificate of Completion from Get Knowledge."
        }
      ]
    }
  ],

  // ----------------------------------------------------------------------------
  // 5. 3-STEP ENROLLMENT PROCESS
  // ----------------------------------------------------------------------------
  enrollmentSteps: [
    {
      step: 1,
      title: "Apply Online",
      description: "Submit your basic contact details (name, email, and WhatsApp number)."
    },
    {
      step: 2,
      title: "Pay ₹199 via UPI",
      description: "Scan our official UPI QR code from any UPI app or transfer via bank transfer."
    },
    {
      step: 3,
      title: "Join Your Cohort",
      description: "Receive your verified Google Meet class invite and batch materials directly on WhatsApp & Email."
    }
  ],

  // ----------------------------------------------------------------------------
  // 7. HELPER FUNCTIONS
  // ----------------------------------------------------------------------------
  getApplicationUrl: function(courseTitle) {
    if (!this.googleForms.applicationFormUrl || this.googleForms.applicationFormUrl.includes("PLACEHOLDER")) {
      return "#apply-modal";
    }
    if (!courseTitle || !this.googleForms.applicationCourseEntryId) {
      return this.googleForms.applicationFormUrl;
    }
    const separator = this.googleForms.applicationFormUrl.includes("?") ? "&" : "?";
    return `${this.googleForms.applicationFormUrl}${separator}${this.googleForms.applicationCourseEntryId}=${encodeURIComponent(courseTitle)}`;
  },

  getPaymentProofUrl: function(courseTitle, amount) {
    if (!this.googleForms.paymentProofFormUrl || this.googleForms.paymentProofFormUrl.includes("PLACEHOLDER")) {
      return "#payment-proof-modal";
    }
    let url = this.googleForms.paymentProofFormUrl;
    const params = [];
    if (courseTitle && this.googleForms.paymentCourseEntryId) {
      params.push(`${this.googleForms.paymentCourseEntryId}=${encodeURIComponent(courseTitle)}`);
    }
    if (amount && this.googleForms.paymentAmountEntryId) {
      params.push(`${this.googleForms.paymentAmountEntryId}=${encodeURIComponent("₹" + amount)}`);
    }
    if (params.length > 0) {
      const separator = url.includes("?") ? "&" : "?";
      url += separator + params.join("&");
    }
    return url;
  },

  getCourseById: function(id) {
    return this.courses.find(c => c.id === id) || this.courses[0] || null;
  },

  formatINR: function(num) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
