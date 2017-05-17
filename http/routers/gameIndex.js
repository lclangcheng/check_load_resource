/*
 * @file gameIndex
 * @author lai_lc
 * @date   2017-05-17 14:22:18
 * @Last Modified by:   lai_lc
 * @Last Modified time: 2017-05-17 18:21:09
 */

'use strict';

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

function GameIndex() {
	var root = 'http://store.720wan.com/play/gamePortal/';

	this.exec = function(route, request, response) {
		//console.log("exec ", route);
		let requestUrl = request.url;
		let parameters = url.parse(requestUrl, true).query;
		let pathName = url.parse(requestUrl).pathname;
		pathName = decodeURI(pathName);

		if (!parameters.pid) {
			response.writeHead(200, {
				"content-type": "text/html"
			});
			response.write("please send pid param.");
			response.end();
			return;
		}

		let indexUrl = root + './gameIndex?id=' + parameters.pid;
		http.get(indexUrl, (res) => {
			let rawData = "";
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {

				let globalScript = rawData.slice(rawData.indexOf("var"), rawData.indexOf("weixinInfo") - 5);

				var filePath = path.join("http/webroot", "index");
				filePath += ".html";

				fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK, (error) => {
					if (error) {
						console.log("data:", error.message);
					} else {
						fs.readFile(filePath, 'utf8', (err, data) => {
							if (err) throw err;
							let html = "";
							let tagCode = "{{TAG_CODE}}";
							let tagCodeIndex = data.indexOf(tagCode);
							let preCode = "";
							let backCode = "";
							if (tagCodeIndex !== -1) {
								preCode = data.slice(0, tagCodeIndex);
								backCode = data.slice(tagCodeIndex + tagCode.length);
							}
							html = preCode + globalScript + backCode;
							response.writeHead(200, {
								"content-type": "text/html"
							});
							response.write(html);
							response.end();
						});
					}
				});
			})
		}).on("error", (error) => {
			console.log("Got error:", error.message);
		})

	}

}

module.exports = new GameIndex();