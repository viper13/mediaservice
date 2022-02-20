var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    DBController = require("./MongoController.js");

var VideoConverter = require("./VideoConverter.js");

var root_folder = "e:/donwloads/torrent";

function writeNoFile(res) {
	res.writeHeader(404, {"Content-Type": "text/html"});  
	res.write("No file.");
	res.end();
}

function writeObj(res, object) {
	res.writeHeader(200, {"Content-Type": "application/json"});
	//console.log("RESPONCE:");
	//console.log(object);
	res.write(JSON.stringify(object));
	res.end();
}

class LogicController {
	constructor() { }

	processRequest(req, res) {
		var url_parts = url.parse(req.url, true);
		console.log(url_parts);
		if (req.url === "/") {
			this.processDyrectoryRequest(path.resolve(root_folder), res);
		} else if (req.url === "/favicon.ico") {
			this.processCommonFile("." + req.url, res);
		} else if (url_parts.pathname === "/video") {
			var file = path.resolve(root_folder, "." + url_parts.query.src);
			this.processFileRequest(file, req, res);
		} else if (url_parts.pathname === "/recents") {
			var id = url_parts.query.id;
			var action = url_parts.query.action;
			if (action === "get") {
				const db = new DBController();
				db.getOrAddUser(id).then(function(value) {
					var result = value.recents;
					if (result.path !== null) {
						result.filename = path.basename(result.source);
					}
					writeObj(res, result);
				});
			}
			else if (action === "set") {
				console.log("SET called: " + id);
				const db = new DBController();
				db.updateRecents(id, {path: url_parts.query.path, source: url_parts.query.source, time: 0, timestamp: Date.now()});
				writeObj(res, "success");
			}
			else {
				console.log("Bad recents action: " + action);
				writeNoFile(res);
			}
		} else {
			// TODO: add using file and time params from request
			var file = path.resolve(root_folder, "." + decodeURI(url_parts.pathname));
			var isDyrectoryAndNotEmpty = false;
			try {
				const fileStat = fs.statSync(file);
				isDyrectoryAndNotEmpty = fileStat.isDirectory();
			}
			catch {
				console.log("WARNING: directory[" + file + "] is empty");
			}

			if (isDyrectoryAndNotEmpty === true) {
				this.processDyrectoryRequest(file, res);
			} else {
				writeNoFile(res);
			}
	    }
	}

	processDyrectoryRequest(dyrectory, res) {
		const replace_vid1_str = /________VIDEO_CONTENT1___________/g;
		const replace_dir_list_str = /_______FOLDERS_LIST____________/g;
		const replace_js_data_str = /_______JS_DATA____________/g;
		fs.readFile('./list.html', function (err, html) {
			fs.readdir(dyrectory, function (err, files) {
				var video_content = "";
				var dirs_content = "";
				var js_data = "";
				//console.log("DIRECTORY: " + dyrectory);
				files.forEach(function (file, index) {
					//console.log("F " + index + " " + file);
					if (file != null) {
						var full_file = path.resolve(dyrectory, file);
						var extention = path.extname(full_file);
						var isDyrectoryAndNotEmpty = false;
						try {
							const fileStat = fs.statSync(full_file);
							isDyrectoryAndNotEmpty = fileStat.isDirectory();
						}
						catch {
							console.log("WARNING: directory[" + file + "] is empty");
						}
						if (extention === ".mp4") {
							var relative_name = path.relative(root_folder, full_file);
							relative_name = path.sep + relative_name;
							video_content += "<p><input type='button' class='video_source' onclick=selectVideoForPlay('" + encodeURI(relative_name) + "') value='" + file + "'></input></p>";
							js_data += "playlistdata['" + file + "']='" + encodeURI(relative_name) + "';";
						} else if (isDyrectoryAndNotEmpty) {
							var relative_name = path.relative(root_folder, full_file);
							relative_name = path.sep + relative_name;
							dirs_content += "<li><a href='" + relative_name + "'>" + file + "</a></li>";
						} else if (extention === ".avi" || extention === ".mkv" || extention === ".wmv") {
							var converter = new VideoConverter(file, dyrectory);
							converter.convert();
						} else {
							console.log("WARNING: can't process -> " + file);
						}
					}
				});
				var file_data = html.toString();
				res.writeHeader(200, {"Content-Type": "text/html"});
				file_data = file_data.replace(replace_vid1_str, video_content);
				file_data = file_data.replace(replace_dir_list_str, dirs_content);
				file_data = file_data.replace(replace_js_data_str, js_data);
				res.write(file_data);
				res.end();
			});
		});
	}

	processFileRequest(fileName, req, res) {
		//console.log("FILE: ", fileName);
		fs.stat(fileName, function(err, stats) {
			if (err) {
				if (err.code === 'ENOENT') {
					// 404 Error if file not found
					writeNoFile(res);
					return;
				}
				res.end(err);
			}
			var range = req.headers.range;
			if (!range) {
				// video page request - not supported
				writeNoFile(res);
				return;
			}
			// video content request
			var positions = range.replace(/bytes=/, "").split("-");
			var start = parseInt(positions[0], 10);
			var total = stats.size;
			var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
			var chunksize = (end - start) + 1;

			res.writeHead(206, {
				"Content-Range": "bytes " + start + "-" + end + "/" + total,
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Type": "video/mp4"
			});

			var stream = fs.createReadStream(fileName, { start: start, end: end })
			.on("open", function() {
				stream.pipe(res);
			}).on("error", function(err) {
				res.end(err);
			});
		});
	}

	processCommonFile(fileName, res) {
		//console.log("Process common file: " + fileName);
		var fullFileName = path.resolve("./", fileName);
		fs.readFile(fullFileName, function (err, html) {
			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(html);
			res.end();
		});
	}
}

module.exports = LogicController;
