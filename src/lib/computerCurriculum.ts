export interface ComputerTopic {
  id: number;
  title: string;
  shortTitle: string;
  category: "COMPUTER";
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: string;
  summary: string;
  keySoftware: string[];
  overview: string;
  coreConcepts: {
    name: string;
    description: string;
  }[];
  practicalExercises?: string[];
  keyboardShortcuts: {
    key: string;
    action: string;
  }[];
  jobAndCareerSkills: string[];
  realWorldKenyaScenario: string;
  practicalWorkflows?: string[];
}

export const OFFICIAL_COMPUTER_TOPICS: ComputerTopic[] = [
  {
    id: 1,
    title: "Introduction to computers",
    shortTitle: "Intro to Computers",
    category: "COMPUTER",
    level: "Beginner",
    estimatedHours: "3 Hours",
    summary: "Foundational understanding of computers: definition, history, generations, classifications, and role in modern society and business.",
    keySoftware: ["Typing Master", "Basic OS Interface", "Calculator"],
    overview: "This orientation module introduces complete beginners to the digital world. Students understand what a computer is, the information processing cycle (Input &rarr; Process &rarr; Output &rarr; Storage), characteristics of computers (speed, accuracy, diligence, versatility), and classifications from microcomputers to supercomputers.",
    coreConcepts: [
      {
        name: "Information Processing Cycle",
        description: "The fundamental cycle of computing: Input (raw data capture), Processing (CPU manipulation), Output (meaningful information presentation), and Storage (secondary memory preservation).",
      },
      {
        name: "Generations of Computers",
        description: "Evolution from 1st Gen vacuum tubes to 2nd Gen transistors, 3rd Gen integrated circuits, 4th Gen microprocessors (VLSI), and 5th Gen AI-driven computing.",
      },
      {
        name: "Classifications of Computers",
        description: "Classification by size and processing power: Supercomputers, Mainframes, Minicomputers, Microcomputers (Desktops, Laptops, Tablets, Smartphones), and Embedded systems.",
      },
      {
        name: "Ergonomics & Health",
        description: "Proper sitting posture, monitor distance, lighting, wrist placement, and avoiding Repetitive Strain Injury (RSI) during long computer sessions.",
      },
    ],
    practicalExercises: [
      "Properly powering on, logging in, rebooting, and shutting down a desktop computer without data corruption.",
      "Touch typing fundamentals: Home row finger placement (ASDF - JKL;) and speed drills on Typing Master.",
      "Navigating the desktop environment using both mouse (left-click, right-click, double-click, drag-and-drop) and keyboard.",
    ],
    keyboardShortcuts: [
      { key: "Ctrl + Alt + Del", action: "Open Windows Security / Task Manager" },
      { key: "Windows Key", action: "Open Start Menu" },
      { key: "Alt + F4", action: "Close active window or prompt shutdown" },
    ],
    jobAndCareerSkills: [
      "Foundational digital literacy required for any modern front-office, administrative, or retail role.",
      "Touch typing proficiency (target 35-50 WPM) for data entry, receptionist, and customer service jobs.",
    ],
    realWorldKenyaScenario: "Operating an eCitizen cyber café terminal or retail point-of-sale (POS) terminal in Thika or Nairobi.",
  },
  {
    id: 2,
    title: "Computer systems & Hardware",
    shortTitle: "Hardware & Architecture",
    category: "COMPUTER",
    level: "Beginner",
    estimatedHours: "4 Hours",
    summary: "Comprehensive breakdown of physical components: Motherboard, CPU, RAM, ROM, storage drives, peripheral devices, and port interfaces.",
    keySoftware: ["Device Manager", "System Information (msinfo32)", "Task Manager Performance"],
    overview: "Demystifies the physical architecture of computer systems. Students learn to identify every internal component inside the system unit casing, understand how data travels along system buses, differentiate primary vs secondary storage, and connect peripherals safely.",
    coreConcepts: [
      {
        name: "Central Processing Unit (CPU)",
        description: "The brain of the computer comprising the Arithmetic Logic Unit (ALU), Control Unit (CU), and Registers. Clock speed measured in GHz, cache hierarchy (L1, L2, L3), and multi-core processing.",
      },
      {
        name: "Primary Storage (RAM vs ROM)",
        description: "RAM is volatile high-speed working memory that resets upon shutdown; ROM is non-volatile firmware holding BIOS/UEFI boot instructions.",
      },
      {
        name: "Secondary Storage (HDD vs SSD vs NVMe)",
        description: "Mechanical Hard Disk Drives (HDDs) vs Solid State Drives (SSDs) and ultra-fast NVMe M.2 drives; storage capacities from Gigabytes (GB) to Terabytes (TB).",
      },
      {
        name: "Peripherals & Input/Output Interfaces",
        description: "Input devices (Keyboards, Scanners, Barcode readers, Biometric thumbprint scanners), Output devices (Monitors, Thermal receipt printers, Projectors), and ports (USB 3.0/Type-C, HDMI, VGA, Ethernet RJ-45).",
      },
    ],
    practicalExercises: [
      "Physical disassembly and inspection of a desktop system unit: identifying CPU cooler, RAM slots, power supply unit (PSU), and SATA cables.",
      "Inspecting system specifications in Windows using 'dxdiag' and 'msinfo32' to determine installed RAM, processor generation, and storage health.",
      "Connecting and configuring a receipt printer, barcode scanner, and secondary monitor via HDMI.",
    ],
    keyboardShortcuts: [
      { key: "Windows Key + Pause/Break", action: "Open System Properties / About PC" },
      { key: "Ctrl + Shift + Esc", action: "Open Task Manager directly" },
      { key: "Windows Key + X", action: "Open Quick Link / Power User Menu" },
    ],
    jobAndCareerSkills: [
      "Hardware Specification Advisor: Advising businesses and schools on purchasing cost-effective desktop and laptop computers.",
      "IT Support Technician: Installing RAM upgrades, swapping slow HDDs for fast SSDs, and setting up office workstations.",
    ],
    realWorldKenyaScenario: "Upgrading a school lab's slow desktop computers with affordable 256GB SSDs and 8GB RAM sourced from Nairobi Computer Pride / Luthuli Avenue.",
  },
  {
    id: 3,
    title: "MS Windows",
    shortTitle: "Windows OS Mastery",
    category: "COMPUTER",
    level: "Beginner",
    estimatedHours: "4 Hours",
    summary: "Mastering the Microsoft Windows operating system: File Explorer, directory hierarchy, Control Panel, Task Manager, and personalization.",
    keySoftware: ["Windows 10 / 11", "File Explorer", "Task Manager", "Control Panel", "Windows Terminal / Command Prompt"],
    overview: "The operating system is the core software managing all computer hardware and software resources. Students achieve complete fluency in Microsoft Windows, mastering file management, directory folder trees, device settings, security updates, and troubleshooting unresponsive programs.",
    coreConcepts: [
      {
        name: "File & Directory Management",
        description: "Organizing files into logical directory trees, folder nesting, path conventions (e.g. C:\\KENA\\Students\\Invoices), and file extensions (.docx, .xlsx, .pdf, .jpg).",
      },
      {
        name: "File Attributes & Operations",
        description: "Copying, moving, renaming, compressing (ZIP/RAR), setting read-only/hidden attributes, and permanently deleting vs Recycle Bin recovery.",
      },
      {
        name: "Control Panel & Windows Settings",
        description: "Managing user accounts, password security, network connections, display scaling, default applications, and Windows Defender antivirus.",
      },
      {
        name: "Process Management with Task Manager",
        description: "Monitoring CPU and memory usage, identifying memory leaks, terminating frozen background tasks, and managing startup programs to boost boot speed.",
      },
    ],
    practicalWorkflows: [
      "Creating a structured organizational filing system for an enterprise with separate subfolders for Departments, Financial Years, and Student Admissions.",
      "Searching for misplaced files using wildcards (*.docx, ?_2026.pdf) and filtering by date modified and size.",
      "Creating compressed ZIP archives, setting password protection, and extracting multi-file packages.",
    ],
    keyboardShortcuts: [
      { key: "Windows Key + E", action: "Open File Explorer instantly" },
      { key: "Windows Key + D", action: "Show / Hide Desktop" },
      { key: "Alt + Tab", action: "Switch between running applications" },
      { key: "Windows Key + Shift + S", action: "Snipping Tool screen capture" },
    ],
    jobAndCareerSkills: [
      "Office File Management: Keeping corporate documents neatly indexed, backed up, and protected from accidental loss.",
      "Help Desk Support: Resetting user passwords, mapping shared network drives, and organizing office server folders.",
    ],
    realWorldKenyaScenario: "Setting up a secure multi-user desktop PC at a SACCO branch with separate password-protected accounts for Tellers and Branch Manager.",
  },
  {
    id: 4,
    title: "MS Word",
    shortTitle: "Word Processing",
    category: "COMPUTER",
    level: "Intermediate",
    estimatedHours: "6 Hours",
    summary: "Professional document creation: formatting, styles, tables, headers/footers, table of contents, and automated Mail Merge for mass letters.",
    keySoftware: ["Microsoft Word 2019 / 2021 / 365"],
    overview: "Microsoft Word is the world standard for office documentation. Students master document typography, page layout, multi-level numbering, corporate letterheads, official tables, automated citations, table of contents generation, and advanced Mail Merge for mass printing personalized certificates and invoices.",
    coreConcepts: [
      {
        name: "Typography & Character Formatting",
        description: "Font hierarchy, kerning, line spacing (1.15, 1.5, double), paragraph alignment, drop caps, and applying Heading Styles (H1, H2, H3) for semantic navigation.",
      },
      {
        name: "Page Setup & Section Breaks",
        description: "Margins, page orientation (Portrait vs Landscape within same document using Section Breaks), multi-column text (newspaper style), and gutter margins for binding.",
      },
      {
        name: "Tables & Document Graphics",
        description: "Inserting and formatting tables, cell merging/splitting, auto-fit behavior, formula calculations (=SUM), text wrapping around images, and SmartArt diagrams.",
      },
      {
        name: "Mail Merge Automation",
        description: "Linking an Excel candidate list to a Word template to auto-generate hundreds of personalized admission letters, exam notices, or completion certificates in seconds.",
      },
      {
        name: "Automated Reference Tools",
        description: "Inserting automated Table of Contents (TOC), footnotes/endnotes, captions for figures, and bibliography citations in APA/Chicago format.",
      },
    ],
    practicalWorkflows: [
      "Drafting a professional KENA Driving School official letterhead with company logo, NTSA registration badge, and header/footer contact details.",
      "Executing a 50-student Mail Merge linking an Excel student spreadsheet to Word completion certificates with individual grades and admission numbers.",
      "Creating an academic report with automatic Table of Contents, numbered headings, and portrait/landscape section breaks.",
    ],
    keyboardShortcuts: [
      { key: "Ctrl + B / I / U", action: "Bold / Italicize / Underline text" },
      { key: "Ctrl + E / L / R / J", action: "Center / Left / Right / Justify text" },
      { key: "Ctrl + K", action: "Insert Hyperlink" },
      { key: "Ctrl + H", action: "Find & Replace text dialog" },
    ],
    jobAndCareerSkills: [
      "Administrative Assistant / Secretary: Drafting formal correspondence, board minutes, contracts, and internal office memos.",
      "Typist & Document Formatter: Formatting university theses, court affidavits, and government tender submissions.",
    ],
    realWorldKenyaScenario: "Generating 120 official NTSA driving license completion certificates for a graduating cohort using automated Mail Merge in under 2 minutes.",
  },
  {
    id: 5,
    title: "MS Excel",
    shortTitle: "Spreadsheets & Analytics",
    category: "COMPUTER",
    level: "Intermediate",
    estimatedHours: "8 Hours",
    summary: "Data analysis and financial modeling: formulas (SUM, IF, VLOOKUP/XLOOKUP), conditional formatting, charts, Pivot Tables, and payroll sheets.",
    keySoftware: ["Microsoft Excel 2019 / 2021 / 365"],
    overview: "Microsoft Excel is the premier business calculation and data analysis software. Students learn to build dynamic financial ledgers, compute payroll with statutory Kenyan deductions (PAYE, NSSF, NHIF/SHIF), leverage formulas, analyze trends with Pivot Tables, and present data with interactive charts.",
    coreConcepts: [
      {
        name: "Cell Referencing (Relative vs Absolute)",
        description: "Understanding cell addresses (A1), relative referencing vs absolute lock referencing ($A$1) using the F4 key for fixed tax and exchange rate lookups.",
      },
      {
        name: "Core Mathematical & Statistical Formulas",
        description: "SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTIF, and SUMIF for calculating sub-totals based on conditions.",
      },
      {
        name: "Logical & Lookup Formulas (IF & VLOOKUP/XLOOKUP)",
        description: "Nested IF conditions (Grading: Dist, Credit, Pass, Fail), VLOOKUP for cross-referencing candidate IDs against payment records, and modern XLOOKUP.",
      },
      {
        name: "Data Visualization & Charts",
        description: "Clustered column charts, trend line charts, donut charts, sparklines, and setting up dynamic chart titles connected to cell values.",
      },
      {
        name: "Pivot Tables & Slicers",
        description: "Summarizing thousands of transactional rows in seconds: grouping sales by branch, intake month, vehicle transmission, and filtering with interactive slicers.",
      },
    ],
    practicalWorkflows: [
      "Building an automated Student Fee Balance Ledger calculating Tuition Due, Paid Amount, Balance, and Payment Status (Cleared / Partial / Pending).",
      "Designing a Kenyan Monthly Payroll Sheet factoring in Basic Salary, Allowances, Gross Pay, NSSF, SHIF/NHIF, PAYE, and Net Pay.",
      "Creating a Pivot Table dashboard analyzing student enrollments by course package and transmission type.",
    ],
    keyboardShortcuts: [
      { key: "F4", action: "Toggle Absolute Cell Reference ($A$1)" },
      { key: "Alt + =", action: "AutoSum selected numbers instantly" },
      { key: "Ctrl + Shift + L", action: "Toggle Filter dropdowns on table" },
      { key: "Ctrl + ;", action: "Insert current date into active cell" },
    ],
    jobAndCareerSkills: [
      "Accounts Clerk / Bookkeeper: Managing sales daybooks, petty cash vouchers, invoicing, and balance reconciliations ($300-$700/mo).",
      "Data Entry Specialist: Accurately compiling inventories, inventory logs, and corporate customer registries.",
    ],
    realWorldKenyaScenario: "Reconciling daily M-Pesa Till payments against student admission records in Excel using VLOOKUP and flagging unsettled balances.",
  },
  {
    id: 6,
    title: "MS Access",
    shortTitle: "Relational Databases",
    category: "COMPUTER",
    level: "Advanced",
    estimatedHours: "6 Hours",
    summary: "Relational database design: Tables, Primary/Foreign keys, Relationships (1-to-Many), Query design, User Data Forms, and Printable Reports.",
    keySoftware: ["Microsoft Access 2019 / 2021 / 365"],
    overview: "Move beyond flat spreadsheets into true relational database management (RDBMS). Students learn how to architect normalized databases, enforce referential integrity between tables, design complex SQL queries, and build user-friendly input forms and executive print reports.",
    coreConcepts: [
      {
        name: "Database Architecture & Normalization",
        description: "Eliminating data redundancy by splitting flat tables into related entities (e.g. tblStudents, tblCourses, tblPayments, tblInstructors).",
      },
      {
        name: "Primary Keys & Foreign Keys",
        description: "Unique identifiers (e.g. AdmissionNumber, StudentID) and creating 1-to-Many relationships with Referential Integrity and Cascade Updates/Deletes.",
      },
      {
        name: "Query Design (Select, Parameter, Calculated)",
        description: "Extracting specific records using criteria (>10000, Like 'Thika*', Between Date1 And Date2), calculated query fields, and aggregate totals.",
      },
      {
        name: "Data Input Forms",
        description: "Designing user-friendly data entry screens with text boxes, combo box dropdowns, date pickers, command buttons, and sub-forms for nested records.",
      },
      {
        name: "Executive Reports & Invoices",
        description: "Building professional printable reports with grouped headers, summary footers, page numbering, and clean print preview formatting.",
      },
    ],
    practicalWorkflows: [
      "Building a complete KENA School Management Database with tables for Students, Vehicles, Instructors, and Lessons with 1-to-Many relationships.",
      "Creating a Query to find all students enrolled in Category B Manual who have a fee balance greater than KSh 5,000.",
      "Designing a professional Student Invoice report ready for export to PDF and direct printing.",
    ],
    keyboardShortcuts: [
      { key: "F5", action: "Run Query / Switch to Form View" },
      { key: "Ctrl + ;", action: "Insert current date into database field" },
      { key: "Shift + F2", action: "Open Zoom box for editing long formulas/criteria" },
    ],
    jobAndCareerSkills: [
      "Database Administrator Assistant: Maintaining corporate records, running daily data exports, and backing up company databases.",
      "Records Management Officer: Managing student archives, patient hospital registries, or inventory warehouse databases.",
    ],
    realWorldKenyaScenario: "Architecting a driving school student tracking database that prevents booking a practical lesson if the student's fee clearance is under 50%.",
  },
  {
    id: 7,
    title: "MS Publisher",
    shortTitle: "Desktop Publishing",
    category: "COMPUTER",
    level: "Intermediate",
    estimatedHours: "4 Hours",
    summary: "Graphic desktop publishing: flyers, tri-fold brochures, business cards, certificates, banners, newsletters, and print layout calibration.",
    keySoftware: ["Microsoft Publisher 2019 / 2021 / 365"],
    overview: "Microsoft Publisher empowers students to design marketing materials with precise visual alignment, page bleed, color palettes, and print-ready typography. Students master the creation of tri-fold marketing brochures, corporate business cards, student IDs, and promotional flyers.",
    coreConcepts: [
      {
        name: "Layout Guides & Grid Alignment",
        description: "Ruler guides, margin guides, column guides, and snap-to-grid features ensuring perfect geometric symmetry across print folds.",
      },
      {
        name: "Visual Hierarchy & Typography",
        description: "Pairing display header fonts with readable body text, contrast ratios, text box linking (overflow text flowing to next column), and drop shadows.",
      },
      {
        name: "Color Models (RGB vs CMYK)",
        description: "Understanding screen colors (RGB) vs commercial printing press inks (CMYK), spot colors, and bleed margins to prevent white edges after cutting.",
      },
      {
        name: "Master Pages & Two-Sided Printing",
        description: "Creating repeating headers/footers with Master Pages, setting up back-to-back duplex printing, and calibrating folds for 3-panel brochures.",
      },
    ],
    practicalWorkflows: [
      "Designing a full-color tri-fold promotional brochure for KENA Driving School & Computer College detailing courses, fees, and location.",
      "Creating a corporate double-sided business card layout with logo, contact details, QR code, and bleed crop marks.",
      "Designing an official Certificate of Competency with ornamental borders and seal ribbons.",
    ],
    keyboardShortcuts: [
      { key: "F9", action: "Toggle between 100% actual size and whole page zoom" },
      { key: "Ctrl + Shift + G", action: "Group selected objects together" },
      { key: "Ctrl + Shift + U", action: "Ungroup objects" },
    ],
    jobAndCareerSkills: [
      "Print Shop & Cyber Café Operator: Designing and printing funeral programs, wedding invitations, posters, and flyers for walk-in clients.",
      "Brand Collateral Designer: Producing corporate marketing materials for local small and medium enterprises.",
    ],
    realWorldKenyaScenario: "Designing a high-impact advertising poster for KENA Driving School's April Holiday student intake to print on glossy A3 paper.",
  },
  {
    id: 8,
    title: "MS PowerPoint",
    shortTitle: "Presentations & Pitch Decks",
    category: "COMPUTER",
    level: "Intermediate",
    estimatedHours: "4 Hours",
    summary: "Creating high-impact visual presentations: Slide Master, transitions, animations, embedded video/audio, and executive pitch deck delivery.",
    keySoftware: ["Microsoft PowerPoint 2019 / 2021 / 365"],
    overview: "Transform dry ideas into compelling visual stories. Students learn how to structure persuasive business presentations, leverage the Slide Master for corporate consistency, embed video demonstrations, apply subtle motion transitions, and deliver presentations professionally using Presenter View.",
    coreConcepts: [
      {
        name: "Slide Master & Corporate Templates",
        description: "Setting up a universal Slide Master with company branding, color theme, and default fonts so all slides remain consistent automatically.",
      },
      {
        name: "The 10/20/30 Rule & Visual Design",
        description: "Avoiding text-heavy slides: using iconography, high-resolution imagery, minimal bullet points, and high contrast for projector visibility.",
      },
      {
        name: "Transitions vs Custom Animations",
        description: "Using smooth slide transitions (Morph, Fade) and entrance/emphasis animations to progressively reveal bullet points during a speech.",
      },
      {
        name: "Presenter View & Delivery Tools",
        description: "Using dual-monitor Presenter View to see speaker notes, elapsed timer, laser pointer tool, and upcoming slides while audience sees clean presentation.",
      },
    ],
    practicalWorkflows: [
      "Creating an interactive 10-slide Driver Safety Induction presentation with embedded video clips of Model Town Board navigation.",
      "Designing a business pitch deck for youth entrepreneurs seeking capital from the Youth Enterprise Development Fund (YEDF).",
      "Using the Morph transition to smoothly animate a vehicle moving through a roundabout.",
    ],
    keyboardShortcuts: [
      { key: "F5", action: "Start presentation from beginning slide" },
      { key: "Shift + F5", action: "Start presentation from current slide" },
      { key: "B / W (during slideshow)", action: "Blackout / Whiteout screen to focus audience attention" },
      { key: "Ctrl + P (during slideshow)", action: "Change cursor to drawing pen" },
    ],
    jobAndCareerSkills: [
      "Corporate Trainer / Instructor: Creating interactive lesson slides for classroom teaching and workshops.",
      "Executive Pitch Deck Designer: Freelancing on Upwork/Fiverr designing pitch presentations for startups and executives ($50-$200 per deck).",
    ],
    realWorldKenyaScenario: "Delivering an NTSA Road Safety training slide deck to a room of 40 corporate fleet drivers at a logistics company in Nairobi.",
  },
  {
    id: 9,
    title: "Email & Internet",
    shortTitle: "Internet & Digital Comms",
    category: "COMPUTER",
    level: "Beginner",
    estimatedHours: "4 Hours",
    summary: "Navigating the web, email etiquette, attachments, cloud storage (Google Drive/OneDrive), cyber hygiene, phishing prevention, and eCitizen navigation.",
    keySoftware: ["Google Chrome", "Mozilla Firefox", "Gmail", "Microsoft Outlook", "Google Drive"],
    overview: "The internet is the backbone of global commerce. Students achieve complete mastery over web browsing, search syntax, professional email correspondence, cloud document sharing, two-factor authentication, and safe online transactions avoiding scams.",
    coreConcepts: [
      {
        name: "Web Browsing & URL Architecture",
        description: "Understanding protocols (HTTP vs HTTPS security padlock), domain extensions (.co.ke, .org, .edu), bookmarks, clearing cache/cookies, and incognito mode.",
      },
      {
        name: "Professional Email Etiquette (Gmail & Outlook)",
        description: "Subject line clarity, formal salutations, CC (Carbon Copy) vs BCC (Blind Carbon Copy), email signatures, out-of-office autoreponders, and scheduling sends.",
      },
      {
        name: "Email Attachments & Cloud File Links",
        description: "Sending attachments within 25MB limits, sharing large files via Google Drive / OneDrive with view vs edit permissions.",
      },
      {
        name: "Cyber Hygiene & Online Safety in Kenya",
        description: "Identifying phishing emails, fake KRA/M-Pesa SMS links, password strength, Two-Factor Authentication (2FA), and safe downloads.",
      },
    ],
    practicalWorkflows: [
      "Setting up a professional Gmail account with a branded corporate email signature, phone contacts, and disclaimer.",
      "Navigating Kenyan eCitizen portal: logging in, searching for NTSA TIMS services, generating eCitizen invoice slips, and verifying Paybill numbers.",
      "Collaborating on a shared Google Docs spreadsheet with real-time comments and version history.",
    ],
    keyboardShortcuts: [
      { key: "Ctrl + T", action: "Open new browser tab" },
      { key: "Ctrl + Shift + T", action: "Reopen last closed browser tab" },
      { key: "Ctrl + Shift + N", action: "Open new Incognito / Private browsing window" },
      { key: "Ctrl + D", action: "Bookmark current webpage" },
    ],
    jobAndCareerSkills: [
      "Customer Care Representative: Managing company customer email inquiries, scheduling appointments, and digital communication.",
      "E-Government Services Operator: Assisting citizens with eCitizen, KRA iTax, NTSA TIMS, and HELB portal applications.",
    ],
    realWorldKenyaScenario: "Applying for a student's NTSA Provisional Driving License (PDL) on eCitizen TIMS, paying via M-Pesa, and downloading the official PDF receipt.",
  },
  {
    id: 10,
    title: "Computer maintenance",
    shortTitle: "PC Maintenance & Security",
    category: "COMPUTER",
    level: "Intermediate",
    estimatedHours: "5 Hours",
    summary: "Hardware care, operating system optimization, disk cleanup, software installation/removal, malware scanning, data backups, and troubleshooting common faults.",
    keySoftware: ["Disk Cleanup", "Defragment and Optimize Drives", "Windows Defender", "Malwarebytes", "Recuva"],
    overview: "Teaches students practical skills to keep computers running fast, secure, and reliable. Students learn preventative physical maintenance, disk health management, software management, malware removal, automated backups, and troubleshooting boot failures and blue screens.",
    coreConcepts: [
      {
        name: "Preventative Physical Care",
        description: "Blowing dust out of cooling fans and heatsinks, thermal paste replacement, anti-static precautions, and using uninterruptible power supplies (UPS) to guard against power surges.",
      },
      {
        name: "Disk Optimization & Cleanup",
        description: "Running Windows Disk Cleanup to purge temporary files, cache, and old Windows update logs; defragmenting HDDs and TRIM optimization for SSDs.",
      },
      {
        name: "Software & Driver Management",
        description: "Proper software installation, clean uninstallation preventing registry bloat, updating device drivers (graphics, network, audio), and Windows Updates.",
      },
      {
        name: "Malware & Virus Removal",
        description: "Understanding viruses, worms, trojans, ransomware, and spyware; performing deep scans with Windows Defender and removing rogue browser extensions.",
      },
      {
        name: "Backup Strategies (3-2-1 Rule)",
        description: "3 copies of critical data, on 2 different media types (internal drive + external hard drive), with 1 copy offsite in cloud storage (Google Drive / OneDrive).",
      },
    ],
    practicalWorkflows: [
      "Performing a complete PC tune-up: cleaning dust, purging 15GB of temporary junk files, and disabling unnecessary startup programs to reduce boot time by 50%.",
      "Diagnosing a slow or freezing computer: checking Task Manager resource spikes, testing hard drive health, and running a full virus scan.",
      "Creating an automated backup of important business documents to an external flash drive.",
    ],
    keyboardShortcuts: [
      { key: "Windows Key + R", action: "Open Run dialog (temp, %temp%, cleanmgr)" },
      { key: "Ctrl + Shift + Esc", action: "Open Task Manager to diagnose bottlenecks" },
      { key: "Windows Key + L", action: "Lock PC when stepping away from desk" },
    ],
    jobAndCareerSkills: [
      "Computer Repair & Maintenance Technician: Servicing computers for local schools, cyber cafés, and corporate offices (KSh 1,500 - 3,500 per PC service).",
      "Office IT Coordinator: Ensuring all company computers remain updated, backed up, and protected from ransomware threats.",
    ],
    realWorldKenyaScenario: "Reviving a sluggish cyber café computer in Thika by cleaning browser adware, upgrading startup apps, and freeing up 30GB of disk space.",
  },
];
