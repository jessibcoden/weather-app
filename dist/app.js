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
								<h4 id="current-condition" class="text-capitalize">${currentWeather.weather[0].description}</h4>
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
								<h2>${resultDays[i].dayOfWeek}</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/${resultDays[i].weather[0].icon}.png" alt="">
							</div>
							<h3 id="temp">${resultDays[i].main.temp}&#176 F</h3>
							<h4 id="forecast-condition" class="text-capitalize">${resultDays[i].weather[0].description}</h4>
							<h4 id="current-wind">Wind Speed: ${resultDays[i].wind.speed} mph</h4>
						</div>`;
					}
	printForecast(forecastString);
};

const printForecast = (strang) => {
	$('.forecast').html(strang);
};

module.exports = {displayCurrentConditions, displayForecast};
},{}],3:[function(require,module,exports){
"use strict";

const owm = require('./weather');
const dom = require('./dom');

let resultDays = [];
let calDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const assignOnLoadEventHandlers = (e) => {
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
  	assign3DayButtonEventHandler();
  	assign5DayButtonEventHandler();
};

const assign3DayButtonEventHandler = () => { 	
  	$('#3-day-button').click ((e) => {
  		e.preventDefault();
  		let startIndex = calDays.indexOf(owm.getCurrentWeather().dayOfWeek) + 1;
  		let endIndex3Day;
  		if(startIndex === 5) {
  			endIndex3Day = 0;
  		} else if(startIndex === 6){
  			endIndex3Day = 1;
  		}else{
  			endIndex3Day = startIndex + 2;
  		}
  		// The following translates to "(if startIndex is equal to 6) then make middleDay 0: OR make middleDay equal to startIndex +1 "
  		let middleDay = (startIndex === 6) ? 0: startIndex + 1;
		let forecastDays = [calDays[startIndex], calDays[middleDay], calDays[endIndex3Day]];
		console.log("forecastDays", forecastDays);
		for (let i = 0; i < forecastDays.length; i++) {
			let dayOfWeek = forecastDays[i];
			console.log("owm.getForecast()", owm.getForecast());
			let dayArray = owm.getForecast()[dayOfWeek];
			let day;
			for (let j = 0; j < dayArray.length; j++) {
				if (dayArray[j].time === '12:00 pm') {
					day = dayArray[j];
					resultDays.push(day);
				}			
			}			
		}
		dom.displayForecast(resultDays);
	});
};

// const assign5DayButtonEventHandler = () => { 	
//   	$('#5-day-button').click ((e) => {
//   		console.log("5 day event", e);
//   		e.preventDefault();
//   		let startIndex = calDays.indexOf(owm.getCurrentWeather().dayOfWeek) + 1;
//   		console.log("startIndex", startIndex);


  		// let endIndex3Day;
  		// if(startIndex === 5) {
  		// 	endIndex3Day = 0;
  		// } else if(startIndex === 6){
  		// 	endIndex3Day = 1;
  		// }else{
  		// 	endIndex3Day = startIndex + 2;
  		// }
  		// console.log("calDays", calDays);

  		// The following translates to if startIndex is equal to 6 then make middleDay 0 OR make middleDay equal to startIndex +1:
  // 		let middleDay = (startIndex === 6) ? 0: startIndex + 1;

		// console.log("forecastDays", forecastDays);


// 		let forecastDays = owm.getForecast();
// 		console.log("forecastDays", forecastDays);
// 		let forecastDays = [calDays[startIndex], calDays[middleDay], calDays[endIndex3Day]];
// 		for (let k = 0; k < forecastDays.length; k++) {

// 			let dayOfWeek = forecastDays[k];
// 			console.log("dayOfWeek", dayOfWeek);
// 			console.log("owm.getForecast()", owm.getForecast());
// 			let dayArray = owm.getForecast()[dayOfWeek];

// 			let day;
// 			for (let l = 0; l < dayArray.length; l++) {
// 				if (dayArray[l].time === '12:00 pm') {
// 					day = dayArray[l];
// 					resultDays.push(day);
// 				}
// 			}		
// 		}
// 		dom.displayForecast(resultDays);
// 		console.log("5 resultDays", resultDays);
// 	});
// };




const assign5DayButtonEventHandler = () => { 	
  	$('#5-day-button').click ((e) => {
  		console.log("5 day event", e);
  		e.preventDefault();
  		let startIndex = calDays.indexOf(owm.getCurrentWeather().dayOfWeek) + 1;
  		let endIndex5Day;
  		let middleDays = [];
  		if(startIndex === 3) {
  			endIndex5Day = 1;
  			middleDays = [4, 5, 6];
  		} else if(startIndex === 4){
  			endIndex5Day = 1;
  			middleDays = [5, 6, 0];
  		} else if(startIndex === 5){
  			endIndex5Day = 2;
  			middleDays = [6, 0, 1];
  		} else if(startIndex === 6){
  			endIndex5Day = 3;
  			middleDays = [0, 1, 2];
  		} else if(startIndex === 2){
  			endIndex5Day = 6;
  			middleDays = [3, 4, 5];
  		} else if(startIndex === 1){
  			endIndex5Day = 5;
  			middleDays = [2, 3, 4];
  		} else if(startIndex === 0){
  			endIndex5Day = 4;
  			middleDays = [1, 2, 3];
  		}

  		console.log("middleDays", middleDays);

		let forecastDays = [calDays[startIndex], calDays[middleDays[0]], calDays[middleDays[1]], calDays[middleDays[2]],calDays[endIndex5Day]];
		console.log("forecastDays", forecastDays);
		for (let k = 0; k < forecastDays.length; k++) {
			let dayOfWeek = forecastDays[k];
			console.log("owm.getForecast()", owm.getForecast());
			let dayArray = owm.getForecast()[dayOfWeek];
			let day;
			for (let l = 0; l < dayArray.length; l++) {
				if (dayArray[l].time === '12:00 pm') {
					day = dayArray[l];
					resultDays.push(day);
				}			
			}			
		}
		console.log("5 resultDays", resultDays);
		dom.displayForecast(resultDays);
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



module.exports = {assignOnLoadEventHandlers};


},{"./dom":2,"./weather":5}],4:[function(require,module,exports){
"use strict";

console.log("works!");

let apiKeys = require('./apiKeys');
let events = require('./events');

events.assignOnLoadEventHandlers();
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
		// momentJS converts unix UTC date to day of the week format:
		currentWeather.dayOfWeek = moment.unix(currentWeather.dt).format('dddd');
		currentWeather.main.temp = Math.round(currentWeather.main.temp);
		dom.displayCurrentConditions(currentWeather);
	}).catch((error) => {
		console.log("error in searchCurrentWeather", error);
	});
};

const getCurrentWeather = () => {
	return currentWeather;
};

const getForecast = () => {
	return forecast;
};

const searchForecast = (query) => {
	//execute searchWeather
	searchForecastApi(query).then((data) => {
		// showResults(data);
		forecastData = data;
		convertDateInfo(forecastData);
		roundForecastTemp(forecastData);
		removeCurrentDayFromForecast(forecastData);
		groupForecastByDay(forecastData);
		console.log("searchForecast data", data);
		// makeNewForecastArray(forecast);
		// dom.displayForecast();
	}).catch((error) => {
		console.log("error in searchForecast", error);
	});
};

// API returns date/time stamp in unix UTC format. I'm using momentJS to convert the format to day of the week, a readable time and date (this is called in serchForecast):
const convertDateInfo = (forecastData) => {
	for (let i = 0; i < forecastData.list.length; i++) {
		forecastData.list[i].date = moment(forecastData.list[i].dt_txt).toDate('YYYY MM DD');
		forecastData.list[i].time = moment(forecastData.list[i].dt_txt).format('h:mm a');
		forecastData.list[i].dayOfWeek = moment(forecastData.list[i].dt_txt).format('dddd');
	}
};

const roundForecastTemp = (forecastData) => {
	for (let i = 0; i < forecastData.list.length; i++) {
		forecastData.list[i].main.temp = Math.round(forecastData.list[i].main.temp);
	}
};

// forecastData returns current and future data. I only want to display future data in the forecast so this removes the current day from forecastData (this is called in serchForecast):
const removeCurrentDayFromForecast = (forecastData) => {
	for (let i = 0; i < forecastData.list.length; i++) {
		if(forecastData.list[i].dayOfWeek === currentWeather.dayOfWeek) {
			forecastData.list[i] = {};
		}
	}
};

// forecastData returns 40 objects which are 3 hr forecasts over 5 days. I want return one object for each day so the forecastData needs to be grouped by day (this is called in serchForecast):
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

module.exports = {setKey, searchCurrentWeather, searchForecast, getCurrentWeather, getForecast};
},{"./dom":2}]},{},[4]);
