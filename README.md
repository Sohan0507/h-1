# Hospital Digital Platform — Full-Stack Production System

Hospital Digital Platform for We Care Multispeciality Hospital, Doddaballapura. It has two separately deployed apps backed by **Supabase** (Postgres with Row Level Security, Auth, Edge Functions):

- **Public website + patient portal** (`wecarehospital.in`): hospital information, live OPD slot booking, and a patient login (one-time code) to track and cancel appointments.
- **Staff app** (`staff.wecarehospital.in`): front desk, doctor and admin dashboards. Invite-only, with mandatory two-step verification.

Setup and deployment: **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**. Security model: **[SECURITY.md](SECURITY.md)**.

---

## 🌟 Architecture & Features

### 1. Public Hospital Information Website
- **Hero & Emergency**: 24/7 Helpline, NABH accreditation badges, 4 CTAs ("Book Appointment", "Kannada Voice Assistant", "Find Doctor", "Call Emergency").
- **About Hospital**: Overview, Mission, Vision, Strengths, Accreditations, and Statistics.
- **Departments & Services**: Specialty cards (Cardiology, Orthopedics, Neurology, Pediatrics, Gynecology, Gastroenterology) with doctor counts and 24/7 ICU/Diagnostics details.
- **Doctor Directory**: Interactive cards, photos, qualifications, experience, department filtering, and profile modal.
- **Live OPD Schedules**: Weekly availability matrix per doctor.
- **Facilities Gallery**: 3T MRI, 128-slice CT, Modular OTs, ICU & Patient Suites.
- **Appointment Booking System**: Live client & server validation, doctor slot selection, idempotency key duplicate rejection, human-readable ID generation (`APT-YYYYMMDD-XXXX`).
- **Contact & FAQs**: Google Maps embed, WhatsApp link, phone numbers, operating hours, accordion FAQs.

### 2. Kannada AI Voice Appointment Assistant
- Interactive floating assistant (`ಕನ್ನಡ Voice Assistant`) supporting Kannada (`kn-IN`) and English (`en-IN`).
- Speech-to-Text (STT) and Text-to-Speech (TTS) integration using Web Speech API.
- Multi-turn NLU State Machine (`INIT` -> `GREETING` -> `COLLECT_NAME` -> `COLLECT_PHONE` -> `COLLECT_DEPARTMENT` -> `COLLECT_DOCTOR` -> `COLLECT_DATE` -> `COLLECT_TIME` -> `COLLECT_REASON` -> `SUMMARY` -> `SUBMIT` -> `CONFIRM_SUCCESS`).
- **Medical Safety Guardrails**: Automatic classifier preventing medical diagnosis or prescription queries and advising clinical consultation.

### 3. Patient Portal (public site, `/login` and `/my`)
- Sign in with a one-time code by SMS or email. The account is created on first sign-in.
- Upcoming and past appointments with booking ID and OPD token; cancel upcoming visits; edit profile.
- Guest bookings made earlier with the same verified mobile number are linked automatically.

### 4. Staff App (separate build and domain)
- Staff are invited by an administrator; there is no public staff sign-up. Password plus authenticator app (TOTP) required.
- **Front desk / receptionist**: appointment queue (confirm, contacted, complete, no-show, cancel), AI call cases.
- **Doctor**: today's queue by token number, mark completed/no-show, manage leave days (blocks booking).
- **Hospital admin**: live KPIs, doctors, staff invitations and access management.
- **Super admin**: everything, plus audit logs and granting admin roles.

---

## 🚀 Quick Start Guide

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm run setup
```
Or individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Run Development Environment
Configure Supabase first (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)), then:
```bash
cd frontend
npm run dev          # public website + patient portal → http://localhost:5173
npm run dev:staff    # staff app                       → http://localhost:5174
```
The Express backend (`npm run dev:backend`) is only needed for the AI voice/telephony integrations.

### 4. Run Core Tests
```bash
supabase/tests/local/run.sh -h localhost -U postgres   # database access rules & booking
npm run test                                          # legacy backend
```

---

## 🔐 Staff Accounts

There are no default or demo staff passwords. Staff accounts are created by invitation only; see `SUPABASE_SETUP.md`.

---|---|---|---|
| **Super Admin** | `superadmin@citycarehospital.example.com` | `SuperAdmin@123` | Full System & Audit Logs |
| **Hospital Admin** | `admin@citycarehospital.example.com` | `HospitalAdmin@123` | Operations & Doctor Approvals |
| **Receptionist** | `reception@citycarehospital.example.com` | `Reception@123` | Appointments & OPD Queue |
| **Sample Doctor** | `doc101@example.com` | `Doctor@123` | Clinical Dashboard |

---

## 📄 Documentation Index

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) — Supabase setup, first admin, deployment of both apps
- [ARCHITECTURE.md](ARCHITECTURE.md) — System Architecture & Decoupled Storage Layer
- [API.md](API.md) — Public, Auth, Patient, Doctor, & Management REST APIs
- [DATABASE.md](DATABASE.md) — Relational Data Schema & Entity Models
- [GOOGLE_SHEETS.md](GOOGLE_SHEETS.md) — V1 Google Sheets Appointment Persistence
- [VOICE_AGENT.md](VOICE_AGENT.md) — Kannada Voice Agent State Machine & Safety Protocol
- [SECURITY.md](SECURITY.md) — Security model: RLS, roles, MFA, audit
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production Deployment & Build Guide
- [TESTING.md](TESTING.md) — Testing Suite & Acceptance QA Criteria
- [ENVIRONMENT.md](ENVIRONMENT.md) — Environment Variable Specifications
