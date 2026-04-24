// Small inline SVG icons (stroke-based, minimal). All use currentColor.
const Icon = {
  Plus: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  Close: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Chevron: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  Trash: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>,
  Edit: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 3l4 4-12 12H5v-4z"/></svg>,
  Flame: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 1-2.5C10 9 8 11 8 14a6 6 0 0012 0c0-5-5-8-8-12z"/></svg>,
  Moon: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>,
  Scale: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 10l2 3h4l2-3"/></svg>,
  Dumbbell: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></svg>,
  Run: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="15" cy="4" r="2"/><path d="M6 20l3-4 3 2 2-4 3 3M9 11l3-3 3 2 2-2"/></svg>,
  Bike: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M12 17.5L8 10h8l-3 4M14 6h3"/></svg>,
  Prayer: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2v6M9 5h6M4 22c0-5 3-8 8-8s8 3 8 8"/></svg>,
  Calendar: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>,
  Spark: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>,
  Yoga: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v5M4 14l8-2 8 2M7 20l5-6 5 6"/></svg>,
  Rest: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 17c2 0 3-2 5-2s3 2 5 2 3-2 5-2M4 13h2M8 13h2M14 13h6"/></svg>,
  Swim: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17c2 0 3-2 5-2s3 2 5 2 3-2 5-2 3 2 3 2"/><circle cx="17" cy="7" r="1.5"/><path d="M8 13l4-5 4 2"/></svg>,
  Walk: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="14" cy="4" r="2"/><path d="M8 20l2-6 3 2v4M13 10l3 2 3-1M6 15l3-5"/></svg>,
  Logo: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="12" r="9"/><path d="M6 12h12M12 6v12" strokeLinecap="round"/></svg>,

  // Strength — compound lifts
  Bench: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 14h18M5 14v4M19 14v4M8 11h8M12 11V7"/><circle cx="12" cy="6" r="1"/></svg>,
  Squat: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="4" r="1.8"/><path d="M12 6v4l-3 4 2 5M12 10l3 4-2 5M4 9h16M4 9v2M20 9v2"/></svg>,
  Deadlift: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="4" r="1.8"/><path d="M12 6v6M9 12h6M10 12l-2 8M14 12l2 8M4 20h16M4 20v-2M20 20v-2"/></svg>,
  OHP: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 5h16M4 5v2M20 5v2M8 5v-1M16 5v-1"/><circle cx="12" cy="11" r="1.6"/><path d="M12 13v5M9 10l3 1 3-1"/></svg>,
  Pullup: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 4h18M7 4v3M17 4v3"/><circle cx="12" cy="10" r="1.6"/><path d="M10 8l2 2 2-2M12 12v4l-2 4M12 16l2 4"/></svg>,
  Rows: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="8" cy="7" r="1.6"/><path d="M8 9v4l3 2M8 13l-2 6M11 11l4-2M15 9l3-1M5 13h2M3 16h2"/></svg>,

  // Split days
  Push: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12h10M14 8l4 4-4 4M8 6l-4 6 4 6"/></svg>,
  Pull: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 12H10M10 8l-4 4 4 4M16 6l4 6-4 6"/></svg>,
  Legs: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3v9l-2 4 2 5M15 3v9l2 4-2 5M8 21h3M13 21h3"/></svg>,
  Arms: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 10c2-3 5-4 7-4M12 6c3 0 5 2 5 5 0 2-1 3-2 3M8 14c0 3 3 5 6 5"/><circle cx="14" cy="11" r="2"/></svg>,
  Abs: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="8" y="4" width="8" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h8M12 4v16"/></svg>,

  // More cardio
  Rowing: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7" cy="7" r="1.5"/><path d="M7 8v4l4 1 3-3M14 10l6 2M3 15l8 2M12 17l-3 4M12 17l3 4"/></svg>,
  JumpRope: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="1.6"/><path d="M12 7v5M9 10h6M10 12l-1 4 3 1 3-1-1-4M11 17l-1 4M13 17l1 4"/><path d="M5 10c-2 2-2 6 0 8M19 10c2 2 2 6 0 8"/></svg>,

  // Mobility / other
  Stretch: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="4" r="1.6"/><path d="M12 6v6M7 10l5 2 5-2M5 20l7-8 7 8"/></svg>,
  HIIT: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L5 13h6l-1 9 8-11h-6z"/></svg>,
  Boxing: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 10c0-3 2-5 5-5h3c2 0 4 1 4 4v3c0 2-2 3-4 3h-1v5H8v-4c-1 0-2-1-2-2z"/><path d="M10 13h4"/></svg>,
  Ball: (p) => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14"/></svg>,
  Google: (p) => (
    <svg viewBox="0 0 48 48" width="18" height="18" {...p}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.2 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.8l5.7-5.7C33.3 6.7 28.9 5 24 5 13 5 4 14 4 25s9 20 20 20 20-9 20-20c0-1.6-.2-3.1-.4-4.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c2.8 0 5.3 1 7.3 2.8l5.7-5.7C33.3 6.7 28.9 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c4.9 0 9.3-1.6 12.6-4.3l-5.8-4.9C28.9 37.4 26.5 38 24 38c-5.2 0-9.7-2.8-11.3-6.7l-6.5 5C9.5 41.8 16.2 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l5.8 4.9C41.3 35.3 44 30.5 44 25c0-1.6-.2-3.1-.4-4.5z"/>
    </svg>
  ),
};

function workoutIconFor(kind) {
  switch ((kind || "").toLowerCase()) {
    case "run": return <Icon.Run />;
    case "walk": return <Icon.Walk />;
    case "cycling": return <Icon.Bike />;
    case "swim": return <Icon.Swim />;
    case "rowing": return <Icon.Rowing />;
    case "jump rope": return <Icon.JumpRope />;
    case "bench press": return <Icon.Bench />;
    case "squat": return <Icon.Squat />;
    case "deadlift": return <Icon.Deadlift />;
    case "overhead press": return <Icon.OHP />;
    case "pull-ups": return <Icon.Pullup />;
    case "rows": return <Icon.Rows />;
    case "push day": return <Icon.Push />;
    case "pull day": return <Icon.Pull />;
    case "leg day": return <Icon.Legs />;
    case "arms": return <Icon.Arms />;
    case "core / abs": return <Icon.Abs />;
    case "yoga": return <Icon.Yoga />;
    case "stretching": return <Icon.Stretch />;
    case "hiit": return <Icon.HIIT />;
    case "boxing": return <Icon.Boxing />;
    case "basketball": return <Icon.Ball />;
    case "weights": return <Icon.Dumbbell />;
    case "rest": return <Icon.Rest />;
    default: return <Icon.Spark />;
  }
}

Object.assign(window, { Icon, workoutIconFor });
