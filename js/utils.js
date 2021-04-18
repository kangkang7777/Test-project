var Utils = function() {
    this.vertexFlameShader = null;
    this.fragmentFlameShader = null;
    this.finished = false;
}

Utils.prototype.preLoad = function ()
{
    let scope = this;
    let loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    loader.load("./shader/fragmentFlameShader.glsl", function(str1){
        loader.load("./shader/vertexFlameShader.glsl", function(str2){
            scope.fragmentFlameShader = str1;
            scope.vertexFlameShader = str2;
            scope.finished = true;
        });
    });
}

Utils.hexToVec3 = function (col) {
    var num = parseInt(col.substr(1), 16);
    var r = (num / 256 / 256) % 256;
    var g = (num / 256) % 256;
    var b = num % 256;
    return [r / 255.0, g / 255.0, b / 255.0];
};
Utils.formatZero = function (val) {
    if (val.length === 1)
        return '0' + val;
    return val;
};
Utils.vec3ToHex = function (col) {
    return '#' +
        this.formatZero(col[0].toString(16)) +
        this.formatZero(col[1].toString(16)) +
        this.formatZero(col[2].toString(16));
};
Utils.vec3Blend = function (cola, colb, t) {
    var a = this.hexToVec3(cola);
    var b = this.hexToVec3(colb);
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
    ];
};