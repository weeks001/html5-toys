class Camera {
    constructor(frame){
        this.frame = frame; //indicates where camera is looking.
    }
    projection(pt) {
        return pt;
    }
    transform(pt) {
        let local = this.frame.toLocalPoint(pt);
        return this.projection(local);
    }
    moveTo(pos) {
        this.frame.O = new Vector(pos.x, pos.y, pos.z);
    }
    lookAt(forwardDirection, upDirection) {
        this.frame.K = new Vector(forwardDirection.x, forwardDirection.y, forwardDirection.z);
        this.frame.J = new Vector(upDirection.x, upDirection.y, upDirection.z);
        this.frame.I = this.frame.K.cross(this.frame.J);
    }
}

// Convert x on scale [a,b] to x' on scale [a',b']
function convert(x, a, b, ap, bp) {
    let xp = (x - a) / (b - a);
    return ap + (bp - ap) * xp;
}

class OrthographicCamera extends Camera {
    constructor(left, right, top, bottom) {
        super(new Frame(
            new Vector(0,0,0),
            new Vector(1,0,0),
            new Vector(0,1,0),
            new Vector(0,0,1)));
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
    projection(pt) {
        let xp = convert(pt.x, this.left, this.right, -1, 1);
        let yp = convert(pt.y, this.bottom, this.top, -1, 1);
        return new Vector(xp, yp, 0);
    }
}

class PerspectiveCamera extends Camera {
    constructor(horizontalFov, verticalFov) {
        super(new Frame(
            new Vector(0,0,0),
            new Vector(1,0,0),
            new Vector(0,1,0),
            new Vector(0,0,1)));
        //in radians
        this.horizontalFov = horizontalFov;
        this.verticalFov = verticalFov;
    }
    projection(pt) {
        return new Vector(
            pt.x / (pt.z * Math.tan(this.horizontalFov / 2)),
            pt.y / (pt.z * Math.tan(this.verticalFov / 2)),
            0);
    }
}