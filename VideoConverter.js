var path = require("path");
const { exec } = require("child_process");
var fs = require("fs");

class VideoConverter {
    constructor(file, folder) {
        this.file = file;
        this.folder = folder;
     }

    convert() {
        try {
            console.log("Start converitng:" + this.file);
            var file = path.resolve(this.folder, this.file);
            var new_file_name = path.resolve(path.normalize(this.folder + "\\" + path.parse(file).name + ".mp4"));
            //TODO: add clearing + from new filename - as result this files will have a problem
            var command = 'ffmpeg -i "' + file + '" -ac 2 -b:v 2000k -c:a aac -c:v libx264 -b:a 160k -vprofile high -bf 0 -strict experimental -f mp4 "' + new_file_name + '"';

            const ffmpeg = exec(command);
            ffmpeg.stdout.on('data', (data) => {
                //console.log("OUT:");
                //console.log(data);
            });

            ffmpeg.stderr.on('data', (data) => {
                //console.log("ERROR:");
                //console.log(data);
            });

            ffmpeg.on('close', (code) => {
                console.log("Converting done child process exited with code:" + code);
                if (code === 0) {
                    fs.rm(file, (err) => {
                        if (err !== null) {
                            console.log("Failure to delete file after converting:" + file);
                        }
                    });
                }
            });
        }
        catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    }
}

module.exports = VideoConverter;