// Main App — auth flow, day rows, today header, charts
const { useState: useState2, useEffect: useEffect2, useMemo: useMemo2, useRef: useRef2 } = React;

const STORAGE_KEY = "sigma.tracker.v1";
const PROFILE_KEY = "sigma.profile.v1";
const AUTH_KEY = "sigma.auth.v1";

function useLocalState(key, initial) {
  const [state, setState] = useState2(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return typeof initial === "function" ? initial() : initial;
  });
  useEffect2(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

/* -------- Sign in screen (Google OAuth) -------- */
function SignIn({ onSignIn }) {
  const [loading, setLoading] = useState2(false);
  const [error, setError] = useState2(null);

  useEffect2(() => {
    // Check for stored auth on mount
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      onSignIn(storedAuth);
      return;
    }

    // Wait for Google Sign-In library to load
    const waitForGoogle = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(waitForGoogle);
        try {
          initializeGoogleSignIn(handleSignInSuccess, handleSignInError);
          // Render the Google Sign-In button
          renderGoogleSignInButton("google-signin-button");
        } catch (err) {
          console.error("Failed to initialize Google Sign-In:", err);
          setError("Failed to initialize Google Sign-In. Please ensure GOOGLE_CLIENT_ID is set in auth.jsx");
        }
      }
    }, 100);

    return () => clearInterval(waitForGoogle);
  }, [onSignIn]);

  function handleSignInSuccess(userProfile) {
    setLoading(false);
    storeAuth(userProfile);
    onSignIn(userProfile);
  }

  function handleSignInError(error) {
    console.error("Sign-in failed:", error);
    setLoading(false);
    setError("Sign-in failed. Please try again.");
  }

  // Fallback button if Google Sign-In doesn't load
  function handleFallbackClick() {
    setLoading(true);
    setError(null);
    // This will trigger Google Sign-In credential callback
    if (window.google && window.google.accounts) {
      // You can trigger programmatic sign-in here if needed
      setLoading(false);
      setError("Please click the Google Sign-In button below.");
    }
  }

  return (
    <div className="signin">
      <div className="signin-card">
        <div className="brand">sig<em>ma</em></div>
        <div className="tag">your personal tracker</div>
        
        {error && (
          <div style={{
            padding: 12,
            marginBottom: 16,
            backgroundColor: "rgba(255, 100, 100, 0.1)",
            border: "1px solid rgba(255, 100, 100, 0.3)",
            borderRadius: 6,
            fontSize: 13,
            color: "var(--text-secondary)",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <div id="google-signin-button" style={{ display: "flex", justifyContent: "center", marginBottom: 16 }} />

        {loading && (
          <button className="google-btn" disabled>
            <Icon.Google />
            Signing in…
          </button>
        )}
      </div>
    </div>
  );
}

/* -------- Greeting splash -------- */
function Greeting({ name, onDone }) {
  useEffect2(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  const hour = new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: PST_TZ });
  const h = parseInt(hour, 10);
  const greeting = h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="splash">
      <div className="splash-inner">
        <div className="sub">{greeting}</div>
        <div className="hello">Hello, <em>{name}</em>.</div>
        <div className="sub" style={{ marginTop: 20 }}>— {prettyDate(pstDateKey())} —</div>
      </div>
    </div>
  );
}

/* -------- Day row -------- */
function DayRow({ entry, isToday, isFuture, onClick }) {
  const { day, month, weekday } = shortDate(entry.date);
  const cal = totalCalories(entry);
  const min = totalWorkoutMinutes(entry);
  const firstKind = entry.workouts[0]?.kind;

  if (isFuture) {
    return (
      <div className="row" style={{ cursor: "default", opacity: 0.45 }}>
        <div className="date-cell">
          <span className="day">{day}</span>
          <span className="month">{month} · {weekday}</span>
        </div>
        <div className="previews">
          <div className="faint" style={{ fontStyle: "italic", fontSize: 13 }}>
            Unlocks at 12:00 AM PST
          </div>
        </div>
        <div />
      </div>
    );
  }

  return (
    <div className={"row" + (isToday ? " is-today" : "")} onClick={onClick}>
      <div className="date-cell">
        <span className="day">{day}</span>
        <span className="month">{month} · {weekday}</span>
      </div>
      <div className="previews">
        <div className={"preview" + (cal ? "" : " empty")}>
          <span className="pv-icon"><Icon.Flame /></span>
          <span className="pv-value">{cal ? cal.toLocaleString() : "—"}</span>
          {cal ? <span className="pv-unit">kcal</span> : null}
        </div>
        <div className={"preview" + (entry.workouts.length ? "" : " empty")}>
          <span className="pv-icon">{firstKind ? workoutIconFor(firstKind) : <Icon.Dumbbell />}</span>
          <span className="pv-value">
            {entry.workouts.length
              ? (firstKind === "Rest" && !min ? "Rest" : `${min} min`)
              : "—"}
          </span>
          {firstKind && firstKind !== "Rest" && <span className="pv-unit">{firstKind.toLowerCase()}</span>}
        </div>
        <div className={"preview" + (entry.weight ? "" : " empty")}>
          <span className="pv-icon"><Icon.Scale /></span>
          <span className="pv-value">{entry.weight ? entry.weight.toFixed(1) : "—"}</span>
          {entry.weight ? <span className="pv-unit">kg</span> : null}
        </div>
        <div className="preview">
          <span className="pv-icon"><Icon.Prayer /></span>
          <div className="prayer-dots">
            {entry.prayers.map((p, i) => <div key={i} className={"pd" + (p ? " on" : "")} title={PRAYERS[i]}/>)}
          </div>
        </div>
      </div>
      <div className="chev"><Icon.Chevron /></div>
    </div>
  );
}

/* -------- Main tracker screen -------- */
function Tracker({ user, onSignOut, tweaks, setTweaks }) {
  const [profile, setProfile] = useLocalState(PROFILE_KEY, {
    heightCm: 178,
    age: 28,
    sex: "m",
    activity: 1.55,
  });
  window.__profile = profile;

  const [todayKey, setTodayKey] = useState2(() => pstDateKey());
  const [entries, setEntries] = useLocalState(STORAGE_KEY, () => ({}));
  const [openKey, setOpenKey] = useState2(null);
  const [showSettings, setShowSettings] = useState2(false);

  // Open settings on first login if no data exists
  useEffect2(() => {
    if (Object.keys(entries).length === 0) {
      setShowSettings(true);
    }
  }, []);

  // Midnight PST rollover — check every 30s
  useEffect2(() => {
    const tick = () => {
      const k = pstDateKey();
      setTodayKey(prev => prev === k ? prev : k);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Build full list of days (past 60 + today) — only include days with actual data
  const allDays = useMemo2(() => {
    const days = [];
    for (let i = 0; i < 60; i++) {
      const key = addDaysKey(todayKey, -i);
      if (entries[key]) {  // Only include if entry has actual data
        days.push(entries[key]);
      }
    }
    return days;
  }, [entries, todayKey]);

  const [pageCount, setPageCount] = useState2(1);
  const visibleDays = useMemo2(() => allDays.slice(0, pageCount * 10), [allDays, pageCount]);
  const hasMore = visibleDays.length < allDays.length;

  const todayEntry = entries[todayKey] || emptyEntry(todayKey);
  const latestW = latestWeight(entries, todayKey);
  const weightForToday = todayEntry.weight || latestW;
  const calorieGoal = estimatedDailyCalories({
    weightKg: weightForToday,
    heightCm: profile.heightCm,
    age: profile.age,
    sex: profile.sex,
    activity: profile.activity,
  });
  const todayCals = totalCalories(todayEntry);
  const todayMin = totalWorkoutMinutes(todayEntry);
  const todayPrayers = prayerCount(todayEntry);
  const todayBMI = computeBMI(weightForToday, profile.heightCm);

  function saveEntry(updated) {
    setEntries(e => ({ ...e, [updated.date]: updated }));
    setOpenKey(null);
    // Sync to backend
    syncEntryData(user.googleId, updated.date, updated);
  }
  function clearDay(key) {
    setEntries(e => ({ ...e, [key]: emptyEntry(key) }));
    setOpenKey(null);
    // Sync to backend
    deleteEntryData(user.googleId, key);
  }

  // Sync profile changes to backend
  useEffect2(() => {
    syncProfileData(user.googleId, profile);
  }, [profile, user.googleId]);

  function prevWeightFor(key) {
    const dayBefore = addDaysKey(key, -1);
    return latestWeight(entries, dayBefore);
  }

  const openEntry = openKey ? (entries[openKey] || emptyEntry(openKey)) : null;

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-left">
          <div className="brand-mark">sig<em>ma</em></div>
          <div className="today-chip mono">{prettyDate(todayKey).toUpperCase()}</div>
        </div>
        <div className="user-chip">
          <div className="avatar">{user.firstName[0]}</div>
          <span>{user.firstName}</span>
          <button onClick={() => setShowSettings(true)} title="Profile & settings">settings</button>
          <button onClick={onSignOut} title="Sign out">sign out</button>
        </div>
      </div>

      {/* Today */}
      <div className="section-head">
        <h2>Today</h2>
        <div className="meta mono">{shortDate(todayKey).weekday.toUpperCase()}</div>
      </div>
      <div className="today-card">
        <div>
          <div className="weekday">{shortDate(todayKey).weekday.toUpperCase()}</div>
          <div className="date serif">{shortDate(todayKey).month} {shortDate(todayKey).day}</div>
          <div className="quick-stats" style={{ marginTop: 14 }}>
            <span><b className="mono">{todayCals.toLocaleString()}</b> / {calorieGoal.toLocaleString()} kcal</span>
            <span><b className="mono">{todayMin}</b> min workout</span>
            <span><b className="mono">{todayPrayers}</b>/5 prayers</span>
            {weightForToday && <span><b className="mono">{weightForToday.toFixed(1)}</b> kg{todayBMI ? ` · BMI ${todayBMI}` : ""}</span>}
          </div>
        </div>
        <div className="today-actions">
          <button className="btn primary" onClick={() => setOpenKey(todayKey)}>
            <Icon.Plus /> Log today
          </button>
        </div>
      </div>

      {/* Rows */}
      {allDays.length > 0 && (
        <>
          <div className="section-head">
            <h2>History</h2>
            <div className="meta mono">SHOWING {visibleDays.length} OF {allDays.length} · CLICK ROW TO EDIT</div>
          </div>
          <div className={"rows density-" + tweaks.density}>
            {visibleDays.map(e => (
              <DayRow
                key={e.date}
                entry={e}
                isToday={e.date === todayKey}
                isFuture={false}
                onClick={() => setOpenKey(e.date)}
              />
            ))}
          </div>
          {hasMore && (
            <div className="view-more-wrap">
              <button className="view-more" onClick={() => setPageCount(p => p + 1)}>
                View more history
                <span className="count">+{Math.min(10, allDays.length - visibleDays.length)}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Charts */}
      {allDays.length > 0 && (
        <>
          <div className="section-head" style={{ marginTop: 40 }}>
            <h2>Progress</h2>
            <div className="meta mono">30-DAY VIEW</div>
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Weight</h3>
              <div className="chart-sub">KG · 30 DAYS</div>
              <WeightChart entries={entries} todayKey={todayKey} heightCm={profile.heightCm} />
            </div>
            <div className="chart-card">
              <h3>BMI</h3>
              <div className="chart-sub">HEALTHY BAND 18.5 – 24.9</div>
              <BMIChart entries={entries} todayKey={todayKey} heightCm={profile.heightCm} />
            </div>
            <div className="chart-card full">
              <h3>Prayer streak</h3>
              <div className="chart-sub">LAST 26 WEEKS · FULL 5/5 IN SOLID ACCENT</div>
              <PrayerHeatmap entries={entries} todayKey={todayKey} />
            </div>
          </div>
        </>
      )}

      {openEntry && (
        <DayModal
          entry={openEntry}
          isToday={openEntry.date === todayKey}
          onClose={() => setOpenKey(null)}
          onSave={saveEntry}
          onDelete={clearDay}
          prevWeight={prevWeightFor(openEntry.date)}
        />
      )}

      {showSettings && (
        <SettingsModal
          profile={profile}
          setProfile={setProfile}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function SettingsModal({ profile, setProfile, onClose }) {
  const [p, setP] = useState2(profile);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 420 }}>
        <div className="modal-head">
          <div>
            <h3>Profile</h3>
            <div className="date-sub">USED TO COMPUTE BMI & CALORIE GOAL</div>
          </div>
          <button className="modal-close" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body">
          <div className="fsection">
            <div className="inline-fields">
              <div className="field">
                <label>Height (cm)</label>
                <input className="mono" type="number" value={p.heightCm}
                  onChange={e => setP({ ...p, heightCm: +e.target.value })}/>
              </div>
              <div className="field">
                <label>Age</label>
                <input className="mono" type="number" value={p.age}
                  onChange={e => setP({ ...p, age: +e.target.value })}/>
              </div>
              <div className="field">
                <label>Sex</label>
                <select value={p.sex} onChange={e => setP({ ...p, sex: e.target.value })}
                  style={{ background: "var(--bg-elev-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", width: "100%" }}>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </div>
            </div>
            <div className="field" style={{ marginTop: 14 }}>
              <label>Activity level</label>
              <select value={p.activity} onChange={e => setP({ ...p, activity: +e.target.value })}
                style={{ background: "var(--bg-elev-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", width: "100%" }}>
                <option value="1.2">Sedentary</option>
                <option value="1.375">Light (1-3 days/wk)</option>
                <option value="1.55">Moderate (3-5 days/wk)</option>
                <option value="1.725">Active (6-7 days/wk)</option>
                <option value="1.9">Very active</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => { setProfile(p); onClose(); }}>
            <Icon.Check /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------- Root -------- */
function App() {
  const [auth, setAuth] = useLocalState(AUTH_KEY, null);
  const [showGreeting, setShowGreeting] = useState2(false);

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "matte",
    "density": "compact"
  }/*EDITMODE-END*/;

  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);

  useEffect2(() => {
    document.body.className = "theme-" + tweaks.theme;
  }, [tweaks.theme]);

  function signIn(user) {
    setAuth(user);
    setShowGreeting(true);
  }
  function signOut() {
    signOutGoogle();  // Call Google sign-out
    setAuth(null);
    setShowGreeting(false);
  }

  // Deep ocean: rising bubbles + cursor-reactive particle canvas
  useEffect2(() => {
    const root = document.querySelector(".ocean");
    if (!root) {
      console.warn("Ocean element not found");
      return;
    }
    console.log("Ocean effect initialized");

    // Spawn 14 slow bubbles at random positions
    const bubbles = [];
    for (let i = 0; i < 14; i++) {
      const b = document.createElement("div");
      b.className = "bubble";
      const size = 4 + Math.random() * 14;
      b.style.width = b.style.height = size + "px";
      b.style.left = (Math.random() * 100) + "%";
      b.style.bottom = "-40px";
      b.style.setProperty("--dur", (14 + Math.random() * 16) + "s");
      b.style.setProperty("--delay", (-Math.random() * 20) + "s");
      b.style.setProperty("--sway", ((Math.random() - 0.5) * 80) + "px");
      root.appendChild(b);
      bubbles.push(b);
    }

    // Particle canvas — tiny specks that drift; cursor stirs them
    const canvas = document.createElement("canvas");
    canvas.className = "ocean-canvas";
    root.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 70;
    const particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.12,
        r: 0.6 + Math.random() * 1.4,
        a: 0.15 + Math.random() * 0.4,
      });
    }

    let mx = -9999, my = -9999, mActive = false;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; mActive = true; };
    const onLeave = () => { mActive = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const accentRgb = () => {
      // Pull accent color; fall back to warm white
      const cs = getComputedStyle(document.body).getPropertyValue("--accent").trim();
      return cs || "#e8a063";
    };
    let accent = accentRgb();
    const refreshAccent = () => { accent = accentRgb(); };
    const obs = new MutationObserver(refreshAccent);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        // Cursor stirring — gentle push away within 120px
        if (mActive) {
          const dx = p.x - mx, dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 120) * 0.6;
            p.vx += (dx / d) * f * 0.08;
            p.vy += (dy / d) * f * 0.08;
          }
        }
        // Gentle drift + slight return to upward float
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 - 0.003;
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        ctx.beginPath();
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      obs.disconnect();
      bubbles.forEach(b => b.remove());
      canvas.remove();
    };
  }, [auth]);

  if (!auth) return <SignIn onSignIn={signIn} />;

  return (
    <>
      <div className="ocean" aria-hidden="true" />
      <Tracker user={auth} onSignOut={signOut} tweaks={tweaks} setTweaks={setTweaks} />
      {showGreeting && <Greeting name={auth.firstName} onDone={() => setShowGreeting(false)} />}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio
          label="Palette"
          value={tweaks.theme}
          onChange={(v) => setTweaks("theme", v)}
          options={[
            { value: "matte", label: "Matte" },
            { value: "warm", label: "Warm" },
            { value: "electric", label: "Electric" },
          ]}
        />
        <TweakSection label="Row density" />
        <TweakRadio
          label="Rows"
          value={tweaks.density}
          onChange={(v) => setTweaks("density", v)}
          options={[
            { value: "rich", label: "Rich" },
            { value: "compact", label: "Compact" },
          ]}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
