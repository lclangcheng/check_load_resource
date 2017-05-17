/*
* @file server
* @author lai_lc
* @date   2017-05-17 14:25:13
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-17 18:06:23
*/

'use strict';


var http = require('http');
var router = require('./router');

router.addRoute('/api', require('./routers/api'));
router.addRoute('/preview', require('./routers/preview'));
router.addRoute('/gameIndex', require('./routers/gameIndex'));
router.addRoute('/res', require('./routers/res'));


var start = () => {
	let port = 8888;

	let httpServer = http.createServer(onConnected);

	httpServer.listen(port, () => {
		console.log("HttpServer start.");
	});

	httpServer.on("error", (error) => {
		console.log(error);
	})
}

var onConnected = (request, response) => {
	router.handleRoute(request.url, request, response);
}

exports.start = start;