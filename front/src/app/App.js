import React from 'react';
import './App.css';
import Navbar from '../navbar/Navbar';
import Main from '../main/Main';
import Leaderboard from '../leaderboard/Leaderboard';

class App extends React.Component {

  render(){ 
    return (
      <div className="App">
      <Navbar />
        <div class="container">
          <div class="row">
            <div class="col-sm-board">
            <Leaderboard />
            </div>
            <div class="col-sm ">
            <Main />
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default App;
