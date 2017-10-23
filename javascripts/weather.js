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
		console.log("searchCurrentWeather data", data);
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
		console.log("searchForecast data", data);
		forecast = data;
		splitForcastData(forecast);
	}).catch((error) => {
		console.log("error in searchForecast", error);
	});
};

// function makeArrayOfObjectsForEach3HourSpan(forecastObject) {
//     var arrayOfObjects = []
//         for (var i = 0; i < forecastObject.list.length; i++) {
//         let weatherObject = {};
//         weatherObject.day = new Date(forecastObject.list[i].dt_txt).getDay();
//         weatherObject.hour = new Date(forecastObject.list[i].dt_txt).getHours();
//         weatherObject.icon = `<i class="wi wi-owm-${forecastObject.list[i].weather[0].id}"></i>`
//         weatherObject.temp = forecastObject.list[i].main.temp.toFixed(0);
//         weatherObject.description = forecastObject.list[i].weather[0].description;
//         weatherObject.dt_txt = forecastObject.list[i].dt_txt
//         arrayOfObjects.push(weatherObject)
//     }
//     buildstring += `<div class = "weatherForecast">`
//     makeCards(arrayOfObjects);
//     buildstring += `</div>`
//     weatherOutputContainer.innerHTML = buildstring;
// }
const splitForcastData = (forecast) => {
	let weatherByDayArray = [];
	for (let i = 0; i < forecast.list.length; i++) {
		console.log("i", forecast.list[i].dt_txt);
		let dayObject = {};
		dayObject.day = new Date(forecast.list[i].dt_txt).getDay();
		dayObject.hour = new Date(forecast.list[i].dt_text).getHours();
		dayObject.icon = forecast.list[i].weather[0].icon;
		dayObject.temp = forecast.list[i].main.temp.toFixed(0);
		dayObject.description = forecast.list[i].weather[0].description;
		dayObject.wind = forecast.list[i].wind.speed.toFixed(0);
		weatherByDayArray.push(dayObject);
	}
	console.log("weatherByDayArray", weatherByDayArray);
	dom.displayForecast(weatherByDayArray);
};

const setKey = (APIKEY) => {
	// sets omwKey
	owmKey = APIKEY;
	console.log(owmKey);
};

// const showResults = (weatherArray) => {
// 	// dom.clearDom();
// 	dom.domString(weatherArray);
// };

module.exports = {setKey, searchCurrentWeather, searchForecast};