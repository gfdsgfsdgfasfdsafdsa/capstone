const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const hostname = 'localhost'
const port = 2222;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync("./certificate/install+1-key.pem"),
    cert: fs.readFileSync("./certificate/install+1.pem")
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log("ready - started server on url: https://localhost:" + port);
    });
});
