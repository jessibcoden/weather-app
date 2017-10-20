(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

let fakeWeather = [{
		date: "today",
		temperature: 76,
		conditions: "Purdy",
		air_pressure: "Average",
		wind_speed: "Breezy"
	}];
		
const displayCurrentConditions = (fakeWeather) => {
	console.log("weatherObject", fakeWeather);
	let domString = `
						<div class="card col-md-3 col-mid-offset-4.5" id="current-card">
							<div class="day">
								<h2>Current Conditions</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/10d.png" alt="">
							</div>
							<h3 id="current-temp">0</h3>
							<h4 id="current-condition">Example Text</h4>
							<h4 id="current-pressure">Air Pressure:</h4>
							<h4 id="current-wind">Wind Speed:</h4>
					`;

	printCurrent(domString);
};

const printCurrent = (strang) => {
	$('.current-condition').append(strang);
};

const displayForecast = (fakeWeather) => {
	let forecastString = `
						<div class="card col-md-3 col-mid-offset-4.5" id="forecast-card">
							<div class="day">
								<h2>Day of the Week</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/10d.png" alt="">
							</div>
							<h3 id="temp-range">0 - 0</h3>
							<h4 id="forecast-condition">Example Text</h4>
					`;
	printForecast(forecastString);

};

const printForecast = (strang) => {
	$('.forecast').append(strang);
};

module.exports = {displayCurrentConditions, displayForecast};
},{}],2:[function(require,module,exports){
"use strict";

console.log("works!");

let dom = require('./dom');

dom.displayCurrentConditions();
dom.displayForecast();
},{"./dom":1}]},{},[2]);
