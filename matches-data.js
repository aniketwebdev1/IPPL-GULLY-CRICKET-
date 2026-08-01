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

   Har match object mein ek "scores" field bhi hai — dono team
   ke final totals (extras milaake, isliye batters ke runs ke
   exact sum se match nahi karega, aur woh normal hai). Winner
   banner isi se decide hota hai — jis team ka score zyada,
   wahi winner ban ke celebrate hota hai.

   ⚠️ Kam se kam pichhle 3 din ke matches yahan hamesha
   maujood rehne chahiye — purane matches delete mat karo,
   sirf naye upar add karte jao. Isse Match Center mein
   history dekhi ja sakti hai aur Orange/Purple Cap sahi
   season data se calculate hote hain.

   📁 records.html ("Past Records" page) bhi isi array se
   seedha date-wise list banata hai — koi extra kaam nahi,
   bas yahan match add karo aur woh wahan apne aap dikhega.
   ============================================ */

const MATCHES = [
  {
    id: "m5",
    date: "2026-08-01",
    label: "Rudra Challengers vs Yogi Blasters",
    ground: "Home Gully Ground",
    // ⚡ Team totals (includes extras/wides etc., so they won't always
    // exactly equal the sum of listed batters) — used for the Winner banner.
    scores: {
      "Rudra Challengers": 44,
      "Yogi Blasters": 43
    },
    players: [
      // name must match PLAYERS[].name in script.js exactly
      // Note: Atharv genuinely played across both teams this match — his
      // batting is combined into one line (9 runs off 28 balls).
      { name: "Pankaj Bhaiya",    runs: 2,  balls: 6,  wickets: 2, overs: 1.5,  runsGiven: 9,  catches: 1, runOuts: 0 },
      { name: "Rudra Chaudhary",  runs: 25, balls: 23, wickets: 2, overs: 3,    runsGiven: 19, catches: 0, runOuts: 0 },
      { name: "Chirag Bhaiya",    runs: 3,  balls: 8,  wickets: 1, overs: 2,    runsGiven: 11, catches: 0, runOuts: 0 },
      { name: "Devansh Bhaiya",   runs: 1,  balls: 3,  wickets: 0, overs: 1,    runsGiven: 4,  catches: 0, runOuts: 0 },
      { name: "Yogi Ashish",      runs: 0,  balls: 2,  wickets: 2, overs: 3.4, runsGiven: 26, catches: 0, runOuts: 0 },
      { name: "Aniket Chaudhary", runs: 10, balls: 9,  wickets: 1, overs: 2,    runsGiven: 9,  catches: 0, runOuts: 0 },
      { name: "Rajeev Kumar",     runs: 11, balls: 11, wickets: 0, overs: 1,    runsGiven: 5,  catches: 0, runOuts: 0 },
      { name: "YUG",               runs: 4, balls: 3,  wickets: 1, overs: 1,    runsGiven: 4,  catches: 0, runOuts: 0 },
      { name: "Atharv",           runs: 9,  balls: 28, wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Hardik Swami",     runs: 0,  balls: 0,  wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 }
    ]
  },
  {
    id: "m4",
    date: "2026-08-01",
    label: "Rudra Challengers vs Yogi Blasters",
    ground: "Home Gully Ground",
    // ⚡ Team totals (includes extras/wides etc., so they won't always
    // exactly equal the sum of listed batters) — used for the Winner banner.
    scores: {
      "Rudra Challengers": 26,
      "Yogi Blasters": 27
    },
    players: [
      // name must match PLAYERS[].name in script.js exactly
      // Note: "Hardik" and "Sonu" in the original scorecard were both
      // naming mix-ups for the same real player — merged here into Chirag Bhaiya.
      { name: "Rudra Chaudhary",  runs: 4,  balls: 5,  wickets: 0, overs: 1,    runsGiven: 9,  catches: 0, runOuts: 0 },
      { name: "Atharv",           runs: 3,  balls: 8,  wickets: 0, overs: 1,    runsGiven: 14, catches: 0, runOuts: 0 },
      { name: "Chirag Bhaiya",    runs: 9,  balls: 9,  wickets: 0, overs: 1,    runsGiven: 4,  catches: 0, runOuts: 0 },
      { name: "Pankaj Bhaiya",    runs: 2,  balls: 2,  wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Devansh Bhaiya",   runs: 1,  balls: 9,  wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 1 },
      { name: "Yogi Ashish",      runs: 17, balls: 12, wickets: 1, overs: 2,    runsGiven: 7,  catches: 0, runOuts: 0 },
      { name: "Aniket Chaudhary", runs: 3,  balls: 3,  wickets: 3, overs: 2.1, runsGiven: 7,  catches: 0, runOuts: 0 },
      { name: "YUG",               runs: 1, balls: 3,  wickets: 0, overs: 1,    runsGiven: 12, catches: 1, runOuts: 0 },
      { name: "Rajeev Kumar",     runs: 0,  balls: 0,  wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Hardik Swami",     runs: 0,  balls: 0,  wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 }
    ]
  },
  {
    id: "m3",
    date: "2026-07-30",
    label: "Rudra Challengers vs Yogi Blasters",
    ground: "Home Gully Ground",
    // ⚡ Team totals (includes extras/wides etc., so they won't always
    // exactly equal the sum of listed batters) — used for the Winner banner.
    scores: {
      "Rudra Challengers": 74,
      "Yogi Blasters": 50
    },
    players: [
      // name must match PLAYERS[].name in script.js exactly
      { name: "Pankaj Bhaiya",    runs: 42, balls: 37, wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Rudra Chaudhary",  runs: 1,  balls: 4,  wickets: 0, overs: 4,    runsGiven: 21, catches: 0, runOuts: 1 },
      { name: "Hardik Swami",     runs: 6,  balls: 9,  wickets: 1, overs: 4,    runsGiven: 19, catches: 0, runOuts: 0 },
      { name: "Devansh Bhaiya",   runs: 4,  balls: 11, wickets: 0, overs: 2,    runsGiven: 10, catches: 0, runOuts: 0 },
      { name: "Yogi Ashish",      runs: 3,  balls: 6,  wickets: 1, overs: 3,    runsGiven: 23, catches: 0, runOuts: 0 },
      { name: "Aniket Chaudhary", runs: 2,  balls: 7,  wickets: 0, overs: 3,    runsGiven: 21, catches: 0, runOuts: 1 },
      { name: "Rajeev Kumar",     runs: 10, balls: 19, wickets: 1, overs: 1,    runsGiven: 6,  catches: 0, runOuts: 0 },
      { name: "YUG",              runs: 22, balls: 30, wickets: 1, overs: 3.17, runsGiven: 24, catches: 0, runOuts: 0 },
      { name: "Atharv",           runs: 7,  balls: 11, wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Chirag Bhaiya",    runs: 0,  balls: 0,  wickets: 0, overs: 0,    runsGiven: 0,  catches: 0, runOuts: 0 }
    ]
  },
  // ---- Sample match — apna asli data isi format mein daalo ----
  {
    id: "m1",
    date: "2026-07-29",
    label: "Yogi Blasters vs Rudra Challengers",
    ground: "Home Gully Ground",
    // ⚡ Team totals (includes extras/wides etc., so they won't always
    // exactly equal the sum of listed batters) — used for the Winner banner.
    scores: {
      "Yogi Blasters": 84,
      "Rudra Challengers": 70
    },
    players: [
      // name must match PLAYERS[].name in script.js exactly
      { name: "Aniket Chaudhary", runs: 23, balls: 20, wickets: 1, overs: 7, runsGiven: 7, catches: 0, runOuts: 0 },
      { name: "Yogi Ashish",      runs: 26,  balls: 18, wickets: 0, overs: 4, runsGiven: 20, catches: 0, runOuts: 0 },
      { name: "Rudra Chaudhary",  runs: 5, balls: 34, wickets: 0, overs: 4, runsGiven: 30,  catches: 0, runOuts: 0 },
      { name: "YUG",        runs: 28, balls: 18, wickets: 0, overs: 3, runsGiven: 20, catches: 0, runOuts: 0 },
      { name: "Devansh Bhaiya",   runs: 6, balls: 11, wickets: 1, overs: 2, runsGiven: 11,  catches: 1, runOuts: 0 },
      { name: "Chirag Bhaiya",    runs: 6,  balls: 9,  wickets: 0, overs: 0, runsGiven: 0,  catches: 0, runOuts: 0 },
      { name: "Pankaj Bhaiya",    runs: 52, balls: 42,  wickets: 0, overs: 4, runsGiven: 33,  catches: 0, runOuts: 0 },
      { name: "Rajeev Kumar",     runs: 1,  balls: 2,  wickets: 1, overs: 2, runsGiven: 19, catches: 0, runOuts: 0 }
    ]
},
]

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
    { name: "Rudra Chaudhary",  runs: 35 },
    { name: "Aniket Chaudhary", runs: 38 },
    { name: "Devansh Bhaiya",   runs: 12 },
    { name: "YUG",              runs: 55 },
    { name: "Pankaj Bhaiya",    runs: 98 },
    { name: "Rajeev Kumar",     runs: 22 },
    { name: "Yogi Ashish",      runs: 46  },
    { name: "Chirag Bhaiya",    runs: 18 },
    { name: "Hardik Swami",     runs: 6  },
    { name: "Atharv",           runs: 19 }
  ],
  bowlers: [
    { name: "Yogi Ashish",      wickets: 4 },
    { name: "Chirag Bhaiya",    wickets: 1 },
    { name: "Aniket Chaudhary", wickets: 5 },
    { name: "YUG",              wickets: 2 },
    { name: "Rajeev Kumar",     wickets: 2 },
    { name: "Rudra Chaudhary",  wickets: 2 },
    { name: "Devansh Bhaiya",   wickets: 1 },
    { name: "Pankaj Bhaiya",    wickets: 2 },
    { name: "Hardik Swami",     wickets: 1 },
    { name: "Atharv",           wickets: 0 }
  ]
};