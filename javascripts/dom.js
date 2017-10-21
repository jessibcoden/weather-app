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