# Campus Shuttle Tracking System

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [User Roles and Access Control](#5-user-roles-and-access-control)
6. [Application Flow](#6-application-flow)
7. [Features](#7-features)
8. [Data Models](#8-data-models)
9. [Algorithms and Simulation](#9-algorithms-and-simulation)
10. [Backend Services](#10-backend-services)
11. [Routing and Navigation](#11-routing-and-navigation)
12. [Design System](#12-design-system)
13. [Deployment](#13-deployment)
14. [Environment Variables](#14-environment-variables)
15. [KNUST Route Data](#15-knust-route-data)


## 1. Project Overview

Campus Shuttle Tracking is a real time web application for students and administrators at **Kwame Nkrumah University of Science and Technology (KNUST)**. It tracks campus shuttle buses on a live map, calculates estimated arrival times, simulates crowd levels at stops, displays route schedules, and provides an admin panel for managing transit data.

**Live URL:** [https://shuttle-track.vercel.app](https://shuttle-track.vercel.app)

Key capabilities:

- Real time bus tracking on an interactive Mapbox map
- ETA calculations for every bus at every stop
- Crowd level simulation at bus stops
- Schedule viewing with morning, afternoon, and evening departures for four routes
- Role based access: students see tracking features, admins manage routes/buses/stops
- Responsive design for mobile and desktop


## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (SPA)                         │
│  React 19 + TypeScript + Vite 7 + React Router 7            │
│  Mapbox GL JS for interactive maps                          │
├─────────────────────────────────────────────────────────────┤
│                     BACKEND SERVICES                        │
│  Firebase Authentication (email/password)                    │
│  Cloud Firestore (user profiles, admin CRUD)                │
│  Firebase Cloud Functions v2 (password reset email)          │
│  Resend API (transactional email delivery)                  │
├─────────────────────────────────────────────────────────────┤
│                     DEPLOYMENT                              │
│  Vercel (frontend hosting)                                  │
│  Firebase (Cloud Functions, Firestore)                      │
└─────────────────────────────────────────────────────────────┘
```

The frontend is a Single Page Application that communicates with Firebase for auth, database, and serverless functions. Bus simulation runs client side using mock data derived from real KNUST GPS coordinates.


## 3. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI component library |
| TypeScript | 5.9.3 | Static type checking |
| Vite | 7.3.1 | Build tool and dev server |
| React Router DOM | 7.13.1 | Client side routing with lazy loading |
| Mapbox GL JS | 3.19.1 | Interactive map rendering |
| react map gl | 8.1.0 | React bindings for Mapbox |
| Lucide React | 0.577.0 | SVG icon library |
| CSS Modules | built in | Scoped component styling |
| ESLint | 9.39.1 | Code linting |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Firebase SDK | 12.10.0 | Auth and Firestore client |
| Firebase Admin | 13.6.0 | Server side auth management |
| Firebase Functions | 7.0.0 | Serverless Cloud Functions (v2) |
| Resend | 6.9.4 | Transactional email API |
| Axios | 1.13.6 | HTTP client |

### Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting with automatic GitHub deployments |
| Firebase | Authentication, Firestore database, Cloud Functions |
| Mapbox | Map tile rendering and geospatial visualization |
| GitHub | Source control and CI/CD trigger |


## 4. Project Structure

```
campus-shuttle-tracking/
├── public/
│   ├── icons/                   # Bus marker icons (red, blue, yellow, green)
│   └── shuttle.jpg              # Hero image for landing page
├── functions/
│   ├── src/index.ts             # Password reset email function
│   └── package.json
├── src/
│   ├── main.tsx                 # Entry point
│   ├── router/AppRouter.tsx     # Route definitions and auth guards
│   ├── context/react-context.tsx # AuthProvider
│   ├── hooks/
│   │   ├── react-hook.tsx       # useAuth() hook
│   │   ├── useShuttleBuses.js   # Bus animation for non map pages
│   │   └── useRecentActivity.js # Buses currently at stops
│   ├── pages/
│   │   ├── OnboardingPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── HomePage.jsx
│   │   ├── auth/                # Login, SignUp, ForgotPassword
│   │   ├── student/             # Map, StudentRoutePage, StudentProfilePage
│   │   ├── common/              # SchedulePage
│   │   └── admin/               # RoutesPage, BusesPage, StopsPage, AdminMapPage
│   ├── components/
│   │   ├── common/              # ProtectedRoute, LimelightNav
│   │   ├── map/                 # MapView, BusMarker, StopMarker, RouteLayer,
│   │   │                        # RouteFilter, RouteLegend, InfoPopup, MiniMap
│   │   └── admin/               # RouteManager, BusManager, StopManager
│   ├── layouts/                 # StudentLayout, AdminLayout
│   ├── services/
│   │   ├── firebase.ts          # Firebase init
│   │   ├── auth.ts              # Auth functions
│   │   ├── shuttleData.ts       # Firestore data fetchers
│   │   ├── mockShuttleData.ts   # Mock routes, stops, buses, GPS paths
│   │   └── scheduleData.js      # Static timetable data
│   ├── types/shuttle.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── calculateETA.ts      # ETA engine
│   │   ├── crowdSim.ts          # Crowd simulation
│   │   └── getNextActiveStopId.js
│   ├── theme/colors.ts          # Design tokens
│   └── styles/                  # CSS Modules and stylesheets
├── package.json
├── vite.config.ts
├── firebase.json
└── vercel.json
```


## 5. User Roles and Access Control

| Role | Access | Assignment |
|---|---|---|
| `student` | Home, Live Map, Routes, Schedule, Profile | Default on sign up |
| `admin` | Admin Panel (Routes, Buses, Stops, Live Map) | Set manually in Firestore |

`ProtectedRoute` redirects unauthenticated users to `/landing` and enforces role restrictions. `PublicRoute` redirects logged in users away from public pages. Students cannot access `/admin` and admins cannot access student pages.


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
Login / Sign Up               Role based redirect
    │                                    │
    ▼                                    │
Role based redirect            ┌─────────┴────────┐
    │                          │                   │
┌───┴────┐                  Student             Admin
│        │                  Dashboard           Panel
▼        ▼
Student  Admin
Dashboard Panel
```

1. First time visitors land on `/onboarding` (three slides), then proceed to `/landing`.
2. Returning visitors go straight to `/landing` (localStorage flag detected).
3. After login, students go to `/home` and admins go to `/admin`.


## 7. Features

### 7.1 Onboarding

Three slide welcome screen at `/onboarding`. Slide 1: "Never Miss Your Shuttle" (commute planning). Slide 2: "Live GPS Tracking" (real time location). Slide 3: "Get ETA at Every Stop" (arrival estimates). Users can skip or advance. Completing sets a localStorage flag so returning visitors bypass it.

### 7.2 Landing Page

Marketing page at `/landing` with a sticky header, hero section with shuttle photo and glass overlay arrival card, bento feature grid (Live Tracking, Smart Alerts, Impact Score, Future Routes, Crowd Logic), scrollable route carousel with stop counts, dark CTA section with phone mockup, and footer.

### 7.3 Authentication

**Sign Up** (`/signup`): Name, email, password with confirmation, terms checkbox. Creates Firebase Auth account and Firestore profile with `student` role. Redirects to `/map`.

**Login** (`/login`): Email and password with show/hide toggle. Fetches Firestore profile for role based redirect (admin to `/admin`, student to `/map`).

**Forgot Password** (`/forgot-password`): Enters email. A Firebase Cloud Function generates a reset link via Admin SDK and sends a branded HTML email through the Resend API. Link expires in 1 hour.

**Auth State**: `AuthProvider` listens to Firebase `onAuthStateChanged`, caches profiles in localStorage, and includes a 3 second timeout to prevent blank screens if Firebase is slow.

### 7.4 Student Dashboard

Home screen at `/home`. Shows a hero banner linking to the live map, quick feature links (Live Tracking, Schedule, ETA), and real time activity cards for buses currently stopped at a station. An ETA bottom sheet lets users pick a route, then view per stop arrival times for the closest bus.

### 7.5 Live Map Tracking

Full screen Mapbox map at `/map` centered on KNUST (lat 6.677, lng -1.575). Buses animate along GPS coordinate paths, updating every 100ms. Users can filter by route (All/A/B/C/D).

Clicking a **bus** shows its name, route, next stop with ETA, and dwell status. Clicking a **stop** shows its name, route, next arriving bus with ETA, and a crowd level bar (Light/Moderate/Busy).

Crowd levels are simulated: people arrive randomly, and counts drop when a bus dwells at the stop.

### 7.6 Campus Routes Browser

Searchable route directory at `/studentroutes`. Each route card expands to show all stops with per stop ETAs, the next active stop highlighted, and a button to open the map filtered to that route. Includes a tappable mini map thumbnail.

### 7.7 Schedule Viewer

Timetable at `/schedule`. Route selector pills, statistics (first/last shuttle, frequency, peak hours), service notices, and collapsible morning/afternoon/evening departure time lists.

### 7.8 Student Profile

Profile management at `/profile`. View and edit display name and email. Change password via bottom sheet (requires current password). Sign out.

### 7.9 Admin Panel

Sidebar based dashboard at `/admin` with four sections:

**Routes** (`/admin/routes`): Create, edit, delete routes with name and color. Real time Firestore sync.

**Buses** (`/admin/buses`): Create, edit, delete buses with name, route assignment, speed, and start position.

**Stops** (`/admin/stops`): Create, edit, delete stops with name, route, GPS coordinates, and order.

**Live Map** (`/admin/map`): Same MapView as students for real time monitoring.

All admin data uses Firestore `onSnapshot` for live updates across clients.


## 8. Data Models

```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "admin";
  photoURL?: string;
}

interface Route {
  id: string;
  name: string;
  color: string;
}

interface Stop {
  id: string;
  routeId: string;
  name: string;
  coords: [number, number];  // [longitude, latitude]
  order: number;
}

interface Bus {
  id: string;
  routeId: string;
  name: string;
  pathIndex: number;       // distance along route in degrees
  speed: number;           // degrees per tick
  dwellRemaining: number;  // ticks remaining at stop (0 = moving)
}

interface ETAResult {
  stop: Stop;
  etaMinutes: number | string;
}

interface ClosestBusResult {
  bus: Bus;
  etaMinutes: number | string;
}

type StopCrowds = Record<string, number>;
```


## 9. Algorithms and Simulation

### 9.1 Bus Movement

Route paths are arrays of `[longitude, latitude]` pairs tracing real KNUST roads. Cumulative distances are precomputed at load. Every 100ms, each bus advances by its speed along the route, wrapping around to loop. A binary search finds the current path segment, then linear interpolation gives the exact map position. When a bus crosses a stop, it enters a dwell state for a fixed number of ticks (simulating boarding).

### 9.2 ETA Calculation

`getETAsForBus(bus)` computes the distance ahead to each stop (with loop wraparound) and converts to minutes. `getClosestBusToStop(stop, buses)` finds the nearest approaching bus on a stop's route. `getBusPosition(bus)` converts a scalar path index to a `[lng, lat]` coordinate.

### 9.3 Crowd Simulation

Each stop initializes with 15 to 35 people. Every 3 seconds: if a bus is dwelling, 5 to 8 people board (count drops); otherwise, there is a 70% chance 1 to 3 people arrive, and a 15% chance 1 person leaves. Max capacity is 50. Displayed as Light (0 to 8), Moderate (9 to 16), or Busy (17+).


## 10. Backend Services

### 10.1 Firebase Authentication

Email/password authentication. Functions: `signUp` (creates Auth account + Firestore profile), `signIn` (authenticates + fetches profile), `signOut`, `changePassword` (reauthenticates then updates), `sendPasswordReset` (calls Cloud Function). Auth state is tracked via `onAuthStateChanged` with localStorage caching.

### 10.2 Cloud Firestore

| Collection | Structure | Used By |
|---|---|---|
| `users` | uid, email, displayName, role | Auth, Profile |
| `routes` | id, name, color | Admin Route Manager |
| `buses` | id, routeId, name, pathIndex, speed, dwellRemaining | Admin Bus Manager |
| `stops` | id, routeId, name, coords, order | Admin Stop Manager |
| `routePaths` | coordinates array | Prepared for live GPS integration |

Admin operations use `onSnapshot` for real time sync. The student map uses mock data with real KNUST coordinates. Firestore integration functions (`fetchRoutes`, `fetchStops`, `subscribeToBuses`) are ready for when live GPS hardware is deployed.

### 10.3 Cloud Functions

`sendPasswordResetEmail`: callable v2 function. Generates a reset link via Firebase Admin SDK, sends a branded HTML email through Resend. The `RESEND_API_KEY` is stored as a Firebase secret.


## 11. Routing and Navigation

| Path | Component | Auth | Role |
|---|---|---|---|
| `/` | RootRedirect | None | None |
| `/onboarding` | OnboardingPage | Public | None |
| `/landing` | LandingPage | Public | None |
| `/login` | LoginPage | Public | None |
| `/signup` | SignUpPage | Public | None |
| `/forgot-password` | ForgotPasswordPage | Public | None |
| `/home` | HomePage | Required | Student |
| `/map` | MapPage | Required | Student |
| `/studentroutes` | StudentRoutePage | Required | Student |
| `/filteredroute` | MapView | Required | Student |
| `/schedule` | SchedulePage | Required | Student |
| `/profile` | StudentProfilePage | Required | Student |
| `/admin` | AdminLayout | Required | Admin |
| `/admin/routes` | RoutesPage | Required | Admin |
| `/admin/buses` | BusesPage | Required | Admin |
| `/admin/stops` | StopsPage | Required | Admin |
| `/admin/map` | AdminMapPage | Required | Admin |

Students use a bottom tab bar (Home, Map, Routes, Profile). Admins use a sidebar (Routes, Buses, Stops, Live Map, Sign Out). All pages are code split via `React.lazy()`.


## 12. Design System

The app uses the "Kinetic Canvas" design system.

| Token | Value | Usage |
|---|---|---|
| primary | #006b0a | Buttons, accents, active states |
| primary_container | #59ee50 | Highlights, badges |
| on_primary | #ffffff | Text on primary surfaces |
| secondary | #ba1a1a | Error/warning |
| tertiary | #00666d | Teal accent |
| surface | #f1f8f1 | Background |
| on_surface | #29302c | Primary text |

**Typography**: Plus Jakarta Sans for headings, Manrope for body text, loaded via Google Fonts.

**Responsive**: CSS Grid with `auto-fit`/`minmax()`, `clamp()` for fluid sizing, `env(safe-area-inset-*)` for iOS safety areas, JS based `--app-height` variable for iOS Safari. Breakpoints at 1024px and 640px.


## 13. Deployment

### Frontend (Vercel)

Automatic deployments triggered by GitHub pushes. SPA routing via `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Build: `tsc -b && vite build`. Output: `dist/`. Manual chunks split React, Firebase, and Mapbox for optimized loading.

### Backend (Firebase)

Cloud Functions deployed via `firebase deploy --only functions`. Firestore used for user profiles and admin CRUD.


## 14. Environment Variables

### Vercel (Frontend)

| Variable | Description |
|---|---|
| VITE_FIREBASE_API_KEY | Firebase Web API key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase Auth domain |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase storage bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| VITE_FIREBASE_APP_ID | Firebase app ID |
| VITE_FIREBASE_MEASUREMENT_ID | Firebase Analytics measurement ID |
| VITE_MAPBOX_TOKEN | Mapbox GL access token |

### Firebase (Cloud Functions)

| Secret | Description |
|---|---|
| RESEND_API_KEY | Resend API key for transactional emails |


## 15. KNUST Route Data

### Route A: Commercial Area to KSB (Red)

| Order | Stop |
|---|---|
| 0 | Commercial Bus Stop |
| 1 | Peace Junction Bus Stop |
| 2 | Pentecost Bus Stop |
| 3 | Trinity Bus Stop |
| 4 | Casely Hayford Bus Stop |
| 5 | Peace Junction Bus Stop (Return) |

Schedule: 07:00 AM to 07:00 PM, every 20 min (10 min peak)

### Route B: Brunei to KSB (Blue)

| Order | Stop |
|---|---|
| 0 | Brunei Bus Stop |
| 1 | Pentecost Bus Stop |
| 2 | KSB Bus Stop |
| 3 | Casely Hayford Bus Stop |
| 4 | Pentecost Bus Stop (Return) |
| 5 | Brunei Bus Stop (Return) |

Schedule: 07:00 AM to 07:00 PM, every 25 min (12 min peak)

### Route C: Pharmacy to Wilkado (Yellow)

| Order | Stop |
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

Schedule: 07:00 AM to 08:00 PM, every 30 min (15 min peak). Reduced service on weekends.

### Route D: Pharmacy to Medical Village (Green)

| Order | Stop |
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

Schedule: 07:00 AM to 07:30 PM, every 35 min (18 min peak). Possible delays near Medical Village during peak hours.

### Mock Buses

| Bus ID | Name | Route |
|---|---|---|
| SH 101 | Shuttle 101 | A |
| SH 102 | Shuttle 102 | A |
| SH 201 | Shuttle 201 | B |
| SH 301 | Shuttle 301 | C |
| SH 302 | Shuttle 302 | C |
| SH 401 | Shuttle 401 | D |

All buses loop continuously along their routes with dwell times at each stop.


*Generated March 30, 2026. Repository: [github.com/KwadwoOwusuAmanqua/shuttle-track](https://github.com/KwadwoOwusuAmanqua/shuttle-track)*
