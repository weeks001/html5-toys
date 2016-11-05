function lerp(a, b, s) {
    return s * (b - a) + a;
}

class Vector {
    constructor(x, y, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get i() {
        return this.x;
    }
    get j() {
        return this.y;
    }
    get k() {
        return this.z;
    }
    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    adds(s, vec){
        return new Vector(this.x + (vec.x * s), this.y + (vec.y * s), this.z + (vec.z * s));
    }
    subtract(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }
    scale(s){
        return new Vector(this.x * s, this.y * s, this.z * s);
    }
    dot(vec){
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
    cross(vec) {
        return new Vector(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
            );
    }
    mag() {
        return Math.sqrt(this.dot(this));
    }
    normalize() {
        if (this.mag() == 0) {
            return this;
        }
        return new Vector(this.x / this.mag(), this.y / this.mag(), this.z / this.mag());
    }
    interpolate(vec, s) {
        return new Vector(lerp(this.x, vec.x, s), lerp(this.y, vec.y, s), lerp(this.z, vec.z, s));
    }
    copy() {
        return new Vector(this.x, this.y, this.z);
    }
    //R: vector rotating about
    rotate(R, theta) {
        if (R.mag() == 0) {
            return this;
        }
        let K = R.normalize();
        let X = new Vector(1,0,0);
        let Y = new Vector(0,1,0);
        let I = K.cross(X);
        if (I.mag() == 0) {
            I = K.cross(Y);
        }
        let J = I.cross(K);

        let B = new Frame(new Vector(0,0,0), I, J, K);

        let Vp = B.toLocalVector(this);
        let alpha = Math.atan2(Vp.j, Vp.i);
        let mag = Math.sqrt(Vp.i * Vp.i + Vp.j * Vp.j);
        let VP = new Vector(mag * Math.cos(alpha + theta), mag * Math.sin(alpha + theta), Vp.k);
        return B.toGlobalVector(VP);
    }
    toString() {
        return '(${this.x}, ${this.y}, ${this.z})';
    }
}

class Frame {
    constructor(O=new Vector(0,0,0), I=new Vector(1,0,0), J=new Vector(0,1,0), K=new Vector(0,0,1)){
        this.O = O;
        this.I = I;
        this.J = J;
        this.K = K;
    }
    toLocalPoint(vec){
        let OP = vec.subtract(this.O);
        return this.toLocalVector(OP);
    }
    toLocalVector(vec){
        var i = vec.dot(this.I) / this.I.dot(this.I);
        var j = vec.dot(this.J) / this.J.dot(this.J);
        var k = vec.dot(this.K) / this.K.dot(this.K);
        return new Vector(i,j,k);
    }
    toGlobalPoint(vec){
        return this.O.add(this.toGlobalVector(vec));
    }
    toGlobalVector(vec){
        return this.I.scale(vec.x).add(this.J.scale(vec.y).add(this.K.scale(vec.z)));
    }
    rotate(axis, theta) {
        this.I = this.I.rotate(axis, theta);
        this.J = this.J.rotate(axis, theta);
        this.K = this.K.rotate(axis, theta);
    }
    translate(t) {
        this.O = this.O.add(t);
    }
    scale(s) {
        this.I = this.I.scale(s);
        this.J = this.J.scale(s);
        this.K = this.K.scale(s);
    }
    copy() {
        return new Frame(this.O.copy(), this.I.copy(), this.J.copy(), this.K.copy());
    }
    draw() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
        ctx.arc(this.O.x, this.O.y, 5, 0, 2 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(this.O.x,this.O.y);
        ctx.lineTo(this.toGlobalPoint(new Vector(1,0,0)).x, 
            this.toGlobalPoint(new Vector(1,0,0)).y);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.O.x,this.O.y);
        ctx.lineTo(this.toGlobalPoint(new Vector(0,1,0)).x, 
            this.toGlobalPoint(new Vector(0,1,0)).y);
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.toGlobalPoint(new Vector(1,0,0)).x,
            this.toGlobalPoint(new Vector(1,0,0)).y);
        ctx.lineTo(this.toGlobalPoint(new Vector(1,1,0)).x, 
            this.toGlobalPoint(new Vector(1,1,0)).y);
        ctx.strokeStyle = '#325999';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.toGlobalPoint(new Vector(0,1,0)).x,
            this.toGlobalPoint(new Vector(0,1,0)).y);
        ctx.lineTo(this.toGlobalPoint(new Vector(1,1,0)).x, 
            this.toGlobalPoint(new Vector(1,1,0)).y);
        ctx.stroke();
    }
}

