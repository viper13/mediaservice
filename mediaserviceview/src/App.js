import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function LoadingItem(props) {
  return <p>waiting....</p>;
}

function Header(props)  {
  return (
    <header>
      <p><a href="/">Home video player</a></p>
    </header>);
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
    <div id="globalnavigation">
      <p id="location">Location: {Array.isArray(detailedLocation) ? detailedLocation.map(value => {
            return <input type='button' onClick={() => clickHandler(value)} value={value.name} />;
          }) : ''}</p>
      <p id="plaing">Plaing: {props.video.name}</p>
      <p id="recent">Last seen: <a id="recent_info" href="/TODO"></a></p>
        <input type='button' id="prevBtn" onClick={() => this.setState({value: 'X'})} value='Prevoius'></input>
        <input type='button' id="nextBtn" onClick={() => this.setState({value: 'X'})} value='Next'></input>
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

  return (<div id="mediacontent">
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
    return (<div id="list">
        {props.files.map(value => {
            return value.isVideo ? <p><input type='button' onClick={() => clickHandler(value)} value={value.name} /></p> : '';
          })}
      </div>);
  } else {
    return <LoadingItem />;
  }
}

function PlayerSection(props)  {
  return (
    <div id="playersection">
      <NavigationBar video={props.video} path={props.path} setPath={props.setPath}/>
      <VideoPlayer video={props.video} /> 
      <VideoList files={props.files} video={props.video} setVideo={props.setVideo} />
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
          return value.isDirectory ? 
                <p><input type='button' onClick={() => clickHandler(value)} value={value.name} /></p> 
                : ''
        })}
    </div>);
  } else {
    return <LoadingItem />;
  }
}

function DownloadsListItem(props) {
  return (<p><a href={"download?src=" + props.file} >{props.name}</a></p>);
}

function DownloadsList(props) {
  if (Array.isArray(props.files)) {
      return (
      <div id="downloadsList">
        { props.files.map(value => {
          return value.isDirectory ? 
                  '' 
                  : <DownloadsListItem file={value.relativeName} name={value.name}/> ;
          }) }
      </div> );
  } else {
    return <LoadingItem />;
  }
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
    </div>
  );
}

export default App;
