/* ============================================
   IPPL — stats-shared.js
   Shared scoring/stat math used by both the homepage (script.js)
   and the Past Records page (records.js), so both always agree.
   ⚠️ Load this AFTER matches-data.js and BEFORE script.js / records.js.
   ============================================ */

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

// Team totals for a match (from match.scores) sorted highest first,
// plus the winner name (or null if tied / no scores recorded).
function matchResult(match){
  if (!match.scores) return null;
  const entries = Object.entries(match.scores);
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const isTie = sorted.length > 1 && sorted[0][1] === sorted[1][1];
  return {
    entries,
    sorted,
    isTie,
    winner: isTie ? null : sorted[0][0]
  };
}

// "2026-07-20" -> "20 Jul 2026"
function formatMatchDate(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}