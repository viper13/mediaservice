# Media Service
Media service for downloading and stream media, planned for local network

# Settings
LogicController.js:8 root_folder - this variable contains path in system that will be a root for media displaying

# Dependencies
Installed nodejs https://nodejs.org/. It must be available from command prompt.

Installed ffmpeg https://www.ffmpeg.org/ it is neaded for video converting to mp4 format. It must be available from command prompt.

# Run
Do not foget execute "npm install" in the root directory. Also "npm install" in the mediaserviceview directory, and than "npm run build".
Then need to execute command "node server.js" by current seting it start server on 8080 port.

# Mongo DB
expected DB 'mediaservice' and collection 'users'