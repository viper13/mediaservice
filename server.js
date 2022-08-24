const PORT=8080;

var http = require("http"),
	url = require("url"),
	express = require("express"),
	favicon = require('serve-favicon'),
	path = require("path"),
	LogicController = require("./LogicController.js");

var app = express();
http.createServer(app).listen(PORT);

app.get('/', function (req, res) {
	var logic = new LogicController;
	logic.processRootRequest(res);
});

app.use(favicon('./favicon.ico'));

app.use("/frontjs", express.static("./frontjs"));

app.get('/video', function (req, res) {
	var logic = new LogicController;
	var url_parts = url.parse(req.url, true);
	var file = path.resolve(LogicController.rootFolder(), "." + url_parts.query.src);
	logic.processFileRequest(file, req.headers.range, res);
});

app.get('/recents', function (req, res) {
	var logic = new LogicController;
	logic.processRecentsRequest(req, res);
});

app.use("/", express.static(process.cwd()+"/angular/hello-world/dist/hello-world/"));
app.get('/test', function (req, res) {
	res.sendFile(process.cwd()+"/angular/hello-world/dist/hello-world/index.html");
});

app.all('*', function (req, res) {
	var logic = new LogicController;
	logic.processRequest(req, res);
});
