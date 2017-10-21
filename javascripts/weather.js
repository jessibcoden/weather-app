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