# Campus Shuttle Tracking System — Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [User Roles and Access Control](#5-user-roles-and-access-control)
6. [Application Flow](#6-application-flow)
7. [Feature Documentation](#7-feature-documentation)
   - 7.1 [Onboarding](#71-onboarding)
   - 7.2 [Landing Page](#72-landing-page)
   - 7.3 [Authentication System](#73-authentication-system)
   - 7.4 [Student Dashboard (Home)](#74-student-dashboard-home)
   - 7.5 [Live Map Tracking](#75-live-map-tracking)
   - 7.6 [Campus Routes Browser](#76-campus-routes-browser)
   - 7.7 [Schedule Viewer](#77-schedule-viewer)
   - 7.8 [Student Profile Management](#78-student-profile-management)
   - 7.9 [Admin Panel](#79-admin-panel)
8. [Data Models](#8-data-models)
9. [Algorithms and Simulation](#9-algorithms-and-simulation)
   - 9.1 [Bus Movement Simulation](#91-bus-movement-simulation)
   - 9.2 [ETA Calculation Engine](#92-eta-calculation-engine)
   - 9.3 [Crowd Simulation](#93-crowd-simulation)
10. [Backend Services](#10-backend-services)
    - 10.1 [Firebase Authentication](#101-firebase-authentication)
    - 10.2 [Cloud Firestore Database](#102-cloud-firestore-database)
    - 10.3 [Firebase Cloud Functions](#103-firebase-cloud-functions)
11. [Routing and Navigation](#11-routing-and-navigation)
12. [Design System](#12-design-system)
13. [Deployment](#13-deployment)
14. [Environment Variables](#14-environment-variables)
15. [Campus Context — KNUST Route Data](#15-campus-context--knust-route-data)

---

## 1. Project Overview

**Campus Shuttle Tracking** is a full-stack, real-time web application designed to help students and administrators at **Kwame Nkrumah University of Science and Technology (KNUST)** track campus shuttle buses, view routes, check estimated arrival times, and manage transit operations.

The system provides:

- **Real-time GPS-style bus tracking** on an interactive Mapbox map centered on the KNUST campus.
- **Estimated Time of Arrival (ETA)** calculations for every bus at every stop.
- **Crowd-level simulation** at bus stops to help students decide when to walk to a stop.
- **Schedule viewing** with morning, afternoon, and evening departure times for all four campus routes.
- **Role-based access**: Students see tracking features; Administrators manage routes, buses, and stops through a dedicated panel.
- **Responsive design** optimized for mobile (iOS/Android) and desktop browsers.

**Live URL:** [https://shuttle-track.vercel.app](https://shuttle-track.vercel.app)

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (SPA)                         │
│  React 19 + TypeScript + Vite 7 + React Router 7            │
│  Mapbox GL JS for interactive maps                          │
│  CSS Modules + responsive clamp()/Grid/Flexbox              │
├─────────────────────────────────────────────────────────────┤
│                     BACKEND SERVICES                        │
│  Firebase Authentication (email/password)                    │
│  Cloud Firestore (user profiles, admin CRUD)                │
│  Firebase Cloud Functions v2 (password reset email)          │
│  Resend API (transactional email delivery)                  │
├─────────────────────────────────────────────────────────────┤
│                     DEPLOYMENT                              │
│  Vercel (frontend hosting, SPA rewrite)                     │
│  Firebase (Cloud Functions, Firestore)                      │
└─────────────────────────────────────────────────────────────┘
```

The frontend is a **Single Page Application (SPA)** that communicates with Firebase for authentication, database operations, and serverless functions. The map and bus simulation run entirely client-side using mock data derived from real KNUST GPS coordinates.

---

## 3. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.0 | UI component library |
| **TypeScript** | 5.9.3 | Static type checking |
| **Vite** | 7.3.1 | Build tool and dev server |
| **React Router DOM** | 7.13.1 | Client-side routing with lazy loading |
| **Mapbox GL JS** | 3.19.1 | Interactive map rendering |
| **react-map-gl** | 8.1.0 | React bindings for Mapbox |
| **Lucide React** | 0.577.0 | Icon library (SVG icons) |
| **CSS Modules** | (built-in) | Scoped component styling |
| **ESLint** | 9.39.1 | Code linting |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Firebase SDK** | 12.10.0 | Auth + Firestore client |
| **Firebase Admin** | 13.6.0 | Server-side auth management |
| **Firebase Functions** | 7.0.0 | Serverless Cloud Functions (v2) |
| **Resend** | 6.9.4 | Transactional email API |
| **Axios** | 1.13.6 | HTTP client |

### Infrastructure

| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting with automatic deployments from GitHub |
| **Firebase** | Authentication, Firestore database, Cloud Functions |
| **Mapbox** | Map tile rendering and geospatial visualization |
| **GitHub** | Source control and CI/CD trigger |

---

## 4. Project Structure

```
campus-shuttle-tracking/
├── public/
│   ├── icons/                   # Bus marker icons (red, blue, yellow, green PNG)
│   └── shuttle.jpg              # Hero image for landing page
├── functions/                   # Firebase Cloud Functions
│   ├── src/index.ts             # Password reset email function
│   └── package.json
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   ├── router/
│   │   └── AppRouter.tsx        # Route definitions and auth guards
│   ├── context/
│   │   └── react-context.tsx    # AuthProvider (Firebase auth state)
│   ├── hooks/
│   │   ├── react-hook.tsx       # useAuth() hook
│   │   ├── useShuttleBuses.js   # Mock bus animation for non-map pages
│   │   └── useRecentActivity.js # Buses currently dwelling at stops
│   ├── pages/
│   │   ├── OnboardingPage.tsx   # First-time user onboarding slides
│   │   ├── LandingPage.tsx      # Marketing/landing page
│   │   ├── HomePage.jsx         # Student dashboard
│   │   ├── auth/
│   │   │   ├── Login.tsx        # Email/password login
│   │   │   ├── SignUp.tsx       # Account registration
│   │   │   └── ForgotPassword.tsx
│   │   ├── student/
│   │   │   ├── Map.tsx          # Full-screen live map
│   │   │   ├── StudentRoutePage.jsx  # Route browser with search
│   │   │   └── StudentProfilePage.tsx
│   │   ├── common/
│   │   │   └── SchedulePage.jsx # Route schedule viewer
│   │   └── admin/
│   │       ├── RoutesPage.tsx   # Admin route management
│   │       ├── BusesPage.tsx    # Admin bus management
│   │       ├── StopsPage.tsx    # Admin stop management
│   │       └── AdminMapPage.tsx # Admin live map view
│   ├── components/
│   │   ├── common/
│   │   │   ├── ProtectedRoute.tsx  # Auth guard with role checking
│   │   │   └── LimelightNav.tsx    # Bottom navigation bar
│   │   ├── map/
│   │   │   ├── MapView.tsx      # Core map with bus animation
│   │   │   ├── BusMarker.tsx    # Animated bus markers
│   │   │   ├── StopMarker.tsx   # Stop pin markers
│   │   │   ├── RouteLayer.tsx   # GeoJSON route polylines
│   │   │   ├── RouteFilter.tsx  # Route filter pills (All/A/B/C/D)
│   │   │   ├── RouteLegend.tsx  # Glass-panel route legend
│   │   │   ├── InfoPopup.tsx    # Click popup (bus/stop details)
│   │   │   └── MiniMap.jsx      # Thumbnail map for route cards
│   │   └── admin/
│   │       ├── RouteManager.tsx # CRUD form for routes
│   │       ├── BusManager.tsx   # CRUD form for buses
│   │       ├── StopManager.tsx  # CRUD form for stops
│   │       └── AdminMapView.tsx # Admin map wrapper
│   ├── layouts/
│   │   ├── StudentLayout.tsx    # Student shell with bottom nav
│   │   └── AdminLayout.tsx      # Admin shell with sidebar nav
│   ├── services/
│   │   ├── firebase.ts          # Firebase app initialization
│   │   ├── auth.ts              # Auth functions (sign up/in/out, profile)
│   │   ├── shuttleData.ts       # Firestore data fetchers (live integration)
│   │   ├── mockShuttleData.ts   # Mock routes, stops, buses, GPS paths
│   │   └── scheduleData.js      # Static schedule timetable data
│   ├── types/
│   │   └── shuttle.ts           # TypeScript interfaces
│   ├── utils/
│   │   ├── calculateETA.ts      # ETA calculation engine
│   │   ├── crowdSim.ts          # Crowd simulation logic
│   │   └── getNextActiveStopId.js
│   ├── theme/
│   │   └── colors.ts            # Design tokens (Kinetic Canvas palette)
│   ├── lib/
│   │   └── auth-actions.ts      # Callable function wrapper
│   └── styles/                  # CSS Modules and global stylesheets
├── package.json
├── vite.config.ts
├── tsconfig.json
├── firebase.json
├── vercel.json
└── PROJECT_DOCUMENTATION.md     # This file
```

---

## 5. User Roles and Access Control

The system supports two user roles stored in the Firestore `users` collection:

| Role | Access Level | Default |
|---|---|---|
| **`student`** | Home, Live Map, Routes, Schedule, Profile | Assigned on sign-up |
| **`admin`** | Admin Panel (Routes, Buses, Stops, Live Map management) | Manually set in Firestore |

### Route Protection

- **`ProtectedRoute`** — Wraps authenticated sections. Redirects unauthenticated users to `/landing`. Shows a skeleton loading state while checking auth.
- **`PublicRoute`** — Wraps public pages (onboarding, landing, login, signup). Redirects already-authenticated users to their appropriate dashboard.
- **Role checking** — If a student tries to access `/admin`, they are redirected to `/home`. If an admin tries to access student pages, they are redirected to `/admin`.

---

## 6. Application Flow

```
First Visit                    Returning Visit (not logged in)
    │                                    │
    ▼                                    ▼
Onboarding (3 slides)               Landing Page
    │                                    │
    ▼                                    ▼
Landing Page                      Login / Sign Up
    │                                    │
    ▼                                    ▼
Login / Sign Up               ┌──────────────────┐
    │                         │  Role-based       │
    ▼                         │  redirect         │
┌──────────────────┐          └──────────────────┘
│  Role-based      │                │
│  redirect        │          ┌─────┴─────┐
└──────────────────┘          │           │
       │                      ▼           ▼
 ┌─────┴─────┐          Student       Admin
 │           │          Dashboard     Panel
 ▼           ▼
Student     Admin
Dashboard   Panel
```

### First-Time Visitors
1. Visiting any URL redirects to `/onboarding` (3 informational slides).
2. Completing or skipping onboarding sets `localStorage["campus_shuttle_onboarded"] = "1"` and redirects to `/landing`.
3. From the landing page, users can sign in or create an account.

### Returning Visitors (not logged in)
1. `localStorage` flag is detected, so users are sent directly to `/landing`.

### Authenticated Users
1. Students are redirected to `/home` (student dashboard).
2. Admins are redirected to `/admin` (admin panel).

---

## 7. Feature Documentation

### 7.1 Onboarding

**Route:** `/onboarding`

A three-slide welcome experience for first-time visitors:

| Slide | Title | Description |
|---|---|---|
| 1 | Never Miss Your Shuttle | Plan your commute with real-time arrivals and route updates. |
| 2 | Live GPS Tracking | Real-time updates on every shuttle's precise location. |
| 3 | Get ETA at Every Stop | Accurate estimated arrival times for any bus stop. |

Each slide features a custom SVG illustration. Users can:
- **Tap "Next"** to advance through slides.
- **Tap "Skip"** to jump directly to the landing page.
- On the final slide, **"Get Started"** goes to `/landing` and **"Sign In"** goes to `/login`.

Progress is tracked via dot indicators that are also tappable.

---

### 7.2 Landing Page

**Route:** `/landing`

A marketing-style page with the following sections:

1. **Sticky Header** — Brand name ("Campus Transit") with "Sign In" and "Get Started" buttons. Glass-morphism effect with backdrop blur.

2. **Hero Section** — Two-column grid layout:
   - Left: Headline ("Never Miss Your Campus Shuttle Again"), subheading, "Track Live Now" CTA button, and a user count indicator ("+2k Joined the flow").
   - Right: Shuttle bus photograph with a glass arrival card overlay ("Main Campus Express — Arriving in 2m" with progress bar) and floating mini-map icon.

3. **Bento Feature Grid** — Five cards in a CSS Grid:
   - **Live Tracking Map** (large) — GPS integration with 99.9% uptime badge.
   - **Smart Alerts** (green accent) — 5-minute advance notifications.
   - **Impact Score** — CO₂ savings tracker.
   - **Future Routes** — Advance schedule checking.
   - **Crowd Logic** — Real-time occupancy levels.

4. **Route Carousel** — Horizontally scrollable cards showing all four KNUST campus routes with stop counts and "LIVE" badges. Each card is color-coded to its route.

5. **Dark CTA Section** — Gradient dark background with:
   - "Join 15,000+ Students Moving Smarter" heading.
   - "Create Free Account" and "Sign In" buttons.
   - Interactive phone mockup showing a miniature version of the app with animated route lines, bus dot, stop pins, ETA chip, arrival list, and bottom navigation.

6. **Footer** — Brand, copyright, and links (Privacy Policy, Terms, Campus Map, Contact Support).

---

### 7.3 Authentication System

#### 7.3.1 Sign Up (`/signup`)

- **Fields:** Full name, email, password, confirm password.
- **Validation:** Terms and conditions checkbox required; password confirmation matching.
- **Process:** Creates a Firebase Auth account, then writes a `UserProfile` document to Firestore `users/{uid}` with role `"student"`.
- **Post-sign-up redirect:** `/map` (live tracking map).

#### 7.3.2 Login (`/login`)

- **Fields:** Email, password.
- **Features:** Password show/hide toggle, "Remember Me" checkbox.
- **Process:** Firebase `signInWithEmailAndPassword`, then fetches user profile from Firestore for role-based routing.
- **Post-login redirect:** Admin users go to `/admin`; students go to `/map`.
- **Links:** "Don't have an account? Sign Up" and "Forgot Password?".

#### 7.3.3 Forgot Password (`/forgot-password`)

- **Field:** Email address.
- **Process:** Calls a Firebase Cloud Function (`sendPasswordResetEmail`) that:
  1. Uses Firebase Admin SDK to generate a password reset link.
  2. Sends a branded HTML email via the **Resend** API with a "Reset Password" button.
  3. The reset link expires in 1 hour.
- **UI States:** Input form, loading spinner, success confirmation with "Back to Sign In" link.

#### 7.3.4 Auth State Management

The `AuthProvider` context wraps the entire application and:

- Listens to `onAuthStateChanged` from Firebase for real-time auth state.
- Caches the user profile in `localStorage` (key: `campus_transit_profile`) for instant load on return visits.
- Includes a **3-second timeout** fallback: if Firebase auth doesn't respond within 3 seconds, the user is treated as unauthenticated to prevent blank-screen hangs.
- Exposes `{ user, loading, setUser }` to all child components via `useAuth()`.

---

### 7.4 Student Dashboard (Home)

**Route:** `/home`

The primary landing screen for authenticated students, featuring:

1. **Top Bar** — "Campus Transit" brand with user avatar (initial letter) linking to profile.

2. **Hero Banner** — "Track Campus Shuttles in Real Time" with a "Track Now" button linking to `/map`.

3. **Quick Features Section** — Three tappable rows:
   - **Live Tracking** — Opens the map (`/map`).
   - **Schedule** — Opens the schedule page (`/schedule`).
   - **Estimated Arrival** — Opens the ETA bottom sheet.

4. **Recent Shuttle Activity** — Real-time cards showing buses that are currently **dwelling at a stop** (boarding passengers). Each card shows the bus name, route, and stop name with an "AT STOP" badge.

5. **ETA Bottom Sheet** — A slide-up panel:
   - **Step 1:** Select a route from a list showing route name, stop count, and active shuttle count.
   - **Step 2:** View all stops on the selected route with the ETA of the closest bus to each stop. ETAs are color-coded by urgency.

---

### 7.5 Live Map Tracking

**Route:** `/map` (student), `/admin/map` (admin)

The core feature of the application — an interactive Mapbox map centered on the KNUST campus (latitude 6.677, longitude -1.575).

#### Map Components

| Component | Description |
|---|---|
| **MapView** | Main map container. Manages bus animation, route filtering, and selection state. |
| **RouteLayer** | Renders GeoJSON polylines for all four routes. Dims non-selected routes when a filter is active. |
| **BusMarker** | Animated bus icons (color-coded PNGs) positioned along routes. Updates every 100ms. |
| **StopMarker** | Circular pin markers at each bus stop. |
| **RouteFilter** | Horizontal pill buttons: "All Routes", "Route A", "Route B", "Route C", "Route D". Filters visible buses and stops. |
| **RouteLegend** | Glass-panel legend showing route names and colors. |
| **InfoPopup** | Mapbox popup that appears on bus/stop click (details below). |

#### Bus Click Popup
- Bus name and route (color-coded badge).
- **Next stop** name with ETA in minutes.
- **"Stopped at this stop"** indicator if the bus is currently dwelling.

#### Stop Click Popup
- Stop name and route (color-coded badge).
- **Next bus** name with ETA in minutes.
- **Crowd level** — A progress bar showing estimated people waiting, categorized as:
  - **Light** (0–8 people) — Green
  - **Moderate** (9–16 people) — Amber
  - **Busy** (17+ people) — Red

#### Route Filtering
When a route filter is selected, only the buses and stops belonging to that route are displayed. This can also be triggered from the Campus Routes browser by tapping "View Detailed Route", which passes `state.activeRoute` to the map.

---

### 7.6 Campus Routes Browser

**Route:** `/studentroutes`

A searchable directory of all campus shuttle routes:

1. **Search Bar** — Filter routes by name in real time.
2. **Mini Map** — A tappable Mapbox thumbnail linking to the full map.
3. **Route Cards** — Expandable cards for each route showing:
   - Route name and color indicator.
   - Number of stops and active shuttles.
   - Expand to see the full stop list with:
     - Stop name and order number.
     - Per-stop ETA of the nearest bus.
     - Highlighted "next active stop" (the stop with the smallest ETA).
   - **"View Detailed Route"** button opens the map filtered to that route.

---

### 7.7 Schedule Viewer

**Route:** `/schedule`

Displays fixed timetable information for each route:

1. **Route Selector** — Horizontal pills for Route A through D.
2. **Route Statistics:**
   - First shuttle time
   - Last shuttle time
   - Normal frequency (e.g., "Every 20 min")
   - Peak frequency (e.g., "Every 10 min")
   - Peak hours (e.g., "12:00–01:00 PM, 03:00–06:00 PM")
3. **Notices** — Route-specific service notices (e.g., "Route C operates reduced service on weekends").
4. **Departure Times Accordion** — Three collapsible sections:
   - **Morning** (07:00 AM – 12:00 PM)
   - **Afternoon** (12:00 PM – 04:00/05:00 PM)
   - **Evening** (04:00/05:00 PM – 07:00/09:30 PM)
   
   Each section displays all departure times as small chips.

---

### 7.8 Student Profile Management

**Route:** `/profile`

Allows students to view and update their account:

1. **Profile Display** — Avatar circle with initial letter, display name, email, and role badge.
2. **Edit Profile** — Inline edit mode for display name and email. Saves to Firestore `users/{uid}` via `updateUserProfile()`.
3. **Change Password** — Slide-up bottom sheet requiring current password and new password. Uses Firebase `reauthenticateWithCredential` + `updatePassword`.
4. **Sign Out** — Clears auth state and navigates to `/landing`.

---

### 7.9 Admin Panel

**Route:** `/admin` (requires `role: "admin"`)

A sidebar-based dashboard for transit administrators with four sections:

#### 7.9.1 Route Management (`/admin/routes`)

Full CRUD for shuttle routes stored in Firestore `routes` collection:
- **Add Route:** Name + color picker (6 preset colors from the design system).
- **Edit Route:** Inline edit with update/cancel.
- **Delete Route:** Confirmation dialog before deletion.
- **Real-time sync:** Uses Firestore `onSnapshot` for live updates across tabs.

#### 7.9.2 Bus Management (`/admin/buses`)

Full CRUD for shuttle buses stored in Firestore `buses` collection:
- **Add Bus:** Name, route assignment (dropdown from existing routes), speed (degrees/tick), start position (path index).
- **Edit Bus:** All fields editable.
- **Delete Bus:** Confirmation dialog.
- **Route linking:** Each bus displays its assigned route with a color indicator.

#### 7.9.3 Stop Management (`/admin/stops`)

Full CRUD for bus stops stored in Firestore `stops` collection:
- **Add Stop:** Name, route assignment, longitude, latitude, order (sequence position on route).
- **Edit Stop:** All fields editable with GPS coordinate precision.
- **Delete Stop:** Confirmation dialog.
- **Sorted display:** Stops are sorted by route ID then order number.

#### 7.9.4 Admin Live Map (`/admin/map`)

The same `MapView` component used by students, giving administrators a real-time overview of all bus positions, routes, and crowd levels.

---

## 8. Data Models

### UserProfile

```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "admin";
  photoURL?: string;
}
```

### Route

```typescript
interface Route {
  id: string;      // "A", "B", "C", "D"
  name: string;    // e.g., "Commercial Area - KSB"
  color: string;   // Hex color code
}
```

### Stop

```typescript
interface Stop {
  id: string;                    // e.g., "A1", "B3"
  routeId: string;               // Parent route ID
  name: string;                  // e.g., "Commercial Bus Stop"
  coords: [number, number];      // [longitude, latitude]
  order: number;                 // Sequence position on route
}
```

### Bus

```typescript
interface Bus {
  id: string;           // e.g., "SH-101"
  routeId: string;      // Assigned route
  name: string;         // Display name
  pathIndex: number;    // Distance travelled along route (degrees)
  speed: number;        // Movement speed (degrees per tick)
  dwellRemaining: number; // Ticks remaining at current stop (0 = moving)
}
```

### Supporting Types

```typescript
interface ETAResult {
  stop: Stop;
  etaMinutes: number | string; // Number or "< 1"
}

interface ClosestBusResult {
  bus: Bus;
  etaMinutes: number | string;
}

type StopCrowds = Record<string, number>; // stopId → people count

type SelectionType =
  | { type: "bus"; data: Bus }
  | { type: "stop"; data: Stop }
  | null;
```

---

## 9. Algorithms and Simulation

### 9.1 Bus Movement Simulation

The map runs a **client-side bus simulation** that moves mock buses along pre-defined GPS coordinate paths:

1. **Route paths** are arrays of `[longitude, latitude]` coordinate pairs defining the exact road geometry on the KNUST campus.
2. **Cumulative distances** are pre-computed at module load for each route using Euclidean distance between consecutive path points.
3. Every **100 milliseconds**, each bus advances by its `speed` value along the cumulative distance of its route (wrapping around at the end to create a continuous loop).
4. **Binary search** is used to find the current path segment, then **linear interpolation** determines the exact map position between two GPS points.
5. When a bus crosses a stop's position, it enters a **dwell state** for a fixed number of ticks (`DWELL_TICKS`), simulating boarding time.

### 9.2 ETA Calculation Engine

Located in `src/utils/calculateETA.ts`:

- **`getETAsForBus(bus)`** — Returns ETAs to all stops on the bus's route, sorted by nearest first. Calculates the ahead-distance (with wrap-around for loops) and converts degrees to minutes using average speed.
- **`getNextStop(bus)`** — Returns the single closest upcoming stop for a bus.
- **`getClosestBusToStop(stop, buses)`** — Finds the nearest bus approaching a given stop from all buses on that route. Used for stop popups and the ETA bottom sheet.
- **`getBusPosition(bus)`** — Converts a bus's `pathIndex` (scalar distance) into a `[longitude, latitude]` coordinate via binary search and interpolation.
- **Distance conversion:** `degToMinutes(distDeg)` converts degree-based distance to minutes using the global `AVG_SPEED_DEG_PER_SEC` constant derived from the simulation tick speed.

### 9.3 Crowd Simulation

Located in `src/utils/crowdSim.ts`:

A probabilistic model that simulates passenger crowds at each bus stop:

- **Initialization:** Each stop starts with a random crowd of 15–35 people.
- **Every 3 seconds**, the simulation ticks:
  - **If a bus is dwelling at the stop:** 5–8 passengers board (crowd decreases).
  - **If no bus is present:** 70% chance that 1–3 people arrive; 15% chance that 1 person leaves (walked away).
- **Maximum capacity:** 50 people per stop.
- **Dwelling detection:** Uses stop distance along the route path with floating-point tolerance to match bus positions to stops.

Crowd levels are displayed in the map's stop popups and influence the color-coded crowd bar (Light/Moderate/Busy).

---

## 10. Backend Services

### 10.1 Firebase Authentication

- **Provider:** Email and password authentication.
- **Operations:**
  - `signUp(email, password, displayName)` — Creates auth account + Firestore profile.
  - `signIn(email, password)` — Authenticates and fetches Firestore profile.
  - `signOut()` — Signs out and clears local cache.
  - `changePassword(currentPassword, newPassword)` — Reauthenticates then updates.
  - `sendPasswordReset(email)` — Calls Cloud Function for branded reset email.
- **State management:** `onAuthStateChanged` listener with `localStorage` caching for instant re-hydration.

### 10.2 Cloud Firestore Database

**Collections:**

| Collection | Document Structure | Used By |
|---|---|---|
| `users` | `{ uid, email, displayName, role, photoURL? }` | Auth, Profile |
| `routes` | `{ id, name, color }` | Admin Route Manager |
| `buses` | `{ id, routeId, name, pathIndex, speed, dwellRemaining }` | Admin Bus Manager |
| `stops` | `{ id, routeId, name, coords, order }` | Admin Stop Manager |
| `routePaths` | `{ coordinates: [{lat, lng}] }` | Live data integration (prepared) |

Admin CRUD operations use real-time Firestore `onSnapshot` listeners for instant UI updates across all connected clients.

The student-facing map currently uses **mock data** (`mockShuttleData.ts`) with real KNUST GPS coordinates. The `shuttleData.ts` service provides Firestore integration functions (`fetchRoutes`, `fetchStops`, `fetchBuses`, `subscribeToBuses`) that are ready for live data when hardware GPS integration is deployed.

### 10.3 Firebase Cloud Functions

**Function:** `sendPasswordResetEmail` (Cloud Functions v2, callable)

- **Trigger:** Client calls via `httpsCallable`.
- **Process:**
  1. Validates the email parameter.
  2. Generates a password reset link via Firebase Admin `getAuth().generatePasswordResetLink(email)`.
  3. Sends a branded HTML email through the Resend API with the reset link.
- **Secret management:** The `RESEND_API_KEY` is stored as a Firebase secret (defined via `defineSecret`).
- **Email template:** Custom HTML with KNUST Campus Shuttle branding, green color scheme, and clear reset button.

---

## 11. Routing and Navigation

### Route Table

| Path | Component | Auth | Role | Description |
|---|---|---|---|---|
| `/` | `RootRedirect` | — | — | Redirects based on auth + onboarding state |
| `/onboarding` | `OnboardingPage` | Public | — | First-time onboarding slides |
| `/landing` | `LandingPage` | Public | — | Marketing landing page |
| `/login` | `LoginPage` | Public | — | Email/password login |
| `/signup` | `SignUpPage` | Public | — | Account registration |
| `/forgot-password` | `ForgotPasswordPage` | Public | — | Password reset request |
| `/home` | `HomePage` | Required | Student | Student dashboard |
| `/map` | `MapPage` | Required | Student | Full-screen live map |
| `/studentroutes` | `StudentRoutePage` | Required | Student | Route browser |
| `/filteredroute` | `MapView` | Required | Student | Map filtered by route |
| `/schedule` | `SchedulePage` | Required | Student | Route schedules |
| `/profile` | `StudentProfilePage` | Required | Student | Profile management |
| `/admin` | `AdminLayout` | Required | Admin | Admin panel shell |
| `/admin/routes` | `RoutesPage` | Required | Admin | Route CRUD |
| `/admin/buses` | `BusesPage` | Required | Admin | Bus CRUD |
| `/admin/stops` | `StopsPage` | Required | Admin | Stop CRUD |
| `/admin/map` | `AdminMapPage` | Required | Admin | Admin live map |

### Navigation

- **Student navigation:** Bottom tab bar (`LimelightNav`) with Home, Map, Routes, and Profile tabs.
- **Admin navigation:** Sidebar with Routes, Buses, Stops, Live Map links and a Sign Out button.
- **Code splitting:** All page components are loaded via `React.lazy()` with a single `Suspense` boundary for minimal initial bundle size.

---

## 12. Design System

The application uses the **"Kinetic Canvas"** design system:

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `primary` | `#006b0a` | Forest Lime — buttons, accents, active states |
| `primary_container` | `#59ee50` | Bright lime — highlights, badges |
| `on_primary` | `#ffffff` | Text on primary surfaces |
| `secondary` | `#ba1a1a` | Error/warning red |
| `tertiary` | `#00666d` | Deep teal accent |
| `surface` | `#f1f8f1` | Base background (light green tint) |
| `on_surface` | `#29302c` | Primary text |
| `on_surface_variant` | `#565d58` | Secondary text |

### Typography

- **Headings:** Plus Jakarta Sans (weights 600–800)
- **Body text:** Manrope (weights 400–600)
- **Loaded via:** Google Fonts (`@import` in CSS)

### Responsive Strategy

- **CSS Grid** with `auto-fit` and `minmax()` for automatic column collapse.
- **`clamp()`** for fluid typography and spacing.
- **`env(safe-area-inset-*)` and `viewport-fit: cover`** for iOS notch/home indicator safety.
- **JavaScript `--app-height` CSS variable** set from `window.innerHeight` for reliable iOS Safari viewport sizing.
- **Breakpoints:** 1024px (tablet), 640px (mobile).

---

## 13. Deployment

### Frontend (Vercel)

- **Hosting:** Vercel with automatic Git-triggered deployments.
- **SPA routing:** `vercel.json` rewrites all paths to `index.html`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Build command:** `tsc -b && vite build`
- **Output directory:** `dist/`
- **Chunk optimization:** Manual chunks for React, Firebase, and Mapbox to optimize loading:
  - `vendor-react` (React + Router) — loads first
  - `vendor-firebase` (Auth + Firestore) — loads on demand
  - `vendor-mapbox` (Map rendering) — loads only on map pages

### Backend (Firebase)

- **Project ID:** Configured in `.firebaserc`.
- **Cloud Functions:** Deployed via `firebase deploy --only functions`.
- **Firestore:** Used for user profiles and admin CRUD data.

---

## 14. Environment Variables

The following environment variables must be configured in the Vercel deployment:

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `VITE_MAPBOX_TOKEN` | Mapbox GL access token |

For Firebase Cloud Functions:

| Secret | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key for transactional emails |

---

## 15. Campus Context — KNUST Route Data

The application models four real shuttle routes on the KNUST campus:

### Route A — Commercial Area to KSB (Red)

| Order | Stop Name |
|---|---|
| 0 | Commercial Bus Stop |
| 1 | Peace Junction Bus Stop |
| 2 | Pentecost Bus Stop |
| 3 | Trinity Bus Stop |
| 4 | Casely Hayford Bus Stop |
| 5 | Peace Junction Bus Stop (Return) |

**Schedule:** 07:00 AM – 07:00 PM, every 20 min (10 min during peak)

### Route B — Brunei to KSB (Blue)

| Order | Stop Name |
|---|---|
| 0 | Brunei Bus Stop |
| 1 | Pentecost Bus Stop |
| 2 | KSB Bus Stop |
| 3 | Casely Hayford Bus Stop |
| 4 | Pentecost Bus Stop (Return) |
| 5 | Brunei Bus Stop (Return) |

**Schedule:** 07:00 AM – 07:00 PM, every 25 min (12 min during peak)

### Route C — Pharmacy to Wilkado (Yellow)

| Order | Stop Name |
|---|---|
| 0 | Pharmacy Bus Stop |
| 1 | SRC Bus Stop |
| 2 | Casely Hayford Bus Stop |
| 3 | Pentecost Bus Stop |
| 4 | KSB Bus Stop |
| 5 | Brunei Bus Stop |
| 6 | Wilkado Bus Stop |
| 7 | KSB Bus Stop (Return) |
| 8 | Pentecost Bus Stop (Return) |
| 9 | Pharmacy Bus Stop (Return) |

**Schedule:** 07:00 AM – 08:00 PM, every 30 min (15 min during peak). Reduced service on weekends.

### Route D — Pharmacy to Medical Village (Green)

| Order | Stop Name |
|---|---|
| 0 | Pharmacy Bus Stop |
| 1 | SRC Bus Stop |
| 2 | Casely Hayford Bus Stop |
| 3 | Pentecost Bus Stop |
| 4 | KSB Bus Stop |
| 5 | Brunei Bus Stop |
| 6 | Medical Village Bus Stop |
| 7 | KSB Bus Stop (Return) |
| 8 | Pentecost Bus Stop (Return) |
| 9 | Pharmacy Bus Stop (Return) |

**Schedule:** 07:00 AM – 07:30 PM, every 35 min (18 min during peak). May experience delays near Medical Village during peak hours.

### Mock Buses

| Bus ID | Name | Route | Notes |
|---|---|---|---|
| SH-101 | Shuttle-101 | A | Primary Route A shuttle |
| SH-102 | Shuttle-102 | A | Secondary Route A shuttle (offset start) |
| SH-201 | Shuttle-201 | B | Primary Route B shuttle |
| SH-301 | Shuttle-301 | C | Primary Route C shuttle |
| SH-302 | Shuttle-302 | C | Secondary Route C shuttle |
| SH-401 | Shuttle-401 | D | Primary Route D shuttle |

All buses operate on continuous loops along their assigned routes with dwell times at each stop.

---

*This document was generated on March 30, 2026.*
*Campus Shuttle Tracking System v0.0.0*
*Repository: [github.com/KwadwoOwusuAmanqua/shuttle-track](https://github.com/KwadwoOwusuAmanqua/shuttle-track)*
