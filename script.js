/* ============================================
   IPPL — script.js
   Edit the PLAYERS and fixtures arrays below with
   your real squad and match schedule.
   ============================================ */

// ---------- 1. SQUAD DATA (edit this) ----------
const PLAYERS = [
  { number: "01", name: "Aniket Chaudhary", role: "All-rounder" },
  { number: "02", name: "Yogi Ashish", role: "All- rounder" },
  { number: "03", name: "Rudra Chaudhary", role: "Batsman" },
  { number: "04", name: "YUG", role: "All-rounder" },
  { number: "05", name: "Devansh Bhaiya", role: "Batsman" },
  { number: "06", name: "Chirag Bhaiya", role: "Bowler" },
  { number: "07", name: "Pankaj Bhaiya", role: "Wicketkeeper" },
  { number: "08", name: "Rajeev Kumar", role: "All-rounder" },
  { number: "09", name: "Hardik Swami", role: "All-rounder" },
  { number: "10", name: "Atharv", role: "Batsman" },
];

// ---------- 1b. TEAMS (edit this) ----------
// Two teams for the season — captain listed separately, plus a
// members array (captain included) so it can render as one lineup.
const TEAMS = [
  {
    name: "Yogi Blasters",
    captain: "Yogi Ashish",
    members: ["Yogi Ashish", "Aniket Chaudhary", "YUG", "Rajeev Kumar"]
  },
  {
    name: "Rudra Challengers",
    captain: "Rudra Chaudhary",
    members: ["Rudra Chaudhary", "Devansh Bhaiya", "Chirag Bhaiya", "Pankaj Bhaiya", "Hardik Swami"]
  }
];

function renderTeams(){
  const grid = document.getElementById("teamsGrid");
  if (!grid) return;
  grid.innerHTML = TEAMS.map(team => `
    <div class="stat-panel team-card">
      <h3>${team.name}</h3>
      <ul class="team-members">
        ${team.members.map(name => `
          <li>${name}${name === team.captain ? ' <span class="captain-tag">C</span>' : ""}</li>
        `).join("")}
      </ul>
    </div>
  `).join("");
}

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

// strikeRate, economy, momBreakdown, momPoints, findManOfTheMatch,
// playerReport, matchResult, formatMatchDate now live in stats-shared.js
// (shared with the Past Records page) — index.html loads that file
// before this one.

// Winner banner — reads match.scores (team totals) and shows which team
// won, with a confetti/glow celebration. If scores are tied, shows a
// neutral "match tied" state instead.
function renderWinnerBanner(match){
  const banner = document.getElementById("winnerBanner");
  if (!banner) return;

  if (!match.scores){
    banner.innerHTML = "";
    banner.className = "winner-banner reveal in-view";
    delete banner.dataset.winner;
    delete banner.dataset.scoreline;
    return;
  }

  const entries = Object.entries(match.scores);
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const isTie = sorted.length > 1 && sorted[0][1] === sorted[1][1];

  if (isTie){
    banner.className = "winner-banner reveal in-view";
    delete banner.dataset.winner;
    delete banner.dataset.scoreline;
    banner.innerHTML = `
      <div class="winner-content">
        <div class="winner-scoreline">
          ${entries.map(([name, runs]) => `<span class="wts"><span class="wts-name">${name}</span> made <span class="wts-runs">${runs}</span></span>`).join('<span class="winner-vs">vs</span>')}
        </div>
        <div class="winner-result">
          <span class="mom-tag">🤝 Match Tied</span>
          <span class="winner-congrats">Koi haara nahi, koi jeeta nahi!</span>
        </div>
      </div>
    `;
    return;
  }

  const winnerName = sorted[0][0];
  const scoreLine = entries.map(([name, runs]) => `${name} ${runs}`).join("  vs  ");
  banner.className = "winner-banner reveal in-view";
  banner.innerHTML = `
    <div class="winner-content">
      <div class="winner-scoreline">
        ${entries.map(([name, runs]) => `<span class="wts"><span class="wts-name">${name}</span> made <span class="wts-runs">${runs}</span></span>`).join('<span class="winner-vs">vs</span>')}
      </div>
      <div class="winner-result">
        <span class="mom-tag">🏆 Match Winner</span>
        <span class="winner-name">${winnerName}</span>
        <span class="winner-congrats">Zabardast jeet! 🎉</span>
      </div>
    </div>
  `;
}

function renderMatchCenter(){
  const select = document.getElementById("matchSelect");
  const scorecardBody = document.getElementById("scorecardBody");
  const pointsBody = document.getElementById("pointsBody");
  const momBadge = document.getElementById("momBadge");
  const reportsList = document.getElementById("reportsList");
  if (!select || !MATCHES || !MATCHES.length) return;

  select.innerHTML = MATCHES.map(m =>
    `<option value="${m.id}">${formatMatchDateWithOrdinal(m, MATCHES)} — ${m.label}</option>`
  ).join("");

  function draw(matchId){
    const match = MATCHES.find(m => m.id === matchId) || MATCHES[0];
    const mom = findManOfTheMatch(match);
    renderWinnerBanner(match);

    scorecardBody.innerHTML = match.players.map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.runs} (${p.balls})</td>
        <td>${strikeRate(p.runs, p.balls).toFixed(1)}</td>
        <td>${p.wickets}/${p.overs}ov</td>
        <td>${p.overs ? p.runsGiven : "—"}</td>
        <td>${p.overs ? economy(p.runsGiven, p.overs).toFixed(1) : "—"}</td>
        <td>${p.catches || 0}c / ${p.runOuts || 0}ro</td>
      </tr>
    `).join("");

    const ranked = match.players
      .map(p => ({ name: p.name, ...momBreakdown(p) }))
      .sort((a, b) => b.total - a.total);

    pointsBody.innerHTML = ranked.map(p => `
      <tr class="${mom && p.name === mom.name ? "mom-row" : ""}">
        <td>${p.name}${mom && p.name === mom.name ? " 🏆" : ""}</td>
        <td>${p.base}</td>
        <td>${p.batBonus > 0 ? "+" + p.batBonus : "—"}</td>
        <td>${p.batBonus < 0 ? p.batBonus : "—"}</td>
        <td>${p.bowlBonus > 0 ? "+" + p.bowlBonus : "—"}</td>
        <td>${p.bowlBonus < 0 ? p.bowlBonus : "—"}</td>
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
    const extraSpins = 5; // full rotations before landing
    const landingDeg = extraSpins * 360 + (isHeads ? 0 : 180);
    coin.style.setProperty("--spin-to", `${landingDeg}deg`);
    coin.classList.remove("spinning");
    // force reflow so the animation restarts
    void coin.offsetWidth;
    coin.classList.add("spinning");
    coin.style.transform = `rotateY(${landingDeg}deg)`;

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
  renderTeams();
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