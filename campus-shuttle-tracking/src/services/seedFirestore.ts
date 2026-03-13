/**
 * seedFirestore.ts — One-time utility to populate Firestore from mock data.
 *
 * Usage:
 *   1. Temporarily add this to main.tsx:
 *        import { seedFirestore } from "./services/seedFirestore";
 *        seedFirestore().then(() => console.log("Seeded!"));
 *   2. Run the app once, check the console for "Seeded!"
 *   3. Remove the import from main.tsx
 */
import { db } from "./firebase";
import { writeBatch, doc, collection, setDoc } from "firebase/firestore";
import {
  ROUTES,
  STOPS,
  MOCK_BUSES,
  ROUTE_PATHS,
} from "./mockShuttleData";

export async function seedFirestore() {
  const batch = writeBatch(db);

  // Seed routes
  for (const route of Object.values(ROUTES)) {
    batch.set(doc(collection(db, "routes"), route.id), route);
  }

  // Seed stops
  for (const stop of STOPS) {
    batch.set(doc(collection(db, "stops"), stop.id), stop);
  }

  // Seed buses
  for (const bus of MOCK_BUSES) {
    batch.set(doc(collection(db, "buses"), bus.id), bus);
  }

  await batch.commit();

  // Route paths are too large for a batch — write separately
  for (const [routeId, coordinates] of Object.entries(ROUTE_PATHS)) {
    await setDoc(doc(db, "routePaths", routeId), { routeId, coordinates });
  }

  console.log("Firestore seeded successfully.");
}
