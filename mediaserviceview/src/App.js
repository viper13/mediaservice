import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import FileDownloadImage from './images/file-download.png';

function LoadingItem(props) {
  return <p>waiting....</p>;
}

function Header(props) {
  return (
    <div id="header">
      <div class="center"><p><a href="/">Home video player</a></p></div>
    </div>);
}
function PrevoiusButton(props) {
  const [prevoius, setPrevoius] = useState({});
  useEffect(() => {
    if (!props.video.file || !props.files) {
      setPrevoius({});
      return;
    }
    var prev = {};
    var isVideoFound;
    isVideoFound = false;
    for (const value of props.files) {
      if (!value.isVideo || isVideoFound) {
        continue;
      }
      if (value.name === props.video.name) {
        isVideoFound = true;
      } else {
        prev = {file: value.relativeName, name:value.name};
      }
    }
    if (isVideoFound) {
      setPrevoius(prev);
    } else {
      setPrevoius({});
    }
  }, [props.video, props.files]);

  function clickHandler() {
    props.setVideo({file: prevoius.file, name: prevoius.name});
  }

  return (<input type='button' id="prevoiusButton" onClick={() => clickHandler()} value='Prevoius' disabled={!prevoius.file}></input>);
}

function NextButton(props) {
  const [next, setNext] = useState({});
  useEffect(() => {
    if (!props.video.file || !props.files) {
      setNext({});
      return;
    }
    var plusOne = {};// next
    var isVideoFound;
    isVideoFound = false;
    for (const value of props.files) {
      if (!value.isVideo || Object.keys(plusOne).length !== 0) {
        continue;
      }
      if (isVideoFound) {
        plusOne = {file: value.relativeName, name:value.name};
        continue;
      }
      if (value.name === props.video.name) {
        isVideoFound = true;
      }
    }
    setNext(plusOne);
  }, [props.video, props.files]);

  function clickHandler() {
    props.setVideo({file: next.file, name: next.name});
  }

  return (<input type='button' id="nextButton" onClick={() => clickHandler()} value='Next' disabled={!next.file}></input>);
}

function NavigationBar(props)  {
  const [detailedLocation, setDetailedLocation] = useState(0);

  function clickHandler(value) {
    console.log("Click to location: " + value.name);
    props.setPath(value.relativeName);
  }

  useEffect(() => {
    console.log("Fetch location: " + props.path);
    const dataFetch = async () => {
      const data = await (await fetch("/explainPath?path=" + encodeURI(props.path))).json();
      setDetailedLocation(data.directories);
    };

    dataFetch();
  }, [props.path]);
  return (
    <div id="navigationBar">
      <p id="location">{Array.isArray(detailedLocation) ? detailedLocation.map(value => {
            return <input type='button' onClick={() => clickHandler(value)} value={value.name} />;
          }) : ''}</p>

      <p id="plaing">Plaing: {props.video.name}</p>
      <p id="recent">Last seen: <a id="recent_info" href="/"></a></p>
    </div>);
}

function VideoPlayer(props)  {
  const videoPlayer = useRef(null);
  useEffect(() => {
    console.log("Video changed: " + props.video.file)
    if (!props.video.file)
      return;
    var video = videoPlayer.current;
    video.src = "/video?src=" + props.video.file;
    video.load();
    video.play().catch(function(error) {
      console.log("Looks like user have not interact with document.");
    });
  }, [props.video])

  return (<div id="videoPlayer">
    <video id="video" ref={videoPlayer} controls>
      </video>
  </div>);
}

function VideoList(props) {
  function clickHandler(value) {
    console.log("Click to video: " + value.name);
    props.setVideo({file: value.relativeName, name:value.name});
  }

  if (Array.isArray(props.files)) {
    return (<div id="videoList">
        {props.files.map(value => {
          if (value.isVideo) {
            return <input class="videoListItem" type='button' onClick={() => clickHandler(value)} value={value.name} />;
          } else {
            return '';
          }
        })}
      </div>);
  } else {
    return <LoadingItem />;
  }
}

function PlayerSection(props)  {
  return (
    <div id="playerSection">
      <NavigationBar video={props.video} setVideo={props.setVideo} path={props.path} setPath={props.setPath} files={props.files}/>
      <div id="videoContent">
        <PrevoiusButton video={props.video} setVideo={props.setVideo} files={props.files} />
        <VideoPlayer video={props.video} />
        <NextButton video={props.video} setVideo={props.setVideo} files={props.files} />
        <VideoList files={props.files} video={props.video} setVideo={props.setVideo} />
      </div>
    </div>);
}

function FoldersList(props) {
  function clickHandler(value) {
    console.log("Click to folder: " + value.name);
    props.setPath(value.relativeName);
  }
  if (Array.isArray(props.files)) {
    return (
      <div id="foldersList">
        { props.files.map(value => {
          if (value.isDirectory) {
            return <p><input class="foldersListItem" type='button' onClick={() => clickHandler(value)} value={value.name} /></p>;
          } else {
            return '';
          }
        })}
    </div>);
  } else {
    return <LoadingItem />;
  }
}

function DownloadsListItem(props) {
  return (<p><p class="downloadsListItem">
    <img class="downloadsListItem" src={FileDownloadImage} />
    <a class="downloadsListItem" href={"download?src=" + props.file} >{props.name}</a>
    </p></p>);
}

function DownloadsList(props) {
  if (Array.isArray(props.files)) {
      return (
      <div id="downloadsList">
        { props.files.map(value => {
            if (value.isDirectory) {
              return '';
            } else {
              return <DownloadsListItem file={value.relativeName} name={value.name}/>;
            }
          }) }
      </div> );
  } else {
    return <LoadingItem />;
  }
}

function Footer(props) {
  return (<div id="footer"><p>Private home video player.</p></div>);
}

function App() {
  const [files, setFiles] = useState(0);
  const [video, setVideo] = useState(0);
  const [path, setPath] = useState('/')

  useEffect(() => {
    console.log("Path updated: " + path);

    const dataFetch = async () => {
      const data = await (await fetch("/data?path=" + encodeURI(path))).json();
      setFiles(data.files);
    }

    dataFetch();
  }, [path]);

  return (
    <div className="App">
      <Header />
      <PlayerSection files={files} video={video} setVideo={setVideo} path={path} setPath={setPath} />
      <FoldersList files={files} path={path} setPath={setPath}/>
      <DownloadsList files={files} />
      <Footer />
    </div>
  );
}

export default App;
