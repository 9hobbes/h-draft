import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import HEditor from './h-editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to H-Draft</h1>
        </header>
        <p className="App-intro">
          두 줄 밑에 중간에 잘 눌러보면 커서가 생기고 편집할 수 있습니다.
        </p>
        <HEditor />
      </div>
    );
  }
}

export default App;
