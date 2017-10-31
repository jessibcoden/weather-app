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