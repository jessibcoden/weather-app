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
									<h2 id="city">${currentWeather.name}</h2>
									<h2>Current Conditions</h2>
								</div>
								<div class="thumbnail">
									<img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="">
								</div>
								<h3 id="current-temp">${currentWeather.main.temp}&#176 F</h3>
								<h4 id="current-condition">${currentWeather.weather[0].description}</h4>
								<h4 id="current-pressure">Air Pressure: ${currentWeather.main.pressure} hPa</h4>
								<h4 id="current-wind">Wind Speed: ${currentWeather.wind.speed} mph</h4>
							</div>`;
					

	printCurrent(domString);
};

const printCurrent = (strang) => {
	$('.current-condition').append(strang);
};

const displayForecast = (resultDays) => {
	let forecastString = '';
	for(let i = 0; i < resultDays.length; i++){
		forecastString += `
						<div class="card" id="forecast-card">
							<div class="day">
								<h2>${resultDays[i].dayOfTheWeek}</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/${resultDays[i].icon}.png" alt="">
							</div>
							<h3 id="temp">${resultDays[i].main.temp}&#176 F</h3>
							<h4 id="forecast-condition">${resultDays[i].weather.description}</h4>
							<h4 id="current-wind">Wind Speed: ${resultDays[i].wind.speed} mph</h4>
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

let resultDays = [];

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


		// findDaysByTime(forecast);

// const findDaysByTime = (forecast) => {
// 	let calDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// 	let startIndex = calDays.indexOf(currentWeather.dayOfWeek) + 1;
// 	let endIndex3Day = calDays[startIndex + 3] ? startIndex + 3 : calDays.length % 3;
// 	let forecastDays = calDays.slice(startIndex, endIndex3Day);
// 	for (let i = 0; i < forecastDays.length; i++) {
// 		var dayOfWeek = forecastDays[i];
// 		var dayArray = forecast[dayOfWeek];
// 		var day;
// 		for (let i = 0; i < dayArray.length; i++) {
// 			if (dayArray[i].time === '12:00 pm') {
// 				day = dayArray[i];
// 			}
// 		}
// 		resultDays.push(day);
// 	}
// 	console.log("resultDays", resultDays);
// };

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
let forecastData = [];
let forecast = {};

let forecastHour;
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
		currentWeather.dayOfWeek = moment.unix(currentWeather.dt).format('dddd');
		dom.displayCurrentConditions(currentWeather);
	}).catch((error) => {
		console.log("error in searchCurrentWeather", error);
	});
};

const searchForecast = (query) => {
	//execute searchWeather
	searchForecastApi(query).then((data) => {
		// showResults(data);
		forecastData = data;
		convertDateInfo(forecastData);
		removeCurrentDayFromForecast(forecastData);
		groupForecastByDay(forecastData);

		console.log("searchForecast data", data);
		// makeNewForecastArray(forecast);
	}).catch((error) => {
		console.log("error in searchForecast", error);
	});
};

const convertDateInfo = (forecastData) => {
	for (let i = 0; i < forecastData.list.length; i++) {
		forecastData.list[i].date = moment(forecastData.list[i].dt_txt).toDate('YYYY MM DD');
		forecastData.list[i].time = moment(forecastData.list[i].dt_txt).format('h:mm a');
		forecastData.list[i].dayOfWeek = moment(forecastData.list[i].dt_txt).format('dddd');
	}
};

const removeCurrentDayFromForecast = (forecastData) => {
	for (let i = 0; i < forecastData.list.length; i++) {
		if(forecastData.list[i].dayOfWeek === currentWeather.dayOfWeek) {
			forecastData.list[i] = {};
		}
	}
};

const groupForecastByDay = (forecastData) => {
	for (let i = 0; i < forecastData.list.length; i++) {
		var obj = forecastData.list[i];
		var day = obj.dayOfWeek;
		// delete obj.dayOfWeek;
		if (forecast[day]) {
			forecast[day].push(obj);
		} else {
			forecast[day] = [obj];
		}
	}
	console.log("forecast", forecast);
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
