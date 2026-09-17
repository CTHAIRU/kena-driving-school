const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning database...");
  await db.admin.deleteMany();
  await db.studentModuleProgress.deleteMany();
  await db.practicalSheetEntry.deleteMany();
  await db.receiptChangeRequest.deleteMany();
  await db.gradebookEntry.deleteMany();
  await db.courseContent.deleteMany();
  await db.studentSkill.deleteMany();
  await db.exam.deleteMany();
  await db.payment.deleteMany();
  await db.lesson.deleteMany();
  await db.student.deleteMany();
  await db.instructor.deleteMany();
  await db.vehicle.deleteMany();
  await db.package.deleteMany();

  console.log("📦 Creating Kena Driving School & Computer College packages...");
  // 14 Driving Classes in official order
  const pkgA1 = await db.package.create({
    data: {
      name: "A1 - Light Motorcycle",
      category: "Category A1 - Motorcycle",
      totalHours: 15,
      price: 7000.0,
      description: "Light motorcycle rider training under 50cc-125cc.",
    },
  });

  const pkgMotorcycle = await db.package.create({
    data: {
      name: "A2 - Motorcycle Taxi, Couriers and three-wheelers",
      category: "Category A2 - Motorcycle Taxi",
      totalHours: 15,
      price: 8000.0,
      description: "Commercial boda boda and courier motorcycle certification.",
    },
  });

  const pkgA3 = await db.package.create({
    data: {
      name: "A3 -Motorcycle three-wheelers",
      category: "Category A3 - Three-Wheelers",
      totalHours: 15,
      price: 8500.0,
      description: "Three-wheeler and tuk-tuk passenger/cargo vehicle training.",
    },
  });

  const pkgClassBAuto = await db.package.create({
    data: {
      name: "B1 - Light Automatic Vehicle",
      category: "Category B1 - Automatic",
      totalHours: 20,
      price: 15500.0,
      description: "Light passenger car automatic transmission roadcraft.",
    },
  });

  const pkgClassBManual = await db.package.create({
    data: {
      name: "B2 - Light Manual Vehicle",
      category: "Category B2 - Manual",
      totalHours: 20,
      price: 14500.0,
      description: "Light passenger car manual transmission, clutch balancing & town board.",
    },
  });

  const pkgBProf = await db.package.create({
    data: {
      name: "B Professional",
      category: "Category B - Professional",
      totalHours: 25,
      price: 16500.0,
      description: "Professional driving, defensive roadcraft, VIP & chauffeur techniques.",
    },
  });

  const pkgC1 = await db.package.create({
    data: {
      name: "C1 - Light Truck",
      category: "Category C1 - Light Truck",
      totalHours: 20,
      price: 18500.0,
      description: "Light commercial truck training (up to 7500kg GVW).",
    },
  });

  const pkgC = await db.package.create({
    data: {
      name: "C - Medium Truck",
      category: "Category C - Medium Truck",
      totalHours: 25,
      price: 20000.0,
      description: "Medium commercial rigid truck operation and cargo transit.",
    },
  });

  const pkgCE = await db.package.create({
    data: {
      name: "CE - Heavy Truck with trailer",
      category: "Category CE - Heavy Trailer",
      totalHours: 30,
      price: 25000.0,
      description: "Heavy articulated commercial truck with trailer & long distance haulage.",
    },
  });

  const pkgCD = await db.package.create({
    data: {
      name: "CD - Heavy Goods Vehicle for Transportation of Hazardous Materials",
      category: "Category CD - Hazardous Materials",
      totalHours: 35,
      price: 28000.0,
      description: "Tankers, flammable, toxic & chemical dangerous goods transport.",
    },
  });

  const pkgD1 = await db.package.create({
    data: {
      name: "D1 - Van (maximum of 14 passengers)",
      category: "Category D1 - Van",
      totalHours: 15,
      price: 12000.0,
      description: "Passenger van and light public service vehicle (PSV up to 14 pax).",
    },
  });

  const pkgD2 = await db.package.create({
    data: {
      name: "D2 - Minibus (14 to 32 passengers)",
      category: "Category D2 - Minibus",
      totalHours: 20,
      price: 15000.0,
      description: "Medium passenger bus and matatu PSV (14 to 32 passengers).",
    },
  });

  const pkgD3 = await db.package.create({
    data: {
      name: "D3 - Large Bus (33 or more passengers)",
      category: "Category D3 - Large Bus",
      totalHours: 25,
      price: 22000.0,
      description: "Large commercial coach and passenger bus (33+ pax).",
    },
  });

  const pkgD4 = await db.package.create({
    data: {
      name: "D4 - Articulated Bus",
      category: "Category D4 - Articulated Bus",
      totalHours: 30,
      price: 26000.0,
      description: "High-capacity articulated transit bus and rapid transit vehicle.",
    },
  });

  // Computer College & AI Packages
  const pkgComputer = await db.package.create({
    data: {
      name: "Computer Packages Certification (10 Modules)",
      category: "Computer College",
      totalHours: 40,
      price: 6000.0,
      description: "Complete 10-module comprehensive IT foundation and office suite.",
    },
  });

  const pkgAI = await db.package.create({
    data: {
      name: "Artificial Intelligence masterclasses",
      category: "Artificial Intelligence",
      totalHours: 20,
      price: 10000.0,
      description: "Comprehensive masterclass on generative AI, LLMs, automation and creative workflows.",
    },
  });

  console.log("🛡️ Creating Admin accounts...");
  await db.admin.create({
    data: {
      name: "KENA Director Desk",
      email: "admin@kenadrivingschool.com",
      phone: "+254 713 449 911",
      password: "admin123",
      role: "SUPERADMIN",
    },
  });

  console.log("🚗 Creating Thika fleet vehicles...");
  const futureDate = (months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const pastDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };

  const v1 = await db.vehicle.create({
    data: {
      make: "Toyota",
      model: "Yaris Dual-Control",
      year: 2022,
      registrationPlate: "KDA 102B",
      transmission: "MANUAL",
      category: "Hatchback",
      status: "AVAILABLE",
      mileage: 41200,
      insuranceExpiry: futureDate(6),
      inspectionExpiry: futureDate(8),
      lastServiceDate: pastDate(20),
    },
  });

  const v2 = await db.vehicle.create({
    data: {
      make: "Volkswagen",
      model: "Polo Dual-Control",
      year: 2023,
      registrationPlate: "KDC 543L",
      transmission: "AUTOMATIC",
      category: "Hatchback",
      status: "AVAILABLE",
      mileage: 23100,
      insuranceExpiry: futureDate(9),
      inspectionExpiry: futureDate(11),
      lastServiceDate: pastDate(12),
    },
  });

  const v3 = await db.vehicle.create({
    data: {
      make: "Nissan",
      model: "Note e-Power",
      year: 2021,
      registrationPlate: "KCY 881P",
      transmission: "AUTOMATIC",
      category: "Hatchback",
      status: "IN_SERVICE",
      mileage: 56400,
      insuranceExpiry: futureDate(2), // Coming up
      inspectionExpiry: futureDate(1), // Soon
      lastServiceDate: pastDate(35),
    },
  });

  const v4 = await db.vehicle.create({
    data: {
      make: "Yamaha",
      model: "YB 125 Training Edition",
      year: 2023,
      registrationPlate: "KMDF 219K",
      transmission: "MANUAL",
      category: "Motorcycle",
      status: "AVAILABLE",
      mileage: 9400,
      insuranceExpiry: futureDate(7),
      inspectionExpiry: futureDate(9),
      lastServiceDate: pastDate(28),
    },
  });

  const v5 = await db.vehicle.create({
    data: {
      make: "Isuzu",
      model: "D-Max Dual-Control",
      year: 2020,
      registrationPlate: "KDE 402T",
      transmission: "MANUAL",
      category: "Pickup / Commercial",
      status: "MAINTENANCE",
      mileage: 72000,
      insuranceExpiry: futureDate(4),
      inspectionExpiry: futureDate(2),
      lastServiceDate: pastDate(3),
    },
  });

  console.log("👨‍🏫 Creating certified Driving instructors, Computer tutors & AI tutors...");
  const inst1 = await db.instructor.create({
    data: {
      firstName: "Marcus",
      lastName: "Kariuki",
      email: "marcus.k@kenadrivingschool.com",
      phone: "+254 713 449 911",
      licenseNumber: "NTSA-INS-99214-B",
      specializations: "Manual, Model Town Board, Highway Roadcraft",
      category: "DRIVING",
      department: "Driving School",
      modulesTaught: "Vehicle Inspection, Clutch Control, Town Board, Highway Driving, NTSA Test Prep",
      status: "ACTIVE",
      rating: 4.9,
      assignedVehicleId: v1.id,
    },
  });

  const inst2 = await db.instructor.create({
    data: {
      firstName: "Sarah",
      lastName: "Wambui",
      email: "sarah.w@kenadrivingschool.com",
      phone: "+254 722 887 654",
      licenseNumber: "NTSA-INS-77182-A",
      specializations: "Automatic, Nervous Beginners, Eco-Driving",
      category: "DRIVING",
      department: "Driving School",
      modulesTaught: "Automatic Transmission, Steering Drills, Reversing, Traffic Navigation",
      status: "ACTIVE",
      rating: 5.0,
      assignedVehicleId: v2.id,
    },
  });

  const inst3 = await db.instructor.create({
    data: {
      firstName: "David",
      lastName: "Omondi",
      email: "david.o@kenadrivingschool.com",
      phone: "+254 733 451 902",
      licenseNumber: "NTSA-INS-55619-M",
      specializations: "Motorcycle Roadcraft, Boda Boda Safety",
      category: "DRIVING",
      department: "Driving School",
      modulesTaught: "Two-Wheeler Balance, Hazard Perception, Road Maneuvers",
      status: "ACTIVE",
      rating: 4.8,
      assignedVehicleId: v4.id,
    },
  });

  // Computer Tutors
  const instComp1 = await db.instructor.create({
    data: {
      firstName: "Grace",
      lastName: "Mwangi",
      email: "grace.m@kenacollege.com",
      phone: "+254 712 301 445",
      licenseNumber: "KENA-COMP-TTR-01",
      specializations: "MS Office Suite, Database Systems (Access), Document Publishing",
      category: "COMPUTER",
      department: "Computer College",
      modulesTaught: "MS Word, MS Excel, MS Access, MS Publisher, MS PowerPoint",
      labStation: "Computer Lab 1 - Station 04",
      certifications: "Diploma in Computer Science, Microsoft Office Specialist (MOS), ICDL Certified",
      status: "ACTIVE",
      rating: 4.9,
    },
  });

  const instComp2 = await db.instructor.create({
    data: {
      firstName: "Brian",
      lastName: "Kiprono",
      email: "brian.k@kenacollege.com",
      phone: "+254 724 610 882",
      licenseNumber: "KENA-COMP-TTR-02",
      specializations: "Hardware & Maintenance, OS Configuration, Internet & Cyber Security",
      category: "COMPUTER",
      department: "Computer College",
      modulesTaught: "Introduction to computers, Computer systems & Hardware, MS Windows, Email & Internet, Computer maintenance",
      labStation: "Computer Lab 2 - Hardware Workshop",
      certifications: "CompTIA A+, CompTIA Network+, Microsoft Certified Professional",
      status: "ACTIVE",
      rating: 4.8,
    },
  });

  // AI Tutors
  const instAi1 = await db.instructor.create({
    data: {
      firstName: "Dr. Kenneth",
      lastName: "Otieno",
      email: "kenneth.o@kenacollege.com",
      phone: "+254 708 920 114",
      licenseNumber: "KENA-AI-TTR-01",
      specializations: "LLMs, Prompt Engineering, Research Assistants & NotebookLM",
      category: "AI",
      department: "Modern AI Academy",
      modulesTaught: "Introduction to AI & its basic, AI models ;Chatgpt, Gemini Etc., Research and writing assistants, Notebook LM, Prompt engineering",
      labStation: "AI Research Suite - Innovation Hub",
      certifications: "Ph.D. in Data Science, Certified Prompt Engineer, Google Cloud Certified AI Engineer",
      status: "ACTIVE",
      rating: 5.0,
    },
  });

  const instAi2 = await db.instructor.create({
    data: {
      firstName: "Faith",
      lastName: "Cherotich",
      email: "faith.c@kenacollege.com",
      phone: "+254 791 440 231",
      licenseNumber: "KENA-AI-TTR-02",
      specializations: "Generative Media (Image/Audio/Video), AI Freelancing & Monetization",
      category: "AI",
      department: "Modern AI Academy",
      modulesTaught: "Image generation, Audio generation, Video generation, Job creation &marketing",
      labStation: "Creative AI Multimedia Studio",
      certifications: "Generative AI Specialist (Midjourney & Runway), Top Rated Plus AI Freelancer (Upwork)",
      status: "ACTIVE",
      rating: 4.9,
    },
  });

  console.log("🎓 Enrolling students with NTSA credentials...");
  const student1 = await db.student.create({
    data: {
      firstName: "Alice",
      lastName: "Wanjiru",
      admissionNumber: "KNA-2026-001",
      email: "alice.wanjiru@gmail.com",
      phone: "+254 701 112 233",
      dateOfBirth: "1999-04-12",
      idNumber: "38291044",
      pdlNumber: "PDL-2026-8910",
      eCitizenRef: "EC-NTSA-99104",
      branch: "Tabby House, Thika",
      licenseCategory: "Category B - Light Vehicle",
      transmission: "MANUAL",
      status: "TEST_READY",
      packageId: pkgClassBManual.id,
      instructorId: inst1.id,
      requiredHours: 20.0,
      completedHours: 19.5,
      customTuitionFee: 14500.0,
      balance: 0.0,
      certificateStatus: "PRINTING",
      certificateNumber: "KENA-CERT-DRV-2026-001",
      certificateIssueDate: new Date(),
      certificateRemarks: "Practical card certified 23/25. Road test ready and certificate printing.",
      nextOfKinName: "Grace Wanjiru",
      nextOfKinPhone: "+254 712 334 455",
      nextOfKinRelation: "Parent",
      referralSource: "Friend",
      notes: "Completed Model Town Board and Thika Superhighway road sessions. Ready for NTSA road test.",
    },
  });

  const student2 = await db.student.create({
    data: {
      firstName: "Brian",
      lastName: "Kimani",
      admissionNumber: "KNA-2026-002",
      email: "brian.k@yahoo.com",
      phone: "+254 702 445 566",
      dateOfBirth: "2001-08-25",
      idNumber: "39182761",
      pdlNumber: "PDL-2026-9214",
      eCitizenRef: "EC-NTSA-88123",
      branch: "Tabby House, Thika",
      licenseCategory: "Category B - Light Vehicle",
      transmission: "AUTOMATIC",
      status: "IN_TRAINING",
      packageId: pkgClassBAuto.id,
      instructorId: inst2.id,
      requiredHours: 20.0,
      completedHours: 12.0,
      customTuitionFee: 15500.0,
      balance: 4500.0,
      nextOfKinName: "John Kimani",
      nextOfKinPhone: "+254 722 556 677",
      nextOfKinRelation: "Parent",
      referralSource: "Google",
      notes: "Practicing 90-degree bay parking and roundabout priority rules.",
    },
  });

  const student3 = await db.student.create({
    data: {
      firstName: "Chloe",
      lastName: "Mwangi",
      admissionNumber: "KNA-2026-003",
      email: "chloe.m@gmail.com",
      phone: "+254 703 778 899",
      dateOfBirth: "2000-11-03",
      idNumber: "40291823",
      pdlNumber: "PDL-2026-9441",
      eCitizenRef: "EC-NTSA-91201",
      branch: "Tabby House, Thika",
      licenseCategory: "Category B - Light Vehicle",
      transmission: "BOTH",
      status: "IN_TRAINING",
      packageId: pkgClassBManual.id,
      instructorId: inst1.id,
      requiredHours: 20.0,
      completedHours: 6.5,
      customTuitionFee: 16500.0,
      balance: 7000.0,
      nextOfKinName: "Paul Mwangi",
      nextOfKinPhone: "+254 733 998 877",
      nextOfKinRelation: "Sibling",
      referralSource: "Instagram",
      notes: "Clutch biting point and hill start at Chania bridge gradient. Dual transmission enrolled.",
    },
  });

  const student4 = await db.student.create({
    data: {
      firstName: "Daniel",
      lastName: "Otieno",
      admissionNumber: "KNA-2026-004",
      email: "daniel.otieno@gmail.com",
      phone: "+254 704 332 110",
      dateOfBirth: "1997-02-18",
      idNumber: "37281900",
      pdlNumber: "PDL-2026-7811",
      eCitizenRef: "EC-NTSA-77402",
      branch: "Tabby House, Thika",
      licenseCategory: "Category A - Motorcycle",
      transmission: "MANUAL",
      status: "IN_TRAINING",
      packageId: pkgMotorcycle.id,
      instructorId: inst3.id,
      requiredHours: 15.0,
      completedHours: 9.0,
      customTuitionFee: 7500.0,
      balance: 2500.0,
      nextOfKinName: "Mary Otieno",
      nextOfKinPhone: "+254 720 112 233",
      nextOfKinRelation: "Spouse",
      referralSource: "Facebook",
      notes: "Slalom control and highway defensive roadcraft.",
    },
  });

  const student5 = await db.student.create({
    data: {
      firstName: "Evelyn",
      lastName: "Mutua",
      admissionNumber: "KNA-2026-005",
      email: "evelyn.mutua@outlook.com",
      phone: "+254 705 991 882",
      dateOfBirth: "2003-09-10",
      idNumber: "36192837",
      pdlNumber: "PDL-2026-6643",
      eCitizenRef: "EC-NTSA-66190",
      branch: "Tabby House, Thika",
      licenseCategory: "Category B - Light Vehicle",
      transmission: "AUTOMATIC",
      status: "GRADUATED",
      packageId: pkgClassBAuto.id,
      instructorId: inst2.id,
      requiredHours: 20.0,
      completedHours: 20.0,
      customTuitionFee: 15500.0,
      balance: 0.0,
      certificateStatus: "COLLECTED",
      certificateNumber: "KENA-CERT-DRV-2026-005",
      certificateIssueDate: pastDate(14),
      certificateRemarks: "Collected in person at Thika Campus desk.",
      nextOfKinName: "Samuel Mutua",
      nextOfKinPhone: "+254 714 887 766",
      nextOfKinRelation: "Parent",
      referralSource: "Tiktok",
      notes: "Passed official NTSA driving examination at Thika Test Center with 0 minor infractions!",
    },
  });

  const student6 = await db.student.create({
    data: {
      firstName: "Faith",
      lastName: "Wambui",
      admissionNumber: "KNA-2026-006",
      email: "faith.w@gmail.com",
      phone: "+254 706 123 456",
      dateOfBirth: "2002-05-19",
      idNumber: "38192033",
      branch: "Tabby House, Thika",
      licenseCategory: "Computer Packages",
      transmission: "NONE",
      status: "GRADUATED",
      packageId: pkgComputer.id,
      instructorId: instComp1.id,
      requiredHours: 40.0,
      completedHours: 40.0,
      customTuitionFee: 6000.0,
      balance: 0.0,
      certificateStatus: "PRINTING",
      certificateNumber: "KENA-CERT-COMP-2026-006",
      certificateIssueDate: new Date(),
      certificateRemarks: "Graduated with Distinction. Certificate forwarded to printing press.",
      nextOfKinName: "Esther Wambui",
      nextOfKinPhone: "+254 722 119 900",
      nextOfKinRelation: "Parent",
      referralSource: "Friend",
      notes: "Excelled in MS Office Suite & advanced database queries. Certified all 10 modules.",
    },
  });

  const student7 = await db.student.create({
    data: {
      firstName: "Geoffrey",
      lastName: "Mwangi",
      admissionNumber: "KNA-2026-007",
      email: "geoffrey.m@yahoo.com",
      phone: "+254 707 987 654",
      dateOfBirth: "2000-03-14",
      idNumber: "37482910",
      branch: "Tabby House, Thika",
      licenseCategory: "Computer Packages",
      transmission: "NONE",
      status: "IN_TRAINING",
      packageId: pkgComputer.id,
      instructorId: instComp2.id,
      requiredHours: 40.0,
      completedHours: 24.0,
      customTuitionFee: 6000.0,
      balance: 2000.0,
      certificateStatus: "UNCOLLECTED",
      nextOfKinName: "James Mwangi",
      nextOfKinPhone: "+254 711 345 678",
      nextOfKinRelation: "Parent",
      referralSource: "Google",
      notes: "Currently on Module 7 (MS Publisher). Completed MS Office fundamentals.",
    },
  });

  const student8 = await db.student.create({
    data: {
      firstName: "Hassan",
      lastName: "Ali",
      admissionNumber: "KNA-2026-008",
      email: "hassan.ali@gmail.com",
      phone: "+254 708 555 777",
      dateOfBirth: "1998-12-01",
      idNumber: "36471829",
      branch: "Tabby House, Thika",
      licenseCategory: "Artificial Intelligence",
      transmission: "NONE",
      status: "GRADUATED",
      packageId: pkgAI.id,
      instructorId: instAi1.id,
      requiredHours: 20.0,
      completedHours: 20.0,
      customTuitionFee: 10000.0,
      balance: 0.0,
      certificateStatus: "COLLECTED",
      certificateNumber: "KENA-CERT-AIM-2026-008",
      certificateIssueDate: pastDate(7),
      certificateRemarks: "Certificate collected in person by student at front desk with ID copy.",
      nextOfKinName: "Fatima Ali",
      nextOfKinPhone: "+254 723 445 566",
      nextOfKinRelation: "Spouse",
      referralSource: "Facebook",
      notes: "Mastered all 9 AI topics. Produced full multimedia AI marketing campaign portfolio.",
    },
  });

  const student9 = await db.student.create({
    data: {
      firstName: "Joy",
      lastName: "Chebet",
      admissionNumber: "KNA-2026-009",
      email: "joy.chebet@outlook.com",
      phone: "+254 709 888 222",
      dateOfBirth: "2001-07-22",
      idNumber: "39281744",
      branch: "Tabby House, Thika",
      licenseCategory: "Artificial Intelligence",
      transmission: "NONE",
      status: "IN_TRAINING",
      packageId: pkgAI.id,
      instructorId: instAi2.id,
      requiredHours: 20.0,
      completedHours: 10.0,
      customTuitionFee: 10000.0,
      balance: 3500.0,
      certificateStatus: "UNCOLLECTED",
      nextOfKinName: "Kipchumba Chebet",
      nextOfKinPhone: "+254 715 667 788",
      nextOfKinRelation: "Sibling",
      referralSource: "Tiktok",
      notes: "Enrolled in AI Masterclass. Currently on Module 5 (Prompt Engineering).",
    },
  });

  console.log("🎯 Adding official NTSA driving competencies...");
  const ntsaSkillsAlice = [
    { skillName: "Model Town Board (MTB) & Road Signs", status: "MASTERED" },
    { skillName: "Cockpit Drill & 5-Point Safety Checks", status: "MASTERED" },
    { skillName: "Vehicle Mechanics & Engine Fluids Check", status: "MASTERED" },
    { skillName: "Clutch Biting Point & Smooth Moving Off", status: "MASTERED" },
    { skillName: "Hill Start (Mlima) & Handbrake Balance", status: "MASTERED" },
    { skillName: "Steering Technique & Three-Point Turn", status: "MASTERED" },
    { skillName: "90-Degree Reverse Bay Parking", status: "MASTERED" },
    { skillName: "Parallel Parking (Kando ya Barabara)", status: "MASTERED" },
    { skillName: "Roundabouts & Kenyan Junction Priority", status: "MASTERED" },
    { skillName: "Highway Roadcraft (Thika Superhighway)", status: "PROFICIENT" },
    { skillName: "Hazard Perception & Emergency Braking", status: "MASTERED" },
    { skillName: "Night & Adverse Weather Roadcraft", status: "PROFICIENT" },
  ];

  for (const s of ntsaSkillsAlice) {
    await db.studentSkill.create({
      data: { studentId: student1.id, ...s },
    });
  }

  const ntsaSkillsBrian = [
    { skillName: "Model Town Board (MTB) & Road Signs", status: "MASTERED" },
    { skillName: "Cockpit Drill & 5-Point Safety Checks", status: "MASTERED" },
    { skillName: "90-Degree Reverse Bay Parking", status: "IN_PROGRESS" },
    { skillName: "Roundabouts & Kenyan Junction Priority", status: "IN_PROGRESS" },
    { skillName: "Parallel Parking (Kando ya Barabara)", status: "NOT_STARTED" },
    { skillName: "Highway Roadcraft (Thika Superhighway)", status: "NOT_STARTED" },
  ];

  for (const s of ntsaSkillsBrian) {
    await db.studentSkill.create({
      data: { studentId: student2.id, ...s },
    });
  }

  console.log("📅 Scheduling lessons...");
  const today = new Date();
  const setHour = (d, h, m = 0) => {
    const copy = new Date(d);
    copy.setHours(h, m, 0, 0);
    return copy;
  };

  await db.lesson.create({
    data: {
      studentId: student1.id,
      instructorId: inst1.id,
      vehicleId: v1.id,
      lessonType: "MOCK_TEST",
      startTime: setHour(today, 9, 0),
      endTime: setHour(today, 10, 30),
      durationHours: 1.5,
      status: "COMPLETED",
      pickupLocation: "Tabby House, Thika Campus",
      instructorFeedback: "Scored 98% on Model Town Board and completed parallel parking in one attempt.",
      rating: 5,
      skillsCovered: "NTSA Practical Driving Test Simulation",
    },
  });

  await db.lesson.create({
    data: {
      studentId: student2.id,
      instructorId: inst2.id,
      vehicleId: v2.id,
      lessonType: "PRACTICAL_DRIVING",
      startTime: setHour(today, 11, 0),
      endTime: setHour(today, 12, 30),
      durationHours: 1.5,
      status: "SCHEDULED",
      pickupLocation: "Ananas Mall, Makongeni",
      skillsCovered: "Roundabouts, Garissa Road Junction",
    },
  });

  await db.lesson.create({
    data: {
      studentId: student3.id,
      instructorId: inst1.id,
      vehicleId: v1.id,
      lessonType: "PRACTICAL_DRIVING",
      startTime: setHour(today, 14, 0),
      endTime: setHour(today, 15, 30),
      durationHours: 1.5,
      status: "SCHEDULED",
      pickupLocation: "Tabby House, Thika Campus",
      skillsCovered: "Clutch Biting Point, Hill Starts",
    },
  });

  console.log("💳 Creating M-Pesa payments (KSh)...");
  await db.payment.create({
    data: {
      studentId: student1.id,
      amount: 8000.0,
      paymentMethod: "MOBILE_MONEY",
      transactionRef: "QJH89201LK",
      status: "COMPLETED",
      notes: "M-Pesa Paybill Deposit - Account 38291044",
      createdAt: pastDate(25),
    },
  });

  await db.payment.create({
    data: {
      studentId: student1.id,
      amount: 6500.0,
      paymentMethod: "MOBILE_MONEY",
      transactionRef: "SHK11209WA",
      status: "COMPLETED",
      notes: "M-Pesa Final Clearance for NTSA test",
      createdAt: pastDate(5),
    },
  });

  await db.payment.create({
    data: {
      studentId: student2.id,
      amount: 11000.0,
      paymentMethod: "MOBILE_MONEY",
      transactionRef: "RKL449182B",
      status: "COMPLETED",
      notes: "M-Pesa Deposit (Balance KSh 4,500 remaining)",
      createdAt: pastDate(14),
    },
  });

  await db.payment.create({
    data: {
      studentId: student3.id,
      amount: 7500.0,
      paymentMethod: "MOBILE_MONEY",
      transactionRef: "TMW99201PK",
      status: "COMPLETED",
      notes: "M-Pesa 1st Installment",
      createdAt: pastDate(3),
    },
  });

  console.log("📝 Registering NTSA driving tests...");
  const examDate1 = new Date();
  examDate1.setDate(examDate1.getDate() + 3);

  await db.exam.create({
    data: {
      studentId: student1.id,
      examType: "PRACTICAL",
      scheduledDate: examDate1,
      testCenter: "NTSA Thika Test Center (Section 9)",
      examinerName: "Inspector Patrick Mwangi",
      result: "PENDING",
      notes: "Dual-control car reserved: Toyota Yaris (KDA 102B). PDL verified.",
    },
  });

  await db.exam.create({
    data: {
      studentId: student5.id,
      examType: "PRACTICAL",
      scheduledDate: pastDate(10),
      testCenter: "NTSA Thika Test Center (Section 9)",
      examinerName: "Inspector Grace Mutiso",
      score: 96,
      result: "PASSED",
      notes: "Passed road test. Smart Driving License issued via eCitizen TIMS.",
    },
  });

  console.log("📚 Creating course content materials (PDFs & Videos)...");
  await db.courseContent.createMany({
    data: [
      {
        title: "NTSA Official Model Town Board (MTB) & Road Signs Manual",
        category: "DRIVING",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/ntsa-mtb-guide.pdf",
        description: "Comprehensive breakdown of the Kenyan Model Town Board layout, lane discipline, roundabouts, and parking rules.",
        fileSize: "4.8 MB",
      },
      {
        title: "Kenya Highway Code & Roundabout Right of Way Masterclass",
        category: "DRIVING",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-roundabouts",
        description: "In-depth video session analyzing major Thika and Nairobi junctions, yielding rules, and lane markings.",
        fileSize: "24 mins",
      },
      {
        title: "Clutch Control, Moving Off & Hill Starts in Thika",
        category: "DRIVING",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-hillstart",
        description: "Practical tutorial on finding the biting point and smooth hill balance on Chania bridge slope.",
        fileSize: "18 mins",
      },
      {
        title: "Parallel Parking & 90-Degree Bay Parking Illustrated Guide",
        category: "DRIVING",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/parking-mastery.pdf",
        description: "Mirror reference markers and steering lock angles for flawless test parking.",
        fileSize: "2.1 MB",
      },
      // 10 Official Computer Packages Curriculum Topics (from syllabus sheet)
      {
        title: "Introduction to computers",
        category: "COMPUTER",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/comp-module-1-intro.pdf",
        description: "Foundational understanding of computers: definition, history, generations, classifications, and role in modern society and business.",
        fileSize: "4.5 MB",
      },
      {
        title: "Computer systems & Hardware",
        category: "COMPUTER",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-hardware",
        description: "Comprehensive breakdown of physical components: Motherboard, CPU, RAM, ROM, storage drives, peripheral devices, and port interfaces.",
        fileSize: "30 mins",
      },
      {
        title: "MS Windows",
        category: "COMPUTER",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-windows",
        description: "Mastering the Microsoft Windows operating system: File Explorer, directory hierarchy, Control Panel, Task Manager, and personalization.",
        fileSize: "28 mins",
      },
      {
        title: "MS Word",
        category: "COMPUTER",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/comp-module-4-word.pdf",
        description: "Professional document creation: formatting, styles, tables, headers/footers, table of contents, and automated Mail Merge for mass letters.",
        fileSize: "8.2 MB",
      },
      {
        title: "MS Excel",
        category: "COMPUTER",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-excel-mastery",
        description: "Data analysis and financial modeling: formulas (SUM, IF, VLOOKUP/XLOOKUP), conditional formatting, charts, Pivot Tables, and payroll sheets.",
        fileSize: "45 mins",
      },
      {
        title: "MS Access",
        category: "COMPUTER",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/comp-module-6-access.pdf",
        description: "Relational database design: Tables, Primary/Foreign keys, Relationships (1-to-Many), Query design, User Data Forms, and Printable Reports.",
        fileSize: "6.9 MB",
      },
      {
        title: "MS Publisher",
        category: "COMPUTER",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/comp-module-7-publisher.pdf",
        description: "Graphic desktop publishing: flyers, tri-fold brochures, business cards, certificates, banners, newsletters, and print layout calibration.",
        fileSize: "5.4 MB",
      },
      {
        title: "MS PowerPoint",
        category: "COMPUTER",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-powerpoint",
        description: "Creating high-impact visual presentations: Slide Master, transitions, animations, embedded video/audio, and executive pitch deck delivery.",
        fileSize: "25 mins",
      },
      {
        title: "Email & Internet",
        category: "COMPUTER",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-internet-email",
        description: "Navigating the web, email etiquette, attachments, cloud storage (Google Drive/OneDrive), cyber hygiene, phishing prevention, and eCitizen navigation.",
        fileSize: "32 mins",
      },
      {
        title: "Computer maintenance",
        category: "COMPUTER",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/comp-module-10-maintenance.pdf",
        description: "Hardware care, operating system optimization, disk cleanup, software installation/removal, malware scanning, data backups, and troubleshooting common faults.",
        fileSize: "7.1 MB",
      },
      // 9 Official AI Curriculum Topics (from syllabus sheet)
      {
        title: "Introduction to AI & its basic",
        category: "AI",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/ai-module-1-basics.pdf",
        description: "Foundational breakdown of Artificial Intelligence, Machine Learning, Deep Learning, and how Generative AI models function.",
        fileSize: "5.2 MB",
      },
      {
        title: "AI models ;Chatgpt, Gemini Etc.",
        category: "AI",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-ai-models",
        description: "Comparative study and hands-on usage of ChatGPT (GPT-4o, o1), Google Gemini (1.5 Pro/Flash), and Anthropic Claude 3.5 Sonnet.",
        fileSize: "32 mins",
      },
      {
        title: "Research and writing assistants",
        category: "AI",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/ai-module-3-research.pdf",
        description: "Conducting real-time citation research with Perplexity AI, academic literature review with Consensus, and executive business writing.",
        fileSize: "4.1 MB",
      },
      {
        title: "Notebook LM",
        category: "AI",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-notebooklm",
        description: "Google NotebookLM zero-hallucination source-grounded research, document synthesis, and generating viral dual-host Audio Overview podcasts.",
        fileSize: "28 mins",
      },
      {
        title: "Prompt engineering",
        category: "AI",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/ai-module-5-prompts.pdf",
        description: "Mastering the 5-Part Master Prompt Formula, Few-Shot examples, Chain-of-Thought reasoning, and system instructions for flawless outputs.",
        fileSize: "6.8 MB",
      },
      {
        title: "Image generation",
        category: "AI",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-ai-images",
        description: "Commercial photorealistic graphic design, Midjourney v6 parameters, DALL-E 3 typography, and brand asset generation.",
        fileSize: "42 mins",
      },
      {
        title: "Audio generation",
        category: "AI",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-ai-audio",
        description: "Voice cloning, hyper-realistic voiceovers with ElevenLabs, and AI music composition in Afrobeat & Pop with Suno AI and Udio.",
        fileSize: "35 mins",
      },
      {
        title: "Video generation",
        category: "AI",
        contentType: "PDF",
        url: "https://www.kenadrivingschool.com/materials/ai-module-8-video.pdf",
        description: "Cinematic video generation, image-to-video motion, Runway Gen-3 Alpha, Luma Dream Machine, and AI talking avatars with HeyGen.",
        fileSize: "7.4 MB",
      },
      {
        title: "Job creation &marketing",
        category: "AI",
        contentType: "VIDEO",
        url: "https://www.youtube.com/watch?v=example-ai-jobs",
        description: "Monetizing AI skills: remote freelancing on Upwork and Fiverr ($25-$80/hr), local Kenyan SME marketing agencies, and WhatsApp AI bot automation.",
        fileSize: "50 mins",
      },
    ],
  });

  console.log("📊 Creating instructor gradebook evaluations...");
  await db.gradebookEntry.createMany({
    data: [
      {
        studentId: student1.id,
        instructorId: inst1.id,
        topic: "Model Town Board Navigation",
        score: 98,
        status: "EXCELLENT",
        remarks: "Flawless knowledge of roundabout rules and lane changes.",
      },
      {
        studentId: student1.id,
        instructorId: inst1.id,
        topic: "Hill Start & Clutch Balancing",
        score: 95,
        status: "EXCELLENT",
        remarks: "Smooth moving off with zero rollback.",
      },
      {
        studentId: student1.id,
        instructorId: inst1.id,
        topic: "Parallel Parking & Bay Reversing",
        score: 92,
        status: "PASS",
        remarks: "Accurate mirror checks and 45-degree angle entry.",
      },
      {
        studentId: student2.id,
        instructorId: inst2.id,
        topic: "Cockpit Drill & 5-Point Safety",
        score: 90,
        status: "PASS",
        remarks: "Thorough pre-drive inspection and mirror adjustment.",
      },
      {
        studentId: student2.id,
        instructorId: inst2.id,
        topic: "90-Degree Reverse Bay Parking",
        score: 74,
        status: "NEEDS_WORK",
        remarks: "Requires more practice keeping within the yellow boundary lines.",
      },
      {
        studentId: student3.id,
        instructorId: inst1.id,
        topic: "Clutch Biting Point & Smooth Moving Off",
        score: 68,
        status: "NEEDS_WORK",
        remarks: "Engine stalled twice during quick stops; working on pedal coordination.",
      },
    ],
  });

  console.log("📑 Creating receipt change requests for admin approval...");
  const samplePayment = await db.payment.findFirst();
  if (samplePayment) {
    await db.receiptChangeRequest.create({
      data: {
        paymentId: samplePayment.id,
        requestedBy: "Sarah Wambui (Desk Clerk)",
        oldAmount: 8000.0,
        newAmount: 8500.0,
        reason: "Customer paid KSh 500 extra cash fee for PDL application document processing.",
        status: "PENDING",
      },
    });
  }

  console.log("📋 Populating official 25-lesson practical sheets for driving students...");
  const OFFICIAL_25_LESSONS = [
    "INTRODUCTION",
    "USE OF BREAK,CLUTCH& HANDBRAKE",
    "CHANGING GEARS",
    "STEERING CONTROL",
    "ROAD POSITIONING",
    "TURNING RIGHT &LEFT",
    "USE OF MIRRORS &HAND SIGNAL",
    "REVERSING PT1",
    "PARKING PT1(ANGLE & FLASH)",
    "DRIVING ASSESMENT 1",
    "CHANGING LANES",
    "ACCELERATION &OVERTAKING",
    "ROUNDABOUTS",
    "U TURN",
    "REVERSING PT 2",
    "PARKING PT 2(ANGLE & FLASH)",
    "THEORY BOARD ASSESEMENT",
    "DRIVING ASSSESEMENT 2",
    "BASIC MECHANICAL",
    "JUNCTION DRILL",
    "THREE POINT TURN",
    "EXAMINATION EVALUATION TEST",
    "HILL START",
    "PARKING PT 3(ANGLE & FLASH)",
    "REVERSING PT 3",
  ];

  // Helper to seed 25 practical rows per student
  async function seedStudentPracticalSheet(student, completedCount, instructor, vehiclePlate) {
    for (let i = 0; i < OFFICIAL_25_LESSONS.length; i++) {
      const praNo = i + 1;
      const lessonTitle = OFFICIAL_25_LESSONS[i];
      const isCompleted = praNo <= completedCount;
      const isInProgress = praNo === completedCount + 1 && completedCount < 25;
      const lessonDate = isCompleted ? pastDate(Math.max(1, 30 - praNo)) : null;

      await db.practicalSheetEntry.create({
        data: {
          studentId: student.id,
          praNo,
          lessonTitle,
          status: isCompleted ? "COMPLETED" : isInProgress ? "IN_PROGRESS" : "PENDING",
          studentSign: isCompleted,
          studentSignDate: lessonDate,
          instructorSign: isCompleted,
          instructorId: isCompleted ? instructor.id : null,
          instructorSignDate: lessonDate,
          date: lessonDate,
          tov: isCompleted ? `${vehiclePlate} (${student.transmission}) - ${String(8 + (praNo % 6)).padStart(2, "0")}:00` : null,
          officialSign: isCompleted && praNo <= completedCount - 2, // Official signs off batches
          officialSignDate: isCompleted && praNo <= completedCount - 2 ? lessonDate : null,
          officialName: isCompleted && praNo <= completedCount - 2 ? "Chief Inspector / Tabby House Desk" : null,
          remarks: isCompleted
            ? `Successfully demonstrated ${lessonTitle} standards.`
            : isInProgress
            ? "Scheduled for today's in-vehicle practical slot."
            : null,
        },
      });
    }
  }

  // Seed for Alice (student1 - Test Ready, 23/25 completed)
  await seedStudentPracticalSheet(student1, 23, inst1, "Toyota Belta KDA 123X");
  // Seed for Brian (student2 - In Training, 14/25 completed)
  await seedStudentPracticalSheet(student2, 14, inst2, "Nissan Tiida KDA 890Y");
  // Seed for Catherine (student3 - In Training, 6/25 completed)
  await seedStudentPracticalSheet(student3, 6, inst1, "Toyota Belta KDA 123X");

  console.log("💻 Seeding student module progress for Computer & AI students...");
  const computerModulesList = [
    { moduleNumber: 1, title: "Introduction to computers", classwork: "Typing speed test (45 WPM) & OS navigation" },
    { moduleNumber: 2, title: "Computer systems & Hardware", classwork: "PC hardware component identification and port cabling" },
    { moduleNumber: 3, title: "MS Windows", classwork: "Windows file structure management and control panel setup" },
    { moduleNumber: 4, title: "MS Word", classwork: "Official business letter formatting, tables & mail merge" },
    { moduleNumber: 5, title: "MS Excel", classwork: "Monthly financial budget with SUM, VLOOKUP & pivot tables" },
    { moduleNumber: 6, title: "MS Access", classwork: "Student relational database design and SQL queries" },
    { moduleNumber: 7, title: "MS Publisher", classwork: "Corporate newsletter and certificate of completion design" },
    { moduleNumber: 8, title: "MS PowerPoint", classwork: "10-slide business pitch deck with animations & transitions" },
    { moduleNumber: 9, title: "Email & Internet", classwork: "Professional Outlook email setup & Google Drive cloud backup" },
    { moduleNumber: 10, title: "Computer maintenance", classwork: "Hardware cleaning, antivirus scan & system disk optimization" },
  ];

  const aiModulesList = [
    { moduleNumber: 1, title: "Introduction to AI & its basic", classwork: "AI history, terminology & setting up generative workspace" },
    { moduleNumber: 2, title: "AI models ;Chatgpt, Gemini Etc.", classwork: "Model benchmarking between GPT-4o, Claude 3.5 & Gemini 1.5" },
    { moduleNumber: 3, title: "Research and writing assistants", classwork: "Synthesizing research paper using Perplexity and Scite" },
    { moduleNumber: 4, title: "Notebook LM", classwork: "PDF document ingestion, audio overview generation & source queries" },
    { moduleNumber: 5, title: "Prompt engineering", classwork: "Zero-shot, few-shot, and chain-of-thought system prompts" },
    { moduleNumber: 6, title: "Image generation", classwork: "Midjourney prompt craft, stylize parameters & banner rendering" },
    { moduleNumber: 7, title: "Audio generation", classwork: "Voice cloning with ElevenLabs & commercial podcast intro" },
    { moduleNumber: 8, title: "Video generation", classwork: "Text-to-video scene generation with Runway Gen-3 Alpha" },
    { moduleNumber: 9, title: "Job creation &marketing", classwork: "Setting up AI copywriting gig on Upwork and social agency portfolio" },
  ];

  // Seed for Faith (student6 - Completed all 10 modules)
  for (const m of computerModulesList) {
    await db.studentModuleProgress.create({
      data: {
        studentId: student6.id,
        courseType: "COMPUTER",
        moduleNumber: m.moduleNumber,
        moduleTitle: m.title,
        classwork: m.classwork,
        status: "COMPLETED",
        score: 88 + (m.moduleNumber % 10),
        remarks: `Excellence demonstrated in ${m.title} practical lab exercises.`,
        tutorId: instComp1.id,
        completedAt: pastDate(15 - m.moduleNumber),
      },
    });
  }

  // Seed for Geoffrey (student7 - In Training, 6 of 10 completed)
  for (const m of computerModulesList) {
    const isComp = m.moduleNumber <= 6;
    const isProg = m.moduleNumber === 7;
    await db.studentModuleProgress.create({
      data: {
        studentId: student7.id,
        courseType: "COMPUTER",
        moduleNumber: m.moduleNumber,
        moduleTitle: m.title,
        classwork: m.classwork,
        status: isComp ? "COMPLETED" : isProg ? "IN_PROGRESS" : "NOT_STARTED",
        score: isComp ? 80 + (m.moduleNumber * 2) : null,
        remarks: isComp ? `Candidate passed ${m.title} assessment.` : isProg ? "Practical project underway in lab." : null,
        tutorId: isComp || isProg ? instComp2.id : null,
        completedAt: isComp ? pastDate(10 - m.moduleNumber) : null,
      },
    });
  }

  // Seed for Hassan (student8 - Completed all 9 AI topics)
  for (const m of aiModulesList) {
    await db.studentModuleProgress.create({
      data: {
        studentId: student8.id,
        courseType: "AI",
        moduleNumber: m.moduleNumber,
        moduleTitle: m.title,
        classwork: m.classwork,
        status: "COMPLETED",
        score: 90 + (m.moduleNumber % 9),
        remarks: `Outstanding generative AI performance in ${m.title}.`,
        tutorId: instAi1.id,
        completedAt: pastDate(12 - m.moduleNumber),
      },
    });
  }

  // Seed for Joy (student9 - In Training, 4 of 9 completed)
  for (const m of aiModulesList) {
    const isComp = m.moduleNumber <= 4;
    const isProg = m.moduleNumber === 5;
    await db.studentModuleProgress.create({
      data: {
        studentId: student9.id,
        courseType: "AI",
        moduleNumber: m.moduleNumber,
        moduleTitle: m.title,
        classwork: m.classwork,
        status: isComp ? "COMPLETED" : isProg ? "IN_PROGRESS" : "NOT_STARTED",
        score: isComp ? 84 + (m.moduleNumber * 2) : null,
        remarks: isComp ? `Successfully mastered ${m.title}.` : isProg ? "Drafting prompt evaluation matrix." : null,
        tutorId: isComp || isProg ? instAi2.id : null,
        completedAt: isComp ? pastDate(8 - m.moduleNumber) : null,
      },
    });
  }

  console.log("✅ KENA Driving School seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
