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
		owm.searchCurrentWeather();
		owm.searchForecast();
	}).catch((error) => {
		console.log("error in retrieveKeys", error);
	});
};

module.exports = {retrieveKeys};
},{"./weather":5}],2:[function(require,module,exports){
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

const displayForecast = (weatherByDayArray) => {
	let forecastString = '';
	for(let i = 0; i < weatherByDayArray.length; i++){
		forecastString += `
						<div class="card" id="forecast-card">
							<div class="day">
								<h2>${weatherByDayArray[i].dayObject.day}, ${weatherByDayArray[i].dayObject.hour} </h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/${weatherByDayArray[i].dayObject.icon}.png" alt="">
							</div>
							<h3 id="temp">${weatherByDayArray[i].dayObject.temp}&#176 F</h3>
							<h4 id="forecast-condition">${weatherByDayArray[i].dayObject.description}</h4>
							<h4 id="current-wind">Wind Speed: ${weatherByDayArray[i].dayObject.wind} mph</h4>
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

const owm = require('./weather');

const assignEventHandlers = (e) => {
	$('#search-input').keypress((e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			validateZip();
  		}
	});
	$('#search-button').click((e) => {
		e.preventDefault();
		validateZip();
  	});
};

const validateZip = () => {
	let query = $('#search-input').val();
	let isValid = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(query);

	if (isValid) {
		owm.searchCurrentWeather(query);
		owm.searchForecast(query);
		$('#forecast-options').removeClass('hidden');
	} else {
		$('#error-message').removeClass('hidden');
	}
};


module.exports = {assignEventHandlers};


},{"./weather":5}],4:[function(require,module,exports){
"use strict";

console.log("works!");

let apiKeys = require('./apiKeys');
let events = require('./events');

events.assignEventHandlers();
apiKeys.retrieveKeys();

},{"./apiKeys":1,"./events":3}],5:[function(require,module,exports){
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
},{"./dom":2}]},{},[4]);
