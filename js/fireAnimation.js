var fireAnimation = function () {
    fireAnimation.STATE_BEFORE_START = 0;
    fireAnimation.STATE_SPAWN = 1;
    fireAnimation.STATE_SPAWN_DOWN = 2;
    fireAnimation.STATE_FLOATING = 3;
    fireAnimation.STATE_IDLE = 4;
    fireAnimation.BEFORE_INTERVAL = 300;
    fireAnimation.SPAWN_INTERVAL = 400;
    fireAnimation.SPAWN_DOWN_INTERVAL = 2000;
    fireAnimation.FLOATING_INTERVAL = 8000;
    fireAnimation.IDLE_INTERVAL = 20000;

    this.params = {
        LightColor2 : '#ff8700',
        LightColor : '#f7f342',
        NormalColor : '#f7a90e',
        DarkColor2 : '#ff9800',
        GreyColor : '#3c342f',
        DarkColor : "#181818",
        TimeScale : 3,
        ParticleSpread : 1,
        ParticleColor : '#ffb400',
        InvertedBackground : false,
        ShowGrid : true
    };

}

fireAnimation.prototype.init = function(instance, distX, distZ, yRatio, animationTimeRatio) {
        distX = distX || 0;
        distZ = distZ || 0;
        yRatio = yRatio || 1;
        animationTimeRatio = animationTimeRatio || 1;
        this.instance = instance;
        this.distX = distX;
        this.distZ = distZ;
        this.yRatio = yRatio;
        this.animationTimeRatio = animationTimeRatio;
        this.reset();
    }

fireAnimation.prototype.setColor = function () {
    let tc = this.timeCount + this.colorTransitionRandom;
    if (tc < 2500 + this.colorTransitionRandom) {
        let t = tc / 2500 + this.colorTransitionRandom;
        this.instance.setColor({
            colDark: this.params.NormalColor,
            colNormal: this.params.LightColor,
            colLight: this.params.LightColor2
        });
    }
    else if (tc < 4000) {
        let t = (tc - 2500) / 1500;
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t),
            colNormal: Utils.vec3Blend(this.params.LightColor, this.params.NormalColor, t),
            colLight: Utils.vec3Blend(this.params.LightColor2, this.params.LightColor, t)
        });
    }
    else if (tc < 7000) {
        let t = (tc - 4000) / 3000;
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor2, t),
            colNormal: Utils.vec3Blend(this.params.NormalColor, this.params.NormalColor, t),
            colLight: Utils.vec3Blend(this.params.LightColor, this.params.LightColor, t)
        });
    }
    else if (tc < 12000) {
        let t = Math.min(1, (tc - 7000) / 5000);
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t),
            colNormal: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t),
            colLight: Utils.vec3Blend(this.params.LightColor, this.params.NormalColor, t)
        });
    }
    else if (tc < 17000) {
        let t = Math.min(1, (tc - 12000) / 5000);
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor, this.params.DarkColor, t),
            colNormal: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t),
            colLight: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t)
        });
    }
    else {
        let t = Math.min(1, (tc - 17000) / 6000);
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor, this.params.GreyColor, t),
            colNormal: Utils.vec3Blend(this.params.DarkColor, this.params.GreyColor, t),
            colLight: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t)
        });
    }
};

fireAnimation.prototype.updateState = function (deltaTime) {
    var cTime = this.currentTime + deltaTime;
    if (this.currentState === fireAnimation.STATE_BEFORE_START) {
        if (cTime > fireAnimation.BEFORE_INTERVAL) {
            cTime -= fireAnimation.BEFORE_INTERVAL;
            this.currentState = fireAnimation.STATE_SPAWN;
        }
    }
    else if (this.currentState === fireAnimation.STATE_SPAWN) {
        if (cTime > fireAnimation.SPAWN_INTERVAL) {
            cTime -= fireAnimation.SPAWN_INTERVAL;
            this.posX = -1;
            this.currentState = fireAnimation.STATE_SPAWN_DOWN;
        }
    }
    else if (this.currentState === fireAnimation.STATE_SPAWN_DOWN) {
        if (cTime > fireAnimation.SPAWN_DOWN_INTERVAL) {
            cTime -= fireAnimation.SPAWN_DOWN_INTERVAL;
            this.currentState = fireAnimation.STATE_FLOATING;
        }
    }
    else if (this.currentState === fireAnimation.STATE_FLOATING) {
        if (cTime > fireAnimation.FLOATING_INTERVAL) {
            this.randFlyX += Math.random() * 0.2;
            this.randFlyZ += Math.random() * 0.2;
            cTime -= fireAnimation.FLOATING_INTERVAL;
            this.posX = -1;
            this.currentState = fireAnimation.STATE_IDLE;
        }
    }
    else if (this.currentState === fireAnimation.STATE_IDLE) {
        if (cTime > fireAnimation.IDLE_INTERVAL) {
            this.isObjDie = true;
        }
    }
    this.currentTime = cTime;
};

fireAnimation.prototype.update = function (deltaTime) {
    if (this.isObjDie)
        return;
    let mesh = this.instance.getMesh();
    let timeScale = this.params.TimeScale;
    this.updateState(deltaTime * timeScale);
    this.timeCount += deltaTime * timeScale;
    if (this.currentState === fireAnimation.STATE_SPAWN) {
        let t = this.currentTime / fireAnimation.SPAWN_INTERVAL;
        let t2 = this.currentTime / (fireAnimation.SPAWN_INTERVAL + fireAnimation.SPAWN_DOWN_INTERVAL);
        mesh.position.set(this.distX * t2, mesh.position.y + t * 0.4 * this.yRatio * timeScale, this.distZ * t2);
        var scale = t;
        mesh.scale.set(scale, scale, scale);
    }
    else if (this.currentState === fireAnimation.STATE_SPAWN_DOWN) {
        let t2 = (this.currentTime + fireAnimation.SPAWN_INTERVAL) /
            (fireAnimation.SPAWN_INTERVAL + fireAnimation.SPAWN_DOWN_INTERVAL);
        mesh.position.set(this.distX * t2, mesh.position.y +
            (0.6 * timeScale *
                (1 - this.currentTime / fireAnimation.SPAWN_DOWN_INTERVAL) +
                0.2 * timeScale) * this.yRatio, this.distZ * t2);
    }
    else if (this.currentState === fireAnimation.STATE_FLOATING) {
        if (this.posX === -1) {
            this.posX = mesh.position.x;
            this.posY = mesh.position.y;
            this.posZ = mesh.position.z;
            this.instance.setFlowRatio(0.5);
        }
        mesh.position.set(mesh.position.x + this.randFlyX * timeScale, mesh.position.y + 0.2 * timeScale, mesh.position.z + this.randFlyZ * timeScale);
        let scale = mesh.scale.x + 0.003 * timeScale;
        mesh.scale.set(scale, scale, scale);
    }
    else if (this.currentState === fireAnimation.STATE_IDLE) {
        if (this.posX === -1) {
            this.posX = mesh.position.x;
            this.posY = mesh.position.y;
            this.posZ = mesh.position.z;
            this.instance.setFlowRatio(0.2);
        }
        mesh.position.setY(this.posY + this.currentTime / 100);
        if (this.currentTime > fireAnimation.IDLE_INTERVAL - 5000) {
            this.instance.setOpacity(1 - (this.currentTime - (fireAnimation.IDLE_INTERVAL - 5000)) / 5000);
        }
        let scale = mesh.scale.x + 0.002 * timeScale;
        mesh.scale.set(scale, scale, scale);
    }
    this.setColor();
    this.instance.update(deltaTime * timeScale * this.animationTimeRatio);
};

fireAnimation.prototype.isDie = function () {
    return this.isObjDie;
};

fireAnimation.prototype.inPolling = function () {
    return this.isInPooling;
};

fireAnimation.prototype.setInPolling = function (val) {
    this.isInPooling = val;
};

fireAnimation.prototype.reset = function () {
    this.randFlyX = Math.random() * 0.1 - 0.05;
    this.randFlyZ = Math.random() * 0.1 - 0.05;
    this.posX = -1;
    this.currentTime = 0;
    this.timeCount = 0;
    this.isObjDie = false;
    this.isInPooling = false;
    this.currentState = fireAnimation.STATE_BEFORE_START;
    this.colorTransitionRandom = Math.random() * 2000 - 1000;
    this.instance.getMesh().position.set(0, 0, 0);
    this.instance.getMesh().scale.set(0, 0, 0);
    this.instance.setFlowRatio(1);
    this.instance.setOpacity(1);
};



