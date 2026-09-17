export interface AITopic {
  id: number;
  title: string;
  shortTitle: string;
  category: "AI";
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: string;
  summary: string;
  keyTools: string[];
  overview: string;
  coreConcepts: {
    name: string;
    description: string;
  }[];
  practicalWorkflows: string[];
  promptTemplates: {
    title: string;
    prompt: string;
    explanation: string;
  }[];
  jobAndMarketingTactics: string[];
  localKenyanContext: string;
}

export const OFFICIAL_AI_TOPICS: AITopic[] = [
  {
    id: 1,
    title: "Introduction to AI & its basic",
    shortTitle: "AI Fundamentals",
    category: "AI",
    level: "Beginner",
    estimatedHours: "4 Hours",
    summary: "Foundational breakdown of Artificial Intelligence, Machine Learning, Deep Learning, and how Generative AI models function.",
    keyTools: ["Google AI Studio", "Hugging Face", "OpenAI Platform"],
    overview: "This foundational module demystifies artificial intelligence for students, breaking down how computers learn from data rather than following static rules. Students learn the distinction between Narrow AI, General AI, and Generative AI, as well as the history from early symbolic logic to modern Transformer neural networks.",
    coreConcepts: [
      {
        name: "Artificial Intelligence vs Machine Learning vs Deep Learning",
        description: "AI is the broad umbrella of machine intelligence; Machine Learning (ML) uses statistical models to learn from historical patterns; Deep Learning (DL) leverages multi-layered neural networks inspired by the human brain.",
      },
      {
        name: "Generative AI & LLMs",
        description: "Models trained on massive text, code, and multimodal corpora capable of producing new text, images, code, and speech rather than just classifying existing inputs.",
      },
      {
        name: "Tokens, Context Windows & Hallucinations",
        description: "How models process words as sub-word tokens, how context windows dictate memory capacity, and why models can confidently hallucinate inaccurate facts if ungrounded.",
      },
      {
        name: "Responsible AI & Ethics",
        description: "Data privacy considerations, copyright laws, intellectual property rights, bias mitigation, and ethical usage in educational and workplace environments.",
      },
    ],
    practicalWorkflows: [
      "Setting up your first AI learning workspace across desktop and mobile devices.",
      "Testing model capabilities: comparing rule-based search engines vs generative reasoning.",
      "Conducting privacy audits: learning what sensitive corporate or personal data to never feed into public models.",
    ],
    promptTemplates: [
      {
        title: "Concept Clarifier",
        prompt: "Explain the difference between Machine Learning and Traditional Programming to a high school graduate in Thika, Kenya using a practical analogy of farming or driving.",
        explanation: "Uses local context and familiar analogies to ground abstract technical concepts.",
      },
    ],
    jobAndMarketingTactics: [
      "AI Literacy Trainer: Offering introductory workshops to local schools, SACCOs, and small businesses in Kenya.",
      "Digital Transformation Consultant: Auditing office workflows to identify repetitive tasks suitable for automation.",
    ],
    localKenyanContext: "How Kenya's Silicon Savannah (Nairobi/Thika corridor), Konza Technopolis, and local fintechs like M-Pesa are leveraging AI for credit scoring, customer care, and agriculture.",
  },
  {
    id: 2,
    title: "AI models ;Chatgpt, Gemini Etc.",
    shortTitle: "Frontier AI Models",
    category: "AI",
    level: "Beginner",
    estimatedHours: "5 Hours",
    summary: "Hands-on mastery of premier frontier Large Language Models: ChatGPT (GPT-4o, o1), Google Gemini (1.5 Pro/Flash), Claude 3.5 Sonnet, and open-source models.",
    keyTools: ["OpenAI ChatGPT (GPT-4o / o1)", "Google Gemini (1.5 Pro / Flash)", "Anthropic Claude 3.5 Sonnet", "Meta Llama 3 / DeepSeek", "Ollama"],
    overview: "A hands-on comparative exploration of the world's leading AI models. Students discover each platform's unique strengths, multimodal inputs, reasoning speeds, cost structures, and when to pick one model over another for specific business tasks.",
    coreConcepts: [
      {
        name: "ChatGPT (OpenAI)",
        description: "Known for GPT-4o versatility, o1 chain-of-thought mathematical reasoning, Canvas interactive editing, custom GPT builder, and voice conversations.",
      },
      {
        name: "Google Gemini",
        description: "Native multimodality (audio, video, images, text), massive 2-million token context window, live Google Workspace integration (Docs, Drive, Gmail), and real-time Google Search grounding.",
      },
      {
        name: "Anthropic Claude 3.5 Sonnet",
        description: "World-class coding proficiency, sophisticated natural nuance in writing, exceptional long-document synthesis, and live interactive Artifacts.",
      },
      {
        name: "Open-Weights & Local AI (Llama 3, DeepSeek, Ollama)",
        description: "Running models locally on private laptops or servers without internet access, ensuring 100% data confidentiality and zero API subscription costs.",
      },
    ],
    practicalWorkflows: [
      "Benchmarking test: Run the exact same business task through ChatGPT, Gemini, and Claude to compare output depth and tone.",
      "Setting up custom system instructions and memory in ChatGPT and Gemini for persistent personalization.",
      "Installing Ollama on a laptop to run Llama 3 offline without internet.",
    ],
    promptTemplates: [
      {
        title: "Comparative Analysis Prompt",
        prompt: "Analyze this quarterly business budget for a Thika transport company. Calculate profit margins, identify 3 cost leaks, and format the output as a Markdown table.",
        explanation: "Tests model numerical precision and structured data formatting.",
      },
    ],
    jobAndMarketingTactics: [
      "AI Stack Advisor: Advising corporate clients on choosing between ChatGPT Team, Gemini for Google Workspace, or private offline models.",
      "Custom GPT Developer: Building proprietary domain-specific chatbots for real estate agents and driving schools.",
    ],
    localKenyanContext: "Evaluating affordable internet bundles and free-tier access in Kenya for students using Android phones and Safaricom / Airtel data.",
  },
  {
    id: 3,
    title: "Research and writing assistants",
    shortTitle: "Research & Writing",
    category: "AI",
    level: "Intermediate",
    estimatedHours: "4 Hours",
    summary: "Leveraging Perplexity AI, Consensus, and writing tools for live citation research, academic literature reviews, grant proposals, and executive drafting.",
    keyTools: ["Perplexity AI", "Consensus", "Elicit", "Grammarly AI", "Hemingway Editor"],
    overview: "Transforming how academic papers, corporate whitepapers, and market research are conducted. Students learn how to replace hours of manual web searches with conversational, citation-backed research engines that verify facts with live URL references.",
    coreConcepts: [
      {
        name: "Conversational Search Engines (Perplexity AI)",
        description: "Performs real-time search across hundreds of web sources, synthesizing answers with direct footnotes and source verification.",
      },
      {
        name: "Academic Literature Engines (Consensus & Elicit)",
        description: "Searching peer-reviewed scientific journals, PubMed, and ArXiv to extract research consensus and statistical findings.",
      },
      {
        name: "High-Impact Business Drafting",
        description: "Writing formal tenders, NGO grant proposals, Kenya Revenue Authority (KRA) appeal letters, employment contracts, and executive summaries.",
      },
      {
        name: "Humanizing & Fact-Checking Workflows",
        description: "Eliminating generic AI clichés ('delve', 'testament to', 'tapestry'), retaining authentic human voice, and cross-verifying citations.",
      },
    ],
    practicalWorkflows: [
      "Writing a comprehensive 10-page market research report on Nairobi electric vehicle adoption with live citations.",
      "Drafting a professional funding proposal for a youth vocational training center.",
      "Fact-checking an unverified news article or statistical claim using Perplexity Pro search.",
    ],
    promptTemplates: [
      {
        title: "Tender Proposal Drafter",
        prompt: "Draft a formal response to an Expression of Interest (EOI) for corporate driving instruction services for a Kenyan banking group. Highlight NTSA compliance, dual-control safety, and certified defensive driving instructors.",
        explanation: "Produces institutional-grade B2B tender copy with Kenyan regulatory compliance.",
      },
    ],
    jobAndMarketingTactics: [
      "Freelance Research Analyst on Upwork: Writing industry reports, competitive intelligence, and literature reviews for international clients ($25-$60/hr).",
      "Grant & Tender Proposal Writer: Assisting local Kenyan companies in bidding for government and NGO procurement tenders.",
    ],
    localKenyanContext: "Researching Kenyan regulatory frameworks, NTSA traffic acts, eCitizen procedures, and EAC trade policies.",
  },
  {
    id: 4,
    title: "Notebook LM",
    shortTitle: "NotebookLM Mastery",
    category: "AI",
    level: "Intermediate",
    estimatedHours: "3 Hours",
    summary: "Mastering Google NotebookLM: zero-hallucination document synthesis, grounded study guides, and viral dual-host Audio Overview podcasts.",
    keyTools: ["Google NotebookLM", "Google Drive", "Google Docs"],
    overview: "Google NotebookLM is a breakthrough research assistant that is strictly grounded in the materials you upload. Unlike open-ended chatbots, NotebookLM cites exact pages and paragraphs in your PDFs and notes, and can generate viral two-host conversational audio podcasts summarizing any topic.",
    coreConcepts: [
      {
        name: "Source Grounding & Zero Hallucination",
        description: "NotebookLM only answers based on the uploaded PDFs, Google Docs, website links, or pasted text, providing clickable citations back to the source text.",
      },
      {
        name: "Audio Overviews (Deep Dive Podcasts)",
        description: "AI generates a natural, highly engaging conversation between two AI hosts who explain, debate, and unpack your uploaded materials with realistic human banter.",
      },
      {
        name: "Study Guides & FAQ Generation",
        description: "Instant generation of revision outlines, timeline chronologies, briefing documents, and practice quiz questions from uploaded textbooks.",
      },
      {
        name: "Collaborative Notebook Workspaces",
        description: "Sharing dynamic notebooks with classmates, colleagues, or students for group research and joint document analysis.",
      },
    ],
    practicalWorkflows: [
      "Uploading the official Kenya Highway Code and 25 Practical Lessons syllabus to create a dedicated exam study assistant.",
      "Generating a 10-minute conversational Audio Overview podcast summarizing Kenyan traffic regulations.",
      "Converting a 50-page legal lease or corporate policy into an interactive FAQ with instant source verification.",
    ],
    promptTemplates: [
      {
        title: "Source-Grounded Exam Prep",
        prompt: "Based strictly on the uploaded NTSA Driving Curriculum PDF, list the 10 most critical vehicle safety checks required before starting a Class B practical test, citing the exact page numbers.",
        explanation: "Ensures 100% adherence to institutional source documents without hallucination.",
      },
    ],
    jobAndMarketingTactics: [
      "Educational Content Creator: Packaging school curricula into Audio Overview podcasts for students on Spotify and YouTube.",
      "Corporate Knowledge Base Specialist: Organizing internal company training manuals into interactive NotebookLM knowledge hubs for onboarding new staff.",
    ],
    localKenyanContext: "Transforming KNEC and NTSA study materials into bite-sized audio lessons that students can listen to while commuting in matatus.",
  },
  {
    id: 5,
    title: "Prompt engineering",
    shortTitle: "Prompt Engineering",
    category: "AI",
    level: "Intermediate",
    estimatedHours: "5 Hours",
    summary: "The science and art of crafting high-precision prompts using the 5-Part Formula, Few-Shot learning, Chain-of-Thought, and structured output formatting.",
    keyTools: ["OpenAI Playground", "Anthropic Workbench", "Google AI Studio"],
    overview: "Prompt engineering is the fundamental skill that separates amateur AI users from professionals. Students learn how to guide AI models to produce exact, predictable, and superior results across any discipline through structured prompting frameworks.",
    coreConcepts: [
      {
        name: "The 5-Part Master Prompt Formula",
        description: "Role (Persona) + Context (Background) + Task (Action Verb) + Constraints (Rules & Tone) + Output Format (Markdown/JSON/Table).",
      },
      {
        name: "Few-Shot Prompting",
        description: "Providing 2-3 examples of ideal input-output pairs inside the prompt to teach the model complex stylistic patterns and schemas.",
      },
      {
        name: "Chain-of-Thought (CoT) & Step-by-Step Reasoning",
        description: "Instructing the model to 'think step-by-step' before delivering a conclusion, drastically reducing errors in math, logic, and policy analysis.",
      },
      {
        name: "System Prompts & Metaprompting",
        description: "Designing overarching instructions that dictate an AI agent's personality, boundaries, forbidden actions, and operational parameters.",
      },
    ],
    practicalWorkflows: [
      "Refactoring a vague 1-sentence prompt into a professional 5-part structured prompt and evaluating the 10x quality difference.",
      "Building a Few-Shot prompt that categorizes customer support WhatsApp messages into Urgent, Inquiry, or Complaint.",
      "Writing a system prompt for an automated customer care assistant for KENA Driving School.",
    ],
    promptTemplates: [
      {
        title: "Master 5-Part Prompt Template",
        prompt: `[ROLE]: You are a senior financial advisor in Kenya specializing in small business bookkeeping.
[CONTEXT]: A driving school in Thika earns revenue from tuition fees and incurs vehicle maintenance, fuel, and instructor salaries.
[TASK]: Create a monthly cashflow forecasting template with recommended reserve ratios.
[CONSTRAINTS]: Use Kenyan Shillings (KSh). Keep explanations under 300 words.
[FORMAT]: Provide a clean Markdown table followed by 3 actionable cost-cutting tips.`,
        explanation: "Exemplifies the full 5-part prompt framework for flawless outputs.",
      },
    ],
    jobAndMarketingTactics: [
      "Prompt Engineer / AI Consultant: Standardizing company prompt libraries for customer support, copywriting, and legal teams ($30-$80/hr).",
      "AI Workflow Automation Specialist: Creating custom automated prompt chains in Make.com or Zapier.",
    ],
    localKenyanContext: "Crafting prompts that capture local nuances, Kenyan Sheng, official Swahili, and local commercial realities.",
  },
  {
    id: 6,
    title: "Image generation",
    shortTitle: "AI Image Generation",
    category: "AI",
    level: "Intermediate",
    estimatedHours: "5 Hours",
    summary: "Creating photorealistic commercial images, branding assets, and marketing posters using Midjourney v6, DALL-E 3, Google Imagen 3, and Flux.1.",
    keyTools: ["Midjourney (v6 / v6.1)", "OpenAI DALL-E 3 (ChatGPT)", "Google Imagen 3", "Flux.1", "Canva Magic Studio"],
    overview: "Students learn how to generate studio-grade commercial photography, social media graphics, product mockups, and architectural visualizations from text prompts without an expensive camera studio or graphic design software.",
    coreConcepts: [
      {
        name: "Visual Prompting Anatomy",
        description: "Subject + Art Medium (Photorealistic / 3D Render / Vector) + Environment + Lighting (Golden Hour / Studio Softbox / Neon) + Camera Lens (85mm f/1.8) + Aspect Ratio.",
      },
      {
        name: "Midjourney Parameters Mastery",
        description: "Aspect ratios (`--ar 16:9`, `--ar 9:16`), stylize intensity (`--s 250`), chaos, image-to-image prompting, and multi-prompting (`::`).",
      },
      {
        name: "DALL-E 3 & In-Image Typography",
        description: "Generating precise text inside graphics, posters, stickers, and brand packaging directly through natural conversational prompts.",
      },
      {
        name: "Product Placement & Mockups",
        description: "Placing local products (e.g. coffee bags, apparel, automotive accessories) into high-end lifestyle scenes for e-commerce advertising.",
      },
    ],
    practicalWorkflows: [
      "Designing a high-converting Instagram advertising poster for a driving school holiday intake.",
      "Creating photorealistic studio product photos for a Kenyan fashion or beauty brand.",
      "Generating YouTube thumbnail art with high emotional contrast and clear visual hierarchy.",
    ],
    promptTemplates: [
      {
        title: "Commercial Automotive Poster",
        prompt: "Commercial automotive photography of a clean white sedan driving on a scenic highway near Mt Kenya at sunrise, dramatic golden hour lighting, 35mm lens, cinematic depth of field, 8k resolution, photorealistic advertisement aesthetic --ar 16:9 --v 6.0",
        explanation: "Generates high-end commercial imagery with specific camera optics and lighting conditions.",
      },
    ],
    jobAndMarketingTactics: [
      "Social Media Creative Designer: Selling weekly social media graphic packages to Kenyan retail businesses, restaurants, and salons ($100-$300/mo).",
      "Stock Photography & Print-on-Demand: Creating AI art collections for digital wall prints, book covers, and stock platforms.",
    ],
    localKenyanContext: "Prompts depicting African faces, Kenyan urban landscapes, Nairobi skyline, and vibrant cultural attire with authentic photorealism.",
  },
  {
    id: 7,
    title: "Audio generation",
    shortTitle: "AI Audio & Voice",
    category: "AI",
    level: "Intermediate",
    estimatedHours: "4 Hours",
    summary: "Producing studio-quality voiceovers, voice cloning, audiobooks, and radio-ready music tracks using ElevenLabs, Suno AI, and Udio.",
    keyTools: ["ElevenLabs", "Suno AI (v3.5 / v4)", "Udio", "OpenAI Advanced Voice", "Audacity"],
    overview: "Explore the cutting-edge of generative audio. Students learn how to create hyper-realistic voiceovers with emotional depth, clone voices responsibly, and generate full musical tracks with original lyrics, harmonies, and instruments across any genre.",
    coreConcepts: [
      {
        name: "Voice Synthesis & Emotion (ElevenLabs)",
        description: "Text-to-speech with natural cadence, pauses, breathing sounds, accent selection, and emotional modulation (excitement, seriousness, whisper).",
      },
      {
        name: "Voice Cloning & Multilingual Dubbing",
        description: "Creating an authentic digital clone of your voice from a 1-minute audio sample, and automatically dubbing videos into Spanish, French, or Swahili.",
      },
      {
        name: "AI Music Generation (Suno & Udio)",
        description: "Crafting complete 3-minute songs with verses, choruses, bridge, and vocal harmonies from text lyrics in genres like Afrobeat, Gospel, Amapiano, and Pop.",
      },
      {
        name: "Audio Mastering & Commercial Usage",
        description: "Noise reduction, audio export standards (WAV/MP3), royalty-free licensing, and copyright attribution.",
      },
    ],
    practicalWorkflows: [
      "Generating a professional radio advertisement voiceover for a local driving school campaign.",
      "Creating an original Afrobeat marketing jingle with custom catchy lyrics using Suno AI.",
      "Translating and dubbing an English educational video into Swahili with synchronized voice cloning.",
    ],
    promptTemplates: [
      {
        title: "Suno Afrobeat Jingle Prompt",
        prompt: "Genre: Upbeat Afrobeat, uplifting log drum rhythm, acoustic guitar riffs, warm soulful vocals. Lyrics: [Verse] Start your engine, learn the way, KENA Driving School will lead the day. [Chorus] Road safety first, license in hand, the finest drivers in the land!",
        explanation: "Structures song sections with genre tags and metered lyrics for musical generation.",
      },
    ],
    jobAndMarketingTactics: [
      "Voiceover Artist on Fiverr & Upwork: Delivering commercial voiceovers for corporate explainer videos, YouTube channels, and audiobooks ($20-$50 per gig).",
      "Audio Ad Producer for Local Radio & TikTok: Creating jingles and voice adverts for Kenyan businesses.",
    ],
    localKenyanContext: "Creating voiceovers in Kenyan English accents, Swahili translations, and upbeat Afropop/Gengetone beats for local brand resonance.",
  },
  {
    id: 8,
    title: "Video generation",
    shortTitle: "AI Video Production",
    category: "AI",
    level: "Advanced",
    estimatedHours: "6 Hours",
    summary: "End-to-end cinematic AI video creation: text-to-video, image-to-video animation, camera controls, and avatar presenters using Runway Gen-3, Luma Dream Machine, and Kling.",
    keyTools: ["Runway Gen-3 Alpha", "Luma Dream Machine", "Kling AI", "HeyGen", "CapCut"],
    overview: "The frontier of generative video: transform still images into moving cinematic sequences, generate video clips from text prompts, and produce AI avatar presenter videos without needing cameras, lighting rigs, or actors.",
    coreConcepts: [
      {
        name: "Text-to-Video vs Image-to-Video (I2V)",
        description: "Why image-to-video provides 10x greater consistency and composition control by starting from a Midjourney image and animating it.",
      },
      {
        name: "Cinematic Camera Controls & Motion Prompts",
        description: "Prompting camera motions: Pan left/right, Zoom in/out, Drone aerial sweep, Crane shot, Orbit, and tracking moving subjects.",
      },
      {
        name: "AI Talking Head Avatars (HeyGen / Synthesia)",
        description: "Creating photo-realistic digital human avatars that speak any script in sync with lifelike lip movements and facial expressions.",
      },
      {
        name: "The 5-Step AI Video Pipeline",
        description: "1. Scripting (ChatGPT) &rarr; 2. Visual Storyboarding (Midjourney) &rarr; 3. Animation (Runway/Luma) &rarr; 4. Voice & Sound (ElevenLabs) &rarr; 5. Assembly (CapCut).",
      },
    ],
    practicalWorkflows: [
      "Producing a 30-second cinematic video advertisement for TikTok and Instagram Reels.",
      "Creating an AI instructor avatar that explains the Model Town Board rules in under 60 seconds.",
      "Extending and transitioning video scenes using Runway Gen-3 motion brush.",
    ],
    promptTemplates: [
      {
        title: "Cinematic Motion Prompt",
        prompt: "FPV drone camera flying low over a sleek modern vehicle driving through lush green tea plantations in Tigoni, Kenya, cinematic morning mist, golden sun flares, smooth stabilized motion, 4k ultra-detailed.",
        explanation: "Guides video physics, camera trajectory, and atmospheric lighting.",
      },
    ],
    jobAndMarketingTactics: [
      "AI Video Ad Agency: Producing short-form video ads for e-commerce brands, real estate firms, and hospitality venues ($150-$500 per video).",
      "Faceless YouTube Channel Creator: Building automated educational channels monetized through YouTube AdSense and sponsorships.",
    ],
    localKenyanContext: "Creating viral video content tailored to Kenyan TikTok, showcasing local landmarks, business showcases, and educational tips.",
  },
  {
    id: 9,
    title: "Job creation &marketing",
    shortTitle: "Job Creation & Marketing",
    category: "AI",
    level: "Advanced",
    estimatedHours: "5 Hours",
    summary: "Monetizing AI skills: remote freelancing on Upwork and Fiverr, AI digital marketing agencies for local businesses, WhatsApp automation, and online income streams.",
    keyTools: ["Upwork", "Fiverr", "Meta Ads Manager", "WhatsApp Business API", "Canva", "M-Pesa Till / Paybill"],
    overview: "Connecting technical AI mastery to real-world financial independence. Students learn step-by-step how to package their AI research, writing, design, audio, and video skills into paid services, acquire local and international clients, and automate digital marketing.",
    coreConcepts: [
      {
        name: "Remote Freelancing on Global Platforms",
        description: "Optimizing Upwork and Fiverr profiles, portfolio curation, proposal bidding strategies, and getting paid in USD to Kenyan bank accounts via Payoneer or PayPal.",
      },
      {
        name: "Local Business AI Marketing Agency",
        description: "Approaching Kenyan businesses (driving schools, clinics, schools, retail shops) to manage their social media, run Facebook/Instagram Ads, and create promotional videos.",
      },
      {
        name: "AI WhatsApp Business Automation",
        description: "Configuring automated AI customer support bots on WhatsApp to answer customer questions 24/7, book appointments, and capture phone numbers.",
      },
      {
        name: "Digital Product Creation",
        description: "Creating and selling prompt engineering bundles, study summaries, resume templates, and online workshops using M-Pesa automated payments.",
      },
    ],
    practicalWorkflows: [
      "Setting up a professional Upwork profile specializing as an 'AI Content & Video Creation Specialist'.",
      "Drafting a cold outreach pitch to a local business offering a 3-video trial marketing package.",
      "Setting up an automated Meta (Facebook/Instagram) lead generation ad targeting drivers in Kiambu and Nairobi.",
    ],
    promptTemplates: [
      {
        title: "Cold Client Outreach Pitch",
        prompt: `Write a friendly, high-converting WhatsApp message to the manager of a local business in Kenya.
Compliment their brand, point out that short-form TikTok/Reels videos could increase their customer inquiries by 40%, and offer to create 1 free sample AI promotional video with zero obligation. Keep it under 100 words, polite, and professional.`,
        explanation: "Crafts low-friction sales outreach tailored to Kenyan business communication etiquette.",
      },
    ],
    jobAndMarketingTactics: [
      "Freelance AI Specialist: Earning $500 - $2,500/month working remotely for international clients from Thika or Nairobi.",
      "Social Media Marketing Agency (SMMA): Retainer packages charging local businesses KSh 15,000 - 45,000/month for AI-powered content and ads.",
      "Corporate AI Trainer: Hosting weekend workshops for corporate staff on productivity using ChatGPT and NotebookLM.",
    ],
    localKenyanContext: "Navigating M-Pesa Paybill / Till Number payments, registering a business name on eCitizen (BRS), and compliance with KRA tax requirements.",
  },
];
