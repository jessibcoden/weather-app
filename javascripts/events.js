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

