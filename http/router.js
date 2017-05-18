/*
* @file router
* @author lai_lc
* @date   2017-05-16 10:49:50
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-05-18 10:12:35
*/

'use strict';
var http = require("http");

/**
 * route class
 * @param {String} route   route path
 * @param {Object} handler handler object
 */
function RouterData(route, handler) {
	/**
	 * save route path
	 * @type {String}
	 */
	this.route =  route || '';

	/**
	 * save handelr object
	 * @type {Object}
	 */
	this.handler = handler || {};
}

/**
 * route Object
 */
function Route() {
	/**
	 * save route list
	 * @type {Array}
	 */
	var routers = [];

	/**
	 * add route
	 * @param {String} route   route path
	 * @param {Object} handler handler object
	 */
	this.addRoute = function(route, handler) {
		if (!route || !handler) return;
		var routerData = new RouterData(route, handler);
		routers.push(routerData);
	}

	/**
	 * handler execute
	 * @param  {String} route    request route path
	 * @param  {Object} request  http request
	 * @param  {Object} resposne http response
	 */
	this.handleRoute = function(route, request, resposne) {
		let handler = getRouteHandlerByRoute(route);
		if (!handler) {
			handle_404(route, request, resposne);
			return;
		}
		handler.exec(route, request, resposne);
	}

	/**
	 * find route handler by route in routers array
	 * @param  {String} route request route path
	 * @return {Object}       handler
	 */
	function getRouteHandlerByRoute(route) {
		let len = routers.length;
		let handler = null;
		
		if (route.indexOf("/", 1) !== -1) {
			route = route.slice(0, route.indexOf("/", 1));
		} else if (route.indexOf("?") !== -1) {
			route = route.slice(0, route.indexOf("?"));
		}
	
		for (let i = 0; i < len; i++) {
			if (route === routers[i].route) {
				handler = routers[i].handler;
				//console.log(route + "::" + routers[i].route);
				break;
			}
		}
		return handler;
	}

	/**
	 * deal with not found handler
	 * @param  {String} route    request route path
	 * @param  {Object} request  http reuqest
	 * @param  {Object} response http response
	 */
	function handle_404(route, request, response) {
		response.writeHeader(404, {
			'Content-Type': 'text/plain'
		});
		response.end();
	}

}


module.exports = new Route();