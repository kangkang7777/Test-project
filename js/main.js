
let container, camera, scene, renderer, controls, camControl, delta;

let worker;
let stats = new Stats();
//let cull;

//火焰相关
let Fire;
let vertexFlameShader = null;
let fragmentFlameShader = null;
//火焰的默认位置
let pos = (0,0,0);

const clock = new THREE.Clock();

init();
animate();

//模型测试
function myTest()
{
    //测试用的模型
    const geometry = [

        [ new THREE.IcosahedronGeometry( 100, 16 ), 50 ],
        [ new THREE.IcosahedronGeometry( 100, 8 ), 300 ],
        [ new THREE.IcosahedronGeometry( 100, 4 ), 1000 ],
        [ new THREE.IcosahedronGeometry( 100, 2 ), 2000 ]
        // ,
        // [ new THREE.IcosahedronGeometry( 100, 1 ), 8000 ]
        // ,
        // [ new THREE.BufferGeometry, 10000 ]

    ];

    const material = new THREE.MeshLambertMaterial( { color: 0x66ccff, wireframe: true } );

    for ( let j = 0; j < 10000; j ++ ) {

        const lod = new THREE.LOD();

        for ( let i = 0; i < geometry.length; i ++ ) {

            const mesh = new THREE.Mesh( geometry[ i ][ 0 ], material );
            mesh.scale.set( 1.5, 1.5, 1.5 );
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            //mesh.frustumCulled = false;
            mesh.frustumCulled = true;
            lod.addLevel( mesh, geometry[ i ][ 1 ] );
        }
        //lod.frustumCulled = true;
        lod.position.x = 10000 * ( 0.5 - Math.random() );
        lod.position.y = 7500 * ( 0.5 - Math.random() );
        lod.position.z = 10000 * ( 0.5 - Math.random() );
        lod.updateMatrix();
        lod.matrixAutoUpdate = false;
        scene.add( lod );
        //scene.setRenderList()
    }
}

function init() {

    //场景初始化
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 15000 );
    //camera.position.z = 50;
    camera.position.x = -500;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x555555, 1, 15000 );
    scene.background = new THREE.Color(0xf8f8f8);

    const pointLight = new THREE.PointLight( 0xffffff );
    pointLight.position.set( 0, 0, 0 );
    scene.add( pointLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set(0,0,1).normalize();
    scene.add( dirLight );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.body.appendChild( stats.dom );

    camControl = new THREE.FirstPersonControls(camera, renderer.domElement);

    window.addEventListener( 'resize', onWindowResize, false );


    //剔除测试
    //cull = new culling();

    //自定义模型的lod以及距离剔除的测试
    //myTest();

    //多线程测试
    workerTest();

    //火焰测试
    //fireTest();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

        stats.begin();
        Fire.update(20);
        camControl.update(5);
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        //frustumCullingUpdate();
        stats.end();
}

function frustumCullingUpdate()
{
    scene.traverse(function (node) {
        //if (node instanceof THREE.Mesh) {
        if (node instanceof THREE.Mesh) {
            //scene.updateMatrixWorld();
            node.geometry.computeBoundingSphere();
            node.frustumCulled = false;
            if (node.geometry.boundingSphere) {
                //console.log(node);console.log(node.name+":"+node.visible)
                node.visible = cull.intersectsSphere(node);
            } else {
                node.geometry.computeBoundingSphere();
            }
        }
    })
}

function workerTest()
{
    worker = new Worker('js/worker.js');
    let i =0;
    worker.onmessage = function (event)
    {
        console.log("主线程接收到自线程消息:"+event.data);
        worker.postMessage("这是主线程向子线程的第2次post测试");
        i++;
    }
    worker.postMessage("这是主线程向子线程的第1次post测试");


    // while(true)
    // {
    //     worker.postMessage("这是主线程向子线程的第"+i+"次post测试");
    //     i++;
    // }

}

function fireTest()
{
    Fire = new fireControl();
    Fire.init();
}