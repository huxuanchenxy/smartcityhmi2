function postToIframeMethed(iframeid:string,methedName: string, data: any, backFun?: any) {
    var win = (document.getElementById(iframeid) as HTMLIFrameElement).contentWindow;
    //console.log(win);
    win.postMessage(JSON.stringify({ method: methedName, data: data, backfun: backFun }), '*');
    window.onmessage = function (e) {
        if (e.origin != 'http://localhost') return;
        console.log(JSON.parse(e.data).name);
    };
}