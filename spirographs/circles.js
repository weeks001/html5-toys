class Circle {
    constructor(center, radius=1, rotation=0.0) {
        this.center = center;
        this.radius = radius;
        this.rotation = rotation; //in radians
    }
    draw() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
        ctx.arc(this.center.u, this.center.v, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    getFrame() {
        var I = new Vector(Math.cos(this.rotation), Math.sin(this.rotation)).scale(this.radius);
        var J = new Vector(-Math.sin(this.rotation), Math.cos(this.rotation)).scale(this.radius);
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
    constructor(inner, outer, point, step, second, hue) {
        this.inner = inner;
        this.outer = outer;
        this.point = point;
        this.step = step;
        this.second = second;
        this.hue = hue;
    }
    interpolate(spirograph, s) {
        // console.log(this.hue);
        return new Spirograph(
            this.inner.interpolate(spirograph.inner, s),
            this.outer.interpolate(spirograph.outer, s),
            this.point.interpolate(spirograph.point, s),
            lerp(this.step, spirograph.step, s),
            lerp(this.second, spirograph.second, s),
            this.hue.interpolate(spirograph.hue, s)
        );
        //lerp(this.hue, spirograph.hue, s)
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
    constructor(center, sizeFactor, randomHue) {
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
        this.randomHue = randomHue;
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
                this.randomHue()
            );
        } 
        // console.log(this.randomHue);
        // console.log(x.hue);
        let maxAngle = 1000;
        drawSpirograph(x.inner, x.outer, x.point, x.step, 100 / x.step, x.hue);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
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
            // new Palette("Honey Pot", [new Color(16, 91, 99), new Color(255, 250, 213), new Color(255, 211, 78), new Color(219, 158, 54), new Color(189, 73, 50)]),
            new Palette("Aspirin C", [HSB(206,72,47), HSB(186,87,64), HSB(182,29,95), HSB(85,11,100), HSB(32,100,92)]),
            new Palette("Granny Smith Apple", [HSB(86,89,86), HSB(71,63,91), HSB(62,14,96), HSB(71,84,77), HSB(50,85,29)])
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
    constructor(r, g, b) {
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
    }
    interpolate(color, s) {
        return new Color(
            lerp(this.r, color.r, s),
            lerp(this.g, color.g, s),
            lerp(this.b, color.b, s)
        );
    }
    get string() {
        return "hsl(" + this.r + "," + this.g + "%," + this.b + "%)";
    }
}

var c = document.getElementById("myCanvas");
var delay = 20;
var start = new Date().getTime(); 
var palettes = [];
var pm = new PaletteMaster();

// For other draw funcions
// var outer = new Circle(new Vector(c.width/2,c.height/2), 200, 0);
// var inner = new Circle(new Vector(0,0), 50, 0);
// var point = new Vector(1,1);
// var points = [];
// var loopRadians = 500;


// PRETTY COLORS~~ :D
// palettes.push(new Palette("Honey Pot", ['#105b63', '#fffad5', '#ffd34e', '#db9e36', '#bd4932']));
// palettes.push(new Palette("Aspirin C", ['#225378', '#1695A3', '#ACF0F2', '#F3FFE2', '#EB7F00']));
// palettes.push(new Palette("Flat UI", ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9']));
// palettes.push(new Palette("Vitamin C", ['#004358', '#1F8A70', '#BEDB39', '#FFE11A', '#FD7400']));
// palettes.push(new Palette("Sea Wolf", ['#DC3522', '#D9CB9E', '#374140', '#2A2C2B', '#1E1E20']));
// palettes.push(new Palette("Cherry Cheesecake", ['#B9121B', '#4C1B1B', '#F6E497', '#FCFAE1', '#BD8D46']));
// palettes.push(new Palette("CS04", ['#F6F792', '#333745', '#77C4D3', '#DAEDE2', '#EA2E49']));
// palettes.push(new Palette("Friends and Foes", ['#2F2933', '#01A2A6', '#29D9C2', '#BDF271', '#FFFFA6']));
// palettes.push(new Palette("Pear Lemon Fizz", ['#', '#', '#', '#', '#']));
// palettes.push(new Palette("Ocean Sunset", ['#', '#', '#', '#', '#']));
// palettes.push(new Palette("Cote Azur", ['#', '#', '#', '#', '#']));
// palettes.push(new Palette("Ventana Azul", ['#', '#', '#', '#', '#']));
// palettes.push(new Palette("Flat Design Colors 1", ['#', '#', '#', '#', '#']));

// palettes.push(new Palette("Honey Pot", [new Color(16, 91, 99), new Color(255, 250, 213), new Color(255, 211, 78), new Color(219, 158, 54), new Color(189, 73, 50)]));
// palettes.push(new Palette("Aspirin C", [new Color(34, 83, 120), new Color(22, 149, 163), new Color(172, 240, 242), new Color(243, 255, 226), new Color(235, 127, 0)]));
// new Palette("Granny Smith Apple", [new Color(133, 219, 24), new Color(205,232,85), new Color(245,246,212), new Color(167,197,32), new Color(73,63,11)])


// Live redraw of spirograph
function redraw() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
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
    var sPoint = inner.getFrame().toGlobalPoint(new Vector(0,0));
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

//Draw given spirograph
function drawSpirograph(inner, outer, point, step, iterations, hue) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
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
    // ctx.strokeStyle = 'hsl(' + hue + ', 100%, 80%)';
    ctx.strokeStyle = hue.string;

    ctx.stroke();
    ctx.closePath();
}
 
 //Draw a specfic spirograph over a given number of iterations
function drawPattern() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();

    let time = (new Date().getTime() - start) / 1000;
    let point = new Vector(3 * Math.sin(time), Math.cos(time * 0.7));
    inner.radius = lerp(-30, 30, Math.sin(time * 0.07)/2 + 0.5);
    outer.radius = (Math.cos(time * 0.003) + 2) * 100;

    drawSpirograph(inner, outer, point, 1);
}

function clear() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();

}

function drawPalettes() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
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

// let currentPalette = palettes[Math.floor(lerp(0, palettes.length, Math.random()))];
// let chosenColors = currentPalette.getColors(3);

// var spiro1 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 0.5, () => lerp(0, 60, Math.random()));
// var spiro2 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 1, () => lerp(60, 180, Math.random()));
// var spiro3 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 2, () => lerp(180, 240, Math.random()));

var spiro1 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 0.5, () => pm.getColor(0));
var spiro2 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 1, () => pm.getColor(1));
var spiro3 = new LerpySpirograph(new Vector(c.width * 3/4, c.height/2), 2, () => pm.getColor(2));
// console.log(chosenColors[0] + ", " + chosenColors[1] + ", " + chosenColors[2]);
// console.log(spiro1.randomHue);

setInterval(() => {
    clear();
    spiro1.draw();
    spiro2.draw();
    spiro3.draw();
    drawPalettes();
}, delay);

