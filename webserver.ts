(function server():void {
    "use strict";
    const node:any = {
            http: require("http"),
            https: require("https"),
            path: require("path")
        },
        ports:any = {
            insecure: 8888,
            secure: 9999
        },
        sep:string = node.path.sep,
        projectPath:string = (function node_project() {
            const dirs:string[] = __dirname.split(sep);
            return dirs.slice(0, dirs.length - 1).join(sep) + sep;
        }()),
        text:any     = {
            angry    : "\u001b[1m\u001b[31m",
            blue     : "\u001b[34m",
            bold     : "\u001b[1m",
            clear    : "\u001b[24m\u001b[22m",
            cyan     : "\u001b[36m",
            diffchar : "\u001b[1m\u001b[4m",
            green    : "\u001b[32m",
            nocolor  : "\u001b[39m",
            none     : "\u001b[0m",
            purple   : "\u001b[35m",
            red      : "\u001b[31m",
            underline: "\u001b[4m",
            yellow   : "\u001b[33m"
        },
        respond = function server_resond(request, response):void {
            let quest:number = request.url.indexOf("?"),
                uri:string = (quest > 0)
                    ? request.url.slice(0, quest)
                    : request.url,
                file:string = projectPath + uri.slice(1).replace(/\//g, node.path.sep);
            if (uri === "/") {
                file = `${projectPath + node.path.sep}index.xhtml`;
            }
            if (request.url.indexOf("favicon.ico") < 0 && request.url.indexOf("images/apple") < 0) {
                node.fs.readFile(file, "utf8", function node_apps_server_create_readFile(err:Error, data:string):void {
                    if (err !== undefined && err !== null) {
                        if (err.toString().indexOf("no such file or directory") > 0) {
                            response.writeHead(404, {"Content-Type": "text/plain"});
                            if (file.indexOf("apple-touch") < 0 && file.indexOf("favicon") < 0) {
                                console.log(`${text.angry}404${text.none} for ${file}`);
                            }
                            return;
                        }
                        response.write(JSON.stringify(err));
                        console.log(err);
                        return;
                    }
                    if (file.indexOf(".js") === file.length - 3) {
                        response.writeHead(200, {"Content-Type": "application/javascript"});
                    } else if (file.indexOf(".css") === file.length - 4) {
                        response.writeHead(200, {"Content-Type": "text/css"});
                    } else if (file.indexOf(".xhtml") === file.length - 6) {
                        response.writeHead(200, {"Content-Type": "application/xhtml+xml"});
                    }
                    response.write(data);
                    response.end();
                });
            } else {
                response.end();
            }
        },
        insecure = node.http.createServer(function server_insecure(request, response):void {
            respond(request, response);
        }),
        secure = node.https.createServer(function server_secure(request, response):void {
            respond(request, response);
        }),
        serverError = function node_apps_server_serverError(error):void {
            console.log(`${error.Error}`);
            process.exit(1);
        };
    insecure.on("error", serverError);
    insecure.listen(ports.insecure);
    secure.on("error", serverError);
    secure.listen(ports.secure);
    console.log(`http server is up on port ${ports.insecure}.`);
    console.log(`https server is up on port ${ports.secure}.`);
}());