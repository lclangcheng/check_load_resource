/*
* @file api
* @author lai_lc
* @date   2017-05-17 15:01:14
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-18 10:13:00
*/

'use strict';

var http = require('http');
var url = require('url');

function API() {
	this.exec = function(route, request, response) {

		var requestInterface = route.slice(5);
		if (requestInterface.indexOf("getProjectData") !== -1) {
			let requestUrl = request.url;
			let requestProjectDataUrl = requestUrl.slice(requestUrl.indexOf("?") + 1);

			http.get(requestProjectDataUrl, (res) => {
				let rawData = "";
				res.on('data', (chunk) => {
					rawData += chunk;
				});
				res.on('end', () => {
					response.writeHead(200, {
						"content-type": "text/html"
					});
					response.end(rawData);
				});
			});
		}
	}
}

module.exports = new API();