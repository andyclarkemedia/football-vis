//========================
// Will return Visualisation
// =======================


import React from 'react';
import ReactDOM from 'react-dom';
import anime from 'animejs/lib/anime.es.js';
import * as d3 from "d3"
import data from "./key_passes.csv"
import playerCount from "./player_count.csv"


export const selectVisualisation = function(Visualisation, activeVis) {

	if (activeVis === "ranking") {
		return rankingVis(Visualisation);
	} else if (activeVis === "none") {
		return noVis(Visualisation);
	}


}

//=============
//
//=============


const rankingVis = function(Visualisation) {


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
						<img className="close-window-image-menu"  src={require('./images/close-window.png')} onClick={ () => { hideSelectMenuContainer() } } />

					</div>
				</div>
			
		</div>

		)

	return result;
}


//=============
//
//=============

const noVis = function(Visualisation) {


	let result = (

		<span>
			
		</span>

		)

	return result;
}


//=============
//
//=============


export const animateWindowDrop = function() {

	//loadEventData();
	loadRankedData();

	let background = document.querySelector(".vis-background-container");

	let bars = document.querySelector('.bar');
	console.log(bars)

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: background,
			duration: 2000,
			height: "100vh",
			opacity: "0.95",
		})
		.add({
			targets: bars,
			duration: 2000,
			opacity: "0.1"
		})
}


//=============
//
//=============


export const animateWindowHide = function() {

	let window = document.querySelector(".vis-background-container");

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: window,
			duration: 1000,
			height: "1vh",
			opacity: "0"
		})

}



export const loadRankedData = function(name) {
	
	d3.csv(playerCount).then(function(res) {
		
		let displayedData = res.slice(0,10)

		if (name) {

			res.forEach(function(item) {
				if (item.playerName.toString() === name.toString()) {
					//displayedData.pop()
					
					createBarChart(displayedData, true)
					displayedData.push(item)
					createBarChart(displayedData)
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



//=============
//
//=============



const createBarChart = function(data, pop) {

	console.log(data)

	if (pop) {
		data.pop();
	}

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
	 var myScaleX = d3.scaleLinear().domain([0, 10]).range([0, (width - margin.left)])


	// CREATE BARS
	var barContainer = d3.select("#ranking-bars")

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
				console.log(d.playerName)
				return d.playerName
			})
			.attr("fill", "#EDF5E1")
			.attr('transform', (d,i)=>{
		       return 'translate( '+ (myScaleX(i) + margin.left) +' , '+ (height - ((margin.bottom) - 30)) +'),'+ 'rotate(45)';})
		   .attr("fill", "#EDF5E1")
		   .attr('x', 0)
		   .attr('y', 0)
		   .attr("class", "x-axis")


	// var update = d3.select("#ranking-svg").selectAll("text").data(data);

	// update.exit().remove();

	// update.enter()
	// 	.append("text")
	// 	.merge(update)
	// 	.text(function(d) { return d.playerName; })
	// 	.attr("fill", "#EDF5E1")
	// 	.attr("class", "x-axis");


	var bars = d3.select("#ranking-bars").selectAll("rect").data(data);

		bars.exit()
			.remove();


		bars.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("width", function(d, i) {
				return (((width - margin.left) / 10) - 5) + 'px';
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
			.attr("onload", function(d, i) {
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

	// CREATE Y AXIS

	var myScaleYAxis = d3.scaleLinear().domain([0, 35]).range([(height - margin.bottom), margin.top])
	var yAxis = d3.select("#ranking-svg").data(data);

		yAxis
			.append("g")
			.attr("transform", "translate(50,0)")      // This controls the vertical position of the Axis
  			.call(d3.axisLeft(myScaleYAxis))
  			.attr("class", "y-axis");


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
// ANIMATE BARS
// ================

const animateBars = function(d, i, margin, height, item) {

	var myScaleY = d3.scaleLinear().domain([0, 35]).range([margin.top, (height - margin.bottom)])
	
 	var timeline = anime.timeline({autoplay: true});

 	var xAxis = document.querySelectorAll(".x-axis")

 	console.log(xAxis)

 	console.log(d.value)

	timeline
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
				{ playerNames }
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
	const origin = document.querySelector('#players-sidebar-container')

	loadRankedData(draggableElement.innerHTML)

	event
		.dataTransfer
		.clearData();

	origin.removeChild(draggableElement)
}




//=================
// ADD PLAYER  
// ================




const animateSelectMenuContainer = function(element) {

	const selectPlayerMenu = document.querySelector('#select-player-menu');
	const subContainer = document.querySelector('#select-player-sub-container');
	const closeWindowMenuImage = document.querySelector('.close-window-image-menu');

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: selectPlayerMenu, 
			duration: 500,
			easing: 'easeInOutQuad',
			opacity: 1,
		})
		.add({
			targets: subContainer,
			duration: 2000,
			height: "100vh",
			easing: 'easeInOutQuad',
			opacity: 1,
		})
		.add({
			targets: closeWindowMenuImage, 
			duration: 500,
			easing: 'easeInOutQuad',
			opacity: 1,
		})


}


const hideSelectMenuContainer = function() {

	const selectPlayerMenu = document.querySelector('#select-player-menu');
	const subContainer = document.querySelector('#select-player-sub-container');
	const closeWindowMenuImage = document.querySelector('.close-window-image-menu');

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: [ selectPlayerMenu, closeWindowMenuImage] , 
			duration: 500,
			easing: 'easeInOutQuad',
			opacity: 0,
		})
		.add({
			targets: subContainer,
			duration: 500,
			height: "0vh",
			easing: 'easeInOutQuad',
		})

}

