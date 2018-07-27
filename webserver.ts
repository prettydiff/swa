(function server():void {
    "use strict";
    const node:any = {
            http: require("http"),
            https: require("https")
        },
        insecure = node.http.createServer(function insecure_create(request, response):void {
            console.log("insecure");console.log(request);
        }),
        secure = node.https.createServer(function secure_create(request, response):void {
            console.log("secure");console.log(request);
        }),
        serverError = function node_apps_server_serverError(error):void {
            console.log(`${error.Error}`);
            process.exit(1);
        };
    insecure.on("error", serverError);
    insecure.listen(8000);
    secure.on("error", serverError);
    secure.listen(4430);
    console.log("http server is up.");
}());