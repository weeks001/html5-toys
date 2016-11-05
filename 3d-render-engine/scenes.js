class Scene {
    constructor(gameObjects=[]) {
        this.gameObjects = gameObjects;
        this.start = new Date().getTime(); 
        this.screenFrame = new Frame();
        this.camera = new Camera(new Frame());
    }
    init() {
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        this.screenFrame = new Frame(
            new Vector(c.width/2, c.height/2, 0),
            new Vector(c.width/2, 0, 0),
            new Vector(0, -c.height/2, 0)
            );

        //setup initial camera
        let V = 1;
        let H = V * c.width/ c.height;
        this.camera = new OrthographicCamera(-H/2, H/2, V/2, -V/2);
        this.camera.moveTo(new Vector(0,0, 1)); // moving z won't affect ortho camera
        this.camera.lookAt(new Vector(0,0,-1), new Vector(0,-1,0));

        this.gameObjects.forEach(obj => obj.init());


        //user camera controls
        let userTheta = 0.1;
        $(document).keydown(function(event) {
            let C = 67; 
            let A = 65; 
            let D = 68; 
            let W = 87; 
            let S = 83;
            if (event.which == C) {
                //toggle between perspective and orthographic camera
                let className = this.camera.constructor.name;
                let prevFrame = this.camera.frame;

                if (className === "OrthographicCamera") {
                    let V = Math.PI/3;
                    let H = 2 * Math.atan(Math.tan(V/2) * c.width/c.height);
                    this.camera = new PerspectiveCamera(H, V);

                } else {
                    let V = 1;
                    let H = V * c.width/ c.height;
                    this.camera = new OrthographicCamera(-H/2, H/2, V/2, -V/2);
                }

                console.log("Current camera: " + this.camera.constructor.name);
                this.camera.moveTo(prevFrame.O); // moving z won't affect ortho camera
                this.camera.lookAt(prevFrame.K, prevFrame.J);
            }
            if (event.which == A) {
                //rotate camera clockwise around <0,1,0>
                this.camera.frame.rotate(new Vector(0,1,0), userTheta);
            }
            if (event.which == D) {
                //rotate camera counterclockwise around <0,1,0>
                this.camera.frame.rotate(new Vector(0,1,0), -userTheta);
            }
            if (event.which == W) {
                //move camera forward
                this.camera.frame.O =  this.camera.frame.O.adds(1, this.camera.frame.K);
            }
            if (event.which == S) {
                //move camera backward
                this.camera.frame.O =  this.camera.frame.O.adds(-1, this.camera.frame.K);
            }
        }.bind(this));

    }
    update() {
        clear();
        this.gameObjects.forEach(obj => {
            obj.update();
            let mesh = obj.transformedMesh;
            mesh.vertices = mesh.vertices.map(v => this.camera.transform(v));
            mesh.render(this.screenFrame);
        });
    }
}