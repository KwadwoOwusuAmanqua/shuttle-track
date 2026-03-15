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
import type { Route } from "../../types/shuttle";

const COLORS = ["#E63946", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4"];

export default function RouteManager() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [editTarget, setEditTarget] = useState<Route | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, "routes"), (snap) => {
      setRoutes(snap.docs.map((d) => ({ ...(d.data() as Route), id: d.id })));
    });
  }, []);

  function startEdit(route: Route) {
    setEditTarget(route);
    setName(route.name);
    setColor(route.color);
  }

  function cancelEdit() {
    setEditTarget(null);
    setName("");
    setColor(COLORS[0]);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        await updateDoc(doc(db, "routes", editTarget.id), { name, color });
      } else {
        await addDoc(collection(db, "routes"), { name, color });
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this route?")) return;
    await deleteDoc(doc(db, "routes", id));
  }

  return (
    <div className="manager">
      <h2>Routes</h2>

      <div className="manager-form">
        <h3>{editTarget ? "Edit Route" : "Add Route"}</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Route name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {COLORS.map((c) => (
              <option key={c} value={c} style={{ backgroundColor: c, color: "#fff" }}>
                {c}
              </option>
            ))}
          </select>
          <span
            className="color-preview"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : editTarget ? "Update" : "Add Route"}
          </button>
          {editTarget && (
            <button className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="manager-list">
        {routes.map((route) => (
          <div key={route.id} className="list-item">
            <span
              className="color-dot"
              style={{ backgroundColor: route.color }}
            />
            <span className="item-name">{route.name}</span>
            <span className="item-id">ID: {route.id}</span>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => startEdit(route)}>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(route.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {routes.length === 0 && (
          <p className="empty-msg">No routes yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
