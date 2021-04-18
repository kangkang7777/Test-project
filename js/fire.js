var fireSim = function () {
    this.material = null;
    this.mesh = null;
    this.defaultColor = {
        colDark: '#000000',
        colNormal: '#f7a90e',
        colLight: '#ede92a'
    };
}

fireSim.prototype.init = function (radius)
{
    this.material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                type: "f",
                value: 0.0
            },
            seed: {
                type: 'f',
                value: Math.random() * 1000.0
            },
            detail: {
                type: 'f',
                value: Math.random() * 3.5 + 5
            },
            opacity: {
                type: 'f',
                value: 1
            },
            colLight: {
                value: Utils.hexToVec3(this.defaultColor.colLight)
            },
            colNormal: {
                value: Utils.hexToVec3(this.defaultColor.colNormal)
            },
            colDark: {
                value: Utils.hexToVec3(this.defaultColor.colDark)
            }
        },
        vertexShader: vertexFlameShader,
        fragmentShader: fragmentFlameShader
    });
    this.mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 3), this.material);
    this.mesh.position.set(0,0,0);
}


fireSim.prototype.setColor = function (prop)
{
    if (prop.colDark != null) {
        if (typeof prop.colDark === 'string') {
            this.material.uniforms['colDark'].value = Utils.hexToVec3(prop.colDark);
        }
        else {
            this.material.uniforms['colDark'].value = prop.colDark;
        }
    }
    if (prop.colNormal != null) {
        if (typeof prop.colNormal === 'string') {
            this.material.uniforms['colNormal'].value = Utils.hexToVec3(prop.colNormal);
        }
        else {
            this.material.uniforms['colNormal'].value = prop.colNormal;
        }
    }
    if (prop.colLight != null) {
        if (typeof prop.colLight === 'string') {
            this.material.uniforms['colLight'].value = Utils.hexToVec3(prop.colLight);
        }
        else {
            this.material.uniforms['colLight'].value = prop.colLight;
        }
    }
};

fireSim.prototype.setOpacity = function (value) {
    this.material.uniforms['opacity'].value = value;
};

fireSim.prototype.setDetail = function (value) {
    this.material.uniforms['detail'].value = value;
};

fireSim.prototype.update = function (timeDiff) {
    this.material.uniforms['time'].value += .0005 * timeDiff * this.flowRatio;
};

fireSim.prototype.setFlowRatio = function (val) {
    this.flowRatio = val;
};

fireSim.prototype.getMesh = function () {
    return this.mesh;
};

