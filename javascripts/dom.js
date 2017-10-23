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