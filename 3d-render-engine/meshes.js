class Face {
    constructor(vertexIndices) {
        //indices in Mesh vertex array
        this.vertexIndices = vertexIndices;
    }
}

function drawLine(frame, p1, p2) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(frame.toGlobalPoint(p1).x,
        frame.toGlobalPoint(p1).y);
    ctx.lineTo(frame.toGlobalPoint(p2).x, 
        frame.toGlobalPoint(p2).y);
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 0.2;
    ctx.stroke();
    ctx.closePath();
}

class Mesh {
    constructor(vertices=[], faces=[], scale=1, move=0) {
        this.vertices = vertices;
        this.faces = faces;
        this.scale = scale;
        this.move = move;
        this.frame = new Frame();
    }
    addVertex(vec) {
        this.vertices.push(vec);
    }
    addFace(face) {
        this.faces.push(face);
    }
    copy() {
        return new Mesh(this.vertices.slice(0), this.faces.slice(0));
    }
    transformed(frame) {
        let m = new Mesh([], this.faces.slice(0));
        for (let i = 0; i < this.vertices.length; i++) {
            m.addVertex(frame.toGlobalPoint(this.vertices[i]));
        }
        return m;
    }
    scaled(s) {
        let m = new Mesh([], this.faces.slice(0));
        for (let i = 0; i < this.vertices.length; i++) {
            m.addVertex(this.vertices[i].scale(s));
        }
        return m;
    }
    adjust() {
        //scale first
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = this.vertices[i].scale(this.scale);
        }
        //then move so the move is centered around the origin
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = this.vertices[i].add(this.move);
        }
    }
    copy() {
        return new Mesh(this.vertices.slice(0), this.faces.slice(0));
    }
    render(frame){
        for (let i = 0; i < this.faces.length; i++) {
            let face = this.faces[i];
            for (let j = 0; j < face.length; j++){
                let a = this.vertices[face[j]];
                let b = this.vertices[face[(j+1) % face.length]];
                if (a && b) {
                    drawLine(frame, a, b);
                }

            }
        }
    }
}


// This is basically making a static method.
Mesh.parse = function(text) {   
    let mesh = new Mesh();
    let lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].split(" "); 
        let parsedLine = [];

        for (let j = 0; j < line.length; j++) {
            if (line[j] == "#") {
                if (line[j+1] == "s")  {
                    mesh.scale = line[j+2];
                }                
                break;
            }
            if (!line[j]) {continue;}
            parsedLine.push(line[j]);
        }
        if (parsedLine[0] == "v") {
            mesh.addVertex(new Vector(parsedLine[1], parsedLine[2], parsedLine[3]));
        }
        if (parsedLine[0] == "f") {
            //obj format indexes from 1 not 0
            mesh.addFace(parsedLine.slice(1, parsedLine.length).map(x => x-1));
        }
    }
    return mesh;
}

function clear() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.rect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fill();
}