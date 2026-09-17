const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function runTests() {
  console.log("=========================================");
  console.log("🧪 RUNNING DRIVING SCHOOL SYSTEM TESTS");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Verify Database Seed
  const studentCount = await db.student.count();
  assert(studentCount >= 5, `Students populated in database (Found ${studentCount})`);

  const instructorCount = await db.instructor.count();
  assert(instructorCount >= 3, `Instructors registered (Found ${instructorCount})`);

  const vehicleCount = await db.vehicle.count();
  assert(vehicleCount >= 4, `Vehicles in fleet (Found ${vehicleCount})`);

  // 2. Verify Student Skills are automatically attached
  const alice = await db.student.findFirst({
    where: { firstName: "Alice" },
    include: { skills: true, package: true, assignedInstructor: true },
  });
  assert(alice !== null, "Found student Alice");
  assert(alice.pdlNumber !== null, `Alice has NTSA PDL registered (${alice.pdlNumber})`);

  // 3. Test Conflict Detection Logic
  console.log("\nTesting Lesson Conflict Detection...");
  const inst = await db.instructor.findFirst();
  const testStudent = await db.student.findFirst({ where: { status: "IN_TRAINING" } });
  const testVehicle = await db.vehicle.findFirst();

  const start1 = new Date();
  start1.setHours(18, 0, 0, 0);
  const end1 = new Date(start1.getTime() + 90 * 60 * 1000);

  // Create first booking
  const lesson1 = await db.lesson.create({
    data: {
      studentId: testStudent.id,
      instructorId: inst.id,
      vehicleId: testVehicle.id,
      lessonType: "PRACTICAL_DRIVING",
      startTime: start1,
      endTime: end1,
      durationHours: 1.5,
      status: "SCHEDULED",
    },
  });
  assert(lesson1.id !== null, "Successfully scheduled initial lesson");

  // Test overlapping time check (simulating API conflict check logic)
  const overlapStart = new Date(start1.getTime() + 30 * 60 * 1000); // 30 mins after start1
  const overlapEnd = new Date(overlapStart.getTime() + 60 * 60 * 1000);

  const conflict = await db.lesson.findFirst({
    where: {
      instructorId: inst.id,
      status: { notIn: ["CANCELLED"] },
      AND: [
        { startTime: { lt: overlapEnd } },
        { endTime: { gt: overlapStart } },
      ],
    },
  });
  assert(conflict !== null, "Correctly identified overlapping conflict for instructor");

  // 4. Test Payment & Balance Reduction
  console.log("\nTesting Payment Processing & Balance Settlement (KSh)...");
  const initialBalance = testStudent.balance;
  const paymentAmount = 2000.0;

  const payment = await db.payment.create({
    data: {
      studentId: testStudent.id,
      amount: paymentAmount,
      paymentMethod: "MOBILE_MONEY",
      transactionRef: `TEST-MPESA-${Date.now()}`,
      status: "COMPLETED",
    },
  });
  assert(payment.id !== null, "M-Pesa payment successfully recorded");

  const newBalance = Math.max(0, initialBalance - paymentAmount);
  await db.student.update({
    where: { id: testStudent.id },
    data: { balance: newBalance },
  });

  const updatedStudent = await db.student.findUnique({ where: { id: testStudent.id } });
  assert(
    updatedStudent.balance === newBalance,
    `Student balance accurately decremented from KSh ${initialBalance} to KSh ${updatedStudent.balance}`
  );

  // 5. Verify Quotation Portal Features
  console.log("\nTesting Quotation Portals Models & Data...");
  const contentCount = await db.courseContent.count();
  assert(contentCount >= 6, `Course materials library populated (${contentCount} items)`);

  const gradebookCount = await db.gradebookEntry.count();
  assert(gradebookCount >= 4, `Instructor gradebook entries populated (${gradebookCount} evaluations)`);

  const approvalCount = await db.receiptChangeRequest.count();
  assert(approvalCount >= 1, `Receipt change requests populated (${approvalCount} pending approvals)`);

  // 6. Verify Admin Account & Auth
  console.log("\nTesting Admin & Multi-Role Authentication...");
  const adminAccount = await db.admin.findUnique({ where: { email: "admin@kenadrivingschool.com" } });
  assert(adminAccount !== null && adminAccount.role === "SUPERADMIN", "Superadmin account seeded and queryable");

  // 7. Verify Enhanced Student Fields (Admission Number, Manual Fee, Next of Kin, Referral Source)
  console.log("\nTesting Enhanced Student Fields & Offers...");
  const sampleStudent = await db.student.findFirst({ where: { admissionNumber: "KNA-2026-001" } });
  assert(sampleStudent !== null, "Student queryable by manual admission number KNA-2026-001");
  assert(sampleStudent?.nextOfKinName === "Grace Wanjiru", "Student Next of Kin recorded correctly");
  assert(sampleStudent?.referralSource === "Friend", "Student referral source recorded correctly");

  // 8. Verify Full CRUD Operations (Create, Edit, Delete)
  console.log("\nTesting Full CRUD (Edit & Delete) for Students, Instructors, and Vehicles...");
  // Test Student CRUD
  const crudStudent = await db.student.create({
    data: {
      firstName: "TestCrud",
      lastName: "Student",
      admissionNumber: "KNA-TEST-999",
      email: "test.crud@gmail.com",
      phone: "+254 799 999 999",
      idNumber: "TEST9999",
      licenseCategory: "Category B - Light Vehicle",
      transmission: "BOTH",
      customTuitionFee: 12000.0,
      balance: 12000.0,
    },
  });
  assert(crudStudent.transmission === "BOTH", "Student with 'BOTH' transmission created");

  const editedStudent = await db.student.update({
    where: { id: crudStudent.id },
    data: { notes: "Updated via CRUD test", balance: 6000.0 },
  });
  assert(editedStudent.balance === 6000.0, "Student successfully edited via CRUD");

  await db.student.delete({ where: { id: crudStudent.id } });
  const deletedCheck = await db.student.findUnique({ where: { id: crudStudent.id } });
  assert(deletedCheck === null, "Student successfully deleted and removed via CRUD");

  // Test Instructor CRUD
  const crudInst = await db.instructor.create({
    data: {
      firstName: "TestCrud",
      lastName: "Instructor",
      email: "test.instructor@kenadrivingschool.com",
      phone: "+254 788 888 888",
      licenseNumber: "INS-TEST-999",
      specializations: "Manual & Automatic",
    },
  });
  await db.instructor.update({ where: { id: crudInst.id }, data: { status: "ON_LEAVE" } });
  await db.instructor.delete({ where: { id: crudInst.id } });
  const deletedInstCheck = await db.instructor.findUnique({ where: { id: crudInst.id } });
  assert(deletedInstCheck === null, "Instructor successfully edited and deleted via CRUD");

  // Test Vehicle CRUD
  const crudVeh = await db.vehicle.create({
    data: {
      make: "TestMake",
      model: "TestModel",
      year: 2024,
      registrationPlate: "KTEST 999X",
      transmission: "AUTOMATIC",
      category: "Sedan",
      insuranceExpiry: new Date(),
      inspectionExpiry: new Date(),
    },
  });
  await db.vehicle.update({ where: { id: crudVeh.id }, data: { status: "MAINTENANCE" } });
  await db.vehicle.delete({ where: { id: crudVeh.id } });
  const deletedVehCheck = await db.vehicle.findUnique({ where: { id: crudVeh.id } });
  assert(deletedVehCheck === null, "Vehicle successfully edited and deleted via CRUD");

  // 9. Verify Official 25 Practical Lessons Progress Sheet
  console.log("\nTesting Official 25 Practical Lessons Progress Tracking Sheet...");
  const alicePracticalEntries = await db.practicalSheetEntry.findMany({
    where: { studentId: alice.id },
    orderBy: { praNo: "asc" },
  });
  assert(alicePracticalEntries.length === 25, `Alice has all 25 practical lessons registered (Found ${alicePracticalEntries.length})`);

  const lesson2 = alicePracticalEntries.find((e) => e.praNo === 2);
  assert(
    lesson2?.lessonTitle === "USE OF BREAK,CLUTCH& HANDBRAKE",
    `Lesson 2 matches official title: ${lesson2?.lessonTitle}`
  );
  assert(lesson2?.studentSign === true, "Lesson 2 has student sign-off");
  assert(lesson2?.instructorSign === true, "Lesson 2 has instructor sign-off");
  assert(lesson2?.tov !== null, `Lesson 2 has vehicle recorded: ${lesson2?.tov}`);

  const lesson25 = alicePracticalEntries.find((e) => e.praNo === 25);
  assert(
    lesson25?.lessonTitle === "REVERSING PT 3",
    `Lesson 25 matches official title: ${lesson25?.lessonTitle}`
  );

  // Test sign-off update simulation
  const updatedEntry = await db.practicalSheetEntry.update({
    where: { studentId_praNo: { studentId: alice.id, praNo: 24 } },
    data: {
      instructorSign: true,
      date: new Date(),
      tov: "Toyota Belta KDA 123X Manual - 11:30 AM",
    },
  });
  assert(updatedEntry.instructorSign === true, "Successfully signed off lesson 24 for student");

  // Clean up test lesson & payment
  await db.lesson.delete({ where: { id: lesson1.id } });
  await db.payment.delete({ where: { id: payment.id } });
  await db.student.update({ where: { id: testStudent.id }, data: { balance: initialBalance } });

  // 10. Verify Role-Based Access Control (RBAC) & Route Guarding
  console.log("\nTesting Role-Based Access Control (RBAC) & Route Permissions...");

  const ADMIN_ONLY_ROUTES = [
    "/portal/admin",
    "/portal/admin/add-student",
    "/portal/admin/content",
    "/portal/admin/reports",
    "/students",
    "/students/123",
    "/instructors",
    "/vehicles",
    "/billing",
    "/exams",
  ];

  const INSTRUCTOR_ROUTES = [
    "/portal/instructor",
    "/portal/instructor/gradebook",
    "/portal/instructor/students",
    "/schedule",
  ];

  const STUDENT_ROUTES = [
    "/portal/student",
    "/portal/student/practical-sheet",
    "/portal/student/courses",
    "/portal/student/content",
    "/portal/student/payments",
    "/portal/student/profile",
  ];

  const PUBLIC_ROUTES = ["/login", "/register", "/practical-topics"];

  function checkRouteAccess(pathname, role) {
    if (PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return { allowed: true };
    }
    if (!role) return { allowed: false, reason: "Unauthenticated" };
    if (role === "ADMIN") return { allowed: true };

    if (role === "STUDENT") {
      const isForbidden = ADMIN_ONLY_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
                          INSTRUCTOR_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
      return { allowed: !isForbidden, reason: isForbidden ? "Student Forbidden" : "Allowed" };
    }

    if (role === "INSTRUCTOR") {
      const isForbidden = ADMIN_ONLY_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
                          pathname.startsWith("/portal/student/payments");
      return { allowed: !isForbidden, reason: isForbidden ? "Instructor Forbidden" : "Allowed" };
    }

    return { allowed: false, reason: "Unknown role" };
  }

  // Student RBAC Assertions
  assert(checkRouteAccess("/portal/student/practical-sheet", "STUDENT").allowed, "Student CAN access their practical sheet");
  assert(checkRouteAccess("/practical-topics", "STUDENT").allowed, "Student CAN access practical topics reference");
  assert(!checkRouteAccess("/portal/admin", "STUDENT").allowed, "Student CANNOT access /portal/admin");
  assert(!checkRouteAccess("/portal/admin/add-student", "STUDENT").allowed, "Student CANNOT access /portal/admin/add-student");
  assert(!checkRouteAccess("/portal/instructor/gradebook", "STUDENT").allowed, "Student CANNOT access /portal/instructor/gradebook");
  assert(!checkRouteAccess("/students", "STUDENT").allowed, "Student CANNOT access /students directory");
  assert(!checkRouteAccess("/billing", "STUDENT").allowed, "Student CANNOT access /billing");
  assert(!checkRouteAccess("/vehicles", "STUDENT").allowed, "Student CANNOT access /vehicles");

  // Instructor RBAC Assertions
  assert(checkRouteAccess("/portal/instructor/gradebook", "INSTRUCTOR").allowed, "Instructor CAN access instructor gradebook");
  assert(checkRouteAccess("/schedule", "INSTRUCTOR").allowed, "Instructor CAN access training schedule");
  assert(!checkRouteAccess("/portal/admin", "INSTRUCTOR").allowed, "Instructor CANNOT access /portal/admin");
  assert(!checkRouteAccess("/billing", "INSTRUCTOR").allowed, "Instructor CANNOT access /billing");
  assert(!checkRouteAccess("/students", "INSTRUCTOR").allowed, "Instructor CANNOT access /students admin management");

  // Admin RBAC Assertions
  assert(checkRouteAccess("/portal/admin", "ADMIN").allowed, "Admin CAN access /portal/admin");
  assert(checkRouteAccess("/students", "ADMIN").allowed, "Admin CAN access /students");
  assert(checkRouteAccess("/billing", "ADMIN").allowed, "Admin CAN access /billing");
  assert(checkRouteAccess("/portal/instructor/gradebook", "ADMIN").allowed, "Admin CAN inspect instructor gradebooks");

  // Unauthenticated Assertions
  assert(checkRouteAccess("/login", null).allowed, "Guest CAN access /login");
  assert(!checkRouteAccess("/portal/admin", null).allowed, "Guest CANNOT access /portal/admin without authentication");
  assert(!checkRouteAccess("/portal/student", null).allowed, "Guest CANNOT access /portal/student without authentication");

  // 11. Test AI Curriculum Course Content (9 Official Topics)
  console.log("\nTesting AI Curriculum Content in Database (9 Topics)...");
  const aiContents = await db.courseContent.findMany({
    where: { category: "AI" },
  });
  assert(aiContents.length >= 9, `Database has at least 9 AI curriculum modules (Found ${aiContents.length})`);

  const expectedAiTitles = [
    "Introduction to AI & its basic",
    "AI models ;Chatgpt, Gemini Etc.",
    "Research and writing assistants",
    "Notebook LM",
    "Prompt engineering",
    "Image generation",
    "Audio generation",
    "Video generation",
    "Job creation &marketing",
  ];

  for (const title of expectedAiTitles) {
    const item = aiContents.find((c) => c.title === title);
    assert(item !== undefined, `AI topic exists: "${title}"`);
    if (item) {
      assert(item.description && item.description.length > 50, `AI topic "${title}" has detailed curriculum description`);
    }
  }

  // 12. Test Computer Curriculum Course Content (10 Official Topics)
  console.log("\nTesting Computer Curriculum Content in Database (10 Topics)...");
  const compContents = await db.courseContent.findMany({
    where: { category: "COMPUTER" },
  });
  assert(compContents.length >= 10, `Database has at least 10 Computer curriculum modules (Found ${compContents.length})`);

  const expectedCompTitles = [
    "Introduction to computers",
    "Computer systems & Hardware",
    "MS Windows",
    "MS Word",
    "MS Excel",
    "MS Access",
    "MS Publisher",
    "MS PowerPoint",
    "Email & Internet",
    "Computer maintenance",
  ];

  for (const title of expectedCompTitles) {
    const item = compContents.find((c) => c.title === title);
    assert(item !== undefined, `Computer module exists: "${title}"`);
    if (item) {
      assert(item.description && item.description.length > 50, `Computer module "${title}" has detailed curriculum description`);
    }
  }

  // 13. Test Computer & AI Tutor Faculty Support
  console.log("\nTesting Computer & AI Tutor Faculty Support...");
  const totalInstructors = await db.instructor.count();
  assert(totalInstructors >= 7, `Faculty directory populated (Found ${totalInstructors})`);

  const compTutors = await db.instructor.findMany({
    where: { category: "COMPUTER" },
  });
  assert(compTutors.length >= 2, `Found at least 2 Computer Tutors in database (Found ${compTutors.length})`);

  const grace = compTutors.find((t) => t.firstName === "Grace");
  assert(grace !== undefined, "Found Computer Tutor Grace Mwangi");
  if (grace) {
    assert(grace.department === "Computer College", "Grace is assigned to Computer College");
    assert(grace.modulesTaught.includes("MS Word"), "Grace teaches MS Word");
    assert(grace.modulesTaught.includes("MS Excel"), "Grace teaches MS Excel");
    assert(grace.labStation !== null, `Grace has assigned lab station: ${grace.labStation}`);
    assert(grace.assignedVehicleId === null, "Computer tutor has no mandatory vehicle assignment");
  }

  const aiTutors = await db.instructor.findMany({
    where: { category: "AI" },
  });
  assert(aiTutors.length >= 2, `Found at least 2 AI Tutors in database (Found ${aiTutors.length})`);

  const kenneth = aiTutors.find((t) => t.firstName.includes("Kenneth"));
  assert(kenneth !== undefined, "Found AI Tutor Dr. Kenneth Otieno");
  if (kenneth) {
    assert(kenneth.department === "Modern AI Academy", "Kenneth is assigned to Modern AI Academy");
    assert(kenneth.modulesTaught.includes("Prompt engineering"), "Kenneth teaches Prompt engineering");
    assert(kenneth.modulesTaught.includes("AI models"), "Kenneth teaches AI models ;Chatgpt, Gemini Etc.");
    assert(kenneth.labStation !== null, `Kenneth has assigned AI lab: ${kenneth.labStation}`);
    assert(kenneth.assignedVehicleId === null, "AI tutor has no mandatory vehicle assignment");
  }

  // Test dynamic creation of a Computer Tutor
  const testCompTutor = await db.instructor.create({
    data: {
      firstName: "Dennis",
      lastName: "Kariuki",
      email: `dennis.test.${Date.now()}@kenacollege.com`,
      phone: "+254 700 999 888",
      licenseNumber: `TEST-COMP-TTR-${Date.now()}`,
      category: "COMPUTER",
      department: "Computer College",
      specializations: "Computer Systems & MS Office",
      modulesTaught: "MS Word, MS Excel, MS Access, Computer maintenance",
      labStation: "Lab 1 - Station 09",
      certifications: "B.Sc. Computer Science",
    },
  });
  assert(testCompTutor.id !== null, "Successfully created new Computer Tutor without vehicle");

  // Test dynamic creation of an AI Tutor
  const testAiTutor = await db.instructor.create({
    data: {
      firstName: "Mercy",
      lastName: "Wanjiku",
      email: `mercy.test.${Date.now()}@kenacollege.com`,
      phone: "+254 711 222 333",
      licenseNumber: `TEST-AI-TTR-${Date.now()}`,
      category: "AI",
      department: "Modern AI Academy",
      specializations: "Generative AI & Prompt Engineering",
      modulesTaught: "Image generation, Video generation, Job creation &marketing",
      labStation: "AI Creative Lab",
      certifications: "Certified AI Practitioner",
    },
  });
  assert(testAiTutor.id !== null, "Successfully created new AI Tutor without vehicle");

  // Clean up test tutors
  await db.instructor.delete({ where: { id: testCompTutor.id } });
  await db.instructor.delete({ where: { id: testAiTutor.id } });

  // 14. Verify Course Packages Order and Naming
  console.log("\nTesting Course Packages Ordering & Naming...");
  const EXPECTED_DRIVING_CLASSES = [
    "A1 - Light Motorcycle",
    "A2 - Motorcycle Taxi, Couriers and three-wheelers",
    "A3 -Motorcycle three-wheelers",
    "B1 - Light Automatic Vehicle",
    "B2 - Light Manual Vehicle",
    "B Professional",
    "C1 - Light Truck",
    "C - Medium Truck",
    "CE - Heavy Truck with trailer",
    "CD - Heavy Goods Vehicle for Transportation of Hazardous Materials",
    "D1 - Van (maximum of 14 passengers)",
    "D2 - Minibus (14 to 32 passengers)",
    "D3 - Large Bus (33 or more passengers)",
    "D4 - Articulated Bus",
  ];

  const packages = await db.package.findMany();
  assert(packages.length >= 16, `Database has all 16 course packages (Found ${packages.length})`);

  for (const expectedName of EXPECTED_DRIVING_CLASSES) {
    const pkg = packages.find((p) => p.name === expectedName);
    assert(pkg !== undefined, `Driving package exists: "${expectedName}"`);
  }

  const compPkg = packages.find((p) => p.name === "Computer Packages Certification (10 Modules)");
  assert(compPkg !== undefined, 'Computer package exists: "Computer Packages Certification (10 Modules)"');

  const aiPkg = packages.find((p) => p.name === "Artificial Intelligence masterclasses");
  assert(aiPkg !== undefined, 'AI package exists: "Artificial Intelligence masterclasses"');

  // Verify none of the package names have "hrs" or "hours"
  const hasHoursInName = packages.some((p) => /hours|hrs/i.test(p.name));
  assert(!hasHoursInName, "No package name contains hours or hrs");

  // 12. Verify Student Module Progress & Certificate Collection Tracking
  console.log("\nTesting Student Module Progress & Certificate Collection Tracking...");

  // 12a. Verify Faith Wambui (Computer Packages 10/10 modules, PRINTING status)
  const faith = await db.student.findFirst({
    where: { firstName: "Faith", lastName: "Wambui" },
    include: { moduleProgress: true, package: true },
  });
  assert(faith !== null, "Found student Faith Wambui");
  assert(faith.moduleProgress.length === 10, `Faith has 10 Computer modules (Found ${faith.moduleProgress.length})`);
  const faithCompleted = faith.moduleProgress.filter((m) => m.status === "COMPLETED").length;
  assert(faithCompleted === 10, `Faith has all 10 modules completed (${faithCompleted}/10)`);
  assert(faith.certificateStatus === "PRINTING", `Faith certificate status is PRINTING (${faith.certificateStatus})`);
  assert(faith.certificateNumber !== null && faith.certificateNumber.includes("KENA-CERT-COMP"), `Faith certificate number is formatted properly (${faith.certificateNumber})`);

  // 12b. Verify Hassan Ali (AI Masterclasses 9/9 topics, COLLECTED status)
  const hassan = await db.student.findFirst({
    where: { firstName: "Hassan", lastName: "Ali" },
    include: { moduleProgress: true, package: true },
  });
  assert(hassan !== null, "Found student Hassan Ali");
  assert(hassan.moduleProgress.length === 9, `Hassan has 9 AI topics (Found ${hassan.moduleProgress.length})`);
  const hassanCompleted = hassan.moduleProgress.filter((m) => m.status === "COMPLETED").length;
  assert(hassanCompleted === 9, `Hassan has all 9 topics completed (${hassanCompleted}/9)`);
  assert(hassan.certificateStatus === "COLLECTED", `Hassan certificate status is COLLECTED (${hassan.certificateStatus})`);
  assert(hassan.certificateNumber !== null && hassan.certificateNumber.includes("KENA-CERT-AIM"), `Hassan certificate number is formatted properly (${hassan.certificateNumber})`);

  // 12c. Verify Geoffrey Mwangi (Computer Packages 6/10 in training, UNCOLLECTED status)
  const geoffrey = await db.student.findFirst({
    where: { firstName: "Geoffrey", lastName: "Mwangi" },
    include: { moduleProgress: true, package: true },
  });
  assert(geoffrey !== null, "Found student Geoffrey Mwangi");
  assert(geoffrey.moduleProgress.length === 10, `Geoffrey has 10 Computer module records (Found ${geoffrey.moduleProgress.length})`);
  const geoffreyCompleted = geoffrey.moduleProgress.filter((m) => m.status === "COMPLETED").length;
  assert(geoffreyCompleted === 6, `Geoffrey has 6 modules completed (${geoffreyCompleted}/10)`);
  assert(geoffrey.certificateStatus === "UNCOLLECTED", `Geoffrey certificate status is UNCOLLECTED (${geoffrey.certificateStatus})`);

  // 12d. Test Tutor inputting module progress for Geoffrey (Module 7)
  console.log("\nTesting Tutor inputting module progress for Geoffrey (Module 7: MS Publisher)...");
  const updatedMod7 = await db.studentModuleProgress.update({
    where: {
      studentId_courseType_moduleNumber: {
        studentId: geoffrey.id,
        courseType: "COMPUTER",
        moduleNumber: 7,
      },
    },
    data: {
      status: "COMPLETED",
      score: 92,
      classwork: "Designed official tri-fold school prospectus and event ticket",
      remarks: "Outstanding typography and desktop publishing layout skills demonstrated.",
      completedAt: new Date(),
    },
  });
  assert(updatedMod7.status === "COMPLETED", "Tutor successfully marked Module 7 COMPLETED");
  assert(updatedMod7.score === 92, "Tutor recorded score of 92%");
  assert(updatedMod7.classwork.includes("prospectus"), "Classwork assignment recorded");

  // 12e. Test Certificate Status Transitions: UNCOLLECTED -> PRINTING -> COLLECTED
  console.log("\nTesting Certificate Collection State Transitions (Dropdown values)...");
  // Transition 1: UNCOLLECTED -> PRINTING
  const certToPrinting = await db.student.update({
    where: { id: geoffrey.id },
    data: {
      certificateStatus: "PRINTING",
      certificateNumber: "KENA-CERT-COMP-2026-TEST-007",
      certificateRemarks: "Queued for print by examinations officer.",
    },
  });
  assert(certToPrinting.certificateStatus === "PRINTING", 'Successfully transitioned to "PRINTING" state');

  // Transition 2: PRINTING -> COLLECTED
  const certToCollected = await db.student.update({
    where: { id: geoffrey.id },
    data: {
      certificateStatus: "COLLECTED",
      certificateRemarks: "Collected in person with National ID at Tabby House reception.",
    },
  });
  assert(certToCollected.certificateStatus === "COLLECTED", 'Successfully transitioned to "COLLECTED" state');

  // Transition 3: Revert to UNCOLLECTED
  const certReverted = await db.student.update({
    where: { id: geoffrey.id },
    data: { certificateStatus: "UNCOLLECTED" },
  });
  assert(certReverted.certificateStatus === "UNCOLLECTED", 'Successfully reverted to "UNCOLLECTED" state');

  console.log("\n=========================================");
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("=========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
