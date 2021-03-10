
const canvas = document.getElementById("window");
const c = canvas.getContext("2d");
const targets = [];
canvas.width = innerWidth;
canvas.height = innerHeight;

document.addEventListener("DOMContentLoaded", function() {
    startRound();
    window.addEventListener('click', (mc) => {
        targetHit(mc.clientX, mc.clientY);
    })
})

class Target {
    constructor() {
        this.radius = Math.random() * (30 - 2) + 2
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
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
    setInterval(addTarget, 1000)
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
    targets.push(new Target())
    console.log(targets)
}

function targetHit(x, y) {
    targets.forEach(t => {
        if (Math.sqrt((x-t.x)*(x-t.x) + (y-t.y)*(y-t.y)) < t.radius) {
            targets.splice(targets.indexOf(t), 1)
        }
        
    })
}

function insideTarget(mX, mY, tX, tY, tR) {
    Math.sqrt((mX-tX)*(mX-tX) + (mY-tY)*(mY-tY)) < tR ? true : false
}


function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    targets.forEach((target) => {
        target.update();
    })
}

animate()





