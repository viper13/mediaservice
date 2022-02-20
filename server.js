const PORT=808; 

var http = require("http"),
	LogicController = require("./LogicController.js");

http.createServer(function (req, res) {
    //console.log(req.url);
	var logic = new LogicController;
	logic.processRequest(req, res);
}).listen(PORT);
