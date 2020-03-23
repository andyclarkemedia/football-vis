//========================
// This file will render the game on the page 
// =======================

// Import Statements


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {selectVisualisation, animateWindowDrop, animateWindowHide } from './visualisations.js'
 



class Visualisation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      visualisation: selectVisualisation(this, this.activeVisualisation)
      
      }

      this.update = this.update.bind(this);
      
    }

  // Update Visualisation State

  update = () => {  
    this.setState({ visualisation: selectVisualisation(this, this.activeVisualisation) })

    console.log(this.state.visualisation)
  }


  activeVisualisation = "none";

  changeActiveVisualisation = (vis) => {


    if (vis === "none") {
      this.activeVisualisation = "none"
    } else if (vis === "ranking") {
      this.activeVisualisation = "ranking"
    } else if (vis === "events") {
      this.activeVisualisation = "events"
    } else if (vis === "links") {
      this.activeVisualisation = "links"
    }

    this.update();

  }


  // Update Visualisation State


  render() {
  
    let result = (
      <div className="background-container">

        <h1 id="page-title" className="home-screen-text"> Playmakers of the World Cup 2019 </h1>


        <div id="link-up-container" className="visualisation-selection-container">

          <p id="link-up-selection-title" className="selection-title" >Link Ups</p>

          <button className="home-selection-button" onClick={ () => this.changeActiveVisualisation("links") } > View </button>

        </div>

        <div id="ranking-container" className="visualisation-selection-container">

          <p id="ranking-selection-title" className="selection-title" >Player Ranking</p>

          <button className="home-selection-button" onClick={ () => { this.changeActiveVisualisation("ranking") ; animateWindowDrop() } }> View </button>

        </div>

        <div id="events-container" className="visualisation-selection-container">

          <p id="events-selection-title" className="selection-title" >See the Play</p>

          <button className="home-selection-button" onClick={ () => this.changeActiveVisualisation("events") } > View </button>

        </div>

        { this.state.visualisation }

        <div className="vis-background-container">
        </div>
        <div className="menu-background-container">
        </div>

        
      </div>
    );
    
    return result
  }
};


ReactDOM.render(<Visualisation />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
