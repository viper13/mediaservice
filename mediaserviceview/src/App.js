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
    <video id="video" controls>
      </video>
  </div>);
}

function playMe() {
  //TODO
}

function VideoList(props) {
  return (<div id="list">
    <p><input type='button' onClick={() => playMe()}></input></p>
    <p><input type='button' onClick={() => playMe()}></input></p>
    <p><input type='button' onClick={() => playMe()}></input></p>
  </div>);
}

function PlayerSection(props)  {
  return (
    <div id="playersection">
      <VideoPlayer /> 
      <VideoList />
    </div>);
}

function FoldersList(props) {
  return (
    <div id="foldersList">
      {Array.isArray(props.files) ? props.files.map(value => { return value.isDirectory ? <p>{value.name}</p> : '' }) : 'wait...'}
    </div>
  );
}

function DownloadsList(props) {
  return (
    <div id="downloadsList">
      {Array.isArray(props.files) ? props.files.map(value => { return value.isDirectory ? '' : <p>{value.name}</p> }) : 'wait...'}
    </div>
  );
}

function App() {
  const [files, setFiles] = useState(0);

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
      <PlayerSection files={files} />
      <FoldersList files={files} />
      <DownloadsList files={files} />
    </div>
  );
}

export default App;
