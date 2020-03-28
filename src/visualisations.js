//========================
// Will organise and return correct visualisation
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

import { rankingVis } from './ranking-visualisation.js';
import { eventsVis } from './events-visualisation.js';
import { animateWindowHide } from "./utils.js";

// =====================
// SELECT VIS FUNCTION
// =====================


export const selectVisualisation = function(Visualisation, activeVis) {

	if (activeVis === "ranking") {
		return rankingVis(Visualisation);
	} else if (activeVis === "none") {
		return noVis(Visualisation);
	} else if (activeVis === "events") {
		return eventsVis(Visualisation);
	}


}




//=============
// FOR NO VISUALISATION > Return to home screen
//=============

const noVis = function(Visualisation) {


	let result = (

		<span>
			
		</span>

		)

	return result;
}


