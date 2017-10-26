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