"use strict";

let fakeWeather = [{
		date: "today",
		temperature: 76,
		conditions: "Purdy",
		air_pressure: "Average",
		wind_speed: "Breezy"
	}];
		
const displayCurrentConditions = (fakeWeather) => {
	console.log("weatherObject", fakeWeather);
	let domString = `
						<div class="card col-md-3 col-mid-offset-4.5" id="current-card">
							<div class="day">
								<h2>Current Conditions</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/10d.png" alt="">
							</div>
							<h3 id="current-temp">0</h3>
							<h4 id="current-condition">Example Text</h4>
							<h4 id="current-pressure">Air Pressure:</h4>
							<h4 id="current-wind">Wind Speed:</h4>
					`;

	printCurrent(domString);
};

const printCurrent = (strang) => {
	$('.current-condition').append(strang);
};

const displayForecast = (fakeWeather) => {
	let forecastString = `
						<div class="card col-md-3 col-mid-offset-4.5" id="forecast-card">
							<div class="day">
								<h2>Day of the Week</h2>
							</div>
							<div class="thumbnail">
								<img src="http://openweathermap.org/img/w/10d.png" alt="">
							</div>
							<h3 id="temp-range">0 - 0</h3>
							<h4 id="forecast-condition">Example Text</h4>
					`;
	printForecast(forecastString);

};

const printForecast = (strang) => {
	$('.forecast').append(strang);
};

module.exports = {displayCurrentConditions, displayForecast};