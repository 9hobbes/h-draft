import React, { Component } from 'react';
import logo from './logo.svg';
import HEditor from './h-editor';

import './app.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to H-Draft</h1>
        </header>
        <HEditor />
      </div>
    );
  }
}

export default App;
