function drawScene(gameObjects) {
    let scene = new Scene(gameObjects);
    scene.init();
    let delay = 20;
    setInterval(() => scene.update(), delay);
}


// Run python -m SimpleHTTPServer first.
$.get("/stanfordbunny.obj").then(function(data1) {
    $.get("/square.obj").then(function(data2) {
        let mesh1 = Mesh.parse(data1);
        mesh1.frame = new Frame(
        new Vector(0, 0.4, 0),
        new Vector(1, 0, 0),
        new Vector(0, -1, 0),
        new Vector(0, 0, 1));
        mesh1.frame.translate(new Vector(0,0,-0.15));
        mesh1.frame.scale(mesh1.scale);
        let go1 = new GameObject(mesh1);
        go1.update = function() {
            this.frame.rotate(new Vector(0,1,0), Math.PI/20);
        }.bind(go1);


        let mesh2 = Mesh.parse(data2);
        mesh2.frame = new Frame(
        new Vector(0, 0, 0),
        new Vector(1, 0, 0),
        new Vector(0, 1, 0),
        new Vector(0, 0, 1));
        mesh2.frame.translate(new Vector(0, 0.5,-0.15));
        mesh2.frame.scale(mesh2.scale);
        let go2 = new GameObject(mesh2);

        drawScene([go1, go2]);
    });
});