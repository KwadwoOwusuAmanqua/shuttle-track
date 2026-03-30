# Campus Shuttle Tracking

A campus shuttle tracking web application that allows students to view shuttle routes, track shuttle locations in real time, and receive updates on shuttle movement around the KNUST campus.

**Live URL:** [https://shuttle-track.vercel.app](https://shuttle-track.vercel.app)

## Tech Stack

- React 19 + TypeScript + Vite 7
- Mapbox GL JS for interactive maps
- Firebase (Auth, Firestore, Cloud Functions)
- Vercel (hosting)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase and Mapbox credentials:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_MAPBOX_TOKEN=
```
