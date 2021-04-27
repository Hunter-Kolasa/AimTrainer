// ====== MAIN APPLICATION FUNCTIONS/ASSETS ====== //
  // Req: Object-Oriented JS
  class Target {
    // build target from params
    constructor(x, y, radius) {
      this.radius = radius;
      this.x = x;
      this.y = y;
      this.color = getRandomColor();
    }

    // draw target on canvas
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.closePath;
      c.fillStyle = this.color;
      c.fill();
    }

    // update canvas with locations (or lack of) of targets
    update() {
      this.draw();
    }
  }

  // should be used to load main menu of game where users login/view stats/view leaderboard
  document.addEventListener("DOMContentLoaded", function () {
    loadMainMenu();
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      usernameH4.innerHTML = username;
      userLoginOrSignup(username);
    });
    startBtn.addEventListener("click", (e) => {
      // e.preventDefault();
      startRound();
    });
    replayBtn.addEventListener("click", function (e) {
      // e.preventDefault();
      startRound();
    });
    mainMenuBtn.addEventListener("click", function (e) {
      // e.preventDefault();
      // userLoginOrSignup(usernameH4.innerHTML);
      userMenu(currentUser);
    });
    canvas.addEventListener("mousedown", (mc) => {
      targetHit(mc.clientX, mc.clientY);
    });
  });

  function loadMainMenu() {
    setToHidden([canvas, replayBtn, mainMenuBtn, startBtn]);
    fetchGames();
  }
  // ---- AJAX calls ----
    // Req: 1) 3+ ajax covering 2+ CRUD. 2) Must use fetch. 3)Client-server communication 
  function fetchGames() {
    return fetch(BASE_URL + "games")
      .then((response) => {
        return response.json();
      })
      .then((object) => {
        // console.log(object)
        populateLeaderboard(object);
      })
      .catch((error) => {
        let note = "There are no scores yet!";
        renderError(error, note);
      });
  }

  function userLoginOrSignup(user) {
    console.log(user)
    return fetch(BASE_URL + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: user,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        userId = object.id
        // currentUser = object
        console.log(object)
        userMenu(object);
      })
      .catch(function (error) {
        console.log(error)
        alert("You need to enter a username!");
      });
  }

  function submitScore(score) {
    console.log(`Game submitting with id: ${userId} and score: ${score}.`)
    return fetch(BASE_URL + `users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: userId,
        score: score,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        state = "win";
        console.log(object);
        currentUser = object
        endGame(state, object);
      })
      .catch(function (error) {
        console.log(error)
        state = "loss";
        endGame(state);
      });
  }
  // --- End AJAX calls ---

  function populateLeaderboard(games) {
    if(games) {
      games.forEach(g => {
        let gameP = document.createElement("p");
        gameP.setAttribute("class", "leaderboard-score");
        gameP.innerHTML = g.score;
        leaderDiv.appendChild(gameP);
      });
    } else {
      let error = "No games"
      let note = "You haven't recorded any scores yet!"
      renderError(error, note);
    }
  }

  function userMenu(user) {
    reset();
    leaderDiv.appendChild(leaderH2);
    leaderH2.innerHTML = "Your Top Scores";
    populateLeaderboard(user.games);
    setToHidden([userForm, usernameH4, replayBtn, mainMenuBtn, endMessageP, scorecardH3]);
    setToVisible([startBtn, leaderDiv]);
  }

  // listens for mousedown and starts target generating loop
  function startRound() {
    reset();
    scorecardH3.innerHTML = score;
    setToHidden([leaderDiv, startBtn, errorDiv]);
    setToVisible([scorecardH3, usernameH4, canvas]);
    targetInterval = setTimeout(addTargets, interval);
  }

  // generates random target params within limits and adds to targets array
  function addTargets() {
    if (targets.length > 29) {
      console.log("Score: " + score)
      submitScore(score);
    }
    targetDraw();
    targetInterval = setTimeout(addTargets, interval);
  }

  function targetDraw() {
    let radius = Math.random() * (30 - 12) + 12;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    while (x < canvas.width / 10 || x > 9 * (canvas.width / 10)) {
      x = Math.random() * canvas.width;
    }
    while (y < canvas.height / 8 || y > 7 * (canvas.height / 8)) {
      y = Math.random() * canvas.height;
    }
    targets.push(new Target(x, y, radius));
  }

  // checks if mousedown coordinates are within any target radii
  // if within -> removes target from array, adds to score, **add cool animation??**
  // if score doesn't go up, registers as miss, adds to missCounter
  function targetHit(x, y) {
    priorScore = score;  
    targets.forEach((t) => {
      if (Math.sqrt((x - t.x) * (x - t.x) + (y - t.y) * (y - t.y)) <= t.radius) {
        targets.splice(targets.indexOf(t), 1);
        scorecardH3.innerHTML = ++score;
        interval = interval * 0.99
        //   hitSpray(t);
      }
    });
    if (priorScore === score) {
      missCounter++;
      if (missCounter > 4) {
      //   if (score <= 0) {
      //     score = 0;
      //     // scorecardH3.innerHTML = score;
      //   } else {
      //     scorecardH3.innerHTML = --score;
      //   }
      // } else {
        submitScore(score);
      }
    }
  }

  // function hitSpray(targetHit) {
  //   // insert cool animation for target hit here
  // }

  // displays end screen, calls submitScore() and gives option to start again or return to main menu
  function endGame(state, userGameObject) {
    reset();
    setToHidden([canvas]);
    setToVisible([replayBtn, mainMenuBtn, endMessageP])
    if (state === "loss") {
      endMessageP.innerHTML = "Oh no! You had a score of zero!";
    }
    if (state === "win") {
      endMessageP.innerHTML = `Congratulations, ${userGameObject.user.username}! You finished with ${userGameObject.game.score} points!`;
    }
  }

  // frame request loop that updates targets every frame
  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    targets.forEach((target) => {
      target.update();
      // const updateFn = target.update
      // updateFn()
    });
  }

  animate();
// ========= END MAIN FUNCTIONS ========= //

// ========= HELPERS ========= //
  function setToHidden(elementArray) {
    elementArray.forEach((e) => (e.hidden = true));
  }
  function setToVisible(elementArray) {
    elementArray.forEach((e) => (e.hidden = false));
  }
  function reset() {
    leaderDiv.innerHTML = "";
    clearTimeout(targetInterval);
    interval = 1000
    missCounter = 0;
    score = 0;
    priorScore = 0;
    targets = [];
  }
  // random color generator, can be refactored into single but super confusing line
  function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  function renderError(er, note) {
    setToVisible([errorDiv]);
    let erP = document.createElement("p");
    erP.innerHTML = note;
    errorDiv.appendChild(erP);
    //   console.log(er)
  }
// ========= END HELPERS ========= //
