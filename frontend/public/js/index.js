const canvas = document.getElementById("window");
const c = canvas.getContext("2d");
const targets = [];
const clicks = [];
let score = 0
let missCounter = 0
canvas.width = innerWidth;
canvas.height = innerHeight;

class Target {
    constructor(x, y, radius) {
        this.radius = radius
        this.x = x
        this.y = y
        this.color = getRandomColor()  
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.closePath
        c.fillStyle = this.color
        c.fill()
        
    }

    update() {
        this.draw()
    }
}

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

document.addEventListener("DOMContentLoaded", function() {
    startRound();
})

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

function startRound() {
    window.addEventListener('mousedown', (mc) => {
        // clicks.push(new Click(mc.clientX, mc.clientY))
        targetHit(mc.clientX, mc.clientY);
    })
    setInterval(addTarget, 500)
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
}

function targetHit(x, y) {
    priorScore = score
    targets.forEach(t => {
        if (Math.sqrt((x-t.x)*(x-t.x) + (y-t.y)*(y-t.y)) < t.radius) {
            targets.splice(targets.indexOf(t), 1)
            score++
            console.log("Score: " + score)
            hitSpray(t)
        }
    })
    if (priorScore === score) {
        console.log("Misses: " + ++missCounter)
    }
}

function hitSpray(targetHit) {

}

function insideTarget(mX, mY, tX, tY, tR) {
    Math.sqrt((mX-tX)*(mX-tX) + (mY-tY)*(mY-tY)) <= tR ? true : false
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    // clicks.forEach((click) => {
    //     click.update();
    // })
    targets.forEach((target) => {
        target.update();
    })
}

animate()





