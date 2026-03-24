import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Stop, Route } from "../../types/shuttle";

export default function StopManager() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [form, setForm] = useState<Omit<Stop, "id">>({
    routeId: "",
    name: "",
    coords: [0, 0],
    order: 0,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const targetRef= useRef();

  useEffect(() => {
    const unsubStops = onSnapshot(collection(db, "stops"), (snap) => {
      setStops(
        snap.docs
          .map((d) => ({ ...(d.data() as Stop), id: d.id }))
          .sort((a, b) => a.routeId.localeCompare(b.routeId) || a.order - b.order)
      );
    });
    const unsubRoutes = onSnapshot(collection(db, "routes"), (snap) => {
      setRoutes(snap.docs.map((d) => ({ ...(d.data() as Route), id: d.id })));
    });
    return () => { unsubStops(); unsubRoutes(); };
  }, []);

  function startEdit(stop: Stop) {
    setEditId(stop.id);
    setForm({
      routeId: stop.routeId,
      name: stop.name,
      coords: stop.coords,
      order: stop.order,
    });

    setTimeout(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' // Ensure it scrolls to the top of the header
      });
    }
  }, 0);
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ routeId: "", name: "", coords: [0, 0], order: 0 });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.routeId) return;
    setSaving(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "stops", editId), { ...form });
      } else {
        await addDoc(collection(db, "stops"), { ...form });
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this stop?")) return;
    await deleteDoc(doc(db, "stops", id));
  }

  return (
    <div className="manager">
      <h2>Stops</h2>

      <div className="manager-form">
        <h3 ref={targetRef}>{editId ? "Edit Stop" : "Add Stop"}</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Stop name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.routeId}
            onChange={(e) => setForm({ ...form, routeId: e.target.value })}
          >
            <option value="">Select route</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>
            Longitude
            <input
              type="number"
              step="0.0001"
              value={form.coords[0]}
              onChange={(e) =>
                setForm({
                  ...form,
                  coords: [parseFloat(e.target.value), form.coords[1]],
                })
              }
            />
          </label>
          <label>
            Latitude
            <input
              type="number"
              step="0.0001"
              value={form.coords[1]}
              onChange={(e) =>
                setForm({
                  ...form,
                  coords: [form.coords[0], parseFloat(e.target.value)],
                })
              }
            />
          </label>
          <label>
            Order
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: parseInt(e.target.value, 10) })
              }
            />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : editId ? "Update" : "Add Stop"}
          </button>
          {editId && (
            <button className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="manager-list">
        {stops.map((stop) => {
          const route = routes.find((r) => r.id === stop.routeId);
          return (
            <div key={stop.id} className="list-item">
              <span
                className="color-dot"
                style={{ backgroundColor: route?.color ?? "#ccc" }}
              />
              <span className="item-name">{stop.name}</span>
              <span className="item-id">
                Route {stop.routeId} · Order {stop.order}
              </span>
              <div className="item-actions">
                <button className="btn-edit" onClick={() => startEdit(stop)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(stop.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {stops.length === 0 && (
          <p className="empty-msg">No stops yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
