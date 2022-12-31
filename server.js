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

app.get('/download', function(req, res){
	var logic = new LogicController;
	var url_parts = url.parse(req.url, true);
	logic.downloadFile(url_parts.query.src, res);
	res.download(file);
});

app.get('/recents', function (req, res) {
	var logic = new LogicController;
	logic.processRecentsRequest(req, res);
});

app.get('/data', function (req, res) {
	var logic = new LogicController;
	logic.dataRequest(req, res);
});

app.all('*', function (req, res) {
	var logic = new LogicController;
	logic.processRequest(req, res);
});
