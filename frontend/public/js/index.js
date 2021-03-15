const BASE_URL = "http://localhost:3000/";
// canvas build
    const canvasDiv = document.querySelector(".canvas")
    const canvas = document.createElement("canvas");
    canvas.hidden = true
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    canvasDiv.appendChild(canvas)
    const c = canvas.getContext("2d");
// 
// scorecard w/ space for username
    const scoreDiv = document.querySelector(".scorecard");
    const scorecardH3 = document.createElement("h3");
    const usernameH4 = document.createElement("h4");
    scorecardH3.hidden = true
    usernameH4.hidden = true
    scoreDiv.appendChild(usernameH4);
    scoreDiv.appendChild(scorecardH3);
// 
// error logging div
    const errorDiv = document.querySelector(".alert");
// 
// user login form/btn
    const userForm = document.forms["login-signup"];
    const loginBtn = document.getElementById("loginBtn");
// start btn create
    const startBtnDiv = document.querySelector(".start-game-btn")
    const startBtn = document.createElement("button")
    startBtn.hidden = true;
// 
// end menu with replay/main menu buttons and
// either loss message or final score
    const endMenuDiv = document.querySelector(".end-menu");
    const replayBtn = document.createElement("button");
    replayBtn.hidden = true;
    replayBtn.innerText = "Play Again"
    const mainMenuBtn = document.createElement("button");
    mainMenuBtn.hidden = true;
    mainMenuBtn.innerText = "Main Menu"
    const endMessageP = document.createElement("p");
    endMessageP.hidden = true;
    endMenuDiv.appendChild(endMessageP);
    endMenuDiv.appendChild(replayBtn);
    endMenuDiv.appendChild(mainMenuBtn);
// 
let targets = [];
let score = 0;
let missCounter = 0;
let stop = 0

// const clicks = [];

class Target {
    // build target from params
    constructor(x, y, radius) {
        this.radius = radius
        this.x = x
        this.y = y
        this.color = getRandomColor() 
        
    }

    // draw target on canvas
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.closePath
        c.fillStyle = this.color
        c.fill()
    }

    // update canvas with locations (or lack of) of targets
    update() {
        this.draw()
    }
};

// do things after DOM is completely loaded
// should be used to load main menu of game where users login/view stats/view leaderboard
document.addEventListener("DOMContentLoaded", function() {
    loadMainMenu();
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value
        userLoginOrSignup(username);
    })
    
    // startRound();
});

function loadMainMenu() {
    fetchGames();
} 

function fetchGames() {
    return fetch(BASE_URL + "games")
        .then(response => {
            return response.json()
        })
        .then(object => {
            console.log(object)
            populateLeaderboard(object);
        })
        .catch(error => {
            let note = "There are no scores yet!"
            renderError(error, note);
        } )
}

function renderError(er, note) {
    let erP = document.createElement("p");
    erP.innerHTML = note;
    errorDiv.appendChild(erP);
    console.log(er)
}

function populateLeaderboard(games) {
    // builds and populates leaderboard to display on Main Menu
}


function userLoginOrSignup(user) {
    console.log(`Login button pressed with username: ${user}`)
    return fetch(BASE_URL + "users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( {
            username: user
        } )
    } )
        .then(function(response) {
            return response.json()
        } )
        .then(function(object) {
            userForm.hidden = true
            userMenu(object.username)
        } )
        .catch(function(error) {
            alert("Something went wrong.")
            console.log(error.message)
        } )
}

function userMenu(username) {
    reset();
    replayBtn.hidden = true;
    mainMenuBtn.hidden = true;
    endMessageP.hidden = true;
    scorecardH3.hidden = true
    usernameH4.hidden = true
    userForm.hidden = true
    startBtn.setAttribute('class', 'startBtn')
    startBtn.innerText = "Start Round"
    startBtnDiv.appendChild(startBtn)
    startBtn.hidden = false
    startBtn.addEventListener('click', () => {
        startBtn.hidden = true
        usernameH4.innerHTML = username
        

        startRound();
    })
    
}

// function buildCanvas() {
//     // build canvas and set to global canvas and context(c) variables
//     canvas(); 
//     canvas.width = innerWidth;
//     canvas.height = innerHeight;
//     canvasDiv.appendChild(canvas)
// }

// listens for mousedown and starts target generating loop
function startRound() {
    reset();
    scorecardH3.hidden = false
    scorecardH3.innerHTML = score
    replayBtn.hidden = true;
    mainMenuBtn.hidden = true;
    endMessageP.hidden = true;
    usernameH4.hidden = false
    canvas.hidden = false
    window.addEventListener('mousedown', (mc) => {
        // clicks.push(new Click(mc.clientX, mc.clientY))
        targetHit(mc.clientX, mc.clientY);
    })
    addTargets();
};

function reset() {
    missCounter = 0
    score = 0
    stop = 1
    targets = []
}

// random color generator, can be refactored into single but super confusing line
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// generates random target params within limits and adds to targets array
function addTargets() {
    stop = 0
    let targetInterval = setInterval(() => {
    if (targets.length > 29) {
        let state = "loss"
        endGame(state)
    }
    let radius = Math.random() * (30 - 12) + 12
    let x = Math.random() * (canvas.width)
    let y = Math.random() * (canvas.height)
    while(x < (canvas.width / 10) || x > 9 * (canvas.width / 10)) {
        x = Math.random() * (canvas.width)
    }
    while(y < (canvas.height / 8) || y > 7 * (canvas.height / 8)) {
        y = Math.random() * (canvas.height)
    }
    targets.push(new Target(x, y, radius))
    if (stop === 1) {
        clearInterval(targetInterval)        
    }
    }, 500)
    
};

// checks if mousedown coordinates are within any target radii
// if within -> removes target from array, adds to score, **needs to have cool animation**
// if score doesn't go up, registers as miss, adds to missCounter
function targetHit(x, y) {
    priorScore = score
    targets.forEach(t => {
        if (Math.sqrt((x-t.x)*(x-t.x) + (y-t.y)*(y-t.y)) <= t.radius) {
            targets.splice(targets.indexOf(t), 1)
            scorecardH3.innerHTML = ++score
            hitSpray(t)
        }
    })
    if (priorScore === score) {
        missCounter++
        if (missCounter < 5){
            if (score <= 0) {
                score = 0
                scorecardH3.innerHTML = score
            } else {
                scorecardH3.innerHTML = --score
            }
        } else {
            stop = 1
            submitScore(usernameH4.value, score);
        }
    }
};


function hitSpray(targetHit) {
    // insert cool animation for target hit here
};

function submitScore(user, score) {
    console.log(`Game submitting with username: ${user} and score: ${score}.`)
    return fetch(BASE_URL + "games", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( {
            username: user,
            game: score
        } )
    } )
        .then(function(response) {
            return response.json()
        } )
        .then(function(object) {
            let state = "win"
            endGame(state, object)
        } )
        .catch(function(error) {
            alert("Something went wrong while submitting score")
            console.log(error.message)
        } )
}

function endGame(state, score) {
    // displays end screen, calls submitScore() and gives option to start again or return to main menu
    canvas.hidden = true;
    replayBtn.hidden = false;
    mainMenuBtn.hidden = false;
    endMessageP.hidden = false;
    if (state === "loss" ) {
        endMessageP.innerHTML = "You couldn't keep up!"
    }
    if (state === "win" ) {
        endMessageP.innerHTML = `Congratulations! You finished with ${score} points!`
    }
    replayBtn.addEventListener("click", function() {
        startRound();
    })
    mainMenuBtn.addEventListener("click", function() {
        userMenu(usernameH4.value);
    })

}



// frame request loop that updates targets every frame
function animate() {
    // while (stop === 0) {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    // clicks.forEach((click) => {
    //     click.update();
    // })
    targets.forEach((target) => {
        target.update();
    })
    
};

animate();







// const myGameArea = {
//     canvas: document.createElement("canvas"),
//     start: function() {
//         this.canvas.width = innerWidth;
//         this.canvas.height = innerHeight;
//         this.context = this.canvas.getContext("2d");
//         document.body.insertBefore(this.canvas, document.body.childNodes[0]);
//         startRound();
//     }
//     // add user login to track highscores, stats, etc..
// }

// let targetRandomizer = function() {
//     x: Math.random() * myGameArea.canvas.width;
//     y: Math.random() * myGameArea.canvas.height;
//     radius: Math.random() * (150 - 10) + 10;
//     color: getRandomColor();
// }

// class Click {
//     constructor(x, y) {
//         this.radius = 2
//         this.x = x
//         this.y = y
//         this.color = "white"  
//     }

//     draw() {
//         c.beginPath()
//         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
//         c.closePath
//         c.fillStyle = this.color
//         c.fill()
        
//     }

//     update() {
//         this.draw()
//     }
// }