class GameObject {
    constructor(mesh, frame=new Frame(), init=()=>{}, update=()=>{}) {
        this.mesh = mesh;
        this.frame = frame;
        this.init = init.bind(this);
        this.update = update.bind(this);
    }
    get transformedMesh() {
        return this.mesh.transformed(this.mesh.frame).transformed(this.frame);
    }
}