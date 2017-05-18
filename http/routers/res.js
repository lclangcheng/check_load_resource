/*
* @file res
* @author lai_lc
* @date   2017-05-17 14:52:00
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-18 10:12:51
*/

'use strict';

var path = require('path');
var fs = require('fs');
var url = require('url');

function Res() {
	this.exec = function(route, request, response) {
		
		let pathName = url.parse(request.url).pathname;
		pathName = decodeURI(pathName);
		var filePath = path.join("http/webroot", pathName);
		response.writeHead(200, {
			"content-type": "text/javascript"
		});
		var stream = fs.createReadStream(filePath, {
			flags: "r",
			encoding: null
		});
		stream.on("error", () => {
			response.writeHead(500, {
				"content-type": "text/html"
			});
			response.end("<h1>500 Server Error!</h1>");
		});
		stream.pipe(response);
	}
}

module.exports = new Res();