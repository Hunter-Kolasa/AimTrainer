// ======= GLOBAL VARIABLES FOR ALL ELEMENTS =========== //
    const BASE_URL = "http://localhost:3000/";
    // canvas
    const canvasDiv = document.querySelector(".canvas");
    const canvas = document.createElement("canvas");
    const c = canvas.getContext("2d");
    // 
    // user info
    const scoreDiv = document.querySelector(".scorecard");
    const scorecardH3 = document.createElement("h3");
    const usernameH4 = document.createElement("h4");
    const userForm = document.forms["login-signup"];
    // 
    // leaderboard
    const leaderDiv = document.querySelector(".leaderboard");
    const leaderH2 = document.createElement("h2");
    // 
    // error display
    const errorDiv = document.querySelector(".alert");
    // 
    // buttons
    const loginBtn = document.getElementById("loginBtn");
    const startBtnDiv = document.querySelector(".start-game-btn");
    const startBtn = document.createElement("button");
    const replayBtn = document.createElement("button");
    const mainMenuBtn = document.createElement("button");
    // 
    // endgame menu
    const endMenuDiv = document.querySelector(".end-menu");
    const endMessageP = document.createElement("p");
    // 
    // various counters/trackers for different game data
    let targets = [];
    let score = 0;
    let missCounter = 0;
    let state;
    let userId;
    let targetInterval;
    let priorScore;
    let interval = 1000;
    // 
// ====================================================== //

// ====== INITIAL SETUP FOR VARIOUS PAGE ELEMENTS/GLOBALS ====== //
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    canvasDiv.appendChild(canvas);
    leaderH2.innerHTML = "Leaderboard";
    leaderDiv.appendChild(leaderH2);
    startBtn.setAttribute("class", "startBtn");
    startBtn.innerText = "Start Round";
    startBtnDiv.appendChild(startBtn);
    scoreDiv.appendChild(usernameH4);
    scoreDiv.appendChild(scorecardH3);
    replayBtn.innerText = "Play Again";
    mainMenuBtn.innerText = "Main Menu";
    endMenuDiv.appendChild(endMessageP);
    endMenuDiv.appendChild(replayBtn);
    endMenuDiv.appendChild(mainMenuBtn);
// ============================================================== //