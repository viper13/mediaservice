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
      <p id="plaing">Plaing: </p>
      <p id="recent">Last seen: <a id="recent_info" href="/TODO"></a></p>
        <input type='button' id="prevBtn" onClick={() => this.setState({value: 'X'})} value='Prevoius'></input>
        <input type='button' id="nextBtn" onClick={() => this.setState({value: 'X'})} value='Next'></input>
    </div>);
}

function VideoPlayer(props)  {
  return (<div id="mediacontent">
    <video id="video" controls src={props.video ? ('/video?src=' + props.video) : ''}>
      </video>
  </div>);
}

function VideoList(props) {
  return (<div id="list">
    {Array.isArray(props.files) ? props.files.map(value => {
        return value.isVideo ? <p><input type='button' onClick={() => {
          props.setVideo(value.relativeName)
        }} value={value.name} /></p> : '';
      }) : 'wait...'}
  </div>);
}

function PlayerSection(props)  {
  return (
    <div id="playersection">
      <VideoPlayer video={props.video}/> 
      <VideoList files={props.files} video={props.video} setVideo={props.setVideo}/>
    </div>);
}

function FoldersList(props) {
  return (
    <div id="foldersList">
      {Array.isArray(props.files) ? props.files.map(value => { return value.isDirectory ? <p>{value.name}</p> : '' }) : 'wait...'}
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
        return value.isDirectory ? '' : <DownloadsListItem file={value.relativeName} name={value.name}/> 
        }) : 'wait...'}
    </div>
  );
}

function App() {
  const [files, setFiles] = useState(0);
  const [video, setVideo] = useState(0);

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/data"
        )
      ).json();
      setFiles(data.files);
    }
    dataFetch();
  });
  return (
    <div className="App">
      <Header />
      <NavigationBar />
      <PlayerSection files={files} video={video} setVideo={setVideo}/>
      <FoldersList files={files} />
      <DownloadsList files={files} />
    </div>
  );
}

export default App;
