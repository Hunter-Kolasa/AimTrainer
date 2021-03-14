const BASE_URL = "http://localhost:3000/";
const canvasDiv = document.querySelector(".canvas")
const canvas = document.createElement("canvas");
canvas.hidden = true
canvas.height = innerHeight;
canvas.width = innerWidth;
canvasDiv.appendChild(canvas)
const c = canvas.getContext("2d");
const errorDiv = document.querySelector(".alert");
const userForm = document.forms["login-signup"];
const loginBtn = document.getElementById("loginBtn");
const targets = [];
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
            userMenu(object)
        } )
        .catch(function(error) {
            alert("Something went wrong.")
            console.log(error.message)
        } )
}

function userMenu(user) {
    const startBtnDiv = document.querySelector(".start-game-btn")
    const startBtn = document.createElement("button")
    startBtn.setAttribute('class', 'startBtn')
    startBtn.innerText = "Start Round"
    startBtnDiv.appendChild(startBtn)
    startBtn.addEventListener('click', () => {
        userForm.hidden = true
        startBtn.hidden = true
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
    canvas.hidden = false
    window.addEventListener('mousedown', (mc) => {
        // clicks.push(new Click(mc.clientX, mc.clientY))
        targetHit(mc.clientX, mc.clientY);
    })
    addTargets();
};

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
    setInterval(() => {
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
            score++
            console.log("Score: " + score)
            hitSpray(t)
        }
    })
    if (priorScore === score) {
        console.log("Misses: " + ++missCounter)
    }
};


function hitSpray(targetHit) {
    // insert cool animation for target hit here
};

function endGame() {
    // displays end screen, calls submitScore() and gives option to start again or return to main menu
}

function submitScore() {
    // sends fetch() post back to API
}

// frame request loop that updates targets every frame
function animate(stop = 0) {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    // clicks.forEach((click) => {
    //     click.update();
    // })
    targets.forEach((target) => {
        target.update();
    })
    if (targets.length > 30) {

    }
    //***** */ if stop = 0 *****
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