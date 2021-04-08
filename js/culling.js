var culling = function () {
    let self = this;
    this.frustum;
    this.frustumCulling();
    // function tool(){
    //     requestAnimationFrame(tool);
    //     self.frustumCullingUpdate();
    // }
    // tool();
};

culling.prototype.occlusionCulling = function ()
{


}

culling.prototype.frustumCulling = function ()
{
    let frustum = new THREE.Frustum();
    //frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix,camera.matrixWorldInverse ) );
    const projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    frustum.setFromProjectionMatrix(projScreenMatrix);
    this.frustum = frustum;
}

culling.prototype.frustumCullingUpdate = function ()
{
    scene.traverse(function (node) {
        //if (node instanceof THREE.Mesh) {
        if (node instanceof THREE.Mesh) {
            //scene.updateMatrixWorld();
            node.geometry.computeBoundingSphere();
            node.frustumCulled = false;
            if (node.geometry.boundingSphere) {
                //console.log(node);console.log(node.name+":"+node.visible)
                node.visible = culling.intersectsSphere(node);
            } else {
                node.geometry.computeBoundingSphere();
            }
        }
    })
}
culling.prototype.intersectsSphere = function (mesh)
{
    mesh.geometry.computeBoundingBox();
    let box=mesh.geometry.boundingBox;
    let sx=mesh.scale.x;
    let sy=mesh.scale.y;
    let sz=mesh.scale.z;
    let r=Math.pow(
        sx*Math.pow(box.max.x-box.min.x,2)+
        sy*Math.pow(box.max.y-box.min.y,2)+
        sz*Math.pow(box.max.z-box.min.z,2),
        0.5
    )/2;
    return this.intersectsSphere0([
        mesh.geometry.boundingSphere.center.x
        +mesh.matrixWorld.elements[12],
        mesh.geometry.boundingSphere.center.y
        +mesh.matrixWorld.elements[13],
        mesh.geometry.boundingSphere.center.z
        +mesh.matrixWorld.elements[14]
    ], r );
}

culling.prototype.intersectsSphere0 = function (pos,radius)
{
    let center=new THREE.Vector3(pos[0],pos[1],pos[2])
    const planes = this.frustum.planes;
    //const center = sphere.center;
    const negRadius = - radius;
    for ( let i = 0; i < 6; i ++ ) {
        const distance = planes[ i ].distanceToPoint( center );//平面到点的距离，
        if ( distance < negRadius ) {//内正外负
            return false;//不相交
        }
    }
    return true;//相交
}