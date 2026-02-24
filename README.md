# 🚗 DriveCycle

**VoidHack 2026 · Problem Statement 1**
AI-Powered Sales Communication & Lead Management System — Automotive Vertical

![Built in](https://img.shields.io/badge/Built_in-6_Days-3b82f6?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-React_+_Express_+_PostgreSQL-6366f1?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-f59e0b?style=for-the-badge)
![Recalls](https://img.shields.io/badge/Data-Live_NHTSA_API-ef4444?style=for-the-badge)
![DB](https://img.shields.io/badge/DB-Supabase_PostgreSQL-22c55e?style=for-the-badge)

---

## 🎬 Demo

🔗 [Watch the demo walkthrough](#)

**To run it yourself:**

| Role | Email | Password | Admin Key |
|------|-------|----------|-----------|
| 🏢 Dealer | `dealer@drivecycle.com` | `demo2026` | — |
| 🔐 Admin | `admin@drivecycle.com` | `admin2026` | `DC-ADMIN` |

---

## 💡 What I Built

DriveCycle is a fullstack web application that helps car dealerships manage customer relationships after the sale. The core idea came from a gap I noticed in the market — tools like AutomotiveAI.ca handle pre-sale lead follow-up, but nothing exists for what happens after a customer drives off the lot. Service visits, government safety recalls, trade-in windows — these moments are ignored by every existing tool.

I built three connected engines: **ServicePulse** for retention, **RecallReach** for re-engagement using live NHTSA government recall data, and **TradeIQ** for purchase conversion scoring. Each engine feeds data into the next, creating a customer lifecycle loop. The NHTSA integration was the most important technical decision — it makes the demo real, not fabricated. Judges can watch actual government recall data match against actual customers in real time.

---

## ⚙️ The Three Engines

### ⚡ ServicePulse — Retention Engine

> Watches for customers who are drifting away from the dealership and sends them a personalized AI message before they're gone for good.

**How it actually works:**

- Calculates a **churn score 0–10** per customer using 6 signals:
  1. 📅 Days since last service visit
  2. 📉 Service frequency trend (gap growing = drifting)
  3. 💸 High bill on last visit (frustration signal)
  4. 🔁 Repeat complaint keyword detection
  5. ❌ No satisfaction rating logged
  6. 📭 No follow-up sent after last visit
- Parses job card complaint text to detect **upsell opportunities** (battery weak, brake pads low, etc.)
- Sends AI-generated SMS via Gemini in the **service advisor's name** referencing the customer's exact car
- Updates customer lifecycle status: `active` → `at-risk` → `drifted` → `recovered`

---

### 🛡️ RecallReach — Re-engagement Engine

> Scans the US government recall database, matches any new recalls against dealership customers, and sends a proactive alert before the government letter arrives.

**How it actually works:**

- Hits **NHTSA public API**: `api.nhtsa.gov/recalls/recallsByVehicle` — no auth required, completely free
- Matches recall results against every vehicle in the database by **make / model / year**
- Assesses severity by scanning consequence text for keywords:
  - 🔴 `crash / fire / death` → **CRITICAL**
  - 🟠 `loss of control / brake failure` → **HIGH**
  - 🟡 `stall / malfunction` → **MEDIUM**
- If customer status is `drifted` and recall found → updates to `at-risk` (re-entry logic)
- If vehicle is **> 4 years old** and purchase score **≥ 65** → includes trade-in hook in message

---

### 📈 TradeIQ — Purchase Conversion Engine

> Scores every customer 0–100 on how likely they are to buy a new car right now, then sends them their actual trade-in value upfront with no sales pressure.

**How it actually works:**

- **Purchase likelihood score** from 6 signals:

  | Signal | Max Points |
  |--------|-----------|
  | Vehicle age | 30 pts |
  | Mileage | 20 pts |
  | Repair spend this year | 20 pts |
  | Time since purchase | 15 pts |
  | Active recall on vehicle | 10 pts |
  | High churn score | 5 pts |

- **Trade value** estimated using depreciation curve:
  `15%` yr 1 → `12%` yrs 2-3 → `10%` yrs 4-6 → `8%/yr` after that + mileage adjustment.
  No paid API — formula-based on segment base values
- Messages leads with **actual dollar range** upfront (`$X,XXX – $X,XXX`) — transparency is intentional

---
Look at what these three cover together:

```
CUSTOMER BUYS CAR
       │
       ▼
┌─────────────────┐
│  SERVICE PULSE  │  ← Post-purchase retention
│                 │    Stop them from drifting to local mechanics
│  Months 1-36   │    Oil changes, follow-ups, upsells
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RECALL REACH   │  ← Government recall triggers re-engagement
│                 │    NHTSA API pulls live recalls
│  Year 3-6      │    Positions dealer as hero who told them first
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   TRADE IQ      │  ← Purchase likelihood peaks here
│                 │    Transparent market valuation
│  Year 5-8      │    Convert service/recall visit → new car sale
└─────────────────┘
         │
         ▼
  CUSTOMER BUYS
  AGAIN FROM YOU
(not a competitor)
```

---

How The Three Engines Talk To Each Other
This is what makes DriveCycle genuinely new — the data flows between engines, each one making the others smarter:
```
SERVICE HISTORY DATA (ServicePulse)
           │
           ├──→ Feeds vehicle age/mileage/repair cost to TradeIQ
           │    (purchase likelihood scoring gets smarter)
           │
           ├──→ Feeds vehicle VIN/details to RecallReach
           │    (recall matching against YOUR customer base)
           │
           └──→ Identifies drifted customers for RecallReach
                (lost customers recovered through recall re-entry)

RECALL DATA (RecallReach)
           │
           ├──→ Re-entered customers flow into ServicePulse
           │    (relationship rebuilt, now retained)
           │
           └──→ Recall visit = purchase signal trigger for TradeIQ
                (high-mileage car + recall = they're shopping)

PURCHASE SIGNALS (TradeIQ)
           │
           └──→ Converted customers restart the ServicePulse loop
                (new car purchased = Day 1 of retention begins again)
```         
---

## 🔄 How The Data Flows Between Engines

```
Customer logs a service visit
        │
        ▼
ServicePulse calculates new churn score
ServicePulse detects upsell from complaint text
        │
        ▼
Vehicle VIN sent to NHTSA recall check
RecallReach stores any new recalls found
        │
        ▼
If recall found on vehicle age > 4yrs:
    TradeIQ purchase score boosted by 10pts
        │
        ▼
If purchase score >= 75:
    Customer appears on TradeIQ hot leads list
        │
        ▼
Dealer sends trade valuation message
Customer comes in for recall + trade conversation
        │
        ▼
New vehicle purchased → new service history begins
    ServicePulse retention cycle restarts
```

> This is the flywheel. Every action automatically creates the next opportunity.

---

## 🖥️ Admin Dashboard — 5 Real-Time Pages

Built a complete admin panel with **live data from Supabase** — no placeholder content.

| Page | What It Shows |
|------|--------------|
| 📊 **Platform Overview** | Aggregated stats (dealers, customers, vehicles, AI messages today), customer health bars, critical recall alerts with "Notify Now" buttons, AI activity breakdown by engine, recall status donut chart. Auto-refreshes every 30s |
| 🏢 **All Dealers** | Searchable dealer grid with per-dealer stats (customers, vehicles, active recalls, messages sent, hot leads) |
| 🛡️ **Recall Monitor** | Platform-wide recall table with severity and status filters, actionable "Notify" buttons for pending recalls |
| 💬 **AI Message Log** | Filterable log of every AI-generated message across all 3 engines, with type and status filters |
| 🩺 **System Health** | Live service health checks for Database (Supabase), NHTSA API, Gemini AI, and Twilio SMS — with response latency, DB record counts, Node version, uptime, and memory usage. Auto-refreshes every 60s |

---

## ✅ Honest: What's Real vs What's Demo

I want to be upfront about this.

**Actually working end to end:**
- ✅ NHTSA API — live government data, zero mock
- ✅ Supabase PostgreSQL — real database, real queries
- ✅ Gemini AI — real API calls generating real messages
- ✅ Churn scoring — real algorithm on real data
- ✅ Trade value estimation — real formula, real output
- ✅ Twilio SMS — sends real SMS to verified numbers
- ✅ Admin panel — real data from real DB queries
- ✅ Dealer signup — saves real record to Supabase

**Demo-mode for hackathon:**
- 🟡 Auth is hardcoded credentials + localStorage (Supabase Auth is the post-launch upgrade)
- 🟡 Google OAuth simulated (real implementation needs Google Cloud Console project)
- 🟡 SMS mock mode available (`MOCK_SMS=true` in `.env`) because Twilio trial only sends to verified numbers
- 🟡 Trade valuations are formula-based not Black Book API
- 🟡 Single dealership — multi-tenant architecture designed but `dealer_id` FK not enforced yet

---

## 🧠 Tech Decisions — Why I Chose What I Chose

**PostgreSQL over MongoDB:**
The data is relational. `Customer → Vehicle → Recall → ServiceJob → OutreachLog`. These are foreign key relationships. MongoDB would mean manually managing joins. Prisma + PostgreSQL via Supabase gave me type-safe queries, proper relations, and a visual table editor to check data during development.

**Gemini 2.0 Flash over OpenAI:**
Free tier: 15 req/min, 1M tokens/day, no billing required. For a hackathon generating 20-30 messages in a demo this is completely sufficient. The output quality for short SMS generation is equivalent. Switching to Claude API post-launch is literally changing one import.

**NHTSA Public API:**
This was the most important decision in the whole project. Free, no auth, real government data, updates daily. It makes RecallReach demonstrably real in a way no amount of good UI can fake. When a judge watches a live scan return actual recall data for actual vehicles, the product becomes credible immediately.

**Prisma ORM:**
Schema defined once. Ran `npx prisma db push` to deploy to Supabase PostgreSQL with one environment variable change. Zero code changes between local dev and production database.

**No paid APIs:**
The entire project runs at **$0 cost**. Supabase free tier (500MB), Gemini free tier, NHTSA free, Twilio $15 trial credit, Vercel free, Render free tier.

---

## 📁 Project Structure

```
drivecycle/
│
├── 📂 client/                        # React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx               # Animated landing + auth modal
│       │   ├── Dashboard.jsx             # Dealer dashboard + priority actions
│       │   ├── ServicePulse.jsx          # Churn scoring + AI outreach
│       │   ├── RecallReach.jsx           # NHTSA recall scanning
│       │   ├── TradeIQ.jsx               # Trade-in valuations + hot leads
│       │   ├── AdminDashboard.jsx        # Admin panel (5 pages)
│       │   ├── AddServiceJob.jsx         # Service job entry form
│       │   └── Settings.jsx              # Dealer settings + preferences
│       ├── components/
│       │   └── LoginModal.jsx            # Auth modal (dealer + admin tabs)
│       ├── api.js                        # API client (all endpoint methods)
│       └── App.jsx                       # Router + auth state
│
├── 📂 server/                        # Node.js / Express backend
│   ├── routes/
│   │   ├── admin.js                      # Admin API (5 endpoints)
│   │   ├── dashboard.js                  # Dealer dashboard aggregation
│   │   ├── outreach.js                   # AI message gen + SMS sending
│   │   ├── recalls.js                    # NHTSA recall sync + management
│   │   ├── tradeiq.js                    # Trade-in valuation + scoring
│   │   ├── serviceJobs.js                # Service job CRUD
│   │   ├── customers.js                  # Customer endpoints
│   │   └── vehicles.js                   # Vehicle endpoints
│   ├── services/
│   │   ├── aiMessaging.js                # Gemini AI message generation
│   │   ├── messaging.js                  # Twilio SMS delivery
│   │   ├── recallReach.js                # NHTSA API integration
│   │   ├── servicePulse.js               # Churn scoring + upsell detection
│   │   └── tradeiq.js                    # Vehicle valuation algorithms
│   ├── prisma/
│   │   └── schema.prisma                 # Database schema (5 models)
│   ├── seed.js                           # Demo data seeding (13 customers)
│   └── index.js                          # Express entry point
│
└── README.md
```

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Customer   │────▶│   Vehicle    │────▶│    Recall    │
│              │     │              │     │              │
│ name         │     │ make/model   │     │ recallId     │
│ phone/email  │     │ year/vin     │     │ component    │
│ churnScore   │     │ mileage      │     │ severity     │
│ purchaseScore│     │ tradeValue   │     │ status       │
│ status       │     │              │     │ detectedAt   │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ OutreachLog  │     │  ServiceJob  │
│              │     │              │
│ type (SP/RR) │     │ serviceType  │
│ message      │     │ complaints   │
│ status       │     │ totalCost    │
│ twilioSid    │     │ upsells      │
│ sentAt       │     │ advisor      │
└──────────────┘     └──────────────┘
```

---

## 🚀 Run It Locally

### You need:
- **Node.js** v20+
- **Supabase** project (free at [supabase.com](https://supabase.com))
- **Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com/apikey))
- **Twilio** trial account (free at [twilio.com](https://twilio.com)) — OR just set `MOCK_SMS=true`

### 1️⃣ Environment setup

Create `server/.env`:

```env
DATABASE_URL=your_supabase_postgres_connection_string
GEMINI_API_KEY=your_gemini_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=+1xxxxxxxxxx
MOCK_SMS=true
PORT=5000
```

> ⚠️ If your DB password has special characters (`@`, `[`, `]`), URL-encode them (`@` → `%40`).

### 2️⃣ Install and run

```bash
# Clone
git clone https://github.com/YOURUSERNAME/drivecycle
cd drivecycle

# Backend
cd server
npm install
npx prisma generate
npx prisma db push
node seed.js
npm run dev
# → Server on http://localhost:5000

# Frontend (new terminal)
cd ../client
npm install
npm run dev
# → App on http://localhost:5173
```

### 3️⃣ Verify it's working

```
Open http://localhost:5173
Sign in as dealer: dealer@drivecycle.com / demo2026
Go to RecallReach → click "Check for New Recalls"
Watch live NHTSA data return in real time
```

**If that works, everything works.**

---

## 🧪 Seed Data

13 customers built to demo every scenario:

| Customer | Vehicle | Status | Story |
|----------|---------|--------|-------|
| 🔴 Marcus Johnson | 2019 Ford F-150 | at-risk | CRITICAL recall + churn 8 + score 87 → hero demo |
| 🔴 James Okafor | 2016 Chevrolet Malibu | drifted | CRITICAL airbag recall + drifted 14mo |
| 🟠 Robert Chen | 2018 Toyota Camry | drifted | HIGH recall + drifted 12mo → re-entry path |
| 🟠 Nina Fernandez | 2016 Chevrolet Malibu | drifted | Drifted 17mo + 118k miles → trade story |
| 🟡 Emily Watson | 2018 Ford Fusion | at-risk | At-risk + HIGH recall + score 83 |
| 🟡 David Kim | 2020 Chevrolet Silverado | at-risk | At-risk + $1,030 repair bill this year |
| 🟡 Sarah Mitchell | 2021 BMW X3 | at-risk | At-risk + repeat brake complaint |
| 🟢 Priya Sharma | 2022 Honda CR-V | active | Healthy customer → contrast baseline |
| 🟢 Carlos Rivera | 2021 Toyota RAV4 | active | Moderate engagement |
| 🟢 Michael Thompson | 2023 Ford Bronco | active | Newer vehicle, low churn |
| 🟢 Amanda Torres | 2023 Tesla Model 3 | active | Tesla → different service pattern |
| 🟢 Linda Patel | 2024 Hyundai Tucson | active | Brand new customer, first service |
| 🟢 Jennifer Wu | 2022 Subaru Outback | active | Regular, consistent service |

---

## 🗺️ API Endpoints

### Dealer APIs

| Method | Endpoint | What it does |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Aggregated dealer dashboard data |
| `GET` | `/api/customers` | All customers with vehicles |
| `GET` | `/api/vehicles` | All vehicles |
| `POST` | `/api/service-jobs` | Create a new service job |
| `POST` | `/api/recalls/sync/:vehicleId` | Sync NHTSA recalls for a vehicle |
| `POST` | `/api/recalls/notify/:vehicleId` | Send recall notification |
| `GET` | `/api/tradeiq/evaluate/:vehicleId` | Get trade-in valuation |
| `POST` | `/api/outreach/generate` | Generate AI message preview |
| `POST` | `/api/outreach/send` | Send AI message via Twilio |

### Admin APIs

| Method | Endpoint | What it does |
|--------|----------|-------------|
| `GET` | `/api/admin/overview` | Platform stats, customer health, AI activity, recalls |
| `GET` | `/api/admin/dealers` | All dealers with per-dealer statistics |
| `GET` | `/api/admin/recalls` | All recalls sorted by severity |
| `GET` | `/api/admin/messages` | Filterable AI message log |
| `GET` | `/api/admin/system-health` | Live service checks + DB record counts |

---

## 🔮 If I Had More Time

- **Real Supabase Auth** with Google OAuth — currently localStorage. Works fine for demo
- **Multi-tenant dealer isolation** — `dealer_id` FK is in the schema design but not enforced yet. Each dealer should only see their customers
- **Black Book API** for trade valuations — formula works for demo, real dealers need industry-standard numbers
- **DMS integration** — CDK Global and Reynolds & Reynolds APIs so service jobs sync automatically instead of manual entry
- **Transport Canada recall database** — same concept as NHTSA but for Canadian market. Direct competition to AutomotiveAI.ca on their home turf
- **Proper job queue** for recall scanning — currently synchronous loop with 300ms delay. At 500+ vehicles needs Redis + Bull queue

---

## 👤 Built By

**Yash Kumar**
VoidHack 2026 — Problem Statement 1
Built solo in 6 days

---

> *If something doesn't work, check that your `.env` is set up correctly and the server is running on port 5000 before assuming it's broken.*
