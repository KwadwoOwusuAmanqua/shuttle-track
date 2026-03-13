import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Bus, Route } from "../../types/shuttle";

export default function BusManager() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [form, setForm] = useState<Omit<Bus, "id">>({
    routeId: "",
    name: "",
    pathIndex: 0,
    speed: 0.004,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubBuses = onSnapshot(collection(db, "buses"), (snap) => {
      setBuses(snap.docs.map((d) => ({ ...(d.data() as Bus), id: d.id })));
    });
    const unsubRoutes = onSnapshot(collection(db, "routes"), (snap) => {
      setRoutes(snap.docs.map((d) => ({ ...(d.data() as Route), id: d.id })));
    });
    return () => { unsubBuses(); unsubRoutes(); };
  }, []);

  function startEdit(bus: Bus) {
    setEditId(bus.id);
    setForm({
      routeId: bus.routeId,
      name: bus.name,
      pathIndex: bus.pathIndex,
      speed: bus.speed,
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ routeId: "", name: "", pathIndex: 0, speed: 0.004 });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.routeId) return;
    setSaving(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "buses", editId), { ...form });
      } else {
        await addDoc(collection(db, "buses"), { ...form });
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this bus?")) return;
    await deleteDoc(doc(db, "buses", id));
  }

  return (
    <div className="manager">
      <h2>Buses</h2>

      <div className="manager-form">
        <h3>{editId ? "Edit Bus" : "Add Bus"}</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Bus name"
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
            Speed (deg/tick)
            <input
              type="number"
              step="0.001"
              min="0.001"
              max="0.02"
              value={form.speed}
              onChange={(e) => setForm({ ...form, speed: parseFloat(e.target.value) })}
            />
          </label>
          <label>
            Start position
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.pathIndex}
              onChange={(e) => setForm({ ...form, pathIndex: parseFloat(e.target.value) })}
            />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : editId ? "Update" : "Add Bus"}
          </button>
          {editId && (
            <button className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="manager-list">
        {buses.map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId);
          return (
            <div key={bus.id} className="list-item">
              <span
                className="color-dot"
                style={{ backgroundColor: route?.color ?? "#ccc" }}
              />
              <span className="item-name">{bus.name}</span>
              <span className="item-id">Route {bus.routeId}</span>
              <div className="item-actions">
                <button className="btn-edit" onClick={() => startEdit(bus)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(bus.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {buses.length === 0 && (
          <p className="empty-msg">No buses yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
