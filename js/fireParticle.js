
var FlareParticle =  function (){

    this.geometry;
    this.particlesNumber = 500;
    this.particleSystem;
    this.flag = 0;
    this.time = [];
    this.spawnParticleTime = [];
    this.spawnParticleInterval = [];
    this.needsUpdate = [];
    this.originalSizes;
    this.moveDest;
    this.particleTime;
    this.particleColor = [];
    this.particleSpreadingRatio = 1;
}

FlareParticle.prototype.init = function (){


        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: {value : new THREE.Color(0xffb400)} ,
                texture1: {value : new THREE.TextureLoader().load("./images/circle-particle.png")}
            },
            vertexShader: vertexParticleShader,
            fragmentShader: fragmentParticleShader,
            blending: THREE.NormalBlending,
            depthTest: false,
            transparent: true
        });

        this.geometry = new THREE.BufferGeometry();

        let positions = new Float32Array(this.particlesNumber * 3);
        let colors = new Float32Array(this.particlesNumber * 3);
        let sizes = new Float32Array(this.particlesNumber);

        this.needsUpdate = [];
        this.originalSizes = new Float32Array(this.particlesNumber);
        this.moveDest = new Float32Array(this.particlesNumber * 3);
        this.particleTime = new Float32Array(this.particlesNumber);
        this.particleColor = Utils.hexToVec3("#ffb400");

        for (let i = 0, i3 = 0; i < this.particlesNumber; i++ , i3 += 3) {
            positions[i3] = 0;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = 0;

            this.moveDest[i3] = Math.random() * 200 - 100;
            this.moveDest[i3 + 1] = Math.random() * 0.3 + 0.45;
            this.moveDest[i3 + 2] = Math.random() * 200 - 100;

            colors[i3] = this.particleColor[0];
            colors[i3 + 1] = this.particleColor[1];
            colors[i3 + 2] = this.particleColor[2];
            sizes[i] = Math.random() + 1.5;
            this.originalSizes[i] = sizes[i];
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        this.particleSystem = new THREE.Points(this.geometry, shaderMaterial);

        scene.add(this.particleSystem);

        this.reset();

    }

    FlareParticle.prototype.reset = function (){
        this.time = 0;
        this.spawnParticleTime = 0;
        this.spawnParticleInterval = 1;

        let sizes = this.geometry.attributes['size'].array;
        let positions = this.geometry.attributes['position'].array;

        for (let i = 0; i < this.particlesNumber; i++) {
            sizes[i] = 0;
            positions[i*3] = 0;
            positions[i*3 + 1] = 0;
            positions[i*3 + 2] = 0;
            this.needsUpdate[i] = false;
            this.particleTime[i] = 0;
        }

        this.geometry.attributes['size'].needsUpdate = true;
        this.geometry.attributes['position'].needsUpdate = true;
        this.flag = 1;
    }

    FlareParticle.prototype.spawnParticle = function (){
        for (let i = 0; i < this.particlesNumber; i++) {
            if (this.needsUpdate[i] === false) {
                this.needsUpdate[i] = true;
                return;
            }
        }
    }

    FlareParticle.prototype.update = function (deltaTime) {
        if (this.flag === 1) {
            this.spawnParticleTime += deltaTime;
            if (this.spawnParticleTime > this.spawnParticleInterval) {
                this.spawnParticleTime = 0;
                this.spawnParticleInterval = Math.random() * 300 + 50;
                this.spawnParticle();
            }

            deltaTime /= 1000;
            this.time += deltaTime;

            this.particleSystem.rotation.y += 0.01 * deltaTime;
            let timeScale = 3 / 3;
            let sizes = this.geometry.attributes['size'].array;
            let positions = this.geometry.attributes['position'].array;
            let colors = this.geometry.attributes['customColor'].array;

            for (let i = 0, i3 = 0; i < this.particlesNumber; i++ , i3 += 3) {
                if (this.needsUpdate[i]) {
                    if (this.particleTime[i] > 20000 / 1000) {
                        positions[i3] = 0;
                        positions[i3 + 1] = 0;
                        positions[i3 + 2] = 0;
                        this.particleTime[i] = 0;
                        sizes[i] = 0.01;
                    } else {
                        let ac = this.particleSpreadingRatio *
                            this.particleTime[i] / (20000 / 1000) +
                            0.01 * Math.sin(this.time);
                        let randDist = (10 * Math.sin(0.3 * i + this.time + Math.random() / 10)) * timeScale;
                        sizes[i] = this.originalSizes[i] * (3 + Math.sin(0.4 * i + this.time));
                        positions[i3] = ac * this.moveDest[i3] + randDist;
                        positions[i3 + 1] += (Math.random() * 0.4 + 0.9) * this.moveDest[i3 + 1] * timeScale;
                        positions[i3 + 2] = ac * this.moveDest[i3 + 2] + randDist;
                        this.particleTime[i] += deltaTime;
                    }
                }

                colors[i3] = this.particleColor[0];
                colors[i3 + 1] = this.particleColor[1];
                colors[i3 + 2] = this.particleColor[2];
            }

            this.geometry.attributes['customColor'].needsUpdate = true;
            this.geometry.attributes['size'].needsUpdate = true;
            this.geometry.attributes['position'].needsUpdate = true;
        }
    }


