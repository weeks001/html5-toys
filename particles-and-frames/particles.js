class Particle {
    constructor(pos, vel, color, age){
        this.pos = pos;     //vector
        this.vel = vel;     //vector
        this.color = color; //string
        this.age = age;     //int
    }
}

class ParticleSystem {
    constructor(pos){
        this.pos = pos;
        this.minSpeed = 30;
        this.maxSpeed = 200;
        this.gravity = new Vector(0, 15);
        this.maxAge = 1;
        this.minParticles = 100;
        this.particles = [new Particle(new Vector(this.pos.u, this.pos.v), this.getVelocity(), this.getRandColor(), 0)];
        this.copies = [];
    }
    getVelocity() {
        var vel = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        return vel.scale(this.getRand(this.minSpeed, this.maxSpeed));
    }
    getRandColor() {
        return "rgb(" + this.getRand(0,255) + ","  + this.getRand(0,255) + "," + this.getRand(0,255) + ")";
    }
    getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    createParticle(){
        this.particles.push(new Particle(new Vector(this.pos.u, this.pos.v), this.getVelocity(), this.getRandColor(), Math.random() * this.maxAge));
    }
    createFilledParticle(pos, vel, color, age){
        this.particles.push(new Particle(pos, vel, color, age));
    }
    start(){
        while (this.particles.length < this.minParticles) {
            this.createParticle();
        }
    }
    update(timePassed){
        for (p of this.particles) {
            p.vel = p.vel.adds(timePassed, this.gravity);
            p.pos = p.pos.adds(timePassed, p.vel);
            p.age += timePassed;

            if (p.age > this.maxAge) {
                this.resetParticle(p);
            }
        }
    }
    resetParticle(particle){
        particle.age = Math.random() * this.maxAge;
        particle.pos = new Vector(this.pos.u, this.pos.v);
        particle.vel = this.getVelocity();
        particle.color = this.getRandColor();
    }
}

delay = 20;
var clipping = 1;
var frame1 = new Frame(new Vector(50,100), new Vector(200,0), new Vector(0,200));
var frame2 = new Frame(new Vector(550,100), new Vector(200,0), new Vector(0,200));
var frame3 = new Frame(new Vector(150,550), new Vector(50,0), new Vector(0,100));
var frame4 = new Frame(new Vector(650,550), new Vector(50,0), new Vector(0,100));
var ps = new ParticleSystem(new Vector(200,200));
var relativeX = 0;
var relativeY = 0;
ps.start();

$("#myCanvas").mousemove(function(event){
    var canvasX = $("#myCanvas").offset().left;
    var canvasY = $("#myCanvas").offset().top;
    var mouseX = event.pageX;
    var mouseY = event.pageY;

    relativeX = mouseX - canvasX;
    relativeY = mouseY - canvasY;

    ps.pos = new Vector(relativeX, relativeY);
});

$(document).keydown(function(event) {
    let O = 79; I = 73; J = 74; C = 67; Q = 81; X = 88; Y = 89;
    if (event.which == C) {
        clipping = !clipping;
    }
    if (event.which == O) {
        frame2.O = new Vector(relativeX, relativeY);
    }
    if (event.which == I) {
        frame2.I = new Vector(relativeX, relativeY).subtract(frame2.O);
    }
    if (event.which == J) {
        frame2.J = new Vector(relativeX, relativeY).subtract(frame2.O);
    }
    if (event.which == Q) {
        frame4.O = new Vector(relativeX, relativeY);
    }
    if (event.which == X) {
        frame4.I = new Vector(relativeX, relativeY).subtract(frame4.O);
    }
    if (event.which == Y) {
        frame4.J = new Vector(relativeX, relativeY).subtract(frame4.O);
    }
});

function isInsideRect(particle, frame) {
    let local = frame.toLocalPoint(particle.pos);
    return (local.u > 0 && local.v > 0 && local.u <= 1 && local.v <= 1);
}

function isInsideOval(particle, frame) {
    return frame.toLocalPoint(particle.pos).mag() <= 1;
}

function copyParticle(particle, frame1, frame2) {
    //use first frame to get particle pos in local coord
    let localPos = frame1.toLocalPoint(particle.pos);
    //use second frame to convert back to global coord
    let globalPos = frame2.toGlobalPoint(localPos);
    //draw particle at new coord
    drawParticle(new Particle(globalPos, particle.vel, particle.color, particle.age));
}

function drawParticle(p) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = p.color;
    ctx.fillRect(p.pos.u,p.pos.v,3,3);
}

function redraw() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();

    for (p of ps.particles) {
        drawParticle(p);
        if (clipping && isInsideRect(p, frame1)){
            copyParticle(p, frame1, frame2);
            continue;
        }
        if (clipping && isInsideOval(p, frame3)){
            copyParticle(p, frame3, frame4);
        }
    }
    ps.update(delay / 1000.0);
    frame1.draw();
    frame2.draw();
    frame3.drawPortal("#FFA500");
    frame4.drawPortal("#0000FF");
}

setInterval(redraw, delay);