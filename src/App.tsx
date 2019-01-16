import React, { Component } from 'react';
import './App.css';
import ParkingMap from './components/parking_map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ParkingMap />
      </div>
    );
  }
}

export default App;
