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

