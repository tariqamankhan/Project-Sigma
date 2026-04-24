// Edit/View modal for a single day's entry
const { useState, useEffect, useMemo, useRef } = React;

// Calorie slider — draggable horizontal track with snap steps + readout.
// Non-linear: fine-grained for small snacks, quicker for big meals.
function CalorieSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const MAX = 1500;  // visible max; values above still accepted via typing
  const v = Math.max(0, Math.min(MAX, +value || 0));
  const pct = (v / MAX) * 100;

  function setFromClientX(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // snap to nearest 10 kcal
    const raw = ratio * MAX;
    const snapped = Math.round(raw / 10) * 10;
    onChange(snapped);
  }

  useEffect(() => {
    if (!dragging) return;
    const move = e => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(x);
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragging]);

  function onKey(e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); onChange(Math.max(0, v - 10)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); onChange(Math.min(MAX, v + 10)); }
    else if (e.key === "PageDown") { e.preventDefault(); onChange(Math.max(0, v - 100)); }
    else if (e.key === "PageUp") { e.preventDefault(); onChange(Math.min(MAX, v + 100)); }
  }

  return (
    <div className={"cal-slider" + (dragging ? " is-dragging" : "")}>
      <div
        ref={trackRef}
        className="cal-track"
        onMouseDown={e => { setDragging(true); setFromClientX(e.clientX); }}
        onTouchStart={e => { setDragging(true); setFromClientX(e.touches[0].clientX); }}
      >
        <div className="cal-fill" style={{ width: `${pct}%` }} />
        {/* tick marks */}
        {[0, 250, 500, 750, 1000, 1250, 1500].map(t => (
          <div key={t} className="cal-tick" style={{ left: `${(t / MAX) * 100}%` }} />
        ))}
        <div
          className="cal-thumb"
          role="slider"
          aria-valuemin="0"
          aria-valuemax={MAX}
          aria-valuenow={v}
          tabIndex="0"
          onKeyDown={onKey}
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="cal-readout mono">
        <input
          type="number"
          value={value === "" || value == null ? "" : v}
          placeholder="0"
          onChange={e => onChange(e.target.value === "" ? "" : Math.max(0, +e.target.value))}
        />
        <span className="faint">kcal</span>
      </div>
    </div>
  );
}

// Custom workout picker — dropdown with icons and groups.
// Menu renders via portal so it's not clipped by the modal's scroll container.
function WorkoutPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const updatePos = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r) return;
      const menuW = Math.max(260, r.width);
      const vh = window.innerHeight;
      // If not enough room below, open upward
      const spaceBelow = vh - r.bottom;
      const menuH = 280;
      const above = spaceBelow < menuH + 12 && r.top > menuH + 12;
      setMenuPos({
        left: Math.max(8, Math.min(window.innerWidth - menuW - 8, r.left)),
        top: above ? r.top - menuH - 6 : r.bottom + 6,
        width: menuW,
      });
    };
    updatePos();
    const onDoc = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onDoc);
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("mousedown", onDoc);
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open]);

  const groups = {};
  for (const k of WORKOUT_KINDS) {
    if (!groups[k.group]) groups[k.group] = [];
    groups[k.group].push(k);
  }

  const current = WORKOUT_KINDS.find(k => k.name === value) || WORKOUT_KINDS[0];

  return (
    <div className={"wk-picker" + (open ? " open" : "")} ref={wrapRef}>
      <button type="button" ref={triggerRef} className="wk-trigger" onClick={() => setOpen(o => !o)}>
        <span className="wk-icon">{workoutIconFor(current.name)}</span>
        <span className="wk-label">{current.name}</span>
        <span className="wk-caret"><Icon.Chevron style={{ transform: "rotate(90deg)" }}/></span>
      </button>
      {open && menuPos && ReactDOM.createPortal(
        <div
          ref={menuRef}
          className="wk-menu wk-menu-portal"
          style={{ left: menuPos.left, top: menuPos.top, width: menuPos.width }}
        >
          {Object.entries(groups).map(([group, items]) => (
            <div className="wk-group" key={group}>
              <div className="wk-group-label">{group}</div>
              <div className="wk-options">
                {items.map(k => (
                  <button
                    type="button"
                    key={k.name}
                    className={"wk-opt" + (k.name === value ? " on" : "")}
                    onClick={() => { onChange(k.name); setOpen(false); }}
                  >
                    <span className="wk-icon">{workoutIconFor(k.name)}</span>
                    <span>{k.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

function DayModal({ entry, isToday, onClose, onSave, onDelete, prevWeight }) {
  const [draft, setDraft] = useState(() => ({
    ...entry,
    food: entry.food.length ? entry.food : [{ name: "", calories: "" }],
    workouts: entry.workouts.length ? entry.workouts : [],
    prayers: entry.prayers.slice(),
    weight: entry.weight ?? "",
  }));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function setFood(i, key, val) {
    setDraft(d => {
      const food = d.food.slice();
      food[i] = { ...food[i], [key]: val };
      return { ...d, food };
    });
  }
  function addFood() {
    setDraft(d => ({ ...d, food: [...d.food, { name: "", calories: "" }] }));
  }
  function removeFood(i) {
    setDraft(d => ({ ...d, food: d.food.filter((_, idx) => idx !== i) }));
  }

  function setWorkout(i, key, val) {
    setDraft(d => {
      const workouts = d.workouts.slice();
      workouts[i] = { ...workouts[i], [key]: val };
      return { ...d, workouts };
    });
  }
  function addWorkout() {
    setDraft(d => ({ ...d, workouts: [...d.workouts, { kind: "Run", minutes: "", notes: "" }] }));
  }
  function removeWorkout(i) {
    setDraft(d => ({ ...d, workouts: d.workouts.filter((_, idx) => idx !== i) }));
  }

  function togglePrayer(i) {
    setDraft(d => {
      const prayers = d.prayers.slice();
      prayers[i] = prayers[i] ? 0 : 1;
      return { ...d, prayers };
    });
  }

  function save() {
    // Clean up empty food/workout rows
    const cleaned = {
      ...draft,
      food: draft.food
        .filter(f => (f.name || "").trim() || f.calories)
        .map(f => ({ name: (f.name || "").trim(), calories: +f.calories || 0 })),
      workouts: draft.workouts
        .filter(w => (w.kind || "").trim() && (w.minutes !== "" || (w.notes || "").trim()))
        .map(w => ({ kind: w.kind, minutes: +w.minutes || 0, notes: (w.notes || "").trim() })),
      weight: draft.weight === "" ? null : +draft.weight,
    };
    onSave(cleaned);
  }

  const totalCals = draft.food.reduce((s, f) => s + (+f.calories || 0), 0);
  const totalMin = draft.workouts.reduce((s, w) => s + (+w.minutes || 0), 0);
  const effectiveWeight = draft.weight === "" || draft.weight == null ? prevWeight : +draft.weight;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{prettyDate(entry.date).split(",")[1]?.trim() || prettyDate(entry.date)}</h3>
            <div className="date-sub">{prettyDate(entry.date).split(",")[0]}{isToday ? " · Today" : ""}</div>
          </div>
          <button className="modal-close" onClick={onClose}><Icon.Close /></button>
        </div>

        <div className="modal-body">

          {/* Prayers */}
          <div className="fsection">
            <h4>Prayers</h4>
            <div className="prayer-row">
              {PRAYERS.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  className={"prayer-chip" + (draft.prayers[i] ? " on" : "")}
                  onClick={() => togglePrayer(i)}
                >
                  <span className="dot" />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Food */}
          <div className="fsection">
            <h4>Food — what did you eat?</h4>
            <div>
              {draft.food.map((f, i) => (
                <div className="food-line" key={i}>
                  <input
                    type="text"
                    placeholder="e.g. chicken wrap, banana…"
                    value={f.name}
                    onChange={e => setFood(i, "name", e.target.value)}
                  />
                  <CalorieSlider
                    value={f.calories}
                    onChange={val => setFood(i, "calories", val)}
                  />
                  <button className="icon-btn" onClick={() => removeFood(i)} title="Remove">
                    <Icon.Trash />
                  </button>
                </div>
              ))}
              <button className="add-line" onClick={addFood}>
                + add another item
              </button>
            </div>
            <div className="food-total">
              <span>Today's total calories</span>
              <b className="mono">{totalCals.toLocaleString()} <span className="faint">kcal</span></b>
            </div>
          </div>

          {/* Workouts */}
          <div className="fsection">
            <h4>Workout</h4>
            {draft.workouts.length === 0 && (
              <div className="empty-state">No workout logged yet.</div>
            )}
            {draft.workouts.map((w, i) => (
              <div className="workout-line" key={i}>
                <WorkoutPicker
                  value={w.kind}
                  onChange={val => setWorkout(i, "kind", val)}
                />
                <input
                  className="mono"
                  type="number"
                  placeholder="min"
                  value={w.minutes}
                  onChange={e => setWorkout(i, "minutes", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="notes (e.g. Push day — bench, OHP)"
                  value={w.notes}
                  onChange={e => setWorkout(i, "notes", e.target.value)}
                />
                <button className="icon-btn" onClick={() => removeWorkout(i)} title="Remove">
                  <Icon.Trash />
                </button>
              </div>
            ))}
            <button className="add-line" onClick={addWorkout}>
              + add workout
            </button>
            <div className="workout-total">
              <span>Today's total workout</span>
              <b className="mono">{totalMin} <span className="faint">min</span></b>
            </div>
          </div>

          {/* Weight */}
          <div className="fsection">
            <h4>Weight</h4>
            <div className="inline-fields">
              <div className="field">
                <label>Weight (kg)</label>
                <input
                  className="mono"
                  type="number"
                  step="0.1"
                  placeholder={prevWeight ? String(prevWeight) : "—"}
                  value={draft.weight}
                  onChange={e => setDraft(d => ({ ...d, weight: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>BMI</label>
                <input
                  readOnly
                  className="mono"
                  value={(() => {
                    const bmi = computeBMI(effectiveWeight, window.__profile?.heightCm);
                    return bmi ? `${bmi} · ${bmiBand(bmi)}` : "—";
                  })()}
                  style={{ color: "var(--fg-dim)" }}
                />
              </div>
              <div className="field">
                <label>vs. last entry</label>
                <input
                  readOnly
                  className="mono"
                  value={(() => {
                    if (!effectiveWeight || !prevWeight || effectiveWeight === prevWeight) return "—";
                    const d = +(effectiveWeight - prevWeight).toFixed(1);
                    return `${d > 0 ? "+" : ""}${d} kg`;
                  })()}
                  style={{ color: "var(--fg-dim)" }}
                />
              </div>
            </div>
            {draft.weight === "" && prevWeight && (
              <div className="faint" style={{ fontSize: 11, marginTop: 8 }}>
                Not entered — using latest recorded weight of {prevWeight} kg.
              </div>
            )}
          </div>

        </div>

        <div className="modal-foot">
          <button className="btn ghost danger" onClick={() => onDelete(entry.date)}>
            Clear day
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={save}>
              <Icon.Check /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DayModal });
