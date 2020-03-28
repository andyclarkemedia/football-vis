//========================
// Will return EVENTS Visualisation
// =======================



// =====================
// GENERAL IMPORTS
// =====================


import React from 'react';
import ReactDOM from 'react-dom';
import anime from 'animejs/lib/anime.es.js';
import * as d3 from "d3"
import eventsData from "./key_passes.csv"
import playerCount from "./player_count.csv"


// =====================
// VISUALISATION IMPORTS
// =====================

import { animateWindowHide, hideSelectMenuContainer, animateSelectMenuContainer, createIndividualPlayerDiv } from "./utils.js";
import { returnPlayerPhoto } from "./player-photos.js";
 




// =====================
// MODULE SPECIFIC FUNCTIONS 
// =====================



export const eventsVis = function(Visualisation) {


	let result = (

		<div className="whole-page-events-container">


			<h1 id="events-title"> See The Play </h1>
			<h3 id="events-description"> Investigate the key plays from the best playmakers in the 2018 World Cup</h3>

			<div id="player-profile-container">
				<img id="player-profile-image" src="" />
				<p id="player-profile-name"> </p>
				<p id="playmaker-rank"> </p>
				<p id="field-position"> </p>
				<p id="country-team"> </p>
				<p id="club-team"> </p>

			</div>


			<img className="close-window-image"  src={require('./images/close-window.png')} onClick={ () => { Visualisation.changeActiveVisualisation("none") ; animateWindowHide() } } />

			<img className="arrow-icon" id="left-icon" src={require('./images/left-icon.png')} onClick={ () => { changeEvent("down") } } />
			<img className="arrow-icon" id="right-icon" src={require('./images/right-icon.png')} onClick={ () => { changeEvent("up") } } />

			<div id="event-info-container">
				<p id="match-info-label"> </p>
				<p id="event-number-counter"> </p>
				<p id="event-type-label">Type of Play:</p>
				<p id="event-type"> </p>
				<p id="event-description-label">Description:</p>
				<p id="event-description-text"> </p>
			</div>

			<div id="svg-events-container">
				<svg id="events-svg">
					<g id="pitch-group">
						<line id="top-line" className="pitch-line" x1="2" y1="2" x2="" y2="2" />
						<line id="left-line" className="pitch-line" x1="2" y1="2" x2="2" y2="0" />
						<line id="right-line" className="pitch-line" x1="2" y1="2" x2="0" y2="0" />
						<line id="bottom-line" className="pitch-line" x1="2" y1="0" x2="" y2="0" />
						<line id="center-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />


						<line id="left-penalty-top-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="left-penalty-middle-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="left-penalty-bottom-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />

						<line id="left-six-top-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="left-six-middle-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="left-six-bottom-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />


						<line id="right-penalty-top-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="right-penalty-middle-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="right-penalty-bottom-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />

						<line id="right-six-top-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="right-six-middle-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />
						<line id="right-six-bottom-line" className="pitch-line" x1="2" y1="2" x2="" y2="0" />

						<circle id="left-penalty-spot-circle" className="pitch-line" cx="" cy="" r="" />
						<circle id="right-penalty-spot-circle" className="pitch-line" cx="" cy="" r="" />


						<circle id="halfway-circle" className="pitch-line" cx="" cy="" r=""/>
						<circle id="center-spot-circle" className="pitch-line" cx="" cy="" r="" fill="#8EE4AF"/>


						<circle id="first-ball" className="ball" cx="" cy="" r=""/>
						<circle id="second-ball" className="ball" cx="" cy="" r=""/>


						<text id="player-name" className="svg-inner-text" x="" y=""> </text>
						<text id="recipient-name" className="svg-inner-text" x="" y=""> </text>


					</g>
				</svg>
			</div>


			<div id="select-player-sub-container">

				<div id="select-player-menu">
					<h1 id="select-player-menu-title" > Select a Player </h1> 
					<img className="close-window-image-menu"  src={require('./images/close-window.png')} onClick={ () => { hideSelectMenuContainer() } } />

					<section id="scrollable-players">
					</section>
					
					<button id="add-player-select-button" onClick={ () => confirmSelectNewPlayer() }> Select Player </button>

				</div>
			</div>


			<button id="select-player-events-button" onClick={() => { animateSelectMenuContainer() } }>
				Select Player
			</button> 
			
		</div>

		)

	return result;
}


//====================
// DECLARE COUNTER & PLAYER NAME
//====================

let playerName = "Neymar";
let eventCounter = 0;

let recipientName = "";
let maxValue;


let temporarySelectedPlayer = "";



//====================
// DECLARE INFO
//====================


let matchInfo = "";



// FUNCTION TO RETURN SCALES AND POSITION

// const createScaleAndPositionObject = function() {

// 	// Declare Object

// 	let object = {
// 		margin: 2,
// 		svgPosition: document.querySelector('#events-svg').getBoundingClientRect(),
// 		myPitchScaleX: d3.scaleLinear().domain([0, 100]).range([this.margin, (this.svgPosition.width - this.margin)]),
// 		myPitchScaleY: d3.scaleLinear().domain([0, 100]).range([this.margin, (this.svgPosition.height - this.margin)])
// 	}

// 	return object;

// }


//====================
// Load Events Data
//====================

export const loadEventsData = function(first) {


	// Load the data 
	d3.csv(eventsData).then(function(res) {
		
		let firstPlayerData = returnAllPlayerEvents(res);
		fillSelectPlayerMenuEvents();

		
		if (first) {
			// DRAW PITCH
			drawPitch();
			// Plot Data after Pitch has loaded
			setTimeout(plotEventsData, 7000, firstPlayerData);
		} else {
			plotEventsData(firstPlayerData)
		}


	})
}

//====================
// RETURN ALL PLAYER EVENTS 
//====================

const returnAllPlayerEvents = function(data) {

	// Array for holding all player data
	let playerArray = [];


	// Loop through data and push matching items to playerArray
	data.forEach(function(item) {

		// Check for match 
		if (item.playerName === playerName) {
			playerArray.push(item)
		}
	})

	maxValue = playerArray.length;

	return playerArray;
}


//====================
// PLOT EVENTS DATA
//====================


const plotEventsData = function(data) {

	let play = data[eventCounter];

	// WARNING OF REPEATING MYSELF CONSIDER ADDING TO A SEPARATE FUNCTION

	// SET RECIPIENT NAME 
	recipientName = play.recipientName;

	// SET MATCH INFO
	matchInfo = play.label;

	const matchInfoElement = document.querySelector('#match-info-label');
	matchInfoElement.innerHTML = matchInfo;

	const eventNumberCounter = document.querySelector('#event-number-counter');
	eventNumberCounter.innerHTML = (eventCounter + 1) + "/" + maxValue;

	const eventTypeElement = document.querySelector('#event-type');
	eventTypeElement.innerHTML = play.subEventName;


	const eventDescriptionElement = document.querySelector('#event-description-text');

	if (play.Tag_3_Description != "") {
		eventDescriptionElement.innerHTML = play.Tag_1_Description + " / " + play.Tag_2_Description + " / " + play.Tag_3_Description
	} else if (play.Tag_2_Description != "") {
		eventDescriptionElement.innerHTML = play.Tag_1_Description + " / " + play.Tag_2_Description
	} else {
		eventDescriptionElement.innerHTML = play.Tag_1_Description
	}

	console.log(play)


	// CREATE PLAYER PROFILE INFO

	createPlayerProfile(play);

	// SET MARGIN 

	let margin = 8;

	// GET POSITIONS 
	const svgPosition = document.querySelector('#events-svg').getBoundingClientRect();

	//==============
	// SCALES
	//==============

	var myBallScaleX = d3.scaleLinear().domain([0, 100]).range([margin, (svgPosition.width - margin)])
	var myBallScaleY = d3.scaleLinear().domain([0, 100]).range([margin, (svgPosition.height - margin)])


	// Create Balls
	animateFirstBall(play.startingX, play.startingY, myBallScaleX, myBallScaleY);
	animateBallMove(play.startingX, play.startingY, play.finishingX, play.finishingY, myBallScaleX, myBallScaleY);


}


//====================
// Animate Ball Functions
//====================

const animateFirstBall = function(cx, cy, scaleX, scaleY) {


	// CREATE CALCULATE PLAYER LABEL POSITION FUNCTION 


	// Select Ball 
	const ball = document.querySelector("#first-ball");

	// Select Player Text
	const textElementPlayerName = document.querySelector('#player-name');

	textElementPlayerName.innerHTML = playerName;
	// Create Animation Timeline
	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: ball,
			duration: 1,
			cx: scaleX(cx),
			cy: scaleY(cy),
			r: 5,
			easing: 'linear'
		})
		.add({
			targets: textElementPlayerName,
			duration: 100,
			x: (scaleX(cx) + 10),
			y: (scaleY(cy) + 10),
			easing: 'linear'
		})

}

const animateBallMove = function(cxOne, cyOne, cxTwo, cyTwo, scaleX, scaleY) {


	// CREATE CALCULATE PLAYER LABEL POSITION FUNCTION

	// Select Ball 
	const ball = document.querySelector("#second-ball");
	

	// Select Recipient Text
	const textElementRecipientName = document.querySelector('#recipient-name');

	textElementRecipientName.innerHTML = recipientName;

	// Create Animation Timeline
	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: textElementRecipientName,
			duration: 0,
			opacity: 0,
			easing: 'linear'
		})
		.add({
			targets: textElementRecipientName,
			duration: 1,
			x: (scaleX(cxTwo) - 50),
			y: (scaleY(cyTwo) - 10),
			easing: 'linear'
		})
		.add({
			targets: ball,
			duration: 1,
			r: 5,
			fill: "#EDF5E1",
			cx: scaleX(cxOne),
			cy: scaleY(cyOne),
			easing: 'linear'
		})
		.add({
			targets: ball,
			duration: 1000,
			cx: scaleX(cxTwo),
			cy: scaleY(cyTwo),
			easing: 'linear'
		})
		.add({
			targets: textElementRecipientName,
			duration: 500,
			opacity: 1,
			easing: 'linear'
		})
}


//====================
// Change Event Up Down
//====================


const changeEvent = function(direction) {

	if (direction === "up") {
		if (eventCounter != (maxValue - 1)) {
			eventCounter += 1;
		} else {
			eventCounter = 0;
		}
	} else if (direction === "down") {
		if (eventCounter != 0) {
			eventCounter -= 1;
		} else {
			eventCounter = (maxValue - 1);
		}
	}

	loadEventsData();

}


// =================
// FILL PLAYER PROFILE 
//==================


const createPlayerProfile = function(data) {

	// Create Functionality to set player photo



	// Player Name 
	const playerNameElement = document.querySelector('#player-profile-name');
	// Playmaker Rank
	const playmakerRankElement = document.querySelector('#playmaker-rank')
	// Field Position
	const fieldPositionElement = document.querySelector('#field-position');
	// Country Team
	const countryTeam = document.querySelector('#country-team');
	// Club Team
	const clubTeam = document.querySelector('#club-team');
	// Player Profile 
	const playerProfilePicture = document.querySelector('#player-profile-image');



	// LOAD PLAYER DATA 

	d3.csv(playerCount).then(function(res) {

		let player;

		res.forEach(function(item) {
			if (item.playerName === data.playerName) {
				let player = item;
				const pictureUrlLoad = returnPlayerPhoto(player[""]);
				playerProfilePicture.src = pictureUrlLoad;
				playerNameElement.innerHTML = player.playerName;
				playmakerRankElement.innerHTML = "Playmaker Rank: " + (parseInt(player[""]) + 1);
				fieldPositionElement.innerHTML = "Position: " + player.fieldPosition;
				countryTeam.innerHTML = "Country: " + player.country;
				clubTeam.innerHTML = "Club: " + player.clubOfficial;
			}
		})


	})
}


// ===============
// FILL SELECT PLAYER MENU 
// ===============

const fillSelectPlayerMenuEvents = function() {

	// Parent Container 
	const selectPlayerMenu = document.querySelector('#select-player-menu');
	const scrollablePlayerContainer = document.querySelector('#scrollable-players');


	d3.csv(playerCount).then(function(res) {

		res.forEach(function(item) {
			let playerContainer = createIndividualPlayerDiv(item, selectNewPlayer);
			scrollablePlayerContainer.appendChild(playerContainer);
		})
	})

}


const selectNewPlayer = function(item) {

	console.log(item)

	temporarySelectedPlayer = item.target.innerText;

	const allPlayerContainers = document.querySelectorAll('.player-select-container');

	allPlayerContainers.forEach(function(element) {
		element.style.backgroundColor = "#EDF5E1";
		element.style.color = "#282828";
	})

	// Check if child or parent was clicked 

	if (item.target.tagName.toLowerCase() === "div") {
		item.target.style.backgroundColor = "#05386B";
		item.target.style.color = "#EDF5E1";
	} else {
		item.target.parentElement.style.backgroundColor = "#05386B";
		item.target.parentElement.style.color = "#EDF5E1";
	}
}


const confirmSelectNewPlayer = function() {

	if (temporarySelectedPlayer != "") {

		playerName = temporarySelectedPlayer;
		loadEventsData();
		hideSelectMenuContainer();

	} else {
		hideSelectMenuContainer();
	}
}


//====================
// Draw pitch Function
//====================

const drawPitch = function() {

	// SET MARGIN 

	let margin = 2;

	// GET POSITIONS 
	const svgPosition = document.querySelector('#events-svg').getBoundingClientRect();


	// SELECT PITCH 
	const pitch = document.querySelector('#pitch-group');

	// SELECT LINES
	const topLine = document.querySelector('#top-line');
	const bottomLine = document.querySelector('#bottom-line');
	const leftLine = document.querySelector('#left-line');
	const rightLine = document.querySelector('#right-line');

	const centerLine = document.querySelector('#center-line');

	const leftPenaltyTopLine = document.querySelector('#left-penalty-top-line');
	const leftPenaltyMiddleLine = document.querySelector('#left-penalty-middle-line');
	const leftPenaltyBottomLine = document.querySelector('#left-penalty-bottom-line');

	const leftSixTopLine = document.querySelector('#left-six-top-line');
	const leftSixMiddleLine = document.querySelector('#left-six-middle-line');
	const leftSixBottomLine = document.querySelector('#left-six-bottom-line');

	const rightPenaltyTopLine = document.querySelector('#right-penalty-top-line');
	const rightPenaltyMiddleLine = document.querySelector('#right-penalty-middle-line');
	const rightPenaltyBottomLine = document.querySelector('#right-penalty-bottom-line');

	const rightSixTopLine = document.querySelector('#right-six-top-line');
	const rightSixMiddleLine = document.querySelector('#right-six-middle-line');
	const rightSixBottomLine = document.querySelector('#right-six-bottom-line');

	const rightPenaltySpot = document.querySelector('#right-penalty-spot-circle');
	const leftPenaltySpot = document.querySelector('#left-penalty-spot-circle');


	const halfwayCircle = document.querySelector('#halfway-circle');
	const centerSpot = document.querySelector('#center-spot-circle');


	// SELECT ARROWS
	const arrowLeft = document.querySelector("#left-icon");
	const arrowRight = document.querySelector("#right-icon");


	// SELECT CONTAINERS 
	const eventInfoContainer = document.querySelector('#event-info-container');
	const playerProfileContainer = document.querySelector('#player-profile-container');


	//==============
	// SCALES
	//==============

	var myPitchScaleX = d3.scaleLinear().domain([0, 100]).range([margin, (svgPosition.width - margin)])
	var myPitchScaleY = d3.scaleLinear().domain([0, 100]).range([margin, (svgPosition.height - margin)])


	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: topLine,
			duration: 300,
			x2: myPitchScaleX(100),
			easing: 'linear'
		})
		.add({
			targets: bottomLine,
			duration: 1,
			y1: myPitchScaleY(100),
			y2: myPitchScaleY(100)
		})
		.add({
			targets: bottomLine,
			duration: 300,
			x2: myPitchScaleX(100),
			easing: 'linear'
		})
		.add({
			targets: leftLine,
			duration: 300,
			y2: myPitchScaleY(100),
			easing: 'linear'
		})
		.add({
			targets: rightLine,
			duration: 1,
			x1: myPitchScaleX(100),
			x2: myPitchScaleX(100),
		})
		.add({
			targets: rightLine,
			duration: 300,
			y2: myPitchScaleY(100),
			easing: 'linear'
		})
		.add({
			targets: centerLine,
			duration: 1,
			x1: myPitchScaleX(50),
			x2: myPitchScaleX(50)
		})
		.add({
			targets: centerLine,
			duration: 300,
			y2: myPitchScaleY(100),
			easing: 'linear'
		})
		.add({
			targets: centerLine,
			duration: 300,
			y2: myPitchScaleY(100),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltyTopLine,
			duration: 1,
			y1: myPitchScaleY(28),
			y2: myPitchScaleY(28),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltyTopLine,
			duration: 200,
			x2: myPitchScaleX(16),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltyMiddleLine,
			duration: 1,
			x1: myPitchScaleX(16),
			x2: myPitchScaleX(16),
			y1: myPitchScaleY(28),
			y2: myPitchScaleY(28),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltyMiddleLine,
			duration: 200,
			y2: myPitchScaleY(72),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltyBottomLine,
			duration: 1,
			y1: myPitchScaleY(72),
			y2: myPitchScaleY(72),
			x1: myPitchScaleX(16),
			x2: myPitchScaleX(16),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltyBottomLine,
			duration: 200,
			x2: myPitchScaleX(0),
			easing: 'linear'
		})
		.add({
			targets: leftSixTopLine,
			duration: 1,
			y1: myPitchScaleY(40),
			y2: myPitchScaleY(40),
			easing: 'linear'
		})
		.add({
			targets: leftSixTopLine,
			duration: 200,
			x2: myPitchScaleX(6),
			easing: 'linear'
		})
		.add({
			targets: leftSixMiddleLine,
			duration: 1,
			x1: myPitchScaleX(6),
			x2: myPitchScaleX(6),
			y1: myPitchScaleY(40),
			y2: myPitchScaleY(40),
			easing: 'linear'
		})
		.add({
			targets: leftSixMiddleLine,
			duration: 200,
			y2: myPitchScaleY(60),
			easing: 'linear'
		})
		.add({
			targets: leftSixBottomLine,
			duration: 1,
			y1: myPitchScaleY(60),
			y2: myPitchScaleY(60),
			x1: myPitchScaleX(6),
			x2: myPitchScaleX(6),
			easing: 'linear'
		})
		.add({
			targets: leftSixBottomLine,
			duration: 200,
			x2: myPitchScaleX(0),
			easing: 'linear'
		})
		.add({
			targets: rightPenaltyTopLine,
			duration: 1,
			y1: myPitchScaleY(28),
			y2: myPitchScaleY(28),
			x1: myPitchScaleX(100),
			x2: myPitchScaleX(100),
			easing: 'linear'
		})
		.add({
			targets: rightPenaltyTopLine,
			duration: 200,
			x2: myPitchScaleX(84),
			easing: 'linear'
		})
		.add({
			targets: rightPenaltyMiddleLine,
			duration: 1,
			x1: myPitchScaleX(84),
			x2: myPitchScaleX(84),
			y1: myPitchScaleY(28),
			y2: myPitchScaleY(28),
			easing: 'linear'
		})
		.add({
			targets: rightPenaltyMiddleLine,
			duration: 200,
			y2: myPitchScaleY(72),
			easing: 'linear'
		})
		.add({
			targets: rightPenaltyBottomLine,
			duration: 1,
			y1: myPitchScaleY(72),
			y2: myPitchScaleY(72),
			x1: myPitchScaleX(84),
			x2: myPitchScaleX(84),
			easing: 'linear'
		})
		.add({
			targets: rightPenaltyBottomLine,
			duration: 200,
			x2: myPitchScaleX(100),
			easing: 'linear'
		})
		.add({
			targets: rightSixTopLine,
			duration: 1,
			y1: myPitchScaleY(40),
			y2: myPitchScaleY(40),
			x1: myPitchScaleX(100),
			x2: myPitchScaleX(100),
			easing: 'linear'
		})
		.add({
			targets: rightSixTopLine,
			duration: 200,
			x2: myPitchScaleX(94),
			easing: 'linear'
		})
		.add({
			targets: rightSixMiddleLine,
			duration: 1,
			x1: myPitchScaleX(94),
			x2: myPitchScaleX(94),
			y1: myPitchScaleY(40),
			y2: myPitchScaleY(40),
			easing: 'linear'
		})
		.add({
			targets: rightSixMiddleLine,
			duration: 200,
			y2: myPitchScaleY(60),
			easing: 'linear'
		})
		.add({
			targets: rightSixBottomLine,
			duration: 1,
			y1: myPitchScaleY(60),
			y2: myPitchScaleY(60),
			x1: myPitchScaleX(94),
			x2: myPitchScaleX(94),
			easing: 'linear'
		})
		.add({
			targets: rightSixBottomLine,
			duration: 200,
			x2: myPitchScaleX(100),
			easing: 'linear'
		})
		.add({
			targets: leftPenaltySpot,
			duration: 1,
			r: myPitchScaleX(0.1),
			cx: myPitchScaleX(12),
			cy: myPitchScaleY(0)
		})
		.add({
			targets: leftPenaltySpot,
			duration: 200,
			cy: myPitchScaleY(50)
		})
		.add({
			targets: rightPenaltySpot,
			duration: 1,
			r: myPitchScaleX(0.1),
			cx: myPitchScaleX(88),
			cy: myPitchScaleY(0)
		})
		.add({
			targets: rightPenaltySpot,
			duration: 200,
			cy: myPitchScaleY(50)
		})
		.add({
			targets: halfwayCircle,
			duration: 500,
			cy: myPitchScaleY(50)
		})
		.add({
			targets: halfwayCircle,
			duration: 1,
			r: myPitchScaleX(10),
			cx: myPitchScaleX(50),
			cy: myPitchScaleY(0)
		})
		.add({
			targets: halfwayCircle,
			duration: 500,
			cy: myPitchScaleY(50)
		})
		.add({
			targets: centerSpot,
			duration: 1,
			r: myPitchScaleX(0.2),
			cx: myPitchScaleX(50),
			cy: myPitchScaleY(0)
		})
		.add({
			targets: centerSpot,
			duration: 300,
			cy: myPitchScaleY(50)
		})
		.add({
			targets: [arrowRight, arrowLeft],
			duration: 2000,
			opacity: 1
		})
		.add({
			targets: [playerProfileContainer, eventInfoContainer],
			duration: 2000,
			opacity: 1
		})

}


//====================
// Create Line Function
//====================

