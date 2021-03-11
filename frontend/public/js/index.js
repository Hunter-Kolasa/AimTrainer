const canvas = document.getElementById("game-window");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const userForm = document.forms["login-signup"];
const loginBtn = document.getElementById("loginBtn");
const targets = [];
let score = 0;
let missCounter = 0;


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
    
    // startRound();
});

function loadMainMenu() {
    
}

function userLoginOrSignup(user, p) {
    console.log(`Login button pressed with username: ${user} and password: ${p}`)
    return fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( {
            username: user,
            password_digest: p
        } )
    } )
        .then(function(response) {
            return response.json()
        } )
        .then(function(object) {
            userMenu(object)
        } )
        .catch(function(error) {
            alert("Oofingest oof, something went wrong.")
            console.log(error.message)
        } )
}

function userMenu(user) {

}

// listens for mousedown and starts target generating loop
function startRound() {
    function drawCanvas() {
        
    }
    window.addEventListener('mousedown', (mc) => {
        // clicks.push(new Click(mc.clientX, mc.clientY))
        targetHit(mc.clientX, mc.clientY);
    })
    setInterval(addTarget, 500)
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
function addTarget() {
    const radius = Math.random() * (30 - 12) + 12
    let x = Math.random() * (canvas.width)
    let y = Math.random() * (canvas.height)
    while(x < (canvas.width / 10) || x > 9 * (canvas.width / 10)) {
        x = Math.random() * (canvas.width)
    }
    while(y < (canvas.height / 8) || y > 7 * (canvas.height / 8)) {
        y = Math.random() * (canvas.height)
    }
    targets.push(new Target(x, y, radius))
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

// insert cool animation for target hit here
function hitSpray(targetHit) {

};

// frame request loop that updates targets every frame
function animate() {
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



// const clicks = [];

// helper function for checking if mosue coords inside target radius
// function insideTarget(mX, mY, tX, tY, tR) {
//     Math.sqrt((mX-tX)*(mX-tX) + (mY-tY)*(mY-tY)) <= tR ? true : false
// }

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
//         this.x = x - 8
//         this.y = y - 8
//         this.color = "#000000"  
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