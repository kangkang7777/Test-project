
onmessage = function (event)
{
    globalThis
    test(event.data);
}

function test(message)
{
    console.log("子线程："+message);

    postMessage("子线程给发的");
}