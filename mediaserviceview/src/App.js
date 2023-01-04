import './App.css';
import React, { useState, useEffect } from 'react';

function Header(props)  {
  return (
    <header>
      <p><a href="/">Home video player</a></p>
    </header>);
}

function NavigationBar(props)  {
  return (
    <div id="globalnavigation">
      <p id="plaing">Plaing: {props.video.name}</p>
      <p id="recent">Last seen: <a id="recent_info" href="/TODO"></a></p>
        <input type='button' id="prevBtn" onClick={() => this.setState({value: 'X'})} value='Prevoius'></input>
        <input type='button' id="nextBtn" onClick={() => this.setState({value: 'X'})} value='Next'></input>
    </div>);
}

function VideoPlayer(props)  {
  useEffect(() => {
    console.log("Video changed: " + props.video.file)
    if (!props.video.file)
      return;
    var video = document.getElementById('video');
    video.src = "/video?src=" + props.video.file;
    video.load();
    video.play();
  }, [props.video])

  return (<div id="mediacontent">
    <video id="video" controls>
      </video>
  </div>);
}

function VideoList(props) {
  return (<div id="list">
    {Array.isArray(props.files) ? props.files.map(value => {
        return value.isVideo ? <p><input type='button' onClick={() => {
          props.setVideo({file: value.relativeName, name:value.name});
        }} value={value.name} /></p> : '';
      }) : 'wait...'}
  </div>);
}

function PlayerSection(props)  {
  return (
    <div id="playersection">
      <NavigationBar video={props.video} />
      <VideoPlayer video={props.video} /> 
      <VideoList files={props.files} video={props.video} setVideo={props.setVideo} />
    </div>);
}

function FoldersList(props) {
  return (
    <div id="foldersList">
      {Array.isArray(props.files) ? props.files.map(value => { 
          return value.isDirectory ? <p><input type='button' onClick={() => {
            props.setPath(value.relativeName);
          }} value={value.name} /></p> : '' 
        }) : 'wait...'}
    </div>
  );
}

function DownloadsListItem(props) {
  return (<p><a href={"download?src=" + props.file} >{props.name}</a></p>);
}

function DownloadsList(props) {
  return (
    <div id="downloadsList">
      {Array.isArray(props.files) ? props.files.map(value => {
        return value.isDirectory ? '' : <DownloadsListItem file={value.relativeName} name={value.name}/> ;
        }) : 'wait...'}
    </div>
  );
}

function App() {
  const [files, setFiles] = useState(0);
  const [video, setVideo] = useState(0);
  const [path, setPath] = useState('/')

  const dataFetch = async () => {
    const data = await (await fetch("/data?path=" + path)).json();
    setFiles(data.files);
  }

  useEffect(() => {
    dataFetch();
  });
  useEffect(() => {
    console.log("Path updated: " + path);
    dataFetch();
  }, [path]);
  return (
    <div className="App">
      <Header />
      <PlayerSection files={files} video={video} setVideo={setVideo} />
      <FoldersList files={files} path={path} setPath={setPath}/>
      <DownloadsList files={files} />
    </div>
  );
}

export default App;
