// Charts: weight line, BMI line, prayer heatmap
function WeightChart({ entries, todayKey, heightCm }) {
  // Pull last 30 days with forward-fill
  const days = [];
  let cursor = addDaysKey(todayKey, -29);
  let lastW = null;
  for (let i = 0; i < 30; i++) {
    const e = entries[cursor];
    if (e && e.weight) lastW = e.weight;
    days.push({ date: cursor, weight: lastW });
    cursor = addDaysKey(cursor, 1);
  }
  const weights = days.map(d => d.weight).filter(Boolean);
  if (weights.length < 2) {
    return <div className="empty-state">Log your weight for a couple of days to see the trend.</div>;
  }

  const W = 600, H = 160, PAD = { l: 36, r: 12, t: 16, b: 22 };
  const min = Math.min(...weights) - 0.5;
  const max = Math.max(...weights) + 0.5;
  const x = i => PAD.l + (i / (days.length - 1)) * (W - PAD.l - PAD.r);
  const y = v => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);

  const points = days.map((d, i) => d.weight ? `${x(i)},${y(d.weight)}` : null).filter(Boolean).join(" ");
  const area = `M ${x(0)},${y(days[0].weight)} ` +
    days.map((d, i) => d.weight ? `L ${x(i)},${y(d.weight)}` : "").join(" ") +
    ` L ${x(days.length - 1)},${H - PAD.b} L ${x(0)},${H - PAD.b} Z`;

  const current = weights[weights.length - 1];
  const first = weights[0];
  const delta = +(current - first).toFixed(1);

  const gridLines = 4;
  return (
    <div>
      <div className="chart-value mono">
        {current.toFixed(1)}<span className="faint" style={{ fontSize: 14 }}> kg</span>
        <span className="delta" style={{ color: delta < 0 ? "var(--success)" : delta > 0 ? "var(--fg-dim)" : "var(--fg-faint)" }}>
          {delta > 0 ? "+" : ""}{delta} over 30d
        </span>
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[...Array(gridLines)].map((_, i) => {
          const yy = PAD.t + (i / (gridLines - 1)) * (H - PAD.t - PAD.b);
          const v = max - (i / (gridLines - 1)) * (max - min);
          return (
            <g key={i}>
              <line x1={PAD.l} x2={W - PAD.r} y1={yy} y2={yy} stroke="var(--border)" strokeDasharray="2 4" />
              <text x={PAD.l - 6} y={yy + 3} textAnchor="end" fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#wgrad)" />
        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {days.map((d, i) => d.weight && entries[d.date]?.weight ? (
          <circle key={i} cx={x(i)} cy={y(d.weight)} r="2.2" fill="var(--accent)" />
        ) : null)}
        <text x={PAD.l} y={H - 6} fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">
          {shortDate(days[0].date).month} {shortDate(days[0].date).day}
        </text>
        <text x={W - PAD.r} y={H - 6} textAnchor="end" fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">
          today
        </text>
      </svg>
    </div>
  );
}

function BMIChart({ entries, todayKey, heightCm }) {
  if (!heightCm) return <div className="empty-state">Set your height to see BMI.</div>;
  const days = [];
  let cursor = addDaysKey(todayKey, -29);
  let lastW = null;
  for (let i = 0; i < 30; i++) {
    const e = entries[cursor];
    if (e && e.weight) lastW = e.weight;
    const bmi = lastW ? computeBMI(lastW, heightCm) : null;
    days.push({ date: cursor, bmi });
    cursor = addDaysKey(cursor, 1);
  }
  const vals = days.map(d => d.bmi).filter(Boolean);
  if (vals.length < 2) return <div className="empty-state">Not enough data yet.</div>;

  const W = 600, H = 160, PAD = { l: 36, r: 12, t: 16, b: 22 };
  const dataMin = Math.min(...vals), dataMax = Math.max(...vals);
  const min = Math.min(dataMin - 0.3, 18), max = Math.max(dataMax + 0.3, 26);
  const x = i => PAD.l + (i / (days.length - 1)) * (W - PAD.l - PAD.r);
  const y = v => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);

  const poly = days.map((d, i) => d.bmi ? `${x(i)},${y(d.bmi)}` : null).filter(Boolean).join(" ");
  const current = vals[vals.length - 1];
  const band = bmiBand(current);

  // Healthy band 18.5 - 24.9
  const bandTop = y(Math.min(24.9, max));
  const bandBot = y(Math.max(18.5, min));

  return (
    <div>
      <div className="chart-value mono">
        {current.toFixed(1)}
        <span className="delta" style={{ color: band === "Healthy" ? "var(--success)" : "var(--fg-dim)" }}>
          {band}
        </span>
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <rect x={PAD.l} y={bandTop} width={W - PAD.l - PAD.r} height={bandBot - bandTop}
              fill="var(--success)" opacity="0.08" />
        <line x1={PAD.l} x2={W - PAD.r} y1={y(18.5)} y2={y(18.5)} stroke="var(--border)" strokeDasharray="2 4"/>
        <line x1={PAD.l} x2={W - PAD.r} y1={y(24.9)} y2={y(24.9)} stroke="var(--border)" strokeDasharray="2 4"/>
        <text x={PAD.l - 6} y={y(18.5) + 3} textAnchor="end" fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">18.5</text>
        <text x={PAD.l - 6} y={y(24.9) + 3} textAnchor="end" fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">24.9</text>
        <polyline points={poly} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx={x(days.length - 1)} cy={y(current)} r="3" fill="var(--accent)"/>
        <text x={PAD.l} y={H - 6} fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">
          {shortDate(days[0].date).month} {shortDate(days[0].date).day}
        </text>
        <text x={W - PAD.r} y={H - 6} textAnchor="end" fontSize="9" fill="var(--fg-faint)" fontFamily="var(--font-mono)">
          today
        </text>
      </svg>
    </div>
  );
}

function PrayerHeatmap({ entries, todayKey }) {
  // Past ~6 months of prayer counts (0-5)
  const WEEKS = 26;
  const cols = WEEKS;
  const rows = 7;
  // Compute start: go back (WEEKS * 7 - 1) days
  const totalDays = cols * rows;
  const cells = [];
  let cursor = addDaysKey(todayKey, -(totalDays - 1));
  for (let i = 0; i < totalDays; i++) {
    const e = entries[cursor];
    cells.push({ date: cursor, val: e ? prayerCount(e) : 0 });
    cursor = addDaysKey(cursor, 1);
  }

  // Streak calc: consecutive days ending today with full 5/5
  let streak = 0;
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].val === 5) streak++;
    else break;
  }
  const completedThisWeek = cells.slice(-7).filter(c => c.val === 5).length;

  return (
    <div>
      <div className="chart-value mono">
        {streak}<span className="faint" style={{ fontSize: 14 }}> day streak</span>
        <span className="delta">{completedThisWeek}/7 full days this week</span>
      </div>
      <div className="heatmap" style={{ marginTop: 14 }}>
        {cells.map((c, i) => (
          <div
            key={i}
            className="hm"
            data-val={c.val}
            title={`${c.date} · ${c.val}/5`}
          />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>{shortDate(cells[0].date).month} {shortDate(cells[0].date).day}</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          less
          {[0,1,2,3,4,5].map(v => <div key={v} className="hm" data-val={v} style={{ width: 10, height: 10 }}/>)}
          more
        </span>
        <span>today</span>
      </div>
    </div>
  );
}

Object.assign(window, { WeightChart, BMIChart, PrayerHeatmap });
