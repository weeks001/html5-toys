class Circle {
    constructor(center, radius=1, rotation=0.0) {
        this.center = center;
        this.radius = radius;
        this.rotation = rotation; //in radians
    }
    draw() {
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");

        ctx.beginPath();
        ctx.arc(this.center.u, this.center.v, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    getFrame() {
        let I = new Vector(Math.cos(this.rotation), Math.sin(this.rotation)).scale(this.radius);
        let J = new Vector(-Math.sin(this.rotation), Math.cos(this.rotation)).scale(this.radius);
        return new Frame(this.center,I, J);
    }
    get circumference() {
        return 2 * Math.PI * this.radius;
    }
    interpolate(circle, s) {
        return new Circle(this.center.copy(), lerp(this.radius, circle.radius, s), this.rotation);
    }
}

class Spirograph {
    constructor(inner, outer, point, step, second, color) {
        this.inner = inner;
        this.outer = outer;
        this.point = point;
        this.step = step;
        this.second = second;
        this.color = color;
    }
    interpolate(spirograph, s) {
        return new Spirograph(
            this.inner.interpolate(spirograph.inner, s),
            this.outer.interpolate(spirograph.outer, s),
            this.point.interpolate(spirograph.point, s),
            lerp(this.step, spirograph.step, s),
            lerp(this.second, spirograph.second, s),
            this.color.interpolate(spirograph.color, s)
        );
    }
}

//Least Common Multiple
function LCM(n,s) {
    n = Math.floor(Math.abs(n));
    s = Math.floor(Math.abs(s));
    for (let i = Math.max(n,s); i <= n*s; i++) {
        if (i % n == 0 && i % s == 0) {
            return i;
        }
    }
}

class LerpySpirograph {
    constructor(center, sizeFactor, randomColor) {
        this.lastState = new Spirograph(
            new Circle(new Vector(0,0)), 
            new Circle(center.copy()), 
            new Vector(0,0), 
            1, 
            -1000, 
            new Color(0,0,0)
        );
        this.nextState = this.lastState;
        this.sizeFactor = sizeFactor;
        this.randomColor = randomColor;
    }
    draw() {
        let duration = 10;
        let time = (new Date().getTime() - start) / 1000;
        let s = (time - this.lastState.second) / duration;
        let x = this.lastState.interpolate(this.nextState, Math.sin(Math.min(s, 1)* Math.PI/2));

        if (s >= 1) {
            this.lastState = x;
            this.lastState.second = Math.floor(time);
            this.nextState = new Spirograph(
                new Circle(this.lastState.inner.center, this.sizeFactor * lerp(20, 50, Math.random())*(Math.random()>0.5?1:-1), this.lastState.inner.rotation),
                new Circle(this.lastState.outer.center, this.sizeFactor * lerp(150, Math.min(c.width, c.height)*0.4, Math.random()), this.lastState.outer.rotation),
                new Vector(lerp(0.1, 2, Math.random()), lerp(0.1, 2, Math.random())),
                Math.pow(10, lerp(-2.0, 0, Math.random())),
                Math.floor(time),
                this.randomColor()
            );
        } 
        let maxAngle = 1000;
        drawSpirograph(x.inner, x.outer, x.point, x.step, 100 / x.step, x.color);
    }
}

Array.prototype.pop = function(index) {
    return this.splice(index, 1)[0];
};

class Palette {
    constructor(name, colors) {
        this.name = name;
        this.colors = colors;
    }
    getColors(n) {
        shuffle(this.colors);
        let colorSet = [];
        for (let i = 0; i < n; i++) {
            colorSet.push(this.colors[i]);
        }
        return colorSet;
    }
}

class PaletteMaster {
    constructor() {
        this.buffers = [ [], [], [] ];
        this.palettes = [
            // new Palette("Avoidance", [HSB(,,), HSB(,,), HSB(,,), HSB(,,), HSB(,,)]),
            new Palette("Aspirin C", [HSB(206,72,47), HSB(186,87,64), HSB(182,29,95), HSB(85,11,100), HSB(32,100,92)]),
            new Palette("Honey Pot", [HSB(186,84,39), HSB(52,16,100), HSB(45,69,100), HSB(38,75,86), HSB(10,73,74)]),
            new Palette("Flat UI", [HSB(210,45,31), HSB(6,74,91), HSB(192,2,95), HSB(204,76,86), HSB(204,78,73)]),
            new Palette("Vitamin C", [HSB(194,100,35), HSB(166,78,54), HSB(71,74,86), HSB(52,90,100), HSB(28,100,99)]),
            new Palette("Sea Wolf", [HSB(6,85,86), HSB(46,27,85), HSB(175,15,25), HSB(150,5,17), HSB(240,6,13)]),
            new Palette("Cherry Cheesecake", [HSB(357,90,73), HSB(0,64,30), HSB(49,39,96), HSB(56,11,99), HSB(36,63,74)]),
            new Palette("CS04", [HSB(61,41,97), HSB(226,26,27), HSB(190,44,83), HSB(145,8,93), HSB(351,80,92)]),
            new Palette("Friends and Foes", [HSB(278,19,20), HSB(182,99,65), HSB(172,81,85), HSB(85,53,95), HSB(60,35,100)]),
            new Palette("Pear Lemon Fizz", [HSB(180,98,75), HSB(137,20,99), HSB(54,58,97), HSB(79,59,81), HSB(92,73,56)]),
            new Palette("Ocean Sunset", [HSB(163,29,35), HSB(58,21,61), HSB(36,42,100), HSB(25,69,100), HSB(11,83,96)]),
            new Palette("Time's Changing", [HSB(302,28,20), HSB(347,23,39), HSB(15,67,97), HSB(25,69,100), HSB(39,18,64)]),
            new Palette("Ventana Azul", [HSB(349,77,95), HSB(40,99,96), HSB(87,7,95), HSB(180,66,85), HSB(186,72,75)]),
            new Palette("Flat Design Colors 1", [HSB(202,45,36), HSB(168,61,70), HSB(46,68,94), HSB(22,72,89), HSB(7,67,87)]),
            new Palette("Woman in Purple Dress", [HSB(43,31,98), HSB(18,34,90), HSB(354,67,80), HSB(340,57,45), HSB(313,57,19)]),
            new Palette("Avoidance", [HSB(318,100,37), HSB(276,33,20), HSB(190,100,41), HSB(168,100,52), HSB(73,100,71)]),
            new Palette("Japanese Lanterns", [HSB(351,64,30), HSB(56,52,94), HSB(70,61,66), HSB(171,57,41), HSB(120,31,11)])
        ];
    }
    addPalette() {
        let palette = this.randomPalette().slice(0);
        for (let i = 0; i < this.buffers.length; i++){
            this.buffers[i].push(palette.pop(Math.floor((Math.random() * palette.length))));
        }
    }
    randomPalette() {
        return this.palettes[Math.floor(this.palettes.length * Math.random())].colors; 
    }
    getColor(i){
        if (this.buffers[i].length == 0) {
            this.addPalette();
        }
        return this.buffers[i].pop(0);
    }
}

function HSB(h, s, b) {
    s = s / 100.0;
    b = b / 100.0;
    let l =  0.5 * b * (2 - s);
    let newS = b*s / (1 - Math.abs(2 * l - 1));
    console.log(l + ", " + b*s / (1 - Math.abs(2 * l - 1)));
    return new Color(h, newS*100, l*100);
} 

class Color {
    constructor(h, s, l) {
        this.h = Math.floor(h);
        this.s = Math.floor(s);
        this.l = Math.floor(l);
    }
    interpolate(color, s) {
        return new Color(
            lerp(this.h, color.h, s),
            lerp(this.s, color.s, s),
            lerp(this.l, color.l, s)
        );
    }
    get string() {
        return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
    }
}

var c = document.getElementById("myCanvas");
var delay = 20;
var start = new Date().getTime(); 
var pm = new PaletteMaster();

// For other draw funcions: 
// var outer = new Circle(new Vector(c.width/2,c.height/2), 200, 0);
// var inner = new Circle(new Vector(0,0), 50, 0);
// var point = new Vector(1,1);
// var points = [];
// var loopRadians = 500;

// Live redraw of spirograph
function redraw() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();

    let theta = (new Date().getTime() - start) / 1000;
    inner.center = outer.center.add(new Vector(Math.cos(theta), Math.sin(theta)).scale(outer.radius - inner.radius));
    inner.rotation = (theta * outer.radius) / inner.radius;

    outer.draw();
    inner.draw();

    let gPoint = inner.getFrame().toGlobalPoint(point);
    let sPoint = inner.getFrame().toGlobalPoint(new Vector(0,0));
    ctx.moveTo(sPoint.u, sPoint.v);
    ctx.lineTo(gPoint.u, gPoint.v);
    ctx.stokeStyle = "#76dce8";
    ctx.stroke();

    ctx.fillStyle = "#2eb3c1";
    ctx.fillRect(gPoint.u, gPoint.v, 5, 5);
    
    points.push(gPoint);
    ctx.beginPath();
    for (let p = 0; p < points.length; p++) {
        if (p == 0) {
            ctx.moveTo(points[p].u, points[p].v);
        } else {
            ctx.lineTo(points[p].u, points[p].v);
        }
    }
    ctx.strokeStyle = "#2eb3c1";
    ctx.stroke();    
}

// Draw given spirograph
function drawSpirograph(inner, outer, point, step, iterations, color) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();

    for (let iter = 0; iter < iterations; iter++) {
        let t = iter*step;
        inner.center = outer.center.add(new Vector(Math.cos(t), Math.sin(t)).scale(outer.radius - inner.radius));
        inner.rotation = (t * outer.radius) / inner.radius;
        let gPoint = inner.getFrame().toGlobalPoint(point);

        if (t == 0) {
            ctx.moveTo(gPoint.u, gPoint.v);
        } else {
            ctx.lineTo(gPoint.u, gPoint.v);
        }  
    }
    ctx.strokeStyle = color.string;
    ctx.stroke();
    ctx.closePath();
}
 
 // Draw a specfic spirograph over a given number of iterations
function drawPattern() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();

    let time = (new Date().getTime() - start) / 1000;
    let point = new Vector(3 * Math.sin(time), Math.cos(time * 0.7));
    inner.radius = lerp(-30, 30, Math.sin(time * 0.07)/2 + 0.5);
    outer.radius = (Math.cos(time * 0.003) + 2) * 100;

    drawSpirograph(inner, outer, point, 1, 500, HSB(186,87,64));
}

function clear() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();

}

function drawPalettes() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    pm.palettes.forEach((p,i) => {
        p.colors.forEach((c,j) => {
            ctx.beginPath();
            ctx.rect(50 * j,50 * i,50,50);
            ctx.fillStyle = c.string;
            ctx.fill();
            ctx.closePath();
        });
    });
}

var spiro1 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 0.5, () => pm.getColor(0));
var spiro2 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 1, () => pm.getColor(1));
var spiro3 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 2, () => pm.getColor(2));

setInterval(() => {
    clear();
    spiro1.draw();
    spiro2.draw();
    spiro3.draw();
    // drawPalettes();
}, delay);

