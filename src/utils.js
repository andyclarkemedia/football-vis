
//========================
// Contains utility functions to be used over all js files
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
// VISUALISATION IMPORTS
// =====================

import { loadRankedData } from "./ranking-visualisation.js";
import { loadEventsData } from "./events-visualisation.js";



export const animateWindowDrop = function() {

	console.log("hello")

	//loadEventData();
	loadRankedData();

	let background = document.querySelector(".vis-background-container");

	let bars = document.querySelector('.bar');

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

	let windowToHide = document.querySelector(".vis-background-container");

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: windowToHide,
			duration: 1000,
			height: "1vh",
			opacity: "0"
		})

}





//=============
// FOR EVENTS 
//=============

export const animateWindowDropEvents = function() {

	loadEventsData(true);
	// SELECT BACKGROUND
	let background = document.querySelector(".vis-background-container");

	var timeline = anime.timeline({autoplay: true});

	timeline
		.add({
			targets: background,
			duration: 2000,
			height: "100vh",
			opacity: "0.95",
		})

}


export const hideSelectMenuContainer = function() {

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


export const animateSelectMenuContainer = function(element) {

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


export const createIndividualPlayerDiv = function(player, clickFunction) {
	const playerContainer = document.createElement("div");
	playerContainer.addEventListener("click", function(item) {
		clickFunction(item)
	});
	playerContainer.className = "player-select-container";
	const playerName = document.createElement("p");
	playerName.innerHTML = player.playerName;
	playerContainer.appendChild(playerName);

	return playerContainer;


}

