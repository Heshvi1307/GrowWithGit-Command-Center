# 🚀 GROWWITHGIT — GIT CLUB COMMAND CENTER
> **Internal Operating System for the Git Club at CSPIT, CHARUSAT**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![QR Code](https://img.shields.io/badge/QR_Scanner-Optical-purple?style=for-the-badge)
![LocalStorage](https://img.shields.io/badge/Storage-Persistent-orange?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Layout-Responsive-emerald?style=for-the-badge)

---

## 📌 PROBLEM STATEMENT 5
### **Git Club Command Center — The Club's Internal Dashboard**

* **Problem Context:** Managing student clubs, workshops, hackathons, open-source projects, and event admissions manually leads to fragmentation, lost attendee records, lack of visibility into student domain skills, and chaotic check-in desks.
* **Challenge Context:** CSPIT CHARUSAT needs a unified internal operating system that provides role-driven control panels for Administrators, Event Leads, and Student Members while maintaining high visual polish and real-time operational feedback.
* **What We Built:** A full-featured, zero-dependency client-side Command Center featuring role-based workspace isolation, optical QR code pass scanning, live approvals queue, open-source project matching, gamified member XP, and deep event readiness audits.
* **Product Philosophy:** Built around three core operational questions:
  1. *WHAT IS HAPPENING?* (Live activity, stats, operational health)
  2. *WHAT NEEDS ATTENTION?* (Pending approvals, event readiness checks, capacity limits)
  3. *WHAT CAN I DO NEXT?* (Quick actions, event check-in, project application)

---

## 💡 SOLUTION ARCHITECTURE

The platform cleanly separates responsibilities across four core operational environments:

* **Command Center:** Shared high-level club metrics, live announcements, upcoming schedule, and active projects overview.
* **Admin Workspace:** Complete administrative control over member rosters, role promotions, approval queues, project creation, club operations, announcements, and club analytics.
* **Event Lead Workspace:** Focused event command console, pre-event readiness checklists, optical QR scanner check-in desk, participant roster management, and turnout telemetry.
* **Member Workspace:** Personalized student hub featuring event pass generation, open-source project applications, XP levels & streak tracking, activity stream, and committee messaging desk.

---

## 🏗️ SYSTEM ARCHITECTURE & DATA FLOW

```text
[ User / Role Login ]
        │
        ├──► Admin Workspace
        │     ├── Command Center Overview & Live Feed
        │     ├── Member Roster & Role Matrix
        │     ├── Approvals Queue & Applications
        │     ├── Campus Project Directory
        │     ├── Club Operations & Infrastructure
        │     ├── Announcements Desk
        │     └── Club Analytics & Turnout Telemetry
        │
        ├──► Event Lead Workspace
        │     ├── Event Command HQ & Readiness Audit
        │     ├── Event Publishing & Schedule Ops
        │     ├── Check-in Desk & Optical QR Scanner
        │     ├── Event Communications & Broadcasts
        │     └── Event Performance Analytics
        │
        └──► Member Workspace
              ├── My Home Dashboard & XP Progress
              ├── Discover Events & Spot Reservation
              ├── Holographic QR Admission Pass Modal
              ├── Campus Open Source Projects
              ├── Personal Activity Stream & Commit Logs
              └── Committee & Direct Desk Messaging
```

---

## 🔥 KEY FEATURES

1. **Role-Based Workspace Isolation:** Seamlessly switches UI layout, navigation items, and action permissions according to Admin, Event Lead, or Member roles.
2. **Interactive Authentication & Demo Invites:** Fully custom authentication experience with workspace selection, instant demo accounts, and invite code activation (`ADMIN-DEMO`, `LEAD-DEMO`).
3. **Holographic Pass Generator & Optical QR Scanner:** Instant holographic digital passes with live QR verification for quick admission at event check-in desks.
4. **Live Approvals Queue:** Real-time administrative workflow for reviewing student membership applications and open-source project contributor requests.
5. **Event Lifecycle & Readiness Audits:** Operational checklists (WiFi, Audio, Swag, QR Passes, Speaker Confirmation) ensuring zero-failure event execution.
6. **Club Operations & Infrastructure Console:** Operational health metrics, database sync status, committee rosters, and domain distribution telemetry.
7. **Multi-Audience Announcements Broadcast:** Direct messaging and news publishing engine supporting targeted broadcasts to all members or checked-in attendees.
8. **Gamified Member XP & Activity Logs:** XP leveling, streak counters, activity feeds, commit logs, and badges recognizing student engagement.

---

## 🛠️ TECH STACK

- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling & UI:** Tailwind CSS + Lucide React Icons
- **QR Engine:** HTML5-QRCode Scanner + Canvas Holographic Pass Generator
- **Data Persistence:** Synchronized LocalStorage Engine with Seed Data Engine

---

## 🚀 QUICK START & LOCAL DEVELOPMENT

### 1. Clone the repository:
```bash
git clone https://github.com/Heshvi1307/GrowWithGit-Command-Center.git
cd GrowWithGit-Command-Center/app
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start local development server:
```bash
npm run dev
```

### 4. Build for production:
```bash
npm run build
```

---

## 👤 AUTHOR & ACKNOWLEDGMENTS

For the **Git Club at CSPIT, CHARUSAT University**.  

