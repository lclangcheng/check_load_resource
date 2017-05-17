/*
* @file router
* @author lai_lc
* @date   2017-05-16 10:49:50
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-17 17:52:14
*/

'use strict';
var http = require("http");

function RouterData(route, handler) {
	this.route =  route || '';
	this.handler = handler || {};
}

function Route() {
	var routers = [];

	this.addRoute = function(route, handler) {
		if (!route || !handler) return;
		var routerData = new RouterData(route, handler);
		routers.push(routerData);
	}

	this.handleRoute = function(route, request, resposne) {
		let handler = getRouteHandlerByRoute(route);
		if (!handler) {
			handle_404(route, request, resposne);
			return;
		}
		handler.exec(route, request, resposne);
	}

	function getRouteHandlerByRoute(route) {
		let len = routers.length;
		let handler = null;

		for (let i = 0; i < len; i++) {
			if (route.indexOf(routers[i].route) !== -1 ) {
				handler = routers[i].handler;
				console.log(route + "::" + routers[i].route);
				break;
			}
		}
		return handler;
	}

	function handle_404(route, request, response) {
		response.writeHeader(404, {
			'Content-Type': 'text/plain'
		});
		response.end();
	}

}


module.exports = new Route();