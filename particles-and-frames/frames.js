class Point{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class Vector {
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }
    add(vec) {
        return new Vector(this.u + vec.u, this.v + vec.v);
    }
    adds(s, vec){
        return new Vector(this.u + (vec.u * s), this.v + (vec.v * s));
    }
    subtract(vec) {
        return new Vector(this.u - vec.u, this.v - vec.v);
    }
    scale(s){
        return new Vector(this.u * s, this.v * s);
    }
    dot(vec){
        return this.u * vec.u + this.v * vec.v;
    }
    mag() {
        return Math.sqrt(this.dot(this));
    }
    toString() {
        return '(${this.u}, ${this.v})';
    }
}

class Frame {
    constructor(O, I, J){
        this.O = O;
        this.I = I;
        this.J = J;
    }
    toLocalPoint(vec){
        let OP = vec.subtract(this.O);
        return this.toLocalVector(OP);
    }
    toLocalVector(vec){
        var i = vec.dot(this.I) / this.I.dot(this.I);
        var j = vec.dot(this.J) / this.J.dot(this.J);
        return new Vector(i,j);
    }
    toGlobalPoint(vec){
        return this.O.add(this.toGlobalVector(vec));
    }
    toGlobalVector(vec){
        return this.I.scale(vec.u).add(this.J.scale(vec.v));
    }
    draw() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
        ctx.arc(this.O.u, this.O.v, 5, 0, 2 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(this.O.u,this.O.v);
        ctx.lineTo(this.toGlobalPoint(new Vector(1,0)).u, 
            this.toGlobalPoint(new Vector(1,0)).v);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.O.u,this.O.v);
        ctx.lineTo(this.toGlobalPoint(new Vector(0,1)).u, 
            this.toGlobalPoint(new Vector(0,1)).v);
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.toGlobalPoint(new Vector(1,0)).u,
            this.toGlobalPoint(new Vector(1,0)).v);
        ctx.lineTo(this.toGlobalPoint(new Vector(1,1)).u, 
            this.toGlobalPoint(new Vector(1,1)).v);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.toGlobalPoint(new Vector(0,1)).u,
            this.toGlobalPoint(new Vector(0,1)).v);
        ctx.lineTo(this.toGlobalPoint(new Vector(1,1)).u, 
            this.toGlobalPoint(new Vector(1,1)).v);
        ctx.stroke();
    }
    drawPortal(color) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
        for (let i = 0; i <= 360; i++){
            let theta = i * 2 * Math.PI / 360;
            let local = new Vector(Math.cos(theta), Math.sin(theta));
            let g = this.toGlobalPoint(local);
            if (i == 0) {
                ctx.moveTo(g.u, g.v);
            } else {
                ctx.lineTo(g.u, g.v);
            }
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}





