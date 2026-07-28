/* ============================================
   IPPL — script.js
   Edit the PLAYERS and fixtures arrays below with
   your real squad and match schedule.
   ============================================ */

// ---------- 1. SQUAD DATA (edit this) ----------
const PLAYERS = [
  { number: "01", name: "Aniket Chaudhary", role: "All-rounder" },
  { number: "02", name: "Yogi Ashish JOFRA ARCHER ", nickname: "BOFRA ARCHER", role: "Fast Bowler" },
  { number: "03", name: "Rudra Chaudhary", role: "Batsman" },
  { number: "04", name: "YUG", role: "All-rounder" },
  { number: "05", name: "Devansh Bhaiya", role: "Batsman" },
  { number: "06", name: "Chirag Bhaiya", role: "Batsman " },
  { number: "07", name: "Pankaj Bhaiya", role: "All- rounder " },
  { number: "08", name: "Rajeev Kumar", role: "All-rounder" },
  { number: "09", name: "Hardik Swami", role: "All-rounder" },
];

function initials(name){
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function renderSquad(){
  const grid = document.getElementById("squadGrid");
  if (!grid) return;
  grid.innerHTML = PLAYERS.map((p, i) => `
    <div class="player-card reveal" data-num="${p.number}" style="transition-delay:${(i % 4) * 70}ms">
      <span class="player-jersey">#${p.number}</span>
      <div class="player-avatar">${initials(p.name)}</div>
      <div class="player-name">${p.name}</div>
      ${p.nickname ? `<div class="player-nickname">aka "${p.nickname}"</div>` : ""}
      <div class="player-role">${p.role}</div>
    </div>
  `).join("");
}

// ---------- 2. DAILY MATCH SCHEDULE (edit this) ----------
// IPPL har din khelta hai — Monday se Sunday tak, roz isi time pe.
// Time change karni ho toh yahan MATCH_START / MATCH_END edit karo.
const MATCH_START = { hour: 19, minute: 40 }; // 7:40 PM
const MATCH_END   = { hour: 21, minute: 30 }; // 9:30 PM
const MATCH_GROUND = "Home Gully Ground";

const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function fmt12h(h, m){
  const period = h >= 12 ? "PM" : "AM";
  const hr = ((h % 12) || 12);
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

// Weekly schedule list — matches happen daily, so every row shows the same
// time, with today's row highlighted.
function renderWeeklySchedule(){
  const list = document.getElementById("fixtureList");
  if (!list) return;
  const todayIdx = new Date().getDay();
  const timeLabel = `${fmt12h(MATCH_START.hour, MATCH_START.minute)} – ${fmt12h(MATCH_END.hour, MATCH_END.minute)}`;
  list.innerHTML = WEEK_DAYS.map((day, i) => `
    <li class="fixture-item${i === todayIdx ? " fixture-today" : ""}">
      <div>
        <div class="fixture-day">${day}${i === todayIdx ? " · Aaj" : ""}</div>
        <div class="fixture-meta">Daily Match · ${MATCH_GROUND}</div>
      </div>
      <div class="fixture-meta">${timeLabel}</div>
    </li>
  `).join("");
}

function atTime(base, h, m){
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

// Live clock — current date & time, ticking every second.
function startLiveClock(){
  const el = document.getElementById("liveClock");
  if (!el) return;
  function tick(){
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    el.textContent = `${dateStr} — ${timeStr}`;
  }
  tick();
  setInterval(tick, 1000);
}

// Match timer — if it's currently between MATCH_START and MATCH_END today,
// counts down to the match ending. Otherwise counts down to the next
// MATCH_START (today if still ahead, tomorrow if today's match is over).
function startCountdown(){
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minsEl = document.getElementById("cdMins");
  const secsEl = document.getElementById("cdSecs");
  const caption = document.getElementById("countdownCaption");
  if (!daysEl) return;

  function tick(){
    const now = new Date();
    const startToday = atTime(now, MATCH_START.hour, MATCH_START.minute);
    const endToday = atTime(now, MATCH_END.hour, MATCH_END.minute);

    let target, live;
    if (now >= startToday && now < endToday){
      target = endToday;
      live = true;
    } else if (now < startToday){
      target = startToday;
      live = false;
    } else {
      target = new Date(startToday);
      target.setDate(target.getDate() + 1);
      live = false;
    }

    caption.textContent = live
      ? `🔴 Match LIVE hai — ${MATCH_GROUND} — khatam hone mein:`
      : `Agla match — ${MATCH_GROUND} — shuru hone mein:`;

    const diff = target - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

// ---------- 2b. MATCH STATS ENGINE ----------
// Reads MATCHES from matches-data.js (edit that file after every match).

function strikeRate(runs, balls){
  if (!balls) return 0;
  return (runs / balls) * 100;
}

function economy(runsGiven, overs){
  if (!overs) return 0;
  return runsGiven / overs;
}

// Man of the Match points: (runs*2) + (wickets*4) + tiered batting/bowling
// bonuses + fielding bonuses. Edit the tiers below if you want to reweigh things.
function momBreakdown(p){
  const base = (p.runs * 2) + (p.wickets * 4);

  // batting bonus — only kicks in once strike rate crosses 100
  let batBonus = 0;
  if (p.balls > 0){
    const sr = strikeRate(p.runs, p.balls);
    if (sr >= 220)      batBonus = 7;
    else if (sr >= 180) batBonus = 5;
    else if (sr >= 140) batBonus = 4;
    else if (sr >= 110) batBonus = 2;
    else if (sr >= 100) batBonus = 1;
  }

  // bowling bonus — tighter economy = more points (best tier only, not stacked)
  let bowlBonus = 0;
  if (p.overs > 0){
    const econ = economy(p.runsGiven, p.overs);
    if (econ < 3)       bowlBonus = 5;
    else if (econ < 4)  bowlBonus = 3;
    else if (econ < 5)  bowlBonus = 2;
    else if (econ <= 6) bowlBonus = 1;
  }

  // fielding bonus
  const fieldBonus = ((p.catches || 0) * 2) + ((p.runOuts || 0) * 2);

  const total = Math.round((base + batBonus + bowlBonus + fieldBonus) * 10) / 10;
  return { base, batBonus, bowlBonus, fieldBonus, total };
}

function momPoints(p){
  return momBreakdown(p).total;
}

function findManOfTheMatch(match){
  let best = null;
  match.players.forEach(p => {
    const pts = momPoints(p);
    if (!best || pts > best.points) best = { ...p, points: pts };
  });
  return best;
}

// Short, 2-3 line stat-based report per player for a given match.
function playerReport(p){
  const sr = strikeRate(p.runs, p.balls);
  const econ = economy(p.runsGiven, p.overs);
  const lines = [];

  // batting line
  if (p.balls > 0){
    if (p.runs >= 25) lines.push(`Bat se ${p.runs} runs (SR ${sr.toFixed(0)}) — solid knock, momentum banaye rakha.`);
    else if (sr >= 110) lines.push(`${p.runs} runs off ${p.balls} balls, SR ${sr.toFixed(0)} — jitna khela, tez khela.`);
    else if (sr < 70) lines.push(`${p.runs} runs off ${p.balls} balls — strike rate thodi slow rahi, thoda aur risk lene ki zaroorat.`);
    else lines.push(`${p.runs} runs off ${p.balls} balls — steady par unremarkable knock.`);
  } else {
    lines.push("Batting nahi mili is match mein.");
  }

  // bowling line
  if (p.overs > 0){
    if (p.wickets >= 2 && econ <= 6) lines.push(`Bowling mein ${p.wickets} wkts @ econ ${econ.toFixed(1)} — match-winning spell.`);
    else if (p.wickets >= 1) lines.push(`${p.wickets} wkt(s) @ econ ${econ.toFixed(1)} in bowling.`);
    else if (econ <= 5) lines.push(`Wicket nahi mila par econ ${econ.toFixed(1)} tight rakha, runs nahi bahne diye.`);
    else lines.push(`${p.overs} overs mein econ ${econ.toFixed(1)} — line-length pe kaam chahiye.`);
  }

  // improvement nudge
  if (p.balls > 0 && sr < 70) lines.push("Improvement: rotate strike zyada karo, singles chhodo mat.");
  else if (p.overs > 0 && econ >= 9) lines.push("Improvement: yorkers/variations practice karo, boundary rok ke rakho.");
  else if (p.balls === 0 && p.overs === 0) lines.push("Agla match zaroor khilao — dono discipline mein contribute kar sakta hai.");

  return lines.join(" ");
}

function renderMatchCenter(){
  const select = document.getElementById("matchSelect");
  const scorecardBody = document.getElementById("scorecardBody");
  const pointsBody = document.getElementById("pointsBody");
  const momBadge = document.getElementById("momBadge");
  const reportsList = document.getElementById("reportsList");
  if (!select || !MATCHES || !MATCHES.length) return;

  select.innerHTML = MATCHES.map(m =>
    `<option value="${m.id}">${new Date(m.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} — ${m.label}</option>`
  ).join("");

  function draw(matchId){
    const match = MATCHES.find(m => m.id === matchId) || MATCHES[0];
    const mom = findManOfTheMatch(match);

    scorecardBody.innerHTML = match.players.map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.runs} (${p.balls})</td>
        <td>${strikeRate(p.runs, p.balls).toFixed(1)}</td>
        <td>${p.wickets}/${p.overs}ov</td>
        <td>${p.overs ? p.runsGiven : "—"}</td>
        <td>${p.overs ? economy(p.runsGiven, p.overs).toFixed(1) : "—"}</td>
        <td>${p.catches || 0} Catch / ${p.runOuts || 0} Run Out</td>
      </tr>
    `).join("");

    const ranked = match.players
      .map(p => ({ name: p.name, ...momBreakdown(p) }))
      .sort((a, b) => b.total - a.total);

    pointsBody.innerHTML = ranked.map(p => `
      <tr class="${mom && p.name === mom.name ? "mom-row" : ""}">
        <td>${p.name}${mom && p.name === mom.name ? " 🏆" : ""}</td>
        <td>${p.base}</td>
        <td>${p.batBonus ? "+" + p.batBonus : "—"}</td>
        <td>${p.bowlBonus ? "+" + p.bowlBonus : "—"}</td>
        <td>${p.fieldBonus ? "+" + p.fieldBonus : "—"}</td>
        <td class="points-total">${p.total}</td>
      </tr>
    `).join("");

    momBadge.innerHTML = mom
      ? `<span class="mom-tag">🏆 Man of the Match</span><span class="mom-name">${mom.name}</span><span class="mom-points">${mom.points} pts</span>`
      : "";

    reportsList.innerHTML = match.players.map(p => `
      <li class="report-card reveal in-view">
        <span class="report-name">${p.name}</span>
        <p>${playerReport(p)}</p>
      </li>
    `).join("");
  }

  draw(MATCHES[0].id);
  select.addEventListener("change", () => draw(select.value));
}

// Season totals — read directly from SEASON_TOTALS (edited daily/after each
// match), ranked, with Orange Cap / Purple Cap winners shown below.
function renderSeasonTotals(){
  const battingBody = document.getElementById("seasonBattingBody");
  const bowlingBody = document.getElementById("seasonBowlingBody");
  const capBanner = document.getElementById("capWinnersBanner");
  if (!battingBody || !bowlingBody || typeof SEASON_TOTALS === "undefined") return;

  const batters = [...SEASON_TOTALS.batters].sort((a, b) => b.runs - a.runs);
  const bowlers = [...SEASON_TOTALS.bowlers].sort((a, b) => b.wickets - a.wickets);

  battingBody.innerHTML = batters.length
    ? batters.map(b => `<tr><td>${b.name}</td><td>${b.runs}</td></tr>`).join("")
    : `<tr><td colspan="2">Abhi koi data nahi — matches-data.js ke SEASON_TOTALS mein add karo.</td></tr>`;

  bowlingBody.innerHTML = bowlers.length
    ? bowlers.map(b => `<tr><td>${b.name}</td><td>${b.wickets}</td></tr>`).join("")
    : `<tr><td colspan="2">Abhi koi data nahi — matches-data.js ke SEASON_TOTALS mein add karo.</td></tr>`;

  const orangeCap = batters[0];
  const purpleCap = bowlers[0];

  if (!capBanner) return;
  capBanner.innerHTML = `
    <div class="cap-winner">
      <span class="mom-tag">🍊 Orange Cap Winner</span>
      <span class="mom-name">${orangeCap ? orangeCap.name : "—"}</span>
      <span class="mom-points">${orangeCap ? orangeCap.runs + " runs" : ""}</span>
    </div>
    <div class="cap-winner">
      <span class="mom-tag">🟣 Purple Cap Winner</span>
      <span class="mom-name">${purpleCap ? purpleCap.name : "—"}</span>
      <span class="mom-points">${purpleCap ? purpleCap.wickets + " wkts" : ""}</span>
    </div>
  `;
}

// ---------- 3. TOSS SIMULATOR ----------
function initToss(){
  const btn = document.getElementById("tossBtn");
  const coin = document.getElementById("coin");
  const resultEl = document.getElementById("tossResult");
  if (!btn) return;

  const captains = ["Squad A", "Squad B"];
  const choices = ["bat first", "bowl first"];

  btn.addEventListener("click", () => {
    btn.disabled = true;
    resultEl.textContent = "Sikka hawa mein…";

    const isHeads = Math.random() < 0.5;

    // Which face is visible is controlled purely by opacity (see CSS),
    // so set it right away — the spin below is just a decorative full
    // rotation that starts and ends facing the viewer.
    coin.classList.remove("result-heads", "result-tails");
    coin.classList.add(isHeads ? "result-heads" : "result-tails");

    const extraSpins = 5; // full rotations, always a multiple of 360
    coin.style.setProperty("--spin-to", `${extraSpins * 360}deg`);
    coin.classList.remove("spinning");
    // force reflow so the animation restarts
    void coin.offsetWidth;
    coin.classList.add("spinning");

    setTimeout(() => {
      const winner = captains[Math.floor(Math.random() * captains.length)];
      const choice = choices[Math.floor(Math.random() * choices.length)];
      resultEl.textContent = `${isHeads ? "Heads" : "Tails"} — ${winner} won the toss and chose to ${choice}.`;
      btn.disabled = false;
    }, 1650);
  });
}

// ---------- 4. NAV TOGGLE ----------
function initNav(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
    });
  });
}

// ---------- 5. SCROLL REVEAL ----------
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
}

// ---------- 6. SCOREBOARD COUNT-UP ----------
function initScoreCount(){
  const nums = document.querySelectorAll(".score-num");
  nums.forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();
    function frame(now){
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  });
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  renderSquad();
  renderSeasonTotals();
  renderMatchCenter();
  renderWeeklySchedule();
  startLiveClock();
  startCountdown();
  initToss();
  initNav();
  initReveal();
  initScoreCount();
});
/* ============================================
   IPPL — matches-data.js
   ⚡ YEH FILE HAR MATCH KE BAAD EDIT KARO ⚡

   Har match khatam hone ke baad, ek naya object
   MATCHES array mein sabse UPAR (start mein) add karo.
   Player ka naam EXACTLY wahi likho jo script.js ke
   PLAYERS array mein hai (spelling match honi chahiye).

   Agar koi player us match mein bowling nahi kar raha
   tha, toh wickets/overs/runsGiven ko 0 hi rehne do.
   Agar batting nahi ki, runs/balls 0 rehne do.
   Catch nahi liya ya run-out nahi kiya toh catches/
   runOuts ko 0 hi rehne do.

   ⚠️ Kam se kam pichhle 3 din ke matches yahan hamesha
   maujood rehne chahiye — purane matches delete mat karo,
   sirf naye upar add karte jao. Isse Match Center mein
   history dekhi ja sakti hai aur Orange/Purple Cap sahi
   season data se calculate hote hain.
   ============================================ */

const MATCHES = [
  // ---- Sample match — apna asli data isi format mein daalo ----
  {
    id: "m1",
    date: "2026-07-20",
    label: "Squad A vs Squad B",
    ground: "Home Gully Ground",
    players: [
      // name must match PLAYERS[].name in script.js exactly
      { name: "Aniket Chaudhary", runs: 34, balls: 22, wickets: 1, overs: 3, runsGiven: 18, catches: 1, runOuts: 0 },
      { name: "Yogi Ashish ( JOFRA ARCHER )",      runs: 8,  balls: 10, wickets: 3, overs: 4, runsGiven: 14, catches: 0, runOuts: 0 },
      { name: "Rudra Chaudhary",  runs: 41, balls: 30, wickets: 0, overs: 0, runsGiven: 0,  catches: 0, runOuts: 1 },
      { name: "YUG",        runs: 15, balls: 12, wickets: 1, overs: 2, runsGiven: 11, catches: 0, runOuts: 0 },
      { name: "Devansh Bhaiya",   runs: 22, balls: 19, wickets: 0, overs: 0, runsGiven: 0,  catches: 1, runOuts: 0 },
      { name: "Chirag Bhaiya",    runs: 3,  balls: 5,  wickets: 2, overs: 3, runsGiven: 9,  catches: 0, runOuts: 0 },
      { name: "Pankaj Bhaiya",    runs: 12, balls: 9,  wickets: 0, overs: 0, runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Rajeev Kumar",     runs: 6,  balls: 7,  wickets: 1, overs: 2, runsGiven: 13, catches: 0, runOuts: 0 }
    ]
  }

  // ---- Naya match yahan ADD karo (upar wale se pehle, comma laga ke) ----
  // {
  //   id: "m2",
  //   date: "2026-08-03",
  //   label: "Squad A vs Squad B",
  //   ground: "Home Gully Ground",
  //   players: [
  //     { name: "Aniket Chaudhary", runs: 0, balls: 0, wickets: 0, overs: 0, runsGiven: 0, catches: 0, runOuts: 0 },
  //     ...
  //   ]
  // },
];

/* ============================================
   SEASON_TOTALS
   ⚡ YEH BHI DAILY / HAR MATCH KE BAAD EDIT KARO ⚡

   Yeh season ki running total hai — har player ke
   season bhar ke total runs (batters mein) aur total
   wickets (bowlers mein). Har match ke baad bas number
   ko current total mein add karke yahan update kar do.

   Orange Cap (sabse zyada runs) aur Purple Cap (sabse
   zyada wickets) yahi data se automatically nikalte hain
   — jo naam sabse upar aa jaaye, wahi winner ban jaata hai.
   ============================================ */

const SEASON_TOTALS = {
  batters: [
    { name: "Rudra Chaudhary",  runs: 41 },
    { name: "Aniket Chaudhary", runs: 34 },
    { name: "Devansh Bhaiya",   runs: 22 },
    { name: "YUG",              runs: 15 },
    { name: "Pankaj Bhaiya",    runs: 12 },
    { name: "Rajeev Kumar",     runs: 6  },
    { name: "Yogi Ashish JOFRA ARCHER ",      runs: 8  },
    { name: "Chirag Bhaiya",    runs: 3  },
    { name: "Hardik Swami",     runs: 0  }
  ],
  bowlers: [
    { name: "Yogi Ashish JOFRA ARCHER ",      wickets: 3 },
    { name: "Chirag Bhaiya",    wickets: 2 },
    { name: "Aniket Chaudhary", wickets: 1 },
    { name: "YUG",              wickets: 1 },
    { name: "Rajeev Kumar",     wickets: 1 },
    { name: "Rudra Chaudhary",  wickets: 0 },
    { name: "Devansh Bhaiya",   wickets: 0 },
    { name: "Pankaj Bhaiya",    wickets: 0 },
    { name: "Hardik Swami",     wickets: 0 }
  ]
};
