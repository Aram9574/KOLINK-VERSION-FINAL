import { EmojiDensity, PostLength, ViralFramework, ViralTone } from "../types.ts";

export const en = {
  common: {
    loading: "Loading experience...",
    confirmDelete: "Are you sure you want to delete this post?",
    premiumLock: {
      title: "Premium Feature",
      description: "Upgrade your plan to access this feature.",
      button: "View Plans",
      unlockNow: "Unlock Now",
      premiumFeature: "This is a premium feature",
      availableOn: "Available on Pro and Viral plans"
    }
  },
  auth: {
    welcomeHeadline: "Access Your Viral Command Center",
    welcomeSub: "Where the top 1% of creators build their audience.",
    signupSub: "Join the elite of AI-assisted content creators.",
    joinHeadline: "Claim Your Unfair Advantage",
    ctaLogin: "Initialize System",
    ctaSignup: "Unlock Free Access",
    emailLabel: "Professional Email",
    passwordLabel: "Access Key",
    forgotPassword: "Lost your key?",
    rememberMe: "Keep session secure",
    continueWith: "Or access with",
    newHere: "New to the elite?",
    alreadyMember: "Already a member?",
    register: "Request Access",
    login: "Enter",
    trust: {
      security: "Military Grade Encryption",
      noCard: "No Card Required",
      users: "+2k Creators"
    },
    reset: {
      title: "Recover Access",
      desc: "We will send a secure link to your email.",
      button: "Send Rescue Link",
      back: "Back to Login",
      success: "Link sent. Check your email.",
      error: "Could not send link. Try again."
    }
  },
  nav: {
    howItWorks: "How it Works",
    demo: "Demo",
    features: "Features",
    tools: "Tools",
    testimonials: "Results",
    pricing: "Pricing",
    comparison: "Compare",
    faq: "FAQ",
    login: "Log In",
    getStarted: "Get Started",
    freeTools: "Free Tools",
    solutions: "Solutions",
    resources: "Resources",
    company: "Company",
    items: {
      postEditor: { title: "Post Editor", desc: "AI content creation engine." },
      carouselStudio: { title: "Carousel Studio", desc: "Design viral carousels in minutes." },
      autoPilot: { title: "AutoPilot", desc: "Automate your LinkedIn presence." },
      profileAudit: { title: "Profile Audit", desc: "Optimize your profile for authority." },
      insightResponder: { title: "Insight Responder", desc: "Turn insights into valuable comments." },
      employmentInsight: { title: "Employment Insight", desc: "Get hired faster with AI." },
      ideas: { title: "Idea Generator", desc: "Daily inspiration tailored to your niche." },
      headlineGenerator: { title: "Headline Generator", desc: "10 Viral titles in seconds." },
      bioGenerator: { title: "Bio Generator", desc: "Optimize your LinkedIn profile." },
      viralCalculator: { title: "Viral Calculator", desc: "Predict your post reach." },
      
      nicheRealEstate: { title: "Real Estate Agents", desc: "Dominate your local market." },
      nicheSaaS: { title: "SaaS Founders", desc: "Growth hacking for tech leaders." },
      nicheLawyers: { title: "Lawyers & Legal", desc: "Build authority in your practice." },
      nicheMarketing: { title: "Marketing Specialists", desc: "Stay ahead of AI trends." },
      nicheHealth: { title: "Doctors & Health", desc: "Educate and connect with patients." },
      
      blog: { title: "Blog", desc: "Latest strategies and news." },
      helpCenter: { title: "Help Center", desc: "Tutorials and technical docs." },
      videoDemo: { title: "Video Demo", desc: "Watch Kolink in action." },
      commonFaq: { title: "FAQ", desc: "Answers to common questions." },
      
      about: { title: "About Us", desc: "Our mission to humanize AI." },
      prices: { title: "Pricing", desc: "Plans for every growth stage." },
      affiliate: { title: "Affiliate Program", desc: "Earn by recommending the future." },
      socials: { title: "Follow Us", desc: "Join +10k creators on socials." },
      
      hooks: { title: "Hook Library", desc: "100+ Proven Viral Hooks." },
      bestTime: { title: "Best Time", desc: "Calculator based on your niche." },
      trust: { title: "Trust Center", desc: "Security and compliance." },
      viewAll: { title: "View All", desc: "Explore all tools available." }
    }
  },
  hero: {
    badge: "#1 AI Tool for LinkedIn Growth",
    titleLine1: "Stop staring at a",
    titleLine2: "blank page.",
    subtitle:
      "Turn loose ideas into viral posts that connect. Your AI studio to dominate LinkedIn in seconds, not hours.",
    rotatingWords: [
      "on LinkedIn 10x faster",
      "that builds authority",
      "that converts followers",
    ],
    ctaPrimary: "Start Creating for Free",
    ctaSecondary: "Watch Demo",
    generating: "Generating Viral Post...",
  },
  socialProof: "1500+ companies & creators trust Kolink",
  workflow: {
    badge: "SYSTEM ARCHITECTURE",
    title: "THE VIRAL ASSEMBLY LINE",
    step1Title: "Inject Raw Idea",
    step1Desc: "Drop a messy thought, URL, or keyword.",
    step2Title: "Neural Architecture",
    step2Desc: "AI maps 100M+ viral data points.",
    step3Title: "Psychological Ops",
    step3Desc: "Injects hooks, curiosity gaps & patterns.",
    step4Title: "Deploy Asset",
    step4Desc: "One-click formatting for mobile feeds.",
    step5Title: "Dominate Feed",
    step5Desc: "Watch your engagement metrics explode.",
  },
  howItWorks: {
    title: "From vague idea to viral hit",
    subtitle:
      "Our 3-step process turns your random thoughts into structured content assets.",
    step1Title: "Input Topic",
    step1Desc: "Dump your raw thoughts, a link, or just a keyword.",
    step2Title: "Select Framework",
    step2Desc: "Choose a viral structure like 'Contrarian' or 'Story'.",
    step3Title: "Go Viral",
    step3Desc: "Get a perfectly formatted post ready to dominate the feed.",
  },
  comparison: {
    title: "The Reality Check",
    subtitle:
      "See why 10k+ creators switched from standard chatbots to Kolink.",
    genericHeader: "Generic Chatbots",
    genericSub: 'The "Wall of Text" Generator',
    kolinkHeader: "Kolink Studio",
    kolinkSub: "Viral Architecture Engine",
    visualText: "Visual Structure",
    genericVisualLabel: "Unreadable Block",
    kolinkVisualLabel: "Viral Sneak Peek",
    vsBad: "Dense, boring, ignored.",
    vsGood: "Scannable, hooked, viral.",
    hookBad: 'Boring "I\'m excited to announce" intros.',
    hookGood: "Psychological hooks that stop scrolling.",
    toneBad: "Robotic, academic, and dry.",
    toneGood: "Human, witty, and authentic.",
    promptBad: "Requires complex prompt engineering.",
    promptGood: "One-click frameworks. No skills needed.",
    feature1Title: "Human & Viral",
    feature2Title: "Psychological Hooks",
    feature3Title: "Zero Learning Curve",
    visualList1: "Systematize output",
    visualList2: "Leverage psychology",
    viralBadge: "Viral",
  },
  strategicComparison: {
    title: "The Most Comprehensive AI Platform",
    subtitle: "Features that others can't match. See for yourself.",
    bestChoice: "Best Choice",
    features: "Features",
    kolink: "Kolink",
      taplio: "Taplio",
      supergrow: "Supergrow",
      authoredUp: "AuthoredUp",
      rows: [
        {
          name: "Base Price",
          values: {
            kolink: "€15/mo",
            taplio: "$65/mo",
            supergrow: "€49/mo",
            authored: "$20/mo",
          },
        },
        {
          name: "Viral AI Generator",
          values: {
            kolink: "✅ (Full)",
            taplio: "✅",
            supergrow: "✅",
            authored: "❌",
          },
        },
        {
          name: "Pro LLM Models (GPT-4o/Claude 3.5)",
          values: {
            kolink: "✅ Included",
            taplio: "⚠️ (Limited)",
            supergrow: "❌ (Basic)",
            authored: "❌",
          },
        },
        {
          name: "Real-time Preview",
          values: {
            kolink: "✅",
            taplio: "✅",
            supergrow: "✅",
            authored: "✅",
          },
        },
        {
          name: "Integrated Browser Extension",
          values: {
            kolink: "✅",
            taplio: "✅",
            supergrow: "✅",
            authored: "✅",
          },
        },
        {
          name: "Custom Ghostwriting",
          values: {
            kolink: "✅ (High Fidelity)",
            taplio: "✅",
            supergrow: "⚠️",
            authored: "❌",
          },
        },
        {
          name: "Viral Hook Analysis",
          values: {
            kolink: "✅",
            taplio: "✅",
            supergrow: "⚠️",
            authored: "❌",
          },
        },
        {
          name: "Advanced Multilingual Support",
          values: {
            kolink: "✅",
            taplio: "⚠️",
            supergrow: "✅",
            authored: "⚠️",
          },
        },
      ],
    },
  roi: {
    title: "Stop burning money on multiple tools",
    subtitle:
      "Kolink replaces your entire LinkedIn growth stack for a fraction of the cost.",
    item1Title: "Professional Ghostwriter",
    item1Desc: "Replaces: Hiring expensive freelancers (€0.50/word)",
    item1Price: "€2,000/mo",
    item2Title: "LinkedIn Growth Coach",
    item2Desc: "Replaces: Strategy calls and content calendars",
    item2Price: "€500/mo",
    item3Title: "Scheduling & Analytics Tool",
    item3Desc: "Replaces: Tools like Taplio or Shield",
    item3Price: "€49/mo",
    item4Title: "Viral Template Pack",
    item4Desc: "Replaces: Buying static PDF hook libraries",
    item4Price: "€99/mo",
    totalLabel: "What you'd spend otherwise:",
    totalPrice: "€2,648/mo",
    kolinkLabel: "All of this is included when you join Kolink.",
    kolinkPlan: "Kolink Creator Pro:",
    kolinkPrice: "€15/mo",
  },
  testimonials: {
    title: "Creators are growing fast",
    subtitle:
      "Join the movement of founders building massive personal brands.",
    t1:
      "I doubled my impressions in week 1. The 'Contrarian' framework is a cheat code.",
    t2:
      "Finally, an AI that understands LinkedIn formatting. No more massive paragraphs.",
    t3:
      "Kolink saved me 10 hours of writing this week alone. Worth every penny.",
  },
  bento: {
    postGenerator: {
      title: "AI Post Generator",
      desc: "Write viral content",
      subDesc: "Turn loose ideas into optimized posts in seconds."
    },
    voiceCloning: {
      title: "Voice Cloning",
      desc: "Your essence, scaled",
      subDesc: "Train AI on your past posts to write exactly like you, but 10x faster."
    },
    audit: {
      title: "Profile Audit",
      desc: "Analyze your impact",
      subDesc: "Identify which parts of your profile are driving away potential clients."
    },
    carousel: {
      title: "Carousel Designer",
      desc: "Maximum retention",
      subDesc: "Generate visual PDF documents that LinkedIn loves, without touching Canva."
    },
    scheduling: {
      title: "Smart Scheduling",
      desc: "Timing is everything",
      subDesc: "Automatically post when your audience is most active."
    },
    analytics: {
      title: "Viral Analytics",
      desc: "Real growth",
      subDesc: "Metrics that matter: conversions and reach, not just likes."
    }
  },
  features: {
    title: "Everything you need to go viral",
    subtitle:
      "We don't just write text. We engineer engagement using data-backed structures.",
    tools: {
      title: "Platform Tools",
      subtitle: "A complete suite to dominate LinkedIn.",
      studio: {
        title: "Viral Studio",
        desc:
          "Your creative command center. Generate viral posts, edit with AI, and perfect your content before publishing.",
      },
      nexus: {
        title: "Nexus AI",
        desc:
          "Your strategic AI assistant. Chat with your data, brainstorm angles, and get instant feedback on your strategy.",
      },
      editor: {
        title: "Post Editor",
        desc:
          "Distraction-free editor with real-time preview. Format perfect hooks and snippets for maximum readability.",
      },
      carousel: {
        title: "Carousel Generator",
        desc:
          "Turn any text or URL into a stunning PDF carousel. No design skills needed, just pure value.",
      },
      autopost: {
        title: "AutoPost",
        desc:
          "Growth on autopilot. Schedule your strategy and let AI generate and publish content for you while you sleep.",
      },
      audit: {
        title: "Profile Audit",
        desc:
          "Analyze your profile with AI to detect gaps and optimize keywords for maximum visibility.",
      },
    },
    footer: {
      description:
      "The ultimate content creation and analytics tool for LinkedIn™.",
      rights: "© 2025 Kolink Inc. All rights reserved.",
      disclaimer: "Kolink is not affiliated, associated, authorized, endorsed by, or in any way officially connected with LinkedIn Corporation. LinkedIn is a registered trademark of LinkedIn Corporation.",
      verifiedLabel: "Verified",
      compliantLabel: "Compliant",
      madeWith: "Made with ❤️ for LinkedIn creators",
      columns: {
        company: {
            title: "Company",
            links: [
                { label: "About", href: "/about" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Made with Kolink", href: "/#carousel" },
                { label: "Contact", href: "mailto:info@kolink.es" },
                { label: "Affiliate Program", href: "mailto:info@kolink.es?subject=Affiliate Program" }
            ]
        },
        legal: {
            title: "Legal",
            links: [
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" }
            ]
        },
        solutions: {
          title: "Industries",
          links: [
            { label: "Real Estate Agents", href: "/tools/agentes-inmobiliarios" },
            { label: "Lawyers & Legal", href: "/tools/abogados-y-legal" },
            { label: "SaaS Founders", href: "/tools/fundadores-saas" },
            { label: "Marketing", href: "/tools/especialistas-marketing" },
            { label: "Doctors & Health", href: "/tools/doctores-y-salud" },
            { label: "View all industries →", href: "/tools" },
          ],
        },
        freeTools: {
          title: "Free Tools",
          links: [
              { label: "Headline Generator", href: "/tools/headline-generator" },
              { label: "Bio Generator", href: "/tools/bio-generator" },
              { label: "Carousel Studio", href: "/tools/carousel-studio" },
          ]
        }
      },
    },

    f1Desc:
      'Don\'t guess. Use structures like "The Contrarian Take" or "The Vulnerable Story" that are proven to stop the scroll.',
    f2Title: "Brand Voice Cloning",
    f2Desc:
      "Teach the AI your specific writing style. It learns your vocabulary, sentence length, and personality.",
    f3Title: "Engagement Predictor",
    f3Desc:
      "Our proprietary scoring system grades your post before you publish, optimizing for maximum reach.",
    viralScore: "Viral Score",
    hooks: "Hooks",
    format: "Format",
    roboticTone: "Robotic Tone",
    zeroStructure: "Zero Structure",
    hardToPrompt: "Hard to Prompt",
    speedTitle: "Ideas to Viral Hits in 30s",
    speedDesc:
      "Stop wasting hours. Our workflow takes you from a messy thought to a polished, viral-ready asset instantly.",
    noWritersBlock: "No Writer's Block",
    mobileOptimized: "Mobile Optimized",
    readyToPost: "Ready to Post",
    frameworks: {
      pas: { name: "Problem-Agitate-Solution", desc: "Conversion" },
      bab: { name: "Before-After-Bridge", desc: "Storytelling" },
      contrarian: { name: "The Contrarian Take", desc: "Engagement" },
      listicle: { name: "The Listicle", desc: "Reach" },
    },
    brandVoice: {
      aiModel: "AI Model",
      you: "YOU",
      ai: "AI",
      match: "100% Match",
    },
  },
  pricing: {
    title: "Simple, transparent pricing",
    subtitle: "Start for free, upgrade as you grow. No hidden fees.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 20%",
    startFree: "Start for Free",
    getStarted: "Get Started",
    mostPopular: "Recommended",
    footer: "Secure payment via Stripe. Cancel anytime.",
    plans: {
      free: {
        name: "Starter Plan",
        description: "To test the power of AI",
        features: [
          "10 Free Credits",
          "Basic Idea Generator",
          "3 Tones",
          "Community Access",
          "No Credit Card",
        ],
      },
      pro: {
        name: "Creator Pro",
        description: "Automate your personal brand",
        features: [
          "Everything in Starter",
          "UNLIMITED AI Credits",
          "UNLIMITED Ideas",
          "AutoPilot (Scheduling)",
          "Brand Voice Analysis",
          "Priority Support",
        ],
      },
      viral: {
        name: "Viral God",
        description: "Scale without limits",
        features: [
          "Everything in Pro",
          "Multi-Account",
          "Hook A/B Testing",
          "Buffer Integration",
          "24/7 VIP Support",
        ],
      },
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    q1: "Does Kolink generate unique content?",
    a1:
      "Absolutely. We use a combination of GPT-4 and Claude 3 Opus tailored with proprietary viral frameworks. No two posts are the same.",
    q2: "Can I cancel my subscription?",
    a2:
      "Yes, you can cancel anytime from your dashboard. You will retain access until the end of your billing cycle.",
    q3: "What is the difference between the models?",
    a3:
      "The Free plan uses a faster, lighter model. Pro and Viral plans use our 'Deep Think' models which are better at nuance.",
    q4: "Do you offer team plans?",
    a4:
      "Yes! The 'Viral God' plan supports up to 3 team members. For larger enterprise needs, contact our sales team.",
  },
  cta: {
    title: "Ready to dominate your feed?",
    subtitle:
      "Join 10,000+ creators using Kolink to build their personal brand. Start generating viral content in the next 2 minutes.",
    button: "Get Started for Free",
    disclaimer: "No credit card required • Cancel anytime",
  },
  bugReport: {
    buttonLabel: "Report Bug",
    title: "Report an Issue",
    subtitle: "Found a issue? Let us know.",
    placeholder: "Describe the error or feedback...",
    cancel: "Cancel",
    send: "Send Report",
    sending: "Sending...",
    success: "Thanks! We're on it.",
  },
  onboarding: {
    step1: {
      title: "Welcome to Kolink!",
      subtitle: "Let's personalize your studio. What's your name?",
      firstName: "First Name",
      firstNamePlaceholder: "John",
      lastName: "Last Name",
      lastNamePlaceholder: "Doe",
      jobTitle: "Profession / Job Title",
      jobTitlePlaceholder: "e.g. Founder, Marketing Manager, Developer",
      next: "Next Step",
    },
    step2: {
      title: "What is your goal?",
      subtitle: "This helps our AI select the best viral frameworks.",
      intents: {
        personal_brand: {
          label: "Personal Brand",
          desc: "Build authority and network",
        },
        company: { label: "Company Page", desc: "Promote my startup" },
        agency: { label: "Client Work", desc: "Ghostwriting for others" },
        sales: { label: "Sales / Leads", desc: "Social selling" },
        job_hunt: { label: "Job Hunt", desc: "Get seen by recruiters" },
        content_creator: {
          label: "Content Creator",
          desc: "Monetize audience",
        },
      },
      next: "Next Step",
    },
    step3: {
      title: "One last thing...",
      subtitle: "How did you hear about Kolink?",
      sources: {
        linkedin: "LinkedIn",
        twitter: "Twitter / X",
        friend: "Friend / Colleague",
        youtube: "YouTube",
        google: "Search Engine",
        other: "Other",
      },
      start: "Start Creating",
    },
    footer: "We use this information to personalize your viral frameworks.",
  },
  levelUp: {
    title: "Level Up!",
    subtitle: "You are now Level {{level}}",
    achievements: "Achievements Unlocked",
    xp: "XP",
    awesome: "Awesome!",
    achievementList: {
      first_step: {
        title: "The First Step",
        description: "Generate your first post.",
      },
      streak_3: {
        title: "Consistency is Key",
        description: "Reach a 3-day streak.",
      },
      streak_7: {
        title: "LinkedIn Top Voice",
        description: "Reach a 7-day streak.",
      },
      pro_writer: {
        title: "Prolific Writer",
        description: "Generate 10 posts total.",
      },
      clickbait_master: {
        title: "Clickbait Master",
        description: "Use the 'Controversial' tone.",
      },
    },
    rewards: "Rewards",
    continue: "Continue",
    bonus_credits: "Bonus Credits",
    widget: {
      level: "Level",
      xp: "XP",
      to_next_level: "to level up",
      credits: "Credits"
    }
  },
  productTour: {
    skip: "Skip Tour",
    back: "Back",
    next: "Next",
    start: "Start",
    steps: {
      create: {
        title: "Create",
        desc: "Start here to create new viral posts.",
      },
      history: { title: "History", desc: "View and manage your past posts." },
      ideas: {
        title: "Ideas",
        desc: "Get AI-powered inspiration tailored to you.",
      },
      autopilot: {
        title: "AutoPilot",
        desc: "Schedule and automate your content strategy.",
      },
      levelUp: {
        title: "Level Up",
        desc: "Earn XP and rewards by posting consistently.",
      },
    },
  },
    // APP INTERFACE TRANSLATIONS
  carouselStudio: {
    title: "Carousel Generator",
    tabs: {
      ai: "AI Generator",
      templates: "Templates",
      design: "Global Design",
    },
    inputs: {

      text: {
        label: "Raw Text",
        placeholder: "Paste your draft here...",
      },
      topic: { label: "Topic", placeholder: "Enter a topic...", question: "What do you want to write about?" },
      url: { label: "Article URL", placeholder: "https://...", hint: "Paste link here" },
      generateBtn: "Generate Carousel",
      generating: "Designing Slides...",
      tabs: {
        topic: "Topic",
        url: "URL",
        youtube: "YouTube",
        pdf: "PDF"
      },
      youtube: {
        label: "YouTube Video URL",
        placeholder: "https://youtube.com/watch?v=...",
        hint: "We'll analyze the video to create a visual story."
      },
      pdf: {
        label: "Upload PDF Document",
        placeholder: "Select file...",
        select: "Select PDF",
        change: "Click to change",
        maxSize: "Max 5MB"
      },
      buttons: {
        generate: "Generate with AI",
        generating: "Designing... (~15s)",
        convert: "Convert Article",
        converting: "Converting... (~20s)",
        video: "Video → Carousel",
        analyzing: "Analyzing... (~30s)",
        extract: "Extract & Create",
        extracting: "Extracting... (~20s)",
        magic: "AI Magic",
        generateBtn: "Generate",
      },
      hint: "Tip: Use specific URLs for better results.",
      question: "What do you want to create today?",
      footer: "AI generated content may require editing. Review before publishing."
    },
    templates: {
      modern: "Modern",
      minimal: "Minimalist",
      bold: "Bold",
      gradient: "Gradient",
    },
    properties: {
      globalDesign: "Global Design",
      slideEditor: "Slide Editor",
      palette: "Color Palette",
      font: "Typography",
      background: "Background",
      showProfile: "Show Profile",
      showPageNumbers: "Page Numbers",
      slideType: "Slide Type",
      title: "Title",
      subtitle: "Subtitle",
      body: "Body",
      cta: "CTA Text",
      deleteSlide: "Delete Slide",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this slide?",
      deleteConfirmTitle: "Delete Slide?",
      deleteConfirmDesc: "This action cannot be undone.",
      addSlide: "Add Slide",
      intro: "Intro",
      content: "Content",
      outro: "Outro",
      brandNamePrompt: "Enter a name for your Brand Kit:",
      aiTools: "AI Magic Tools",
      brandKits: "Brand Kits",
      saveKits: "Save Kit",
      brandKitHint: "Save your brand colors for reuse.",
      export: {
         watermarkNotice: "Free Plan: Watermark added",
         removeWatermark: "Upgrade to Remove",
         createdWith: "Created with Kolink.ai"
      },
      brandKit: {
        title: "My Brand Kits",
        description: "Your saved visual identities.",
        saveCurrent: "Save Current",
        saveDialogTitle: "Save Brand Kit",
        saveDialogDesc: "Save current colors and fonts as a reusable preset.",
        kitNameLabel: "Kit Name",
        kitNamePlaceholder: "e.g. Personal Brand 2026",
        saveButton: "Save Kit",
        emptyState: "No saved kits yet.",
        deleteConfirm: "Delete this kit?",
        deletedSuccess: "Kit deleted",
        savedSuccess: "Brand kit saved",
        saveError: "Error saving kit",
        applied: "Kit \"{{name}}\" applied"
      },
      primaryFont: "Primary Font",
      magicTools: {
        improve: "Improve Writing",
        shorten: "Shorten",
        expand: "Expand",
        punchify: "Viral Hook",
        emojify: "Add Emojis"
      },
      layouts: {
        default: "Default",
        fullImg: "Full Img",
        quote: "Quote",
        number: "Number",
        list: "List",
        compare: "Compare",
        code: "Code"
      },
      slideImage: "Slide Image",
      slideLayout: "Slide Layout",
      imageUrl: "Image URL",
      backgroundImage: "Background Image",
    },
    export: {
      download: "Download PDF",
      exporting: "Exporting...",
    },
    ai: {
      predict: "Predict Performance",
      predictSubtitle: "Simulate audience reaction before you post.",
      analyzing: "Analyzing audience...",
      score: "Viral Score",
      feedback: "Audience Feedback",
      tips: "Micro-Optimizations",
      hook: "Improved Hook Suggestion",
      polish: "Polish Slide",
      polishSubtitle: "Let AI optimize this specific slide for clarity and impact.",
      optimizeBtn: "Optimize with AI"
    },
    creator: {
      title: "Creator Profile",
      name: "Your Name",
      handle: "Your Handle",
      photo: "Profile Photo",
      upload: "Upload Photo"
    },
    patterns: {
      title: "Background Patterns",
      type: "Pattern Type",
      opacity: "Opacity",
      color: "Pattern Color",
      none: "None",
      dots: "Dots",
      grid: "Grid",
      waves: "Waves"
    },
    canvas: {
      new: "New Carousel",
      slides: "Slides",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      fit: "Fit to Screen",
      fullscreen: "Fullscreen",
      export: "Export",
      resetTitle: "Create New Carousel",
      resetDesc: "Are you sure you want to start over? This action cannot be undone.",
      cancel: "Cancel",
      confirmReset: "Confirm & Reset",
      slideIndicator: "Slide {{current}} / {{total}}",
      useArrows: "Use Arrow Keys",
      deleteSlideTitle: "Delete Slide?",
      deleteSlideDesc: "This action cannot be undone.",
      confirmDelete: "Delete",
      toasts: {
        cannotDeleteLast: "Cannot delete the last slide"
      }
    },
    toasts: {
      captionGenerated: "Caption generated!",
      addSlides: "Please add some slides first.",
      captionFailed: "Failed to generate caption.",
      copied: "Copied to clipboard!",
      bgRemoved: "Background removed successfully",
      bgFailed: "Failed to remove background",
      pdfNeeded: "Please upload a PDF file.",
      contentNeeded: "Please provide content to generate from.",
      genSuccess: "Carousel generated successfully!",
      genFailed: "Generation failed. Please try again.",
      loaded: "Loaded",
      templateApplied: "Template applied successfully!"
    },
    sidebar: {
      caption: "Caption",
      sidebar: "Sidebar",
      tabs: {
        ai: "AI",
        templates: "Templates",
        design: "Design"
      },
      inputs: {
        topic: { label: "Topic", placeholder: "Enter a topic..." },
        text: { label: "Text", placeholder: "Paste your text..." },
        url: { label: "URL", placeholder: "https://..." },
        generateBtn: "Generate",
        generating: "Generating..."
      },
      captions: "Captions"
    },
    captions: {
      title: "LinkedIn Caption",
      copy: "Copy to clipboard",
      copied: "Copied!"
    }
  },
  app: {
    sidebar: {
      home: "Home",
      studio: "Post Editor",
      carousel: "Carousels",
      ideas: "Idea Generator",
      insightResponder: "Insight Responder",
      autopilot: "AutoPost",
      history: "History",
      settings: "Settings",
      library: "Library",
      goPremium: "Go Premium",
      upgradeNow: "Upgrade Now",
      unlockDesc: "Unlock unlimited generations and advanced viral modes.",
      creditsLeft: "credits left",
      logout: "Log Out",
      editor: "Post Editor",
      audit: "Profile Audit",
      insight: {
        title: "Insight Responder",
        subtitle: "Turn screenshots into high-authority comments using",
        uploadTitle: "Upload LinkedIn Post",
        uploadDesc: "Drop a screenshot here or paste an image (Cmd+V).",
        intentLabel: "My Intent (Optional)",
        intentPlaceholder: "e.g. I want to respectfully disagree about...",
        toneLabel: "Response Tone",
        generate: "Generate Insights",
        suggestions: "AI Suggestions",
        analyzing: "Analyzing Visual Context...",
        tones: {
          technical: "Technical Authority",
          supportive: "Supportive & Strategic",
          contrarian: "Subtle Contrarian",
          connector: "Networking Connector",
          empathetic: "Empathetic Peer"
        }
      },
    },
    voiceLab: {
      title: "Voice Lab",
      description: "Analyze your writing style and generate your unique voice DNA.",
      scanProfile: "Scan Profile",
      analyzeDNA: "Analyze DNA",
      cloneVoice: "Clone Voice",
      inputPlaceholder: "Paste your text here or select from history...",
      analyzeButton: "Analyze Voice",
      scanning: "Scanning...",
      results: "Analysis Results",
      saveVoice: "Save Voice",
      voiceSaved: "Voice DNA Saved!",
    },
    audit: {
      title: "LinkedIn Profile Optimization",
      subtitle: "Analyze your digital presence with our IA engine. We detect content gaps and optimize your visibility for recruiters.",
      inputLabel: "Download the PDF from LinkedIn and upload it here",
      inputPlaceholder: "Click to upload or drag your LinkedIn PDF",
      buttonAction: "Start Hybrid Audit",
      pdfHint: "The PDF identifies you and we use the URL to scrape visual elements.",
      processing: {
        step1: "Extracting profile text from PDF...",
        step2: "Identifying your Profile URL...",
        step3: "Scraping visual data with Bright Data...",
        step4: "Generating deep AI audit results...",
      },
      results: {
        scoreTitle: "Audit Score",
        summaryTitle: "AI Summary",
        headline: "Headline",
        about: "About",
        experience: "Experience",
        skills: "Skills",
        current: "Current",
        suggested: "Suggested",
        analysis: "AI Analysis",
        copyBtn: "Copy to clipboard",
        copied: "Copied!",
      }
    },
    editor: {
      limitWarning: {
        text: "Character limit approaching.",
        note: "Keep it concise."
      },
      placeholder: "Write your viral post here...",
      status: {
        readability: {
          title: "Readability Score",
          subtitle: "Based on Flesch-Kincaid Grade Level",
          levels: [
            { g: "5-6", desc: "Best for Viral Posts", color: "text-green-500" },
            { g: "7-8", desc: "Good for Articles", color: "text-blue-500" },
            { g: "9+", desc: "Too Complex", color: "text-red-500" }
          ],
          tip: "Aim for Grade 5-6 for maximum reach."
        }
      },
      title: "Post Editor",
      drafts: "Drafts",
      noDrafts: "No drafts found.",
      toolbar: {
        bold: "Bold",
        italic: "Italic",
        bullet: "Bullet Points",
        dash: "Dashes",
        undo: "Undo",
        redo: "Redo",
        clear: "Clear Formatting",
      },
      sidebar: {
        preview: "Preview",
        hooks: "Hooks",
        endings: "Endings",
        snippets: "Snippets",
      },
      preview: {
        mobile: "Mobile",
        desktop: "Desktop",
        seeMore: "...see more",
        live: "Live Preview",
        tipTitle: "Pro Tip",
        tipDesc: "This view simulates how your post will look in the feed. Ensure your line breaks are clean."
      },
      hooks: {
        title: "Viral Hooks",
        empty: "No hooks available for this search."
      },
      endings: {
        title: "Closings / CTAs",
        empty: "No closings available for this search."
      },
      snippets: {
        title: "My Snippets",
        empty: "No saved snippets yet. Select text in the editor to save one."
      },
      metrics: {
        characters: "characters",
        words: "words",
        paragraphs: "paragraphs",
        sentences: "sentences",
        readingTime: "reading time",
        grade: "Grade",
      },
      aiActions: {
        title: "AI Actions",
        rewrite: "Rewrite",
        shorten: "Shorten",
        expand: "Expand",
        tone: "Change Tone",
      },
      unsavedDraft: "Unsaved draft",
      saveDraft: "Save draft",
      openDraft: "Open draft",
      grade: "Grade",
      attach: "Attach",
      continueLinkedIn: "Publish on LinkedIn",
    },
    copyText: "Copy text",
    theme: "Theme",
    viralAnalysis: {
      title: "Viral Analysis",
      subtitle: "Discover your potential",
      archetype: "Archetype",
      score: "Viral Score",
      coefficient: "Potential",
      tips: "Premium Tips",
      share: "Share Result",
      analyzing: "Scanning viral potential...",
      error: "Error analyzing potential"
    },
    ideas: {
      title: "Viral Inspiration",
      subtitle: "AI-powered trends tailored to your profile.",
      generateBtn: "Generate Ideas",
      generating: "Analyzing trends & synthesizing ideas...",
      useThis: "Use This Idea",
      sources: "Sources & News:",
      configTitle: "Configuration",
      nicheLabel: "Industry / Topic",
      nicheTooltip:
        "Specific niches (e.g. 'SaaS Marketing') yield better trends than broad ones (e.g. 'Business').",
      nichePlaceholder: "e.g. SaaS Marketing, Remote Work...",
      styleLabel: "Idea Style",
      sourceLabel: "Data Source",
      countLabel: "Quantity",
      contextLabel: "Knowledge Base / Context (Optional)",
      contextTooltip: "Upload files or links to give the AI more context.",
      addLink: "Add Link",
      addImage: "Upload Image",
      addText: "Paste Text",
      addDrive: "From Drive",
      linkPlaceholder: "https://...",
      pastePlaceholder: "Paste notes or context...",
      realTimeData: "Real-time data from Google Search",
      angle: "Angle",
        styles: {
          trending: "🔥 Trending News",
          contrarian: "😈 Contrarian/Debate",
          educational: "📚 How-to/Educational",
          story: "📖 Personal Story",
          predictions: "🔮 Future Predictions",
        },
        sourcesOpts: {
          news: "Google Search (Live News)",
          evergreen: "Evergreen (General Knowledge)",
        },
      },
      autopilot: {
        title: "AutoPilot",
        description:
          "AutoPilot generates high-quality drafts automatically based on your topics. Click 'View Output' on any draft to open it in the Studio for editing and publishing.",
        stats: {
          systemHealth: "System Health",
          optimal: "OPTIMAL",
          generations: "Generations",
        },
        insight: {
          title: "Kolink AI Insight",
        },
        console: {
          liveMonitoring: "LIVE_MONITORING",
          ready: "READY",
          cpuPriority: "CPU_PRIORITY",
          maxHigh: "MAX_HIGH",
          queueStatus: "QUEUE_STATUS",
          waitingSchedule: "WAITING_SCHEDULE",
          idle: "IDLE",
          awaitingSignal: "// Awaiting initial generation signal",
          outputGenerated: "Output Generated:",
          awaitingCycle: "Awaiting next operational cycle...",
        },
        statusCard: {
          active: "SYSTEM ACTIVE",
          inactive: "SYSTEM OFFLINE",
          nextRun: "Next Run",
          lastRun: "Last Generated",
          activateBtn: "Activate AutoPilot",
          deactivateBtn: "Deactivate",
          forceRunBtn: "Run Now",
          systemLive: "System Live",
          systemOff: "System Off",
          systemStandby: "SYS_STANDBY // WAITING_INPUT",
          cloudSyncOk: "CLOUD_SYNC_OK",
          neuralProcessing:
            "NEURAL_ENGINE_PROCESSING: Optimizing for next deployment...",
        },
        config: {
          title: "Flight Parameters",
          frequencyLabel: "Frequency",
          frequencyTooltip:
            "How often should AutoPilot generate a draft for you.",
          topicsLabel: "Content Topics",
          topicsTooltip:
            "AutoPilot will randomly pick one of these topics for each run.",
          topicsPlaceholder: "Type topic and press Enter...",
          audienceLabel: "Target Audience",
          audiencePlaceholder: "e.g. SaaS Founders, Marketing Directors...",
          postCountLabel: "Post Quantity per Run",
          postCountTooltip:
            "Number of posts to generate each time AutoPilot runs (1 credit per post).",
          save: "Update Configuration",
          description: "Define your automated content strategy parameters.",
          expand: "Click to expand settings.",
          syncing: "Syncing...",
          addTheme: "Add Theme",
        },
        activity: {
          title: "Flight Log",
          empty: "No automated posts generated yet.",
          manualOverride: "Manual Override",
          generatedFor: "Generated post for:",
          viewOutput: "View Output",
          beta: "Beta",
          systemOnline: "SYSTEM ONLINE",
          systemStandby: "SYSTEM STANDBY",
          connected: "CONNECTED",
          autoPilotTone: "AutoPilot Tone",
          postUnit: "Post",
          postsUnit: "Posts",
          creditCostNote:
            "* Each generated post consumes 1 credit. Total: {{count}} credits per run.",
          noTopics: "No topics added yet. Add at least one.",
        },
        frequencies: {
          daily: "Daily (24h)",
          weekly: "Weekly (7d)",
          biweekly: "Bi-Weekly (14d)",
        },
      },
    generator: {
    title: "Viral Engine",
    credits: "Credits",
    topicLabel: "Core Idea / Topic",
    topicPlaceholder:
      "e.g. Why 'hustle culture' is actually destroying productivity in remote teams...",
    audienceLabel: "Target Audience",
    audienceTooltip:
      "Specific niches perform 2x better. 'SaaS Founders' > 'Business People'.",
    audiencePlaceholder:
      "e.g. SaaS Founders, Junior Devs, Marketing Managers",
    toneLabel: "Tone of Voice",
    toneTooltip:
      "Sets the attitude. 'Professional' builds trust, 'Controversial' sparks debate.",
    structureLabel: "Viral Structure",
    structureTooltipTitle: "Why Structure Matters",
    structureTooltip1: "Listicle: Max readability & saves.",
    structureTooltip2: "Story: Builds deep trust & connection.",
    structureTooltip3: "Contrarian: Triggers debate & comments.",
    lengthLabel: "Post Length",
    emojiLabel: "Emoji Density",
    emojiTooltip:
      "Visual anchors. 'High' for mobile engagement, 'Minimal' for corporate polish.",
    ctaLabel: "Include Call to Action?",
    creativityLabel: "Creativity Level",
    creativityTooltip: "High = Risky/Edgy. Low = Safe/Professional.",
    creativityLow: "Safe & Corporate",
    creativityHigh: "Viral & Edgy",
    generateBtn: "Generate with AI",
    generatingBtn: "Architecting Viral Post...",
    noCreditsBtn: "0 Credits Remaining",
    strategyTitle: "Content Strategy",
    detailsTitle: "Details & Settings",
    },
    preview: {
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        placeholder: "Your viral masterpiece will appear here...",
        follow: "Follow",
        scheduled: "Scheduled successfully",
        seeMore: "...see more",
        viralPotential: "Viral Potential",
        aiEstimate: "AI-estimated reach probability",
        high: "High",
        medium: "Medium",
        low: "Low",
        hook: "HOOK",
        readability: "READABILITY",
        value: "VALUE",
        proTip: "PRO TIP",
    },
    history: {
        title: "Recent Creations",
        navAll: "All Posts",
        navPublished: "Published",
        navScheduled: "Scheduled",
        navDrafts: "Drafts",
        libraryTitle: "Library",
        favorites: "Favorites",
        filtersTitle: "Filters",
        toneLabel: "Tone",
        frameworkLabel: "Framework",
        filterAllFrameworks: "All Frameworks",
        empty: "No history yet.",
        copy: "Copy",
        delete: "Delete",
        viewTitle: "Content Archive",
        viewSubtitle: "Review, edit, and repost your top performing content.",
        searchPlaceholder: "Search by topic or keyword...",
        filterAll: "All Tones",
        noResults: "No posts found matching your criteria.",
        noResultsDesc:
          "Try adjusting your filters or generate a new post to get started.",
        noScore: "No Score",
        statsViews: "Est. Views",
        statsLikes: "Est. Likes",
        actions: {
          reuse: "Reuse",
          copied: "Copied!",
        },
    },
    settings: {
        title: "Settings",
        subtitle: "Manage your account preferences and subscription.",
        trophyRoom: "Trophy Room",
        generalPrefs: "General Preferences",
        languageLabel: "Language / Idioma",
        languageTooltip:
          "Changes the interface language AND the output language of the AI.",
        languageDesc:
          "Select your preferred interface and generation language.",
        brandVoiceTitle: "Brand Voice & Persona",
        brandVoiceTooltip:
          "This overrides the standard 'Tone' setting. Be descriptive about adjectives and sentence structure.",
        premiumFeature: "Premium Feature",
        brandVoiceDesc:
          "Describe how you want your AI to sound. This defines your unique style and overrides standard tone settings when applicable.",
        brandVoicePlaceholder:
          "e.g. 'Witty, sarcastic, and uses pop-culture references.', 'Authoritative, data-driven, and uses short punchy sentences.', 'Empathetic, vulnerable, and storytelling-focused.'",
        profileTitle: "Profile Information",
        uploadPhoto: "Upload New Photo",
        fullName: "Full Name",
        jobTitle: "Job Title",
        companyLabel: "Company Name",
        companyTooltip: "Helps the AI tailor content to your organization.",
        industryLabel: "Industry",
        industryTooltip: "Provides context for industry-specific jargon.",
        headline: "LinkedIn Headline",
        securityTitle: "Security & Data Privacy",
        twoFactor: "Two-Factor Authentication (2FA)",
        twoFactorDesc: "Secure your account with an extra layer of protection.",
        securityAlerts: "Alertas de Seguridad",
        securityAlertsDesc:
          "Recibe notificaciones sobre inicios de sesión sospechosos.",
        activeSessions: "Active Sessions",
        billingTitle: "Billing & Usage",
        currentUsage: "Current Usage",
        manageSub: "Manage Subscription",
        paymentMethod: "Payment Method",
        updatePayment: "Update Payment Details",
        invoiceHistory: "Invoice History",
        saveChanges: "Save Changes",
        saving: "Saving...",
        saved: "Saved!",
        support: {
          title: "Need Help?",
          subtitle:
            "Our support team is ready to help you with any issues or questions you may have.",
          cta: "Contact Support",
        },
    },
    cancellation: {
        title: "We're sorry to see you go",
        subtitle: "Please tell us why you're leaving so we can improve.",
        reasons: {
          expensive: "Too expensive",
          usage: "Not using it enough",
          alternative: "Found a better alternative",
          features: "Missing features",
          other: "Other",
        },
        keepPlan: "Keep My Plan",
        continue: "Continue",
        offer30: {
          title: "Wait! Don't lose your progress",
          subtitle:
            "We'd love to keep you as a creator. Here is a special offer just for you.",
          badge: "LIMITED OFFER",
          discountText: "30% OFF FOR 6 MONTHS",
          claimBtn: "Claim 30% Discount",
          applying: "Applying...",
          reject: "No thanks, I still want to cancel",
        },
        offer50: {
          title: "Last Chance Offer",
          subtitle:
            "We really don't want you to leave. This is our best possible offer.",
          badge: "FINAL OFFER",
          discountText: "50% OFF FOR 1 YEAR",
          claimBtn: "Claim 50% Discount",
          reject: "No thanks, proceed to cancellation",
        },
        confirm: {
          title: "Confirm Cancellation",
          subtitle:
            "Your subscription will be canceled at the end of your current billing period. You will lose access to premium features and your credits will expire.",
          access: "Access until end of billing cycle",
          data: "Data preserved for 30 days",
          frozen: "Credits will be frozen",
          goBack: "Go Back",
          confirmBtn: "Confirm Cancellation",
          canceling: "Canceling...",
          deletionWarning: "IMPORTANT: If you cancel now, your account will be PERMANENTLY DELETED in 3 days due to our coupon abuse policy (only for accounts under 1 month old).",
        },
    },
    upgrade: {
        title: "Choose Your Viral Plan",
        subtitle:
          "Unlock advanced AI models, unlimited generations, and secret viral frameworks used by top creators.",
        monthly: "Monthly",
        yearly: "Yearly",
        save: "Save 20%",
        mostPopular: "Most Popular",
        currentPlan: "Current Plan",
        included: "Included in your Plan",
        upgradeNow: "Upgrade Now",
        billedYearly: "Billed {{amount}} yearly",
        securePayment:
          "Secure payment via Stripe. Cancel anytime. By upgrading, you agree to our Terms of Service. For custom enterprise plans, contact sales.",
    },
    constants: {
        tones: {
          [ViralTone.PROFESSIONAL]: {
            label: "👔 Professional",
            desc: "Clean, corporate, leadership-focused.",
          },
          [ViralTone.INSPIRATIONAL]: {
            label: "✨ Inspirational",
            desc: "Motivating, visionary, and uplifting.",
          },
          [ViralTone.CONTROVERSIAL]: {
            label: "🔥 Controversial",
            desc: "Polarizing opinions that drive comments.",
          },
          [ViralTone.EMPATHETIC]: {
            label: "❤️ Empathetic",
            desc: "Vulnerable stories that build connection.",
          },
          [ViralTone.EDUCATIONAL]: {
            label: "📚 Educational",
            desc: "High value, actionable tips.",
          },
          [ViralTone.PROMOTIONAL]: {
            label: "💰 Promotional",
            desc: "Persuasive, sales-focused, conversion-driven.",
          },
          [ViralTone.HUMOROUS]: {
            label: "😂 Humorous",
            desc: "Lighthearted, relatable, memes.",
          },
          [ViralTone.STORYTELLING]: {
            label: "📖 Storytelling",
            desc: "Deep dive narrative.",
          },
        },
        frameworks: {
          [ViralFramework.PAS]: {
            label: "Problem-Agitate-Solution",
            desc: "Classic copywriting formula for conversion.",
          },
          [ViralFramework.STANDARD]: {
            label: "Standard",
            desc: "Solid, balanced viral structure.",
          },
          [ViralFramework.AIDA]: {
            label: "AIDA",
            desc: "Attention, Interest, Desire, Action.",
          },
          [ViralFramework.BAB]: {
            label: "Before-After-Bridge",
            desc: "Show transformation.",
          },
          [ViralFramework.LISTICLE]: {
            label: "The Listicle",
            desc: "Scannable bullet points (High CTR).",
          },
          [ViralFramework.CONTRARIAN]: {
            label: "Unpopular Opinion",
            desc: "Challenge the status quo.",
          },
          [ViralFramework.CASE_STUDY]: {
            label: "Case Study",
            desc: "Social proof and real results.",
          },
          [ViralFramework.STORY]: {
            label: "Micro-Story",
            desc: "Personal anecdote with a lesson.",
          },
          [ViralFramework.VS_COMPARISON]: {
            label: "Comparison (Vs)",
            desc: "This vs That.",
          },
        },
        lengths: {
          [PostLength.SHORT]: { label: "Short & Punchy" },
          [PostLength.MEDIUM]: { label: "Standard" },
          [PostLength.LONG]: { label: "Deep Dive" },
        },
        emojis: {
          [EmojiDensity.MINIMAL]: { label: "Minimal" },
          [EmojiDensity.MODERATE]: { label: "Balanced" },
          [EmojiDensity.HIGH]: { label: "High" },
        },
        hooks: {
          random: { label: "🎲 Random (Surprise Me)" },
          question: { label: "Rhetorical Question" },
          statistic: { label: "Shocking Fact/Stat" },
          negative: { label: "Negative/Warning" },
          story: { label: "Story Start ('Yesterday...')" },
          assertion: { label: "Direct Assertion" },
    },
    },
  },
  footer: {
      description:
        "The ultimate content creation & analytics tool for LinkedIn™.",
      rights: "© 2025 Kolink Inc. All rights reserved.",
      disclaimer:
        "Kolink is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the LinkedIn Corporation, registered in the U.S. and other countries LinkedIn is a trademark of the LinkedIn Corporation.",
      verifiedLabel: "Verified",
      compliantLabel: "Compliant",
      madeWith: "Made with ❤️ for LinkedIn Creators",
      columns: {
        company: {
          title: "Company",
          links: [
            { label: "About", href: "/#hero" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Made with Kolink", href: "/#carousel" },
            { label: "Contact us", href: "mailto:info@kolink.es" },
            {
              label: "Become an Affiliate",
              href: "mailto:info@kolink.es?subject=Affiliate Program",
            },
          ],
        },
        legal: {
          title: "Legal",
          links: [
            { label: "Cookie Policy", href: "/cookies" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms and Conditions", href: "/terms" },
          ],
        },
        resources: {
          title: "Resources",
          links: [
            { label: "Bio Generator", href: "/tools/bio-generator" },
            { label: "Viral Calculator", href: "/tools/viral-calculator" },
            { label: "Profile Audit", href: "/tools/profile-auditor" },
            { label: "Best Time to Post", href: "/tools/best-time-to-post" },
          { label: "Blog", href: "/blog" },
            { label: "News", href: "/#tools" },
            { label: "Roadmap", href: "/#tools" },
            { label: "Help Center", href: "mailto:info@kolink.es" },
          ],
        },
        alternatives: {
          title: "Alternatives",
          links: [
            { label: "Kolink vs Taplio", href: "/#comparison" },
            { label: "Kolink vs Supergrow", href: "/#comparison" },
            { label: "Kolink vs AuthoredUp", href: "/#comparison" },
          ],
        },
        solutions: {
          title: "Niches",
          links: [
            { label: "Real Estate", href: "/tools/agentes-inmobiliarios" },
            { label: "Legal", href: "/tools/abogados-y-legal" },
            { label: "SaaS & Tech", href: "/tools/fundadores-saas" },
            { label: "Marketing", href: "/tools/especialistas-marketing" },
            { label: "Health", href: "/tools/doctores-y-salud" },
          ],
      },
    },
  },
  dashboard: {
    sidebar: {
      home: "Home",
      create: "New Post",
      history: "History",
      carousel: "Carousel Studio",
      tools: "Niche Tools",
      settings: "Settings",
      upgrade: {
        title: "Upgrade to Pro",
        desc: "Unlock infinite AI and viral tools.",
        btn: "See Plans"
      },
      userToken: "User",
      logoutToast: "Session closed"
    },
    header: {
      dashboard: "Control Panel",
      create: "Post Composer",
      history: "Content Library",
      settings: "Settings",
      carousel: "Carousel Studio",
      credits: "Credits",
      level: "Level",
      autopost: "Smart Scheduler",
      responder: "Engagement Assistant",
      chat: "IA Strategy Personal",
      audit: "Profile Auditor",
      voice: "Voice Lab",
      editor: "Editor",
      home: "Home",
      menu: "Menu",
      upgrade: "Upgrade Plan"
    },
    activation: {
      title: "Your Kolink Journey",
      subtitle: "Complete these steps to lift off 🚀",
      pending: "Pending",
      completed: "Completed",
      steps: {
        brandVoice: {
          title: "Define your Brand Voice",
          desc: "Train AI with your unique style.",
        },
        firstPost: {
          title: "Create your First Post",
          desc: "Draft viral content in seconds.",
        },
        firstCarousel: {
          title: "Design a Carousel",
          desc: "Effortless high-impact visuals.",
        },
      },
    },
    launchpad: {
      tools: {
        create: { name: "Viral Architecture", desc: "Start here. Design high-retention posts with AI.", badge: "Main Action" },
        carousel: { name: "Visual Storyteller", desc: "Convert text into PDF carousels.", badge: "NEW" },
        chat: { name: "Strategic Consultant", desc: "Your 24/7 Personal Brand expert.", badge: "AI MENTOR" },
        autopost: { name: "AutoPilot", desc: "Schedule your consistency. Grow while you sleep." },
        responder: { name: "Community & Leads", desc: "Reply to comments. Convert fans into clients." },
        audit: { name: "Profile Auditor", desc: "Optimize your bio and photo for maximum authority." },
        voice: { name: "Voice Clone", desc: "Train AI to write just like you." },
        editor: { name: "Perfectionist", desc: "Formatting, bolding, and final hooks." },
        history: { name: "Library", desc: "Your best saved posts." },
        settings: { name: "Settings", desc: "Account preferences." }
      },
      shortcuts: {
        home: "Home",
        notifications: "Notifications",
        settings: "Settings",
        support: "Support",
        security: "Security"
      },
      stats: {
        weeklyGoal: "Weekly Goal",
        level: "Level",
        xpToNext: "XP to next",
        master: "Content Master",
        hero: "Your audience is active. Time to lead.",
        streak: "Streak days",
        week: "Week"
      }
    },
    expertChat: {
      initialMessage: "Hello! I'm Nexus, your personal LinkedIn strategist. How can I help you today?",
      errors: {
        insufficientCredits: "You don't have enough credits for this query.",
        generic: "I'm sorry, there was an error processing your query."
      },
      sidebar: {
        activeContext: "Active Context",
        brandVoice: "Brand Voice",
        noBrandVoice: "Not defined. Nexus will use a standard professional tone.",
        userProfile: "User Profile",
        noHeadline: "No headline",
        mode: "Mode",
        ghostwriter: "Ghostwriter",
        dnaActive: "Active DNA",
        nexusKnows: "Nexus knows you:"
      },
      status: {
        analyzing: "Analyzing strategy...",
        sending: "Sending...",
        send: "Send Message",
        placeholder: "Type a draft or ask for advice..."
      }
    },
    lockedStates: {
      history: {
        title: "Access Unlimited History",
        subtitle: "Don't lose your best ideas. Retrieve, analyze, and repurpose your past content.",
        features: ["Complete post archive", "Viral performance analytics", "1-click content repurposing", "Data export"],
        cta: "View My Stats"
      },
      chat: {
        title: "Unlock Nexus AI Expert",
        subtitle: "Your personal strategic consultant available 24/7 to boost your brand.",
        features: ["Unlimited LinkedIn strategy consulting", "Real-time trend analysis", "Personalized content ideas", "Instant answers to technical questions"],
        cta: "Unlock Nexus"
      },
      editor: {
        title: "Professional Post Editor",
        subtitle: "Take your posts to the next level with our advanced editor. Unicode formatting, predefined hooks, and real LinkedIn previews.",
        features: ["Bold/Italic Formatting", "Hooks Library", "Mobile/Desktop Preview", "Snippets Library"]
      },
      audit: {
        title: "Professional Profile Audit",
        subtitle: "Optimize your LinkedIn profile with our advanced AI. Detect gaps, improve your SEO, and increase your visibility to recruiters.",
        features: ["SEO Analysis", "Headline Optimization", "Gap Detection", "Content Suggestions"]
      }
    }
  },
  landing: {
    meta: {
      title: "Kolink | Viral LinkedIn Studio",
      description: "Create viral posts, infinite carousels, and dominate LinkedIn with AI. The ultimate tool for professionals and brands seeking authority.",
      keywords: "LinkedIn AI, Post Generator, LinkedIn Carousels, Personal Brand, Social Selling, LinkedIn Automation",
    },
    mock: {
      level: "LEVEL 1",
      creator: "Creator",
      studio: "Studio",
      ideas: "Ideas",
      autopilot: "AutoPilot",
      history: "History",
      settings: "Settings",
      credits: "20 credits",
      topicLabel: "Topic or Idea",
      topicValue: "How consistency beats intensity on LinkedIn...",
      audienceLabel: "Audience",
      audienceValue: "SaaS Founders, Creators",
      toneLabel: "Tone",
      toneValue: "Controversial",
      structureLabel: "Structure",
      creativityLabel: "Creativity",
      creativityValue: "High",
      generate: "Generate",
      postHeader: "Founder @ Kolink",
      postContent: "Stop staring at a blank page. 🛑\n\nMost people waste 10 hours/week thinking what to write.\n\nMeanwhile, the top 1% use frameworks.\n\nHere is the secret: You don't need more creativity. You need better architecture.\n\nThe PAS Framework for virality:\n❌ Problem: Writer's block kills momentum.\n🔥 Agitate: Inconsistency kills reach.\n✅ Solución: Usa estructuras probadas.",
      postTags: "#GrowthHacking #LinkedInTips #AI",
      voiceCardTitle: "Brand DNA",
      voiceCardVal: "Voice Match: 99%",
      viralCardTitle: "Viral Reach",
      viralCardVal: "Potential: High",
      badPost: "I am thrilled to announce that today I have been reflecting on the importance of consistency. Consistency is key because it allows us to build lasting habits. Furthermore, it is fundamental to stay motivated even when results are not immediate in order to achieve long-term success in our professional careers...",
      goodPostHook: "Consistency > Intensity.",
      goodPostBody: "Most people fail because they sprint.\nThe top 1% win because they walk everyday.\n\nHere is my 3-step system: 👇",
    },
  },
  trustPage: {
    hero: {
      title: "Trust Center",
      subtitle: "Your security is our #1 priority. Built for enterprise, secured like a bank.",
      badge: "MILITARY GRADE SECURITY"
    },
    cards: {
      encryption: {
        title: "Bank-Grade Encryption",
        desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Even we can't see your passwords."
      },
      payment: {
        title: "Secure Payments by Stripe",
        desc: "We do not store your card. Payments are processed by Stripe, the gold standard in online payments."
      },
      privacy: {
        title: "Data Privacy",
        desc: "Your data is yours. We never sell your info to third parties or train public models with your private drafts."
      },
      uptime: {
        title: "99.9% Uptime",
        desc: "Redundant infrastructure distributed globally to ensure you are always online when virality strikes."
      }
    },
    badges: {
      ssl: "SSL Secure",
      gdpr: "GDPR Ready",
      pci: "PCI DSS Compliant"
    },
    certifications: "Certifications & Compliance"
  },
  toolsPage: {
    common: {
      moreTools: "More Tools",
      home: "Home",
      tools: "Tools",
      tryPro: "Try Pro Free",
      copyToast: "Copied to clipboard!",
      conversion: "Convert to Post",
      footer: "Kolink AI © 2026. Made for LinkedIn Creators."
    },
    headlineGenerator: {
      seoTitle: "Free LinkedIn Headline Generator (Viral Hooks) | Kolink AI",
      seoDesc: "Generate 10 viral LinkedIn headlines in seconds. The #1 Free AI Tool for writing hooks that stop the scroll.",
      label: "Free Tool",
      title: "Headline Generator",
      titleHighlight: "Viral",
      subtitle: "Stop the scroll. Generate 10 viral hooks optimized for LinkedIn's algorithm in seconds.",
      roleLabel: "Your Role (e.g. Founder)",
      industryLabel: "Industry",
      topicLabel: "What is your post about?",
      rolePlaceholder: "e.g. CEO, Marketer...",
      industryPlaceholder: "e.g. SaaS, Real Estate...",
      topicPlaceholder: "e.g. How to scale a business without burnout...",
      button: "Get Headlines",
      generating: "Generating...",
      resultTitle: "10 Viral Hooks for You",
      whyTitle: "Why Headlines Matter?",
      whyDesc: "The first 2 lines of your LinkedIn post determine 80% of your success. If people don't click 'See more', the algorithm assumes your content is irrelevant.",
      frameworks: [
        { title: "The Contrarian", desc: "Challenge common beliefs to spark curiosity." },
        { title: "The Listicle", desc: "Show quantifiable value immediately." },
        { title: "The Story", desc: "Open with a dramatic or vulnerable moment." }
      ]
    },
    bioGenerator: {
      seoTitle: "Free LinkedIn Bio Generator | Kolink AI",
      seoDesc: "Create the perfect LinkedIn profile headline in seconds. Optimize for SEO and authority with our free AI tool.",
      label: "Profile Optimizer",
      title: "Bio Generator",
      titleHighlight: "LinkedIn",
      subtitle: "The first thing recruiters see is your headline. Make it impossible to ignore.",
      roleLabel: "Your Role",
      nicheLabel: "Niche / Audience",
      keywordsLabel: "Top 3 Keywords (SEO)",
      styleLabel: "Style",
      styles: {
        professional: "Professional",
        creative: "Creative",
        minimalist: "Minimalist"
      },
      button: "Generate Bios",
      generating: "Optimizing...",
      resultTitle: "5 Optimized Headlines",
      ctaBtn: "Get Audit",
      ctaBox: {
        title: "Want a Full Profile Audit?",
        subtitle: "Optimize every section of your LinkedIn profile.",
        button: "Start Free Audit"
      }
    },
    viralCalculator: {
      seoTitle: "LinkedIn Viral Post Calculator | Kolink AI",
      seoDesc: "Predict the viral potential of your LinkedIn posts before you publish. Free AI calculator based on your engagement rate and content quality.",
      label: "Predictive Analytics",
      title: "Will It Go",
      titleHighlight: "Viral?",
      subtitle: "Stop guessing. Our AI analyzes your follower count, engagement rate, and content structure to predict reach.",
      followersLabel: "Followers",
      followersPlaceholder: "e.g. 5000",
      avgLikesLabel: "Avg Likes",
      avgLikesPlaceholder: "e.g. 150",
      contentLabel: "Paste Your Draft",
      contentPlaceholder: "Paste your post content here...",
      button: "Calculate Viral Score",
      analyzing: "Analyzing...",
      resultLabel: "Viral Probability",
      suggestionsLabel: "AI Suggestions",
      cta: "Improve with AI Studio"
    },
    profileScorecard: {
      seoTitle: "LinkedIn Profile Scorecard | Free AI Audit Tool",
      seoDesc: "Get an instant score for your LinkedIn profile. Our AI analyzes your headline and summary to reveal hidden opportunities for growth.",
      label: "Profile Auditor",
      title: "Rate My",
      titleHighlight: "Profile",
      subtitle: "Is your LinkedIn profile repelling high-ticket clients? Get a brutal, honest score in seconds.",
      headlineLabel: "Your Headline",
      headlinePlaceholder: "e.g. Helping SaaS Founders scale to $10M...",
      aboutLabel: "About Summary (Optional)",
      aboutPlaceholder: "Paste your About section here for deeper analysis...",
      button: "Get My Score",
      analyzing: "Auditing...",
      emptyTitle: "Ready to Audit",
      emptyDesc: "Enter your details to reveal your authority score.",
      scoreLabel: "Authority Score",
      good: "Good",
      needsWork: "Needs Work",
      diagnosisLabel: "Diagnosis",
      cta: "Unlock Full PDF Report",
      ctaSub: "Get a 20-page deep dive with Kolink Pro."
    },
    bestTime: {
      seoTitle: "LinkedIn Best Time to Post Calculator | Free AI Tool",
      seoDesc: "Find the perfect time to post on LinkedIn for your specific industry. Maximize engagement and reach with our algorithmic heatmap.",
      label: "Timing Algorithm",
      title: "Best Time to",
      titleHighlight: "Post",
      subtitle: "Algorithmically determine the highest engagement windows for your specific industry.",
      industryLabel: "Select Your Industry",
      industries: {
        tech: "Technology & SaaS",
        marketing: "Marketing & Agencies",
        realEstate: "Real Estate",
        finance: "Finance & Consulting",
        healthcare: "Healthcare & Medical",
        education: "Education & Coaching",
        general: "General / Personal Brand"
      },
      button: "Reveal Best Times",
      analyzing: "Analyzing Data...",
      heatmapTitle: "Your Engagement Heatmap",
      emptyState: "Select your industry and click calculate to see your personalized engagement heatmap.",
      low: "Low",
      high: "High",
      schedCtaTitle: "Want to schedule automatically?",
      schedCtaDesc: "Kolink Pro auto-schedules for your optimal times.",
      schedCtaBtn: "Schedule Post",
      whyTitle: "Why Posting Time Matters on LinkedIn",
      whyDesc: "The 'Golden Hour' on LinkedIn refers to the first 60 minutes after you post. The algorithm tests your content. If they engage, it gets a boost.",
      bestDaysTitle: "Best Days",
      bestDaysDesc: "Tuesday, Wednesday, and Thursday generally show 25-40% higher engagement rates for B2B industries compared to weekends.",
      worstTimesTitle: "Worst Times",
      worstTimesDesc: "Mondays before 10 AM and Fridays after 4 PM often see lower retention.",
      days: {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        Sun: "Sun"
      },
      timeSlots: {
        "8am - 10am": "8am - 10am",
        "10am - 12pm": "10am - 12pm",
        "12pm - 2pm": "12pm - 2pm",
        "2pm - 5pm": "2pm - 5pm",
        "5pm - 8pm": "5pm - 8pm"
      }
    },
    hookGallery: {
      seoTitle: "Viral Hooks Library for LinkedIn | +50 Proven Openers",
      seoDesc: "Browse our library of high-converting viral hooks. Copy templates for Contrarian, Data, Story, and Listicle posts. Free resource.",
      label: "Viral Library",
      title: "The Ultimate Gallery of",
      titleHighlight: "Hooks",
      subtitle: "Stop staring at a blank page. Browse proven opening lines that grab attention and drive engagement.",
      filters: {
        all: "All",
        contrarian: "Contrarian",
        data: "Data",
        story: "Story",
        listicle: "Listicle",
        question: "Question",
        direct: "Direct"
      },
      card: {
        useInStudio: "Use in Studio",
        copy: "Copy",
        copied: "Copied!",
        example: "Ex:"
      },
      empty: {
        title: "No hooks found",
        desc: "Try a different category."
      },
      cta: {
        title: "Need custom hooks for your brand?",
        desc: "Our AI analyzes your unique voice and generates infinite hooks tailored to your industry.",
        button: "Try AI Generator"
      },
      categories: {
          Contrarian: "Contrarian",
          Data: "Data",
          Story: "Story",
          Listicle: "Listicle",
          Question: "Question",
          Direct: "Direct"
      }
    },
    vsPage: {
      notFound: "Comparison Not Found",
      returnTools: "Return to Tools",
      startTrial: "Start Free Trial",
      seeAllTools: "See All Tools",
      switchHeadline: "Switch to the",
      switchHeadlineHighlight: "Complete Alternative",
      feature: "Feature",
      monthlyCost: "Monthly Cost",
      pricesDisclaimer: "* Prices compared based on monthly Pro plans as of Oct 2025.",
      whySwitch: "Why creators are switching to Kolink",
      designedFor: "Designed for the modern LinkedIn algorithm favoring visual content.",
      theGap: "The Gap:",
      savings: "Savings / Month",
      readyHeadline: "Ready to upgrade your workflow?",
      tryFree: "Try Kolink Free",
      noCard: "No credit card required for free tools."
    }
  }
};
