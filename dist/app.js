(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const owm = require('./weather');

const apiKeys = () => {
	// promise
	return new Promise((resolve, reject) => {
		$.ajax('./db/apiKeys.json').done((data) => {
			resolve(data);
		}).fail((error) => {
			reject(error);
		});
	});
};

const retrieveKeys = () => {
	apiKeys().then((results) => {
		owm.setKey(results.apiKeys.owm.APIKEY);
		owm.searchCurrentWeather(37138);
		owm.searchForecast(37138);
	}).catch((error) => {
		console.log("error in retrieveKeys", error);
	});
};

module.exports = {retrieveKeys};
},{"./weather":4}],2:[function(require,module,exports){
"use strict";


const displayCurrentConditions = (currentWeather) => {
	let domString = `
						<div class="card col-md-3 col-mid-offset-4.5" id="current-card">
							<div class="day">
								<h2>Current Conditions</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="">
							</div>
							<h3 id="current-temp">${currentWeather.main.temp}&#176 F</h3>
							<h4 id="current-condition">${currentWeather.weather[0].description}</h4>
							<h4 id="current-pressure">Air Pressure: ${currentWeather.main.pressure} hPa</h4>
							<h4 id="current-wind">Wind Speed: ${currentWeather.wind.speed} mph</h4>`;
					

	printCurrent(domString);
};

const printCurrent = (strang) => {
	$('.current-condition').append(strang);
};

const displayForecast = (forecast) => {
	let forecastString = '';
	for(let i = 0; i < forecast.list.length; i++){
		forecastString += `
						<div class="card" id="forecast-card">
							<div class="day">
								<h2>${forecast.list[i].dt_txt}</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png" alt="">
							</div>
							<h3 id="temp">${forecast.list[i].main.temp}&#176 F</h3>
							<h4 id="forecast-condition">${forecast.list[i].weather[0].description}</h4>
							<h4 id="current-wind">Wind Speed: ${forecast.list[i].wind.speed} mph</h4>
						</div`;
					}
	printForecast(forecastString);

};

const printForecast = (strang) => {
	$('.forecast').append(strang);
};

module.exports = {displayCurrentConditions, displayForecast};
},{}],3:[function(require,module,exports){
"use strict";

console.log("works!");

let apiKeys = require('./apiKeys');

apiKeys.retrieveKeys();

},{"./apiKeys":1}],4:[function(require,module,exports){
"use strict";

let currentWeather = [];
let forecast = [];
let owmKey;
let iconConfig;
const dom = require('./dom');


const searchCurrentApi = (query) => {
	return new Promise ((resolve, reject) => {
		$.ajax(`http://api.openweathermap.org/data/2.5/weather?zip=${query}&APPID=${owmKey}&units=imperial`).done((data) => {
			resolve(data);
		}).fail((error) => {
			reject(error);
		});
	});
};

const searchForecastApi = (query) => {
	return new Promise ((resolve, reject) => {
		$.ajax(`http://api.openweathermap.org/data/2.5/forecast?zip=${query}&APPID=${owmKey}&units=imperial`).done((data) => {
			resolve(data);
		}).fail((error) => {
			reject(error);
		});
	});
};


const searchCurrentWeather = (query) => {
	//execute searchWeather
	searchCurrentApi(query).then((data) => {
		console.log("currentWeather", data);
		currentWeather = data;
		dom.displayCurrentConditions(currentWeather);
	}).catch((error) => {
		console.log("error in searchCurrentWeather", error);
	});
};

const searchForecast = (query) => {
	//execute searchWeather
	searchForecastApi(query).then((data) => {
		// showResults(data);
		console.log("forecast", data);
		forecast = data;
		dom.displayForecast(forecast);
	}).catch((error) => {
		console.log("error in searchForecast", error);
	});
};

const setKey = (APIKEY) => {
	// sets omwKey
	owmKey = APIKEY;
	console.log(owmKey);
};

const showResults = (weatherArray) => {
	// dom.clearDom();
	dom.domString(weatherArray);
};

module.exports = {setKey, searchCurrentWeather, searchForecast};
},{"./dom":2}]},{},[3]);
