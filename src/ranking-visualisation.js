//========================
// Will return RANKING Visualisation
// =======================

// =====================
// GENERAL IMPORTS
// =====================

import React from 'react';
import ReactDOM from 'react-dom';
import anime from 'animejs/lib/anime.es.js';
import * as d3 from "d3"
import data from "./key_passes.csv"
import playerCount from "./player_count.csv"


// =====================
// UTILS IMPORTS
// =====================

import { animateWindowHide, hideSelectMenuContainer, animateSelectMenuContainer, createIndividualPlayerDiv } from "./utils.js";



export const rankingVis = function(Visualisation) {


	let result = (

		<div className="whole-page-ranking-container">


			<img className="close-window-image"  src={require('./images/close-window.png')} onClick={ () => { Visualisation.changeActiveVisualisation("none") ; animateWindowHide()} } />

			<div id="svg-ranking-container" onDragOver={(event) => { animateOnDragOver("#svg-ranking-container") ; onDragOver(event) }} onDrop={(event) => onDrop(event)}>
				<svg id="ranking-svg">
					<g id="ranking-bars">
					</g>
					<g id="text-container">
					</g>
				</svg>
			</div>

			<div id="sidebar-general-container">

			</div>


			<div id="select-player-sub-container">

					<div id="select-player-menu">
						<h1 id="select-player-menu-title" > Choose some more players </h1> 
						<img className="close-window-image-menu"  src={require('./images/close-window.png')} onClick={ () => { hideSelectMenuContainer() } } />

						<section id="scrollable-players">
						</section>
						
						
					</div>
				</div>
			
		</div>

		)

	return result;
}


//

let displayedData;

export const loadRankedData = function(name) {
	
	d3.csv(playerCount).then(function(res) {

		// Fill Select Player Menu 

		fillSelectPlayerMenu(res);
		
		displayedData = res.slice(0,10)

		if (name) {

			res.forEach(function(item) {
				if (item.playerName.toString() === name.toString()) {
					//displayedData.pop()
					
					createBarChart(displayedData, true);
					displayedData.push(item);
					createBarChart(displayedData);
				}

			})

		}
		else {


			createBarChart(displayedData);

			let tenTwenty = res.slice(11, 21);

			addSidebar(tenTwenty);	


		}
	})

}


// LOAD DATA NOT FIRST 

const loadData = function(name) {


	// Check if player name has been specified 

	if (name) {
		d3.csv(playerCount).then(function(res) {
			res.forEach(function(item) {
				if (item.playerName.toString() === name.toString()) {
					createBarChart(displayedData);
					displayedData.push(item);
					createBarChart(displayedData);
				}
			})
		})
	}

	createBarChart(displayedData);
}



//=============
// FILL SELECT PLAYER MENU CONTAINER
//=============


let selectedPlayerArray = [];

const playerSelectOnClick = function(item) {


	selectedPlayerArray.push(item.target.innerText);
	// Check if child or parent was clicked 

	if (item.target.tagName.toLowerCase() === "div") {
		item.target.style.backgroundColor = "#05386B";
		item.target.style.color = "#EDF5E1";
	} else {
		item.target.parentElement.style.backgroundColor = "#05386B";
		item.target.parentElement.style.color = "#EDF5E1";
	}
	
}


const fillSelectPlayerMenu = function(data) {

	// Parent Container 
	const selectPlayerMenu = document.querySelector('#select-player-menu');

	// Create Add Button

	const addPlayerButton = document.createElement('button');
	addPlayerButton.id = "add-select-players-button";
	addPlayerButton.innerHTML = "Add Player";
	addPlayerButton.addEventListener("click", function() {
		addPlayersFromSelectMenu(selectedPlayerArray);
	})

	// Select container
	const scrollablePlayers = document.querySelector('#scrollable-players');

	// Create scrollable container


	data.forEach(function(item) {
		let playerContainer = createIndividualPlayerDiv(item, playerSelectOnClick);
		scrollablePlayers.appendChild(playerContainer);
	})

	selectPlayerMenu.appendChild(addPlayerButton)
}



const addPlayersFromSelectMenu = function(arr) {
	

	// Clear SideBar container
	const sidebar = document.querySelector('#player-names-container');
	sidebar.innerHTML = "";


	// Add corresponding Objects to array


	d3.csv(playerCount).then(function(res){

		let matchingArray = [];

		res.forEach(function(item){
			if (arr.includes(item.playerName.toString())) {
				matchingArray.push(item);
			}
		})

		addSidebar(matchingArray)
	})


	// Hide Select Player Menu

	hideSelectMenuContainer();

	// Clear Array
	selectedPlayerArray = [];


	// Return all Elements to original style 
	const allSelectPlayers = document.querySelectorAll(".player-select-container");

	allSelectPlayers.forEach(function(item) {
		item.style.backgroundColor = "#EDF5E1";
		item.style.color = "#282828";
	});

}

//=============
// CREATE BAR CHART
//=============



const createBarChart = function(data) {

	console.log(displayedData)
	console.log(data)

	// Get positions of container 

	var positionIdentifier = document.querySelector('#svg-ranking-container');

	let positionMarker = positionIdentifier.getBoundingClientRect();


	let left   = positionMarker.left   + window.scrollX;
	let top    = positionMarker.top    + window.scrollY;
	let right  = positionMarker.right  + window.scrollX;
	let bottom = positionMarker.bottom + window.scrollY;
	let height = positionMarker.height
	let width  = positionMarker.width

	var margin = {
		top: 10,
		bottom: 150,
		left: 55,
		right: 0
	}




	// ADD Y SCALE
	var myScaleY = d3.scaleLinear().domain([0, 35]).range([margin.top, (height - margin.bottom)])

	// ADD X SCALE 
	var myScaleX = d3.scaleLinear().domain([0, data.length]).range([0, (width - margin.left)])


	// CREATE BARS
	var barContainer = d3.select("#ranking-bars")

	// ADD TRASH IMAGE

	var rankingSVGPosition = document.querySelector('#ranking-svg').getBoundingClientRect();
	barContainer.append("image").attr('xlink:href', "https://cdn.onlinewebfonts.com/svg/img_307766.png").attr("width", "100px").attr("height", "100px").attr("x", rankingSVGPosition.width - 100).attr("id", "trash-image")


	// CREATE TOOLTIP
	createTooltip();

	// CREATE TEXT
	let text = d3.select("#text-container").selectAll("text").data(data)

	
	
	text.exit()
		.remove();

	// text.enter()
	// 	.append("text")
	// 	.merge(text)
	

		text.enter()
			.append("text")
			.merge(text)
			.text(function(d) {
				return d.playerName
			})
			.attr("fill", "#EDF5E1")
			.attr('transform', (d,i)=>{
		       return 'translate( '+ (myScaleX(i) + margin.left) +' , '+ (height - ((margin.bottom) - 30)) +'),'+ 'rotate(45)';})
		   .attr("fill", "#EDF5E1")
		   .attr('x', 0)
		   .attr('y', 0)
		   .attr("class", "x-axis")


						//=================
						// BAR DRAGGIN 
						// ================

						let initialPosition;

						var dragHandler = d3.drag()
								.on("start", function () {
							        // d3.select(this).raise().attr("stroke", "black");
							        console.log("Drag Start")

							        initialPosition = this.getBoundingClientRect();
							    })
							    .on("drag", function(d, i) {
							    	d3.select(this)
							    		.attr("x", d3.event.x + "px")
							    		.attr("y", (d3.event.y - 380) + "px")
							    		.attr("height", "50px")
						
							    })
							    .on("end", function(d, i){

							    	const trash = document.querySelector('#trash-image').getBoundingClientRect();
							    	

							    	const positions = this.getBoundingClientRect();

							    	
							    	
							    	if ((positions.right < (trash.right + 50)) && (positions.left > (trash.left - 50)) && (positions.top < (trash.top + 50)) && (positions.bottom > (trash.bottom - 50)) ) {
							    		removeElementFromChart(this, initialPosition);
							    	}


							    	d3.select(this).attr("x", myScaleX(i) + margin.left).attr("y", 0).attr("height", myScaleY(d.value))
							    })


		var bars = d3.select("#ranking-bars").selectAll("rect").data(data);

		bars.exit().remove();

		bars.enter()
			.append("rect")
			.merge(bars)
			.attr("class", "bar")
			.attr("width", function(d, i) {
				return (((width - margin.left) / data.length) - 5) + 'px';
			})
			.attr("height", function(d, i) {
				return d.value;
			})
			.attr("y", function(d, i) {
				return 0;
			})
			.attr("x", function(d, i) {
				return myScaleX(i) + margin.left
			})
			.each(function(d, i) {
				animateBars(d, i, margin, height, this)
			})
			.on("mouseover", function(d, i) {
                this.style.opacity = 0.3;
                d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.playerName + "   " + d.country)
                             
            })
            .on("mousemove", function(d, i) {
                d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
            })
            .on("mouseout", function(d, i) {
                this.style.opacity = .6;
                d3.select('#tooltip').style('opacity', 0)
            })
   			.call(dragHandler);


	// CREATE Y AXIS

	var myScaleYAxis = d3.scaleLinear().domain([0, 35]).range([(height - margin.bottom), margin.top])
	var yAxis = d3.select("#ranking-svg").data(data);

		yAxis
			.append("g")
			.attr("transform", "translate(50,0)")      // This controls the vertical position of the Axis
  			.call(d3.axisLeft(myScaleYAxis))
  			.attr("class", "y-axis");


}


const removeElementFromChart = function(item, position) {
	item.remove();
	

	let positionTopMarginError = position.x + 10;
	let positionBottomMarginError = position.x - 10;


	const textElements = document.querySelectorAll('text.x-axis');
	textElements.forEach(function(item) { 
		let textPosition = item.getBoundingClientRect();
		if ((textPosition.x < positionTopMarginError) && (textPosition.x > positionBottomMarginError)) {
			let xLabelText = (item.innerHTML);
			displayedData.forEach(function(dataElement) {
				if ((dataElement.playerName) === xLabelText) {
					const index = displayedData.indexOf(dataElement);
					displayedData.splice(index, 1);
				}
			})
			item.remove();
		}

	})

	loadData();
}



//=============
//	CREATE TOOLTIP
//=============

const createTooltip = function() {
    var tooltip = d3.select(".whole-page-ranking-container")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip-container")
        .style("position", "absolute")
        .style("z-index", "4000")
        .style("opacity", 0)
    return tooltip
}




//=================



//=================
// ANIMATE BARS
// ================

const animateBars = function(d, i, margin, height, item) {

	var myScaleY = d3.scaleLinear().domain([0, 35]).range([margin.top, (height - margin.bottom)])
	
 	var timeline = anime.timeline({autoplay: true});

 	var xAxis = document.querySelectorAll(".x-axis")

	timeline
		.add({
			targets: item,
			duration: 1,
			opacity: 0,
		})
		.add({
			targets: item,
			duration: 1000,
			height: myScaleY(d.value),
			easing: 'easeInOutQuad',
			opacity: 0.6,
			translateY: ((height - margin.bottom) - myScaleY(d.value)),
			delay: 1000
		})
		.add({
			targets: xAxis,
			duration: 2000,
			opacity: 1
		})

}



//=================
// ADD PLAYERS SIDEBAR 
// ================


export const addSidebar = function(data) {
	
	// SELECT CONTAINER
	const sidebarContainer = document.querySelector('#sidebar-general-container');


	class Sidebar extends React.Component {

		render() {

			let playerNames = data.map(function(name, i) {


				return <p id={"player" + i} onDragStart={(event) => onDragStart(event)}  draggable={true} className="individual-player-container" >{name.playerName}</p>
			})

			return (

				<div id="players-sidebar-container">
					<div id="player-names-container">
					{ playerNames }
					</div>
					<button id="add-player-button" onClick={() => { animateSelectMenuContainer()} }>
						Add Player
					</button> 
				</div>

				)
		} 
	}


	ReactDOM.render(<Sidebar />, sidebarContainer)

	animateSidebar()
}


//=================
// ANIMATE SIDEBAR  
// ================


const animateSidebar = function() {
	const sidebarItems = document.querySelectorAll(".individual-player-container");
	const addPlayerButton = document.querySelectorAll("#add-player-button");

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: [sidebarItems, addPlayerButton],
			duration: 2000,
			delay: 2000,
			easing: 'easeInOutQuad',
			opacity: .8
		})
}




//=================
// DRAG AND DROP  
// ================



// Reference this code 
// https://alligator.io/js/drag-and-drop-vanilla-js/
const onDragStart = function(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);

}

const onDragOver = function(event) {
  event.preventDefault();
}


const animateOnDragOver = function(id) {

	const element = document.querySelector(id)

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: element,
			duration: 100,
			opacity: 0.5
		})
		.add({
			targets: element,
			duration: 100,
			direction: 'alternate',
			opacity: 1
		})
}



const onDrop = function(event) {
	const id = event
		.dataTransfer
		.getData('text');

	const draggableElement = document.getElementById(id);
	const dropzone = event.target;
	const origin = document.querySelector('#player-names-container')

	loadData(draggableElement.innerHTML)

	event
		.dataTransfer
		.clearData();

	origin.removeChild(draggableElement)
}










