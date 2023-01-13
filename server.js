const PORT=8080;

var http = require("http"),
	url = require("url"),
	express = require("express"),
	favicon = require('serve-favicon'),
	path = require("path"),
	LogicController = require("./LogicController.js");

var app = express();
http.createServer(app).listen(PORT);

app.use("/", express.static("./mediaserviceview/build"));

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
});

// not used but will be
app.get('/recents', function (req, res) {
	var logic = new LogicController;
	logic.processRecentsRequest(req, res);
});

app.get('/data', function (req, res) {
	var logic = new LogicController;
	var url_parts = url.parse(req.url, true);
	logic.dataRequest(url_parts.query.path, res);
});

app.get('/explainPath', function (req, res) {
	var logic = new LogicController;
	var url_parts = url.parse(req.url, true);
	logic.explainPathRequest(url_parts.query.path, res);
});

app.all('*', function (req, res) {
	res.writeHead(404, {"Content-Type": "text/html"});  
	res.write("No file.");
	res.end();
});
