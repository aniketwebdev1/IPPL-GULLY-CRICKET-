/* ============================================
   IPPL — records.js
   Powers the "Past Records" section: a date dropdown + a clickable
   list of every match date (from MATCHES in matches-data.js). Pick a
   date from the dropdown (or click a card directly) to open its full
   scorecard — nothing to edit in this file, it just reads whatever
   you've added to matches-data.js.
   ============================================ */

function renderRecordsList(){
  const list = document.getElementById("recordsList");
  const empty = document.getElementById("recordsEmpty");
  if (!list) return;

  if (!MATCHES || MATCHES.length === 0){
    if (empty) empty.style.display = "block";
    return;
  }

  // newest match first
  const ordered = [...MATCHES].sort((a, b) => new Date(b.date) - new Date(a.date));

  list.innerHTML = ordered.map((match, i) => {
    const result = matchResult(match);
    const dateNice = formatMatchDate(match.date);

    let resultChip = `<span class="rec-chip rec-chip-pending">Scorecard available</span>`;
    if (result && result.isTie){
      resultChip = `<span class="rec-chip rec-chip-tie">🤝 Tied</span>`;
    } else if (result){
      resultChip = `<span class="rec-chip rec-chip-win">🏆 ${result.winner}</span>`;
    }

    const scoreLine = result
      ? result.entries.map(([name, runs]) => `${name} ${runs}`).join("  vs  ")
      : "";

    return `
      <li class="record-item">
        <button class="record-toggle" data-match-id="${match.id}" aria-expanded="false">
          <span class="record-toggle-main">
            <span class="record-date">${dateNice}</span>
            <span class="record-label">${match.label}</span>
          </span>
          <span class="record-toggle-side">
            ${resultChip}
            <span class="record-caret">▾</span>
          </span>
        </button>
        ${scoreLine ? `<p class="record-scoreline">${scoreLine}</p>` : ""}
        <div class="record-detail" id="recordDetail-${match.id}"></div>
      </li>
    `;
  }).join("");

  list.querySelectorAll(".record-toggle").forEach(btn => {
    btn.addEventListener("click", () => toggleRecord(btn));
  });

  return ordered;
}

// Date dropdown above the list — picking a date opens that card
// (closing whichever one was open before) and scrolls to it.
function renderRecordsPicker(ordered){
  const select = document.getElementById("recordsSelect");
  if (!select || !ordered || ordered.length === 0) return;

  select.innerHTML = ordered.map(match =>
    `<option value="${match.id}">${formatMatchDate(match.date)} — ${match.label}</option>`
  ).join("");

  select.addEventListener("change", () => {
    openRecordById(select.value, { scroll: true });
  });

  // show the most recent match open by default
  openRecordById(ordered[0].id, { scroll: false });
}

function openRecordById(matchId, opts = {}){
  const { scroll = false } = opts;
  const btn = document.querySelector(`.record-toggle[data-match-id="${matchId}"]`);
  const item = btn ? btn.closest(".record-item") : null;
  if (!btn || !item) return;

  // close any other open record, keep only this one open
  document.querySelectorAll(".record-item.open").forEach(openItem => {
    if (openItem !== item) {
      openItem.classList.remove("open");
      openItem.querySelector(".record-toggle")?.setAttribute("aria-expanded", "false");
    }
  });

  if (!item.classList.contains("open")){
    toggleRecord(btn);
  }

  const select = document.getElementById("recordsSelect");
  if (select && select.value !== matchId) select.value = matchId;

  if (scroll){
    item.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function toggleRecord(btn){
  const matchId = btn.dataset.matchId;
  const detail = document.getElementById(`recordDetail-${matchId}`);
  const item = btn.closest(".record-item");
  if (!detail || !item) return;

  const isOpen = item.classList.contains("open");

  if (isOpen){
    item.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    return;
  }

  // lazy-build the scorecard the first time this date is opened
  if (!detail.dataset.built){
    const match = MATCHES.find(m => m.id === matchId);
    if (match) detail.innerHTML = buildScorecardHTML(match);
    detail.dataset.built = "1";
  }

  item.classList.add("open");
  btn.setAttribute("aria-expanded", "true");
}

function buildScorecardHTML(match){
  const mom = findManOfTheMatch(match);

  const rows = match.players.map(p => {
    const sr = strikeRate(p.runs, p.balls);
    const econ = p.overs ? economy(p.runsGiven, p.overs) : null;
    return `
      <tr>
        <td>${p.name}</td>
        <td>${p.runs} (${p.balls})</td>
        <td>${sr.toFixed(1)}</td>
        <td>${p.overs ? `${p.wickets}/${p.overs}` : "—"}</td>
        <td>${p.overs ? p.runsGiven : "—"}</td>
        <td>${econ !== null ? econ.toFixed(1) : "—"}</td>
        <td>${(p.catches || 0) + (p.runOuts || 0) ? `${p.catches || 0}c ${p.runOuts || 0}ro` : "—"}</td>
      </tr>
    `;
  }).join("");

  const momHTML = mom ? `
    <div class="mom-banner in-view">
      <span class="mom-tag">⭐ Man of the Match</span>
      <span class="winner-name">${mom.name}</span>
      <span class="mom-points">${mom.points} pts</span>
    </div>
  ` : "";

  return `
    <div class="stat-panel scorecard-panel">
      <h3>Scorecard</h3>
      <table>
        <thead><tr><th>Player</th><th>Runs (Balls)</th><th>SR</th><th>Wkts/Ov</th><th>Runs Given</th><th>Econ</th><th>Fielding</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${momHTML}
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const ordered = renderRecordsList();
  renderRecordsPicker(ordered);
});