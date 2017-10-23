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