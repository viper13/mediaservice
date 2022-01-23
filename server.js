const PORT=8080; 

var http = require("http"),
	LogicController = require("./LogicController.js");

http.createServer(function (req, res) {
	var logic = new LogicController;
	logic.processRequest(req, res);
}).listen(PORT);