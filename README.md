# SafeDrive Academy - Driving School Management System

A production-ready Driving School Management System built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM with SQLite**.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure Node.js v18+ is available on your machine. If using the environment configured during installation:
```bash
export PATH="/Users/cthairu/.gemini/antigravity/scratch/.node/bin:$PATH"
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

### 4. Database Management & Seeding
- **Re-seed Demo Data**: `npm run prisma:seed`
- **Push Schema Updates**: `npm run prisma:push`
- **Inspect DB via Prisma Studio UI**: `npx prisma studio`

---

## 🌟 Key Features

### 1. 📊 Executive Operations Dashboard (`/`)
- Real-time KPIs: Active students in training, licensed instructors, fleet operational availability, and revenue collected.
- Today's driving schedule timeline with one-click lesson completion.
- Fleet safety inspection & insurance renewal compliance alerts.
- Upcoming official road test bookings.

### 2. 🎓 Student Directory & Profile (`/students` & `/students/[id]`)
- Student registration with category (Category A - Motorcycle, Category B - Light Vehicle, Commercial) and gearbox selection (Manual vs Automatic).
- Required vs completed practical driving hours progress bar.
- **Interactive Driving Competency Matrix**: 12 core driving skills (Cockpit drill, Hill start, Parallel parking, 3-point turn, Roundabouts, etc.) with real-time status updates (`Not Started`, `In Progress`, `Proficient`, `Mastered`).
- Full lesson history with instructor feedback notes and 5-star ratings.
- Invoicing and payment history.

### 3. 👨‍🏫 Instructor Faculty (`/instructors`)
- Licensed instructor directory with qualifications and specializations.
- Primary assigned dual-control vehicle.
- Active student roster and lesson counts.

### 4. 🚗 Fleet & Vehicle Management (`/vehicles`)
- Vehicle make, model, year, transmission, registration plate, and mileage.
- Color-coded safety inspection and insurance expiration alerts (warns if within 60 days).
- Real-time status toggling (`Available`, `In Service`, `Maintenance`).

### 5. 📅 Smart Lesson Scheduling (`/schedule`)
- Interactive timetable filterable by date, instructor, and vehicle.
- **Automated Double-Booking Prevention**: Validates overlapping times for both the instructor and the vehicle, rejecting conflicts with explicit warnings.
- Instructor lesson completion sign-off modal (logs feedback and automatically credits hours to student's record).

### 6. 💳 Billing, Invoices & Receipts (`/billing`)
- Course Packages catalog with pricing and hours.
- Outstanding student account balance tracker.
- Payment recording (Cash, Card, Bank Transfer, Mobile Money / M-Pesa).
- Clean, printable official driving tuition receipts.

### 7. 🏆 Test Readiness & Examination Center (`/exams`)
- Automatically flags students who reach required course hours as `TEST_READY`.
- Book official government road tests and theory tests.
- Record test outcomes and scores; passing automatically transitions candidate to `GRADUATED`.

---

## 📁 System Architecture

```
driving-school-system/
├── prisma/
│   ├── schema.prisma      # SQLite data models (Student, Instructor, Vehicle, Lesson, Payment, Exam)
│   └── seed.js            # Realistic driving school seed dataset
├── src/
│   ├── app/
│   │   ├── page.tsx               # Executive Dashboard
│   │   ├── students/              # Student Directory & Detail pages
│   │   ├── instructors/           # Instructor faculty
│   │   ├── vehicles/              # Fleet management & inspection alerts
│   │   ├── schedule/              # Conflict-aware lesson scheduler
│   │   ├── billing/               # Packages, balances, payments & receipts
│   │   ├── exams/                 # Test readiness & official exam results
│   │   └── api/                   # REST API routes
│   ├── components/
│   │   ├── Sidebar.tsx            # Navigation sidebar with brand & status
│   │   └── Header.tsx             # Header bar with search & role switcher
│   └── lib/
│       ├── db.ts                  # Prisma Client singleton
│       └── utils.ts               # Formatting, currency, date helpers
├── test-verification.js   # Automated test suite (10 test assertions)
├── package.json
└── tailwind.config.ts
```
