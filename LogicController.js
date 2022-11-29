var fs = require("fs"),
    url = require("url"),
    path = require("path"),
    DBController = require("./MongoController.js");

var VideoConverter = require("./VideoConverter.js");

function writeNoFile(res) {
	res.writeHeader(404, {"Content-Type": "text/html"});  
	res.write("No file.");
	res.end();
}

function writeObj(res, object) {
	res.writeHeader(200, {"Content-Type": "application/json"});
	res.write(JSON.stringify(object));
	res.end();
}

class LogicController {
	constructor() { }
	static rootFolder() {
		return "e:/donwloads/torrent";
	}
	processRootRequest(res) {
		this.processDyrectoryRequest(path.resolve(LogicController.rootFolder()), null, null, res);
	}

	processRequest(req, res) {
		var url_parts = url.parse(req.url, true);
		var dyrectory = path.resolve(LogicController.rootFolder(), "." + decodeURI(url_parts.pathname));
		var isDyrectoryAndNotEmpty = false;
		try {
			const fileStat = fs.statSync(dyrectory);
			isDyrectoryAndNotEmpty = fileStat.isDirectory();
		}
		catch {
			console.log("WARNING: directory[" + dyrectory + "] is empty");
		}

		if (isDyrectoryAndNotEmpty === true) {
			this.processDyrectoryRequest(dyrectory, url_parts.query.file, url_parts.query.time, res);
		} else {
			writeNoFile(res);
		}
	}

	processRecentsRequest(req, res) {
		var url_parts = url.parse(req.url, true);
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
			const db = new DBController();
			console.log("Update: " + id + " [" + url_parts.query.source + "] " + url_parts.query.time);
			db.updateRecents(id, {path: url_parts.query.path, source: url_parts.query.source, time: url_parts.query.time, timestamp: Date.now()});
			writeObj(res, "success");
		}
		else {
			console.log("Bad recents action: " + action);
			writeNoFile(res);
		}
	}

	processDyrectoryRequest(dyrectory, file, time, res) {
		const replace_vid1_str = /________VIDEO_CONTENT1___________/g;
		const replace_dir_list_str = /_______FOLDERS_LIST____________/g;
		const replace_js_data_str = /_______JS_DATA____________/g;
		fs.readFile('./list.html', function (err, html) {
			fs.readdir(dyrectory, function (err, files) {
				var video_content = "";
				var dirs_content = "";
				var dirs_content_other_files = "";
				var js_data = "";
				files.forEach(function (file, index) {
					if (file != null) {
						var full_file = path.resolve(dyrectory, file);
						var extention = path.extname(full_file);
						var isDyrectoryAndNotEmpty = false;
						var size = 0;
						try {
							const fileStat = fs.statSync(full_file);
							size = fileStat.size / (1024*1024*1024);
							isDyrectoryAndNotEmpty = fileStat.isDirectory();
						}
						catch {
							console.log("WARNING: directory[" + file + "] is empty");
						}
						var relative_name = path.relative(LogicController.rootFolder(), full_file);
						relative_name = path.sep + relative_name;
						if (extention === ".mp4") {
							video_content += "<p><input type='button' class='video_source' onclick=selectVideoForPlay(\"" + encodeURI(relative_name) + "\") value=\"" + file + "\"></input></p>";
							dirs_content_other_files += "<li><a href=download?src=" + encodeURI(relative_name) + ">" + file + "</a></li>";
							js_data += "playlistdata[\"" + file + "\"]=\"" + encodeURI(relative_name) + "\";";
						} else if (isDyrectoryAndNotEmpty) {
							dirs_content += "<li><a href=\"" + encodeURI(relative_name) + "\">" + file + "</a></li>";
						//} else if (extention === ".avi" || extention === ".mkv" || extention === ".wmv") {
							//TODO: disabled while it will be more friendly
							//var converter = new VideoConverter(file, dyrectory);
							//converter.convert();
						} else {
							dirs_content_other_files += "<li><a href=download?src=" + encodeURI(relative_name) + ">" + file + "</a>->" + size.toFixed(2) + "GB</li>";
							console.log("WARNING: can't process -> " + file);
						}
					}
				});
				if (file !== null) {
					js_data += "play_on_load=\"" + file + "\";";
				}
				if (time !== null) {
					js_data += "time_on_load=" + time + ";";
				}
				var file_data = html.toString();
				res.writeHeader(200, {"Content-Type": "text/html"});
				file_data = file_data.replace(replace_vid1_str, video_content);
				dirs_content += dirs_content_other_files;
				file_data = file_data.replace(replace_dir_list_str, dirs_content);
				file_data = file_data.replace(replace_js_data_str, js_data);
				res.write(file_data);
				res.end();
			});
		});
	}

	processFileRequest(fileName, range, res) {
		fs.stat(fileName, function(err, stats) {
			if (err) {
				if (err.code === 'ENOENT') {
					// 404 Error if file not found
					writeNoFile(res);
					return;
				}
				res.end(err);
			}
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

	downloadFile(file, res)
	{
		file = LogicController.rootFolder() + path.sep + file;
		fs.stat(file, function(err, stats) {
			if (err) {
				if (err.code === 'ENOENT') {
					// 404 Error if file not found
					writeNoFile(res);
					return;
				}
				res.end(err);
			}

			res.download(file);
		});
	}
}

module.exports = LogicController;
