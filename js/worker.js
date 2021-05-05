let temp = [];


onmessage = function (event)
{
    if(temp.length === 0)
        load();
    else
    {
        postMessage("不是第一次加载");
    }
    //test(event.data);
}

function test(message)
{
    console.log("子线程："+message);

    postMessage("子线程给发的");
}

function load() {
    importScripts("../lib/three.js");
    let loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    loader.load("../test.json", function(str){//dataTexture
        temp = str;
        postMessage("第一次加载json");
    });
}