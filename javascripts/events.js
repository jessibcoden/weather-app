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

