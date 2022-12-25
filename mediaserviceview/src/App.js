import './App.css';
import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <header>
        <p><a href="/">Home video player</a></p>
      </header>);
  }
}

class NavigationBar extends React.Component {
  render() {
    return (
      <div id="globalnavigation">
        <p id="plaing">Plaing: </p>
        <p id="recent">Last seen: <a id="recent_info" href="/TODO"></a></p>
          <input type='button' id="prevBtn" onclick={() => this.setState({value: 'X'})} value='Prevoius'></input>
          <input type='button' id="nextBtn" onclick={() => this.setState({value: 'X'})} value='Next'></input>
      </div>);
  }
}

class VideoPlayer extends React.Component {
  render() {
    return (<div id="mediacontent">
      <video id="video" controls>
        </video>
    </div>);
  }
}

class VideoList extends React.Component {
  playMe() {
    //TODO
  }
  render() {
    return (<div id="list">
      <p><input type='button' class='video_source' onclick={() => this.playMe()}></input></p>
      <p><input type='button' class='video_source' onclick={() => this.playMe()}></input></p>
      <p><input type='button' class='video_source' onclick={() => this.playMe()}></input></p>
    </div>);
  }
}

class PlayerSection extends React.Component {
  render() {
    return (
      <div id="playersection">
        <VideoPlayer /> 
        <VideoList />
      </div>);
  }
}

class FoldersList extends React.Component {
  render() {
    return (
      <div id="foldersList">
        <p>Folder 1</p>
        <p>Folder 2</p>
        <p>Folder 3</p>
      </div>
    );
  }
}

class DownloadsList extends React.Component {
  render() {
    return (
      <div id="downloadsList">
        <p>File 1</p>
        <p>File 2</p>
        <p>File 3</p>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Header />
      <NavigationBar />
      <PlayerSection />
      <FoldersList />
      <DownloadsList />
    </div>
  );
}

export default App;
