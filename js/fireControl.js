var fireControl = function ()
{
    this.currentCol = {['colDark']:0,['colNormal']:1,['colLight']:2};
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
    this.finished = false;
}

fireControl.prototype.init = function ()
{
    //加载glsl文件是异步的，为了防止文件没加载完就开始update，这里设置finished来限制。
    let scope = this;
    let loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    loader.load("./shader/fragmentFlameShader.glsl", function(str1){
        loader.load("./shader/vertexFlameShader.glsl", function(str2){
            fragmentFlameShader = str1;
            vertexFlameShader = str2;
            scope.objs = [];
            scope.objectPool = [];
            scope.spawnTime = 0;
            //this.flareParticle = new flareParticle_1.FlareParticle();
            scope.spawnNewFlame();
            scope.reset();
            scope.finished = true;
        });
    });
}

fireControl.prototype.reset = function () {
    for (let i = 0; i < this.objs.length; i++) {
        this.objs[i].reset();
        scene.remove(this.objs[i].instance.getMesh());
    }
    this.objectPool = [];
    this.objs = [];
    //this.flareParticle.reset();
};

fireControl.prototype.spawnNewFlame = function ()
{
    let i = this.objs.length;
    if (this.objectPool.length > 0) {
        i = this.objectPool.shift();
        this.objs[i].instance.getMesh().visible = true;
        this.objs[i].instance.setColor(this.currentCol);
        this.objs[i].reset();
    }
    else {
        let temp = new fireSim();
        temp.init(Math.random() * 5 + 8)
        let obj = new FlameAnimation();
        obj.init(temp, Math.random() * 7 - 4, Math.random() * 7 - 4, Math.random() * 0.4 + 0.35, Math.random() * 0.4 + 0.3);
        obj.instance.setColor(this.currentCol);
        this.objs.push(obj);
        scene.add(this.objs[i].instance.getMesh());
    }
}

fireControl.prototype.update = function (deltaTime)
{
    if(this.finished) {
        let timeScale = this.params.TimeScale;
        this.spawnTime += deltaTime * timeScale;
        if (this.spawnTime > 200) {
            while (this.spawnTime > 200)
                this.spawnTime -= 200;
            this.spawnNewFlame();
        }
        for (let i = 0; i < this.objs.length; i++) {
            if (this.objs[i].isDie()) {
                if (this.objs[i].inPolling())
                    continue;
                this.objs[i].setInPolling(true);
                this.objs[i].instance.getMesh().visible = false;
                this.objectPool.push(i);
            } else {
                this.objs[i].update(deltaTime);
            }
        }
    }
    //this.flareParticle.update(deltaTime * timeScale);
}