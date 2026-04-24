// Utilities: date handling (PST), storage, seed data, BMI/calorie math

const PST_TZ = "America/Los_Angeles";

function pstDateKey(d = new Date()) {
  // Returns YYYY-MM-DD in PST
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PST_TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(d);
  const y = parts.find(p => p.type === "year").value;
  const m = parts.find(p => p.type === "month").value;
  const day = parts.find(p => p.type === "day").value;
  return `${y}-${m}-${day}`;
}

function dateKeyToParts(key) {
  // key = "YYYY-MM-DD"
  const [y, m, d] = key.split("-").map(Number);
  // Use UTC noon to avoid TZ drift when formatting
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function prettyDate(key) {
  const d = dateKeyToParts(key);
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    timeZone: "UTC",
  });
}

function shortDate(key) {
  const d = dateKeyToParts(key);
  return {
    day: d.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" }),
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
  };
}

function addDaysKey(key, n) {
  const d = dateKeyToParts(key);
  d.setUTCDate(d.getUTCDate() + n);
  return pstDateKey(d);
}

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

// Mifflin-St Jeor (male assumed by default; let user adjust weight/height/age)
function estimatedDailyCalories({ weightKg, heightCm, age = 28, sex = "m", activity = 1.55 }) {
  if (!weightKg || !heightCm) return 2400;
  const bmr = sex === "f"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return Math.round((bmr * activity) / 10) * 10;
}

function computeBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  return +(weightKg / (m * m)).toFixed(1);
}

function bmiBand(bmi) {
  if (!bmi) return null;
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Seeded demo entries so the app isn't empty on first login
function buildSeedEntries(todayKey) {
  const entries = {};
  const plans = [
    { off: 0, food: [["Oats with berries", 320], ["Chicken wrap", 560], ["Protein shake", 220]], workout: { kind: "Run", minutes: 32, notes: "Zone 2 along the river" }, weight: 74.8, prayers: [1,1,1,0,0] },
    { off: -1, food: [["Eggs & toast", 380], ["Rice bowl", 640], ["Banana", 95], ["Chicken & rice", 710]], workout: { kind: "Weights", minutes: 55, notes: "Push day — bench, OHP, triceps" }, weight: 75.1, prayers: [1,1,1,1,1] },
    { off: -2, food: [["Greek yogurt", 180], ["Turkey sandwich", 520], ["Apple", 80], ["Pasta bolognese", 780]], workout: { kind: "Rest", minutes: 0, notes: "Easy walk 20 min" }, weight: 75.0, prayers: [1,1,0,1,1] },
    { off: -3, food: [["Oatmeal", 300], ["Chicken salad", 480], ["Protein bar", 210], ["Steak & potatoes", 820]], workout: { kind: "Weights", minutes: 62, notes: "Pull day" }, weight: 75.2, prayers: [1,1,1,1,1] },
    { off: -4, food: [["Smoothie", 340], ["Chipotle bowl", 760], ["Almonds", 170]], workout: { kind: "Run", minutes: 28, notes: "Tempo" }, weight: 75.4, prayers: [0,1,1,1,1] },
    { off: -5, food: [["Toast + PB", 380], ["Sushi", 620], ["Ice cream", 280]], workout: { kind: "Cycling", minutes: 45, notes: "Easy spin" }, weight: 75.3, prayers: [1,1,1,1,0] },
    { off: -6, food: [["Eggs", 220], ["Burrito", 720], ["Protein shake", 220]], workout: { kind: "Weights", minutes: 50, notes: "Legs" }, weight: 75.5, prayers: [1,1,1,1,1] },
    { off: -7, food: [["Oats", 310], ["Chicken wrap", 540]], workout: { kind: "Rest", minutes: 0, notes: "" }, weight: 75.6, prayers: [1,0,1,1,1] },
    { off: -8, food: [["Yogurt bowl", 260], ["Pizza (2 slices)", 620], ["Salad", 180]], workout: { kind: "Run", minutes: 40, notes: "Long run" }, weight: 75.8, prayers: [1,1,1,1,1] },
    { off: -9, food: [["Toast", 200], ["Poke bowl", 580], ["Protein bar", 210]], workout: { kind: "Weights", minutes: 48, notes: "Push" }, weight: 75.7, prayers: [1,1,0,1,1] },
    { off: -10, food: [["Oatmeal", 320], ["Rice & curry", 690]], workout: { kind: "Cycling", minutes: 35, notes: "" }, weight: 75.9, prayers: [1,1,1,1,1] },
    { off: -11, food: [["Smoothie", 320], ["Chicken bowl", 620], ["Apple", 80], ["Dinner", 640]], workout: { kind: "Weights", minutes: 55, notes: "Pull" }, weight: 76.0, prayers: [0,1,1,0,1] },
    { off: -12, food: [["Eggs & toast", 380], ["Shawarma", 780]], workout: { kind: "Rest", minutes: 0, notes: "" }, weight: 76.1, prayers: [1,1,1,1,1] },
    { off: -13, food: [["Oats", 300], ["Tacos", 720], ["Snacks", 260]], workout: { kind: "Run", minutes: 30, notes: "Easy" }, weight: 76.0, prayers: [1,1,1,1,1] },
  ];
  // Past 30 days partial fill
  for (let i = 14; i < 30; i++) {
    const filled = i % 3 !== 0;
    if (!filled) continue;
    plans.push({
      off: -i,
      food: [["Breakfast", 300 + (i % 4) * 30], ["Lunch", 600 + (i % 5) * 40], ["Dinner", 650 + (i % 3) * 50]],
      workout: {
        kind: ["Run","Weights","Cycling","Rest","Swim"][i % 5],
        minutes: [28, 45, 50, 0, 30][i % 5],
        notes: "",
      },
      weight: +(75 + Math.sin(i / 3) * 0.8).toFixed(1),
      prayers: [i%2, 1, (i+1)%2, 1, i%3 ? 1 : 0],
    });
  }
  for (const p of plans) {
    const key = addDaysKey(todayKey, p.off);
    entries[key] = {
      date: key,
      food: p.food.map(([name, calories]) => ({ name, calories })),
      workouts: p.workout.minutes > 0 || p.workout.notes
        ? [{ kind: p.workout.kind, minutes: p.workout.minutes, notes: p.workout.notes }]
        : (p.workout.kind === "Rest" ? [{ kind: "Rest", minutes: 0, notes: p.workout.notes }] : []),
      weight: p.weight,
      prayers: p.prayers.slice(),
    };
  }
  return entries;
}

function emptyEntry(date) {
  return {
    date,
    food: [],
    workouts: [],
    weight: null,
    prayers: [0,0,0,0,0],
  };
}

function totalCalories(entry) {
  return (entry.food || []).reduce((s, f) => s + (+f.calories || 0), 0);
}
function totalWorkoutMinutes(entry) {
  return (entry.workouts || []).reduce((s, w) => s + (+w.minutes || 0), 0);
}
function prayerCount(entry) {
  return (entry.prayers || []).reduce((s, v) => s + (v ? 1 : 0), 0);
}
function latestWeight(entries, upToKey) {
  // Walk back from upToKey until we find a weight
  let cursor = upToKey;
  for (let i = 0; i < 365; i++) {
    const e = entries[cursor];
    if (e && e.weight) return e.weight;
    cursor = addDaysKey(cursor, -1);
  }
  return null;
}

const WORKOUT_KINDS = [
  // Cardio
  { name: "Run",          icon: "run",       group: "Cardio" },
  { name: "Walk",         icon: "walk",      group: "Cardio" },
  { name: "Cycling",      icon: "bike",      group: "Cardio" },
  { name: "Swim",         icon: "swim",      group: "Cardio" },
  { name: "Rowing",       icon: "rowing",    group: "Cardio" },
  { name: "Jump Rope",    icon: "jumprope",  group: "Cardio" },
  // Strength — compound
  { name: "Bench Press",  icon: "bench",     group: "Strength" },
  { name: "Squat",        icon: "squat",     group: "Strength" },
  { name: "Deadlift",     icon: "deadlift",  group: "Strength" },
  { name: "Overhead Press", icon: "ohp",     group: "Strength" },
  { name: "Pull-ups",     icon: "pullup",    group: "Strength" },
  { name: "Rows",         icon: "rows",      group: "Strength" },
  // Strength — split days
  { name: "Push Day",     icon: "push",      group: "Split" },
  { name: "Pull Day",     icon: "pull",      group: "Split" },
  { name: "Leg Day",      icon: "legs",      group: "Split" },
  { name: "Arms",         icon: "arms",      group: "Split" },
  { name: "Core / Abs",   icon: "abs",       group: "Split" },
  // Other
  { name: "Yoga",         icon: "yoga",      group: "Mobility" },
  { name: "Stretching",   icon: "stretch",   group: "Mobility" },
  { name: "HIIT",         icon: "hiit",      group: "Other" },
  { name: "Boxing",       icon: "boxing",    group: "Other" },
  { name: "Basketball",   icon: "ball",      group: "Other" },
  { name: "Rest",         icon: "rest",      group: "Other" },
  { name: "Other",        icon: "spark",     group: "Other" },
];

Object.assign(window, {
  PST_TZ, PRAYERS, WORKOUT_KINDS,
  pstDateKey, dateKeyToParts, prettyDate, shortDate, addDaysKey,
  estimatedDailyCalories, computeBMI, bmiBand,
  buildSeedEntries, emptyEntry,
  totalCalories, totalWorkoutMinutes, prayerCount, latestWeight,
});
