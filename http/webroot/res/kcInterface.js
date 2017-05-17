"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file kcInterface
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * A Object with a width and a height property.
 * @typedef {Object} Size
 * @memberOf kc
 */
kc.Size = function (width, height) {
    this._width = width || 0;
    this._height = height || 0;
};

/**
 * Representation of 3D vectors and points.
 * @typedef {Object} Vector3
 * @memberOf kc
 * @param {Number} x X component of the vector.
 * @param {Number} y Y component of the vector.
 * @param {Number} z Z component of the vector.
 */
kc.Vector3 = function (x, y, z) {
	var _this = this;
	_this.x = x || 0;
	_this.y = y || 0;
	_this.z = z || 0;
};

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file CollisionManager.js
 * @author wang_ch
 */

var kc = kc || {};
/**
 * <p>
 * kc.CollisionManager is a singleton that handles all the Objects.</p>
 * @class
 * @name kc.CollisionManager
 */
kc.CollisionManager = /** @lends kc.CollisionManager# */{

	/**
	 * collision list
	 * @type {Array}
	 * @memberof! kc.CollisionManager#
	 */
	collisionList: [],

	/**
	 * collision info
	 * @type {Array}
	 */
	collisionInfo:[],

	// group
	// width
	// height
	/**
	 * add a object to the list
	 * @static
	 * @memberof! kc.CollisionManager#
	 * @param {object} opt
	 */
	addCollision: function(obj) {
		var one = {};
		one.infoID = UUID.generate();
		one.group = 0;
		one.width = 1;
		one.height = 1;
		one.clear = false;
		one.infoIdList = [];
		this.collisionList.push(obj);
		this.collisionInfo.push(one);
	},

	/**
	 * set group
	 * @param {Object} obj   
	 * @param {Number} group
	 */
	setGroup:function (obj,group) {
		var _this = this;
		var index = _this.collisionList.indexOf(obj);
		if (index >= 0){
			_this.collisionInfo[index].group = group || _this.collisionInfo[index].group || 0;
		}
	},

	/**
	 * set size
	 * @param {Number} width
	 * @param {Number} height
	 */
	setSize:function(obj,width,height){
		var _this = this;
		var index = _this.collisionList.indexOf(obj);
		if (index >= 0){
			_this.collisionInfo[index].width = width || _this.collisionInfo[index].width || 1;
			_this.collisionInfo[index].height = height || _this.collisionInfo[index].height || 1;
		}
	},

	/**
	 * remove a object from the list
	 * @static
	 * @memberof! kc.CollisionManager#
	 * @param {String} key object key
	 */
	removeCollision: function (obj) {
		var _this = this;
		var index = _this.collisionList.indexOf(obj);
		if (index >= 0){
			for (var k in _this.collisionInfo){
				var one = _this.collisionInfo[k];
				var _index = one.infoIdList.indexOf(_this.collisionInfo[index].infoID);
				if (_index >= 0){
					one.infoIdList.splice(index,1);
				}
			}
			_this.collisionInfo[index].clear = true;
			_this.collisionList.splice(index,1);
			_this.collisionInfo.splice(index,1);
		}
	},

	/**
	 * remove All collision
	 * @memberof! kc.CollisionManager#
	 */
	removeAllCollision:function(){
		this.collisionList.length = 0;
		this.collisionInfo.length = 0;
	},

	_collisionCheck:function(objA,objB,infoA,infoB){
		var widthA = infoA.width;
		var heightA = infoA.height;
		var posA = objA.convertToWorldSpace();
		var anchorA = objA.anchor;

		var widthB = infoB.width;	
		var heightB = infoB.height;
		var posB = objB.convertToWorldSpace();	
		var anchorB = objB.anchor;

		var posFromatA = {
			x:widthA*0.5 - widthA*anchorA.x + posA.x,
			y:heightA*0.5 - heightA*anchorA.y + posA.y
		};

		var posFromatB = {
			x:widthB*0.5 - widthB*anchorB.x + posB.x, 
			y:heightB*0.5 - heightB*anchorB.y + posB.y
		};

		if(Math.abs(posFromatA.x -posFromatB.x)<= (widthA+widthB)*0.5 &&
			Math.abs(posFromatA.y - posFromatB.y)<= (heightA+heightB)*0.5 ){
			return true;
		}
	},

	/**
	 * update collision
	 * @memberof! kc.CollisionManager#
	 */
	updateCollision:function (){
		var _this = this;
		var length = _this.collisionInfo.length;
		if (length < 2) {return;}
		// var nextIndex = 0;
		for(var i=length-1; i >=0 ;i--){
			var one = _this.collisionInfo[i];
			var oneObj = _this.collisionList[i];
			// var _length = length - _this.collisionInfo.length;
			// if (_length > 0){
			// 	nextIndex += 1;
			// 	if (_length < nextIndex){
			// 		nextIndex = 0;
			// 	}else{
			// 		continue;
			// 	}
			// }
			// var nextIndex1 = 0;
			for (var j=length-1;j>=0;j--){
				var one1 = _this.collisionInfo[j];
				var oneObj1 = _this.collisionList[j];
				// var _length1 = length1 - _this.collisionInfo.length-1;
				// if (_length1 > 0){
				// 	nextIndex1 += 1;
				// 	if (_length1 < nextIndex1){
				// 		nextIndex1 = 0;
				// 	}else{
				// 		continue;
				// 	}
				// }
				if (one && one1 && one.group == one1.group && !one.clear && !one1.clear && oneObj1.tag != oneObj.tag){
					if (_this._collisionCheck(oneObj,oneObj1,one,one1)){
						// if (!one.isCollision){
						var index = one.infoIdList.indexOf(one1.infoID);
						var index1 = one1.infoIdList.indexOf(one.infoID);
						if (index < 0 && index1 < 0){
							one.infoIdList.push(one1.infoID);
							one1.infoIdList.push(one.infoID);
							var events = oneObj.getComponents("Event");	
							var Collision = oneObj.getComponents("Collision")[0];
							var Collision1 = oneObj1.getComponents("Collision")[0];
							for (var kk in events) {
								var eventOne = events[kk];
								if (eventOne.eventType == "be-collision") {
									eventOne.doLogic(eventOne.logicId,Collision1);
									one.collisionState = 3;
								}
							}

							var events1 = oneObj1.getComponents("Event");
							for (var kk1 in events1) {
								var eventOne1 = events1[kk1];
								if (eventOne1.eventType == "be-collision") {
									eventOne1.doLogic(eventOne1.logicId,Collision);
									one1.collisionState = 3;
								}
							}
						}
					}else{
						var index = one.infoIdList.indexOf(one1.infoID);
						var index1 = one1.infoIdList.indexOf(one.infoID);
						if (index >= 0 && index1 >= 0){
							one.infoIdList.splice(index,1);
							one1.infoIdList.splice(index1,1);
						}
					}
				}
			}
		}
	}
};



/**
 * @frame cache class
 * @type {Object}
 */
kc.FrameCache = {


	_NS_REG1: /^\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*$/,
	_NS_REG2: /^\s*\{\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*,\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*\}\s*$/,

	_rectFromString: function (content) {
		var result = this._NS_REG2.exec(content);
		if (!result) return kc.rect(0, 0, 0, 0);
		return kc.rect(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]), parseFloat(result[4]));
	},

	_pointFromString: function (content) {
		var result = this._NS_REG1.exec(content);
		if (!result) return kc.p(0, 0);
		return kc.p(parseFloat(result[1]), parseFloat(result[2]));
	},

	_sizeFromString: function (content) {
		var result = this._NS_REG1.exec(content);
		if (!result) return kc.size(0, 0);
		return kc.size(parseFloat(result[1]), parseFloat(result[2]));
	},

	addData: function (_cache, value) {
		var _this = this;

		var frames = value.frames;
		var metadata = value.metadata;

		for (var filename in frames) {
			var one = frames[filename];
			_cache[filename] = {
				frame: _this._rectFromString(one.frame),
				offset: _this._pointFromString(one.offset),
				rotated: one.rotated,
				sourceColorRect: _this._rectFromString(one.sourceColorRect),
				sourceSize: _this._sizeFromString(one.sourceSize),
				realTextureFileName: metadata.realTextureFileName
			};
		}
	}
};


/**
 * 解析plist 文件
 * @type {{parse: Function, _parseNode: Function, _parseArray: Function, _parseDict: Function}}
 */
kc.PlistParser = {

	_parser: null,
	_isSupportDOMParser: null,

	init: function () {
		if (window.DOMParser) {
			this._isSupportDOMParser = true;
			this._parser = new DOMParser();
		} else {
			this._isSupportDOMParser = false;
		}
	},

	parse : function (xmlTxt) {
		var xmlDoc = this._parseXML(xmlTxt);
		var plist = xmlDoc.documentElement;
		if (plist.tagName !== 'plist') {
			return {};
		}

		// Get first real node
		var node = null;
		for (var i = 0, len = plist.childNodes.length; i < len; i++) {
			node = plist.childNodes[i];
			if (node.nodeType === 1)
				break;
		}
		xmlDoc = null;
		return this._parseNode(node);
	},


	_parseXML: function (textxml) {
		// get a reference to the requested corresponding xml file
		var xmlDoc;
		if (this._isSupportDOMParser) {
			xmlDoc = this._parser.parseFromString(textxml, "text/xml");
		} else {
			// Internet Explorer (untested!)
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(textxml);
		}
		return xmlDoc;
	},

	_parseNode: function (node) {
		var data = null, tagName = node.tagName;
		if(tagName === "dict"){
			data = this._parseDict(node);
		}else if(tagName === "array"){
			data = this._parseArray(node);
		}else if(tagName === "string"){
			if (node.childNodes.length === 1)
				data = node.firstChild.nodeValue;
			else {
				//handle Firefox's 4KB nodeValue limit
				data = "";
				for (var i = 0; i < node.childNodes.length; i++)
					data += node.childNodes[i].nodeValue;
			}
		}else if(tagName === "false"){
			data = false;
		}else if(tagName === "true"){
			data = true;
		}else if(tagName === "real"){
			data = parseFloat(node.firstChild.nodeValue);
		}else if(tagName === "integer"){
			data = parseInt(node.firstChild.nodeValue, 10);
		}
		return data;
	},

	_parseArray: function (node) {
		var data = [];
		for (var i = 0, len = node.childNodes.length; i < len; i++) {
			var child = node.childNodes[i];
			if (child.nodeType !== 1)
				continue;
			data.push(this._parseNode(child));
		}
		return data;
	},

	_parseDict: function (node) {
		var data = {};
		var key = null;
		for (var i = 0, len = node.childNodes.length; i < len; i++) {
			var child = node.childNodes[i];
			if (child.nodeType !== 1)
				continue;

			// Grab the key, next noe should be the value
			if (child.tagName === 'key')
				key = child.firstChild.nodeValue;
			else
				data[key] = this._parseNode(child);
		}
		return data;
	}
};

kc.PlistParser.init();
var kc = kc || {};

kc.NetManager = {
	_pNetMsgQueueList:null,
	_pSyncNetMsgQueueList:null,
	_pDispatcher:null,
	_current:null,
	_checkTimeMessageList:null,
	_mSocket:null,
	_socketList:null,
	m_timeOut: 10000, // 10秒超时
	init:function(){
		var _this = this;
		_this._pNetMsgQueueList = [];
		_this._pSyncNetMsgQueueList = [];
		_this._checkTimeMessageList = [];
		_this._pDispatcher= [];
		_this.socketList = {};

		_this.socketConnect();
	},

	socketConnect:function(){
		var _this = this;
		if (false){
			_this._mSocket = io.connect("ws://"+SERVERIP+":"+SERVERPORT);
            _this._mSocket.on("netWork",function(msg){
            	var msgObj = _this.socketList[msg.id];
            	if (msgObj){
            		for(var k in msgObj){
            			msgObj[k](msg);
            		}
            	}
            });

            var _projectId = null;
	        if (DEBUG){
	            _projectId = PROJECTID;
	        }else{
	            _projectId = GAMEID;
	        }

	        if(_this._mSocket && GUESTUSERID) {
	        	_this._mSocket.emit("initUser", {userId:GUESTUSERID,projectGameId:_projectId,owner:OWNER});
	            _this._mSocket.emit("msg", GUESTUSERID);
	        }else{
	            console.log("no this socket on netManger!!!");
	        }
		}
	},

	/**
	 * 发送socket到服务器
	 * @param  {Object} msg
	 * @param  {String} keys 默认发送地址"netWork"
	 */
	socketSend:function(msg,keys){
		var _this = this;
		var key = keys || "netWork";
		if (_this._mSocket){
			_this._mSocket.emit(key, msg);
		}
	},

	/**
	 * add socket notifaction
	 * 增加网络消息接收socket
	 * @param {Number} id
	 * @param {Function} func
	 */
	addSocketNotifaction:function(id,func){
		var _this = this;
		var funcList = _this.socketList[id];
		if (!funcList){
			funcList = _this.socketList[id] = [];
		}
		var index = funcList.indexOf(func);
		if (index >= 0){
			funcList[index] = func;
		}else{
			funcList.push(func);	
		}	
	},

	/**
	 * del socket notifaction
	 * @param {Number} id
	 * @param {Function} func
	 */
	delSocketNotifaction:function(id,func){
		var _this = this;
		var funcList = _this.socketList[id];
		if (!func && funcList){
			delete _this.socketList[id];
		}else if(func && funcList){
			var index = funcList.indexOf(func);
			if (index >= 0){
				funcList.splice(index,1);
			}
		}	
	},

	/**
     * 发送消息到服务器
     * @param msgList   [消息传递序列]
     * @param data      [消息体]
     * @param isSync    [是否同步界面超时] 1,为同步,2为不同步
     * @param website   [发送到服务器地址的指定参数]
     * @param callback  [消息回调-在收到服务器确认包或超时调用]
     */
	sendMessage:function(msgList, data, isSync, website,callback){
		var _this = this;
		var uuid = UUID.generate();

		var _projectId = null;
        if (DEBUG){
            _projectId = PROJECTID;
        }else{
            _projectId = GAMEID;
        }

		var userInfo = {};
        userInfo.userId = GUESTUSERID;
        userInfo.owner = OWNER;
        userInfo.debug = DEBUG;
        userInfo.projectGameId = _projectId;
		userInfo.FrameWorkVersion = FRAMEWORKVERSION;

		var request = {
            "msgList" :msgList,
            "uuid": uuid,
            "userInfo" : userInfo,
            "Cmsg": data,
            "time":new Date().getTime()
        };

        var msgData = {"data": request, "callback": callback, "sync": isSync,"website":website};
        _this._pNetMsgQueueList.push(msgData);
	},

	_deleteInfo:function(obj){
		obj.httpObj.abort();
		if(obj.sync == 1){
			this._currentMessage = false;
			this.stopSyncIcon();
		}		
		if (obj.callback){
    		obj.callback(obj.data);
    	}
	},

	/**
     * 开始显示同步超时图标
     */
    showSyncIcon:function(){

    },

    /**
     * 停止显示同步超时图标
     */
    stopSyncIcon:function(){
        
    },

	update:function(){
		var _this = this;
		if (_this._pSyncNetMsgQueueList.length>0){
			var msgData = _this._pSyncNetMsgQueueList.shift();
			// _this._checkTimeMessageList[msgData.data.uuid] = msgData;
			var sendData = {};
			if (_this._checkTimeMessageList[msgData.data.uuid]){
				sendData.uuid = msgData.data.uuid;
				sendData.result = 1;
			}else{
				sendData.uuid = msgData.data.uuid;
				sendData.result = 0;
			}
			var httpObj = _this._getXMLHttpRequest(msgData);
			msgData.timeStamp = new Date().getTime();
			msgData.httpObj = httpObj;
			msgData.type = "sync";
			httpObj.onreadystatechange = function(){
				if(httpObj.readyState == 4) {
	                if(httpObj.status == 200) {
	                	var packet = JSON.parse(httpObj.response);
	                	var _data = _this._checkTimeMessageList[packet.uuid];
	                	if (_data){
	                		if (_data.callback){
		                		_data.callback(packet);
		                	}
		                	if (_data.sync == 1){
								_this._currentMessage = false;
								_this.stopSyncIcon();
							}
                			delete _this._checkTimeMessageList[packet.uuid];
                		}
                		
	                } else {
	                    console.log("SyncNet Status Error, Status = " + httpObj.status);
	                }
	            }
			};

			httpObj.send(JSON.stringify(sendData));
		}

		var deleteList = [];
		for (var i in _this._checkTimeMessageList){
			var one = _this._checkTimeMessageList[i];
			var timeOut = new Date().getTime() - one.timeStamp;
			if ( timeOut >_this.m_timeOut){
				one.data.isTimeOut = timeOut;
				deleteList.push(i);
			}
		}
		for (var index in deleteList){
			_this._deleteInfo(_this._checkTimeMessageList[deleteList[index]]);
			delete _this._checkTimeMessageList[deleteList[index]];
		}
						

		if (_this._currentMessage){
			return;
		}

		if (_this._pNetMsgQueueList.length>0){
			var msgData = _this._pNetMsgQueueList.shift();
			_this._checkTimeMessageList[msgData.data.uuid] = msgData;
			msgData.timeStamp = new Date().getTime();
			var sendData = msgData.data;//{heart:true,uuid:msgData.data.uuid};
			var httpObj = _this._getXMLHttpRequest(msgData);
			msgData.httpObj = httpObj;
			msgData.type = "net";
			httpObj.onreadystatechange = function(){
				if(httpObj.readyState == 4) {
	                if(httpObj.status == 200) {
	                	var packet =JSON.parse(httpObj.response);
	                	if (packet.Code && packet.Code == 200){
	                		var _data = _this._checkTimeMessageList[packet.uuid];
	                		if (_data){
	                			_this._pSyncNetMsgQueueList.push(_data);
	                			// delete _this._checkTimeMessageList[packet.uuid];
	                		}	                		
	                	}	                	
	                } else {
	                    console.log("Net Status Error, Status = " + httpObj.status);
	                }
	            }
			};
			if (msgData.sync == 1){
				_this.showSyncIcon();
				_this._currentMessage = true;
			}
			var jsData = JSON.stringify(sendData);
			if(DEBUG){
				console.log("the send data is:::::::::\n",jsData);
			}
			httpObj.send(jsData);
		}
	},

	_getXMLHttpRequest:function(data){
		var msgData = data;
		var website = "http://" + SERVERIP + ":" + SERVERPORT;
		if (msgData.website){
			website = "http://" + SERVERIP + ":" + SERVERPORT+msgData.website;
		}
		
		var m_xhr = kc.getXMLHttpRequest();
		m_xhr.open("POST", website, true);

        if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            // IE-specific logic here
            m_xhr.setRequestHeader("Accept-Charset", "utf-8");
            m_xhr.setRequestHeader("Content-Type", 'application/json');
        } else {
            if (m_xhr.overrideMimeType) {
                m_xhr.overrideMimeType("text\/plain; charset=utf-8");
            }
            m_xhr.setRequestHeader("Content-Type", 'application/json');
        }

        return m_xhr;
	}
};

kc.NetManager.init();
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file PointExtension.js
 * @author wang_ch
 */
var kc = kc || {};
/**
 * smallest such that 1.0+FLT_EPSILON != 1.0
 * @constant
 * @type Number
 */
kc.POINT_EPSILON = parseFloat('1.192092896e-07F');

/**
 * Returns opposite of point.
 * @param {kc.Point} point
 * @return {kc.Point}
 */
kc.pNeg = function (point) {
    return kc.p(-point.x, -point.y);
};

/**
 * Calculates sum of two points.
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {kc.Point}
 */
kc.pAdd = function (v1, v2) {
    return kc.p(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Calculates difference of two points.
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {kc.Point}
 */
kc.pSub = function (v1, v2) {
    return kc.p(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Returns point multiplied by given factor.
 * @param {kc.Point} point
 * @param {Number} floatVar
 * @return {kc.Point}
 */
kc.pMult = function (point, floatVar) {
    return kc.p(point.x * floatVar, point.y * floatVar);
};

/**
 * Calculates midpoint between two points.
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {kc.pMult}
 */
kc.pMidpoint = function (v1, v2) {
    return kc.pMult(kc.pAdd(v1, v2), 0.5);
};

/**
 * Calculates dot product of two points.
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {Number}
 */
kc.pDot = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Calculates cross product of two points.
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {Number}
 */
kc.pCross = function (v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

/**
 * Calculates perpendicular of v, rotated 90 degrees counter-clockwise -- cross(v, perp(v)) >= 0
 * @param {kc.Point} point
 * @return {kc.Point}
 */
kc.pPerp = function (point) {
    return kc.p(-point.y, point.x);
};

/**
 * Calculates perpendicular of v, rotated 90 degrees clockwise -- cross(v, rperp(v)) <= 0
 * @param {kc.Point} point
 * @return {kc.Point}
 */
kc.pRPerp = function (point) {
    return kc.p(point.y, -point.x);
};

/**
 * Calculates the projection of v1 over v2.
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {kc.pMult}
 */
kc.pProject = function (v1, v2) {
    return kc.pMult(v2, kc.pDot(v1, v2) / kc.pDot(v2, v2));
};

/**
 * Rotates two points.
 * @param  {kc.Point} v1
 * @param  {kc.Point} v2
 * @return {kc.Point}
 */
kc.pRotate = function (v1, v2) {
    return kc.p(v1.x * v2.x - v1.y * v2.y, v1.x * v2.y + v1.y * v2.x);
};

/**
 * Unrotates two points.
 * @param  {kc.Point} v1
 * @param  {kc.Point} v2
 * @return {kc.Point}
 */
kc.pUnrotate = function (v1, v2) {
    return kc.p(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
};

/**
 * Calculates the square length of a kc.Point (not calling sqrt() )
 * @param  {kc.Point} v
 *@return {Number}
 */
kc.pLengthSQ = function (v) {
    return kc.pDot(v, v);
};

/**
 * Calculates the square distance between two points (not calling sqrt() )
 * @param {kc.Point} point1
 * @param {kc.Point} point2
 * @return {Number}
 */
kc.pDistanceSQ = function(point1, point2){
    return kc.pLengthSQ(kc.pSub(point1,point2));
};

/**
 * Calculates distance between point an origin
 * @param  {kc.Point} v
 * @return {Number}
 */
kc.pLength = function (v) {
    return Math.sqrt(kc.pLengthSQ(v));
};

/**
 * Calculates the distance between two points
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 * @return {Number}
 */
kc.pDistance = function (v1, v2) {
    return kc.pLength(kc.pSub(v1, v2));
};

/**
 * Returns point multiplied to a length of 1.
 * @param {kc.Point} v
 * @return {kc.Point}
 */
kc.pNormalize = function (v) {
    var n = kc.pLength(v);
    return n === 0 ? kc.p(v) : kc.pMult(v, 1.0 / n);
};

/**
 * Converts radians to a normalized vector.
 * @param {Number} a
 * @return {kc.Point}
 */
kc.pForAngle = function (a) {
    return kc.p(Math.cos(a), Math.sin(a));
};

/**
 * Converts a vector to radians.
 * @param {kc.Point} v
 * @return {Number}
 */
kc.pToAngle = function (v) {
    return Math.atan2(v.y, v.x);
};

/**
 * Clamp a value between from and to.
 * @param {Number} value
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {Number}
 */
kc.clampf = function (value, min_inclusive, max_inclusive) {
    if (min_inclusive > max_inclusive) {
        var temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
};

/**
 * Clamp a point between from and to.
 * @param {Point} p
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {kc.Point}
 */
kc.pClamp = function (p, min_inclusive, max_inclusive) {
    return kc.p(kc.clampf(p.x, min_inclusive.x, max_inclusive.x), kc.clampf(p.y, min_inclusive.y, max_inclusive.y));
};

/**
 * Quickly convert kc.Size to a kc.Point
 * @param {kc.Size} s
 * @return {kc.Point}
 */
kc.pFromSize = function (s) {
    return kc.p(s.width, s.height);
};

/**
 * Run a math operation function on each point component <br />
 * Math.abs, Math.fllor, Math.ceil, Math.round.
 * @param {kc.Point} p
 * @param {Function} opFunc
 * @return {kc.Point}
 * @example
 * //For example: let's try to take the floor of x,y
 * var p = kc.pCompOp(kc.p(10,10),Math.abs);
 */
kc.pCompOp = function (p, opFunc) {
    return kc.p(opFunc(p.x), opFunc(p.y));
};

/**
 * Linear Interpolation between two points a and b
 * alpha == 0 ? a
 * alpha == 1 ? b
 * otherwise a value between a..b
 * @param {kc.Point} a
 * @param {kc.Point} b
 * @param {Number} alpha
 * @return {kc.pAdd}
 */
kc.pLerp = function (a, b, alpha) {
    return kc.pAdd(kc.pMult(a, 1 - alpha), kc.pMult(b, alpha));
};

/**
 * @param {kc.Point} a
 * @param {kc.Point} b
 * @param {Number} variance
 * @return {Boolean} if points have fuzzy equality which means equal with some degree of variance.
 */
kc.pFuzzyEqual = function (a, b, variance) {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
        if (a.y - variance <= b.y && b.y <= a.y + variance)
            return true;
    }
    return false;
};

/**
 * Multiplies a nd b components, a.x*b.x, a.y*b.y
 * @param {kc.Point} a
 * @param {kc.Point} b
 * @return {kc.Point}
 */
kc.pCompMult = function (a, b) {
    return kc.p(a.x * b.x, a.y * b.y);
};

/**
 * @param {kc.Point} a
 * @param {kc.Point} b
 * @return {Number} the signed angle in radians between two vector directions
 */
kc.pAngleSigned = function (a, b) {
    var a2 = kc.pNormalize(a);
    var b2 = kc.pNormalize(b);
    var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, kc.pDot(a2, b2));
    if (Math.abs(angle) < kc.POINT_EPSILON)
        return 0.0;
    return angle;
};

/**
 * @param {kc.Point} a
 * @param {kc.Point} b
 * @return {Number} the angle in radians between two vector directions
 */
kc.pAngle = function (a, b) {
    var angle = Math.acos(kc.pDot(kc.pNormalize(a), kc.pNormalize(b)));
    if (Math.abs(angle) < kc.POINT_EPSILON) return 0.0;
    return angle;
};

/**
 * Rotates a point counter clockwise by the angle around a pivot
 * @param {kc.Point} v v is the point to rotate
 * @param {kc.Point} pivot pivot is the pivot, naturally
 * @param {Number} angle angle is the angle of rotation cw in radians
 * @return {kc.Point} the rotated point
 */
kc.pRotateByAngle = function (v, pivot, angle) {
    var r = kc.pSub(v, pivot);
    var cosa = Math.cos(angle), sina = Math.sin(angle);
    var t = r.x;
    r.x = t * cosa - r.y * sina + pivot.x;
    r.y = t * sina + r.y * cosa + pivot.y;
    return r;
};

/**
 * A general line-line intersection test
 * indicating successful intersection of a line<br />
 * note that to truly test intersection for segments we have to make<br />
 * sure that s & t lie within [0..1] and for rays, make sure s & t > 0<br />
 * the hit point is        p3 + t * (p4 - p3);<br />
 * the hit point also is    p1 + s * (p2 - p1);
 * @param {kc.Point} A A is the startpoint for the first line P1 = (p1 - p2).
 * @param {kc.Point} B B is the endpoint for the first line P1 = (p1 - p2).
 * @param {kc.Point} C C is the startpoint for the second line P2 = (p3 - p4).
 * @param {kc.Point} D D is the endpoint for the second line P2 = (p3 - p4).
 * @param {kc.Point} retP retP.x is the range for a hitpoint in P1 (pa = p1 + s*(p2 - p1)), <br />
 * retP.y is the range for a hitpoint in P3 (pa = p2 + t*(p4 - p3)).
 * @return {Boolean}
 */
kc.pLineIntersect = function (A, B, C, D, retP) {
    if ((A.x === B.x && A.y === B.y) || (C.x === D.x && C.y === D.y)) {
        return false;
    }
    var BAx = B.x - A.x;
    var BAy = B.y - A.y;
    var DCx = D.x - C.x;
    var DCy = D.y - C.y;
    var ACx = A.x - C.x;
    var ACy = A.y - C.y;

    var denom = DCy * BAx - DCx * BAy;

    retP.x = DCx * ACy - DCy * ACx;
    retP.y = BAx * ACy - BAy * ACx;

    if (denom === 0) {
        if (retP.x === 0 || retP.y === 0) {
            // Lines incident
            return true;
        }
        // Lines parallel and not incident
        return false;
    }

    retP.x = retP.x / denom;
    retP.y = retP.y / denom;

    return true;
};

/**
 * ccpSegmentIntersect return YES if Segment A-B intersects with segment C-D.
 * @param {kc.Point} A
 * @param {kc.Point} B
 * @param {kc.Point} C
 * @param {kc.Point} D
 * @return {Boolean}
 */
kc.pSegmentIntersect = function (A, B, C, D) {
    var retP = kc.p(0, 0);
    if (kc.pLineIntersect(A, B, C, D, retP))
        if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0)
            return true;
    return false;
};

/**
 * ccpIntersectPoint return the intersection point of line A-B, C-D
 * @param {kc.Point} A
 * @param {kc.Point} B
 * @param {kc.Point} C
 * @param {kc.Point} D
 * @return {kc.Point}
 */
kc.pIntersectPoint = function (A, B, C, D) {
    var retP = kc.p(0, 0);

    if (kc.pLineIntersect(A, B, C, D, retP)) {
        // Point of intersection
        var P = kc.p(0, 0);
        P.x = A.x + retP.x * (B.x - A.x);
        P.y = A.y + retP.x * (B.y - A.y);
        return P;
    }

    return kc.p(0,0);
};

/**
 * check to see if both points are equal
 * @param {kc.Point} A A ccp a
 * @param {kc.Point} B B ccp b to be compared
 * @return {Boolean} the true if both ccp are same
 */
kc.pSameAs = function (A, B) {
    if ((A != null) && (B != null)) {
        return (A.x === B.x && A.y === B.y);
    }
    return false;
};



// High Perfomance In Place Operationrs ---------------------------------------

/**
 * sets the position of the point to 0
 * @param {kc.Point} v
 */
kc.pZeroIn = function(v) {
    v.x = 0;
    v.y = 0;
};

/**
 * copies the position of one point to another
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 */
kc.pIn = function(v1, v2) {
    v1.x = v2.x;
    v1.y = v2.y;
};

/**
 * multiplies the point with the given factor (inplace)
 * @param {kc.Point} point
 * @param {Number} floatVar
 */
kc.pMultIn = function(point, floatVar) {
    point.x *= floatVar;
    point.y *= floatVar;
};

/**
 * subtracts one point from another (inplace)
 * @param {kc.Point} v1
 * @param {kc.Point} v2
 */
kc.pSubIn = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
};

/**
 * adds one point to another (inplace)
 * @param {kc.Point} v1
 * @param {kc.point} v2
 */
kc.pAddIn = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
};

/**
 * normalizes the point (inplace)
 * @param {kc.Point} v
 */
kc.pNormalizeIn = function(v) {
    kc.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
};

kc.Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/**
 * Helper function that creates a kc.Point.
 * @function
 * @param {Number|kc.Point} x a Number or a size object
 * @param {Number} y
 * @return {kc.Point}
 * @example
 * var point1 = kc.p();
 * var point2 = kc.p(100, 100);
 * var point3 = kc.p(point2);
 * var point4 = kc.p({x: 100, y: 100});
 */
kc.p = function (x, y) {
    // This can actually make use of "hidden classes" in JITs and thus decrease
    // memory usage and overall performance drastically
    // return kc.p(x, y);
    // but this one will instead flood the heap with newly allocated hash maps
    // giving little room for optimization by the JIT,
    // note: we have tested this item on Chrome and firefox, it is faster than kc.p(x, y)
    if (x === undefined)
        return {x: 0, y: 0};
    if (y === undefined)
        return {x: x.x, y: x.y};
    return {x: x, y: y};
};

/**
 * Check whether a point's value equals to another
 * @function
 * @param {kc.Point} point1
 * @param {kc.Point} point2
 * @return {Boolean}
 */
kc.pointEqualToPoint = function (point1, point2) {
    return point1 && point2 && (point1.x === point2.x) && (point1.y === point2.y);
};


/**
 * kc.Size is the class for size object, please do not use its constructor to create sizes, use kc.size() alias function instead.
 * @class kc.Size
 * @param {Number} width
 * @param {Number} height
 * @see kc.size
 */
kc.Size = function (width, height) {
    this.width = width || 0;
    this.height = height || 0;
};

/**
 * Helper function that creates a kc.Size.
 * @function
 * @param {Number|kc.Size} w width or a size object
 * @param {Number} h height
 * @return {kc.Size}
 * @example
 * var size1 = kc.size();
 * var size2 = kc.size(100,100);
 * var size3 = kc.size(size2);
 * var size4 = kc.size({width: 100, height: 100});
 */
kc.size = function (w, h) {
    // This can actually make use of "hidden classes" in JITs and thus decrease
    // memory usage and overall performance drastically
    //return kc.size(w, h);
    // but this one will instead flood the heap with newly allocated hash maps
    // giving little room for optimization by the JIT
    // note: we have tested this item on Chrome and firefox, it is faster than kc.size(w, h)
    if (w === undefined)
        return {width: 0, height: 0};
    if (h === undefined)
        return {width: w.width, height: w.height};
    return {width: w, height: h};
};

/**
 * Check whether a point's value equals to another
 * @function
 * @param {kc.Size} size1
 * @param {kc.Size} size2
 * @return {Boolean}
 */
kc.sizeEqualToSize = function (size1, size2) {
    return (size1 && size2 && (size1.width === size2.width) && (size1.height === size2.height));
};


/**
 * kc.Rect is the class for rect object, please do not use its constructor to create rects, use kc.rect() alias function instead.
 * @class kc.Rect
 * @param {Number} width
 * @param {Number} height
 * @see kc.rect
 */
kc.Rect = function (x, y, width, height) {
    this.x = x||0;
    this.y = y||0;
    this.width = width||0;
    this.height = height||0;
};

/**
 * Helper function that creates a kc.Rect.
 * @function
 * @param {Number|kc.Rect} x a number or a rect object
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @returns {kc.Rect}
 * @example
 * var rect1 = kc.rect();
 * var rect2 = kc.rect(100,100,100,100);
 * var rect3 = kc.rect(rect2);
 * var rect4 = kc.rect({x: 100, y: 100, width: 100, height: 100});
 */
kc.rect = function (x, y, w, h) {
    if (x === undefined)
        return {x: 0, y: 0, width: 0, height: 0};
    if (y === undefined)
        return {x: x.x, y: x.y, width: x.width, height: x.height};
    return {x: x, y: y, width: w, height: h };
};

/**
 * Check whether a rect's value equals to another
 * @function
 * @param {kc.Rect} rect1
 * @param {kc.Rect} rect2
 * @return {Boolean}
 */
kc.rectEqualToRect = function (rect1, rect2) {
    return rect1 && rect2 && (rect1.x === rect2.x) && (rect1.y === rect2.y) && (rect1.width === rect2.width) && (rect1.height === rect2.height);
};

kc._rectEqualToZero = function(rect){
    return rect && (rect.x === 0) && (rect.y === 0) && (rect.width === 0) && (rect.height === 0);
};

/**
 * Check whether the rect1 contains rect2
 * @function
 * @param {kc.Rect} rect1
 * @param {kc.Rect} rect2
 * @return {Boolean}
 */
kc.rectContainsRect = function (rect1, rect2) {
    if (!rect1 || !rect2)
        return false;
    return !((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height));
};

/**
 * Returns the rightmost x-value of a rect
 * @function
 * @param {kc.Rect} rect
 * @return {Number} The rightmost x value
 */
kc.rectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

/**
 * Return the midpoint x-value of a rect
 * @function
 * @param {kc.Rect} rect
 * @return {Number} The midpoint x value
 */
kc.rectGetMidX = function (rect) {
    return (rect.x + rect.width / 2.0);
};
/**
 * Returns the leftmost x-value of a rect
 * @function
 * @param {kc.Rect} rect
 * @return {Number} The leftmost x value
 */
kc.rectGetMinX = function (rect) {
    return rect.x;
};

/**
 * Return the topmost y-value of a rect
 * @function
 * @param {kc.Rect} rect
 * @return {Number} The topmost y value
 */
kc.rectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

/**
 * Return the midpoint y-value of `rect'
 * @function
 * @param {kc.Rect} rect
 * @return {Number} The midpoint y value
 */
kc.rectGetMidY = function (rect) {
    return rect.y + rect.height / 2.0;
};

/**
 * Return the bottommost y-value of a rect
 * @function
 * @param {kc.Rect} rect
 * @return {Number} The bottommost y value
 */
kc.rectGetMinY = function (rect) {
    return rect.y;
};

/**
 * Check whether a rect contains a point
 * @function
 * @param {kc.Rect} rect
 * @param {kc.Point} point
 * @return {Boolean}
 */
kc.rectContainsPoint = function (rect, point) {
    return (point.x >= kc.rectGetMinX(rect) && point.x <= kc.rectGetMaxX(rect) &&
        point.y >= kc.rectGetMinY(rect) && point.y <= kc.rectGetMaxY(rect)) ;
};

/**
 * Check whether a rect intersect with another
 * @function
 * @param {kc.Rect} rectA
 * @param {kc.Rect} rectB
 * @return {Boolean}
 */
kc.rectIntersectsRect = function (ra, rb) {
    var maxax = ra.x + ra.width,
        maxay = ra.y + ra.height,
        maxbx = rb.x + rb.width,
        maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
};

/**
 * Check whether a rect overlaps another
 * @function
 * @param {kc.Rect} rectA
 * @param {kc.Rect} rectB
 * @return {Boolean}
 */
kc.rectOverlapsRect = function (rectA, rectB) {
    return !((rectA.x + rectA.width < rectB.x) ||
        (rectB.x + rectB.width < rectA.x) ||
        (rectA.y + rectA.height < rectB.y) ||
        (rectB.y + rectB.height < rectA.y));
};

/**
 * Returns the smallest rectangle that contains the two source rectangles.
 * @function
 * @param {kc.Rect} rectA
 * @param {kc.Rect} rectB
 * @return {kc.Rect}
 */
kc.rectUnion = function (rectA, rectB) {
    var rect = kc.rect(0, 0, 0, 0);
    rect.x = Math.min(rectA.x, rectB.x);
    rect.y = Math.min(rectA.y, rectB.y);
    rect.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - rect.x;
    rect.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - rect.y;
    return rect;
};

/**
 * Returns the overlapping portion of 2 rectangles
 * @function
 * @param {kc.Rect} rectA
 * @param {kc.Rect} rectB
 * @return {kc.Rect}
 */
kc.rectIntersection = function (rectA, rectB) {
    var intersection = kc.rect(
        Math.max(kc.rectGetMinX(rectA), kc.rectGetMinX(rectB)),
        Math.max(kc.rectGetMinY(rectA), kc.rectGetMinY(rectB)),
        0, 0);

    intersection.width = Math.min(kc.rectGetMaxX(rectA), kc.rectGetMaxX(rectB)) - kc.rectGetMinX(intersection);
    intersection.height = Math.min(kc.rectGetMaxY(rectA), kc.rectGetMaxY(rectB)) - kc.rectGetMinY(intersection);
    return intersection;
};

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file scheduleManager.js
 * @author wang_ch
 */

var kc = kc || {};
/**
 * <p>
 * kc.scheduleManager is a singleton that handles all the Objects.</p>
 * @class
 * @name kc.scheduleManager
 */
kc.scheduleManager = /** @lends kc.scheduleManager# */{

	/**
	 * list of objects
	 * @type {Array}
	 * @memberof! kc.scheduleManager#
	 */
	schedule: [],

	/**
	 * function manager
	 * @memberof! kc.scheduleManager#
	 * @type {Array}
	 */
	funcList:[],

	/**
	 * add a object to the list
	 * @static
	 * @memberof! kc.scheduleManager#
	 * @param {Number} deltaTime
	 * @param {callback} func
	 * @param {bool} doing
	 */
	addSchedule: function(time,func,doing) {
		var one = {};
		one.time = time || 0;
		one.func = func || function(){};
		one.timeNow = 0;
		if (doing){
			func(0);
		}
		this.schedule.push(one);
		this.funcList.push(func);
	},

	/**
	 * remove a object from the list
	 * @static
	 * @memberof! kc.scheduleManager#
	 * @param {String} key object key
	 */
	removeSchedule: function (func) {
		var _this = this;
		var index = _this.funcList.indexOf(func);
		if (index >= 0){
			_this.schedule.splice(index,1);
			_this.funcList.splice(index,1);
		}
	},

	/**
	 * remove All schedule
	 * @memberof! kc.scheduleManager#
	 */
	removeAllSchedule:function(){
		this.schedule.length = 0;
		this.funcList.length = 0;
	},

	/**
	 * get the object by key
	 * @static
	 * @memberof! kc.scheduleManager#
	 * @param  {String} key object key
	 * @return {kc.Object}     the object named the key value
	 */
	// getSchedule: function (key) {
	// 	return this.schedule[key];
	// },

	/**
	 * update schedule
	 * @memberof! kc.scheduleManager#
	 */
	updateSchedule:function	(){
		var _this = this;
		for (var k in _this.schedule){
			var one = _this.schedule[k];
			if (one.time > 0){
				one.timeNow = one.timeNow + kc.deltaTime;
				if (one.timeNow >= one.time){
					one.func(one.time);
					one.timeNow = 0;
				}
			}else{
				one.func(kc.deltaTime);
			}			
		}
	}
};

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Util.js
 * @author Chang Fei
 */

/**
 * @namespace
 */
var kc = kc || {};

kc.GameBanner = "data:image/gif;base64,R0lGODlh5wDWAPf/APt5I/t0GdbW1rzJq93d3ZrCZv/n2M/Pz+Dg4MHKtsjt//j79IK9Ntrsw7bJ0ujz2fz8/NS8q9fy/+aaaLjo/9LBtqnH1lfI/sjjphu0/Ym+RP6aWKnFhYbX/rbZh8jLxaTEetra2mPL/f/Ut2i+5//MqnjB5EnD/f6jZvHx8ZTc//7bxPj4+Fm87NTpud2qiJrF2u6KSOfn5328KyG1/P+3h/P564bAOv/s4PH7/+Tk5PX19avj/v5sC3rT/rTHnEW58e7u7sTLzvr6+uz14avUdv/z7K/X69PT04HC4bvckOOhddi0nOvr6/6qcnq7JemTWuP1/4zEQuv4//6NQvb29v6TTOzs7OHq1dDQ0IvD3tjY2DK8/v5pBvz9+iu6/vLy8unp6dHYyP+EM6DOY//EncXa5Pn9///38ZXAXc7JxpvMXOfb1JDGSv69kqXRbdPMxyi1+T658zm+/jG398HUp/+JOsjVuJG/VJTDVm/A5s/GwPGDOtHk7b/K0JXIUefUx8zSw9Lq9uHJucvMycrMzf7hzpjN58bLv8bR1+m5mcTgnnbK8sDemMfLzezDp/6xffKBNMrLyfv9+O/z6vX68P9nAv/69/9/KuLv9Uy67/z+/+nt4+r1+//9/P1vEeWsh9uukPLLsj/A/s7mr+yOUNjgz/R9LTW49rDXfrTQkNPc4a7Gj+3y9cDf7ePq7f/w5uPw0fD359/uyp7Db/H3+pnU8FO87rTQ3Sa4/uK9pJjKVt7W0P39/S62+ITM7vLj2e+HQf3+/NTU1PX38efq4d7CsPD0927P/vCrfeDNwY2/TfGzivnz8M3Lyuzl4fLr5uCmf9DV2OHj5fn6+NTV0mC/7O3t7d/m6uPj4/n89ff7/PP18He6ItHR0f7+/jm49YC9MJ/f//b8/9rf4dnZ2fLz8Obs7+vt6Ovu8OLi4eXl5ebo5PDz9Pb5+/n5+eTn39Hfvtvb2/z9/dzc3KzOf/bw7NDTzdDT1M7R0xez/ni6Iv9mAMzMzP///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RTI3NkE2Q0REMDZFNjExODA5REQ5MzQ5QzAzNEM5MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEREM2OUY3MTBDNkMxMUU2QjM0RjlGMjk5NTFCNDc0RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEREM2OUY3MDBDNkMxMUU2QjM0RjlGMjk5NTFCNDc0RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJGNEI1MkNGNkEwQ0U2MTE4N0IyRTg2NkVFMTc4QzQ1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZFMjc2QTZDREQwNkU2MTE4MDlERDkzNDlDMDM0QzkzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3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";
kc.LoadingIcon = "data:image/gif;base64,R0lGODlh5wDWAPf/APt5I/t0GdbW1rzJq93d3ZrCZv/n2M/Pz+Dg4MHKtsjt//j79IK9Ntrsw7bJ0ujz2fz8/NS8q9fy/+aaaLjo/9LBtqnH1lfI/sjjphu0/Ym+RP6aWKnFhYbX/rbZh8jLxaTEetra2mPL/f/Ut2i+5//MqnjB5EnD/f6jZvHx8ZTc//7bxPj4+Fm87NTpud2qiJrF2u6KSOfn5328KyG1/P+3h/P564bAOv/s4PH7/+Tk5PX19avj/v5sC3rT/rTHnEW58e7u7sTLzvr6+uz14avUdv/z7K/X69PT04HC4bvckOOhddi0nOvr6/6qcnq7JemTWuP1/4zEQuv4//6NQvb29v6TTOzs7OHq1dDQ0IvD3tjY2DK8/v5pBvz9+iu6/vLy8unp6dHYyP+EM6DOY//EncXa5Pn9///38ZXAXc7JxpvMXOfb1JDGSv69kqXRbdPMxyi1+T658zm+/jG398HUp/+JOsjVuJG/VJTDVm/A5s/GwPGDOtHk7b/K0JXIUefUx8zSw9Lq9uHJucvMycrMzf7hzpjN58bLv8bR1+m5mcTgnnbK8sDemMfLzezDp/6xffKBNMrLyfv9+O/z6vX68P9nAv/69/9/KuLv9Uy67/z+/+nt4+r1+//9/P1vEeWsh9uukPLLsj/A/s7mr+yOUNjgz/R9LTW49rDXfrTQkNPc4a7Gj+3y9cDf7ePq7f/w5uPw0fD359/uyp7Db/H3+pnU8FO87rTQ3Sa4/uK9pJjKVt7W0P39/S62+ITM7vLj2e+HQf3+/NTU1PX38efq4d7CsPD0927P/vCrfeDNwY2/TfGzivnz8M3Lyuzl4fLr5uCmf9DV2OHj5fn6+NTV0mC/7O3t7d/m6uPj4/n89ff7/PP18He6ItHR0f7+/jm49YC9MJ/f//b8/9rf4dnZ2fLz8Obs7+vt6Ovu8OLi4eXl5ebo5PDz9Pb5+/n5+eTn39Hfvtvb2/z9/dzc3KzOf/bw7NDTzdDT1M7R0xez/ni6Iv9mAMzMzP///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RTI3NkE2Q0REMDZFNjExODA5REQ5MzQ5QzAzNEM5MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEREM2OUY3MTBDNkMxMUU2QjM0RjlGMjk5NTFCNDc0RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEREM2OUY3MDBDNkMxMUU2QjM0RjlGMjk5NTFCNDc0RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJGNEI1MkNGNkEwQ0U2MTE4N0IyRTg2NkVFMTc4QzQ1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZFMjc2QTZDREQwNkU2MTE4MDlERDkzNDlDMDM0QzkzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3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";

var LogicParObj = {
    id: 100000,
    wrapper_PosX: 100000,
    wrapper_PosY: 200000,

    objAndProperty_Angle: 100000,
    objAndProperty_PosX: 200000,
    objAndProperty_PosY:300000,

    var_member: 100000,
    var_global: 200000,
    var_local:300000,

    mouse_Pos: 300000,
    mouse_PosX: 400000,
    mouse_PosY:500000,
    joystickDir_Up: 100000,
    joystickDir_Down: 200000,
    joystickDir_Left: 300000,
    joystickDir_Right: 400000,
    joystickDir_LeftUp: 500000,
    joystickDir_LeftDown: 600000,
    joystickDir_RightUp: 700000,
    joystickDir_RightDown: 800000
};

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz' ,'ms'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

window.AudioContext  =  window.AudioContext ||
					window.webkitAudioContext ||
					window.mozAudioContext ||
					window.msAudioContext;
/**
 * delta seconds from last frame
 * @type {Number}
 */
kc.deltaTime = 0;

/**
 * @class
 * @classdesc Class管理器
 * @name ClassManager
 * @ignore
 */
var ClassManager = {
    id : (0|(Math.random()*998)),

    instanceId : (0|(Math.random()*998)),

    getNewID : function(){
        return this.id++;
    },

    getNewInstanceId : function(){
        return this.instanceId++;
    }
};

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
(function () {
    var fnTest = /\b_super\b/;

    /**
     * The base Class implementation (does nothing)
     * @class
     * @ignore
     */
    kc.Class = function () {
    };

    /**
     * Create a new Class that inherits from this Class
     * @static
     * @param {object} props
     * @return {function}
     */
    kc.Class.extend = function (props) {
        var _super = this.prototype;

        // Instantiate a base Class (but only create the instance,
        // don't run the init constructor)
        var prototype = Object.create(_super);

        var classId = ClassManager.getNewID();
        ClassManager[classId] = _super;
        // Copy the properties over onto the new prototype. We make function
        // properties non-eumerable as this makes typeof === 'function' check
        // unneccessary in the for...in loop used 1) for generating Class()
        // 2) for kc.clone and perhaps more. It is also required to make
        // these function properties cacheable in Carakan.
        var desc = { writable: true, enumerable: false, configurable: true };

        prototype.__instanceId = null;

        // The dummy Class constructor
        function Class() {
            this.__instanceId = ClassManager.getNewInstanceId();
            // All construction is actually done in the init method
            if (this.ctor)
                this.ctor.apply(this, arguments);
        }

        Class.id = classId;
        // desc = { writable: true, enumerable: false, configurable: true,
        //          value: XXX }; Again, we make this non-enumerable.
        desc.value = classId;
        Object.defineProperty(prototype, '__pid', desc);

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        desc.value = Class;
        Object.defineProperty(Class.prototype, 'constructor', desc);

        // Copy getter/setter
        this.__getters__ && (Class.__getters__ = kc.clone(this.__getters__));
        this.__setters__ && (Class.__setters__ = kc.clone(this.__setters__));

        for(var idx = 0, li = arguments.length; idx < li; ++idx) {
            var prop = arguments[idx];
            for (var name in prop) {
                var isFunc = (typeof prop[name] === "function");
                var override = (typeof _super[name] === "function");
                var hasSuperCall = fnTest.test(prop[name]);

                if (isFunc && override && hasSuperCall) {
                    desc.value = (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-Class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]);
                    Object.defineProperty(prototype, name, desc);
                } else if (isFunc) {
                    desc.value = prop[name];
                    Object.defineProperty(prototype, name, desc);
                } else {
                    prototype[name] = prop[name];
                }

                if (isFunc) {
                    // Override registered getter/setter
                    var getter, setter, propertyName;
                    if (this.__getters__ && this.__getters__[name]) {
                        propertyName = this.__getters__[name];
                        for (var i in this.__setters__) {
                            if (this.__setters__[i] === propertyName) {
                                setter = i;
                                break;
                            }
                        }
                        kc.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                    }
                    if (this.__setters__ && this.__setters__[name]) {
                        propertyName = this.__setters__[name];
                        for (var i in this.__getters__) {
                            if (this.__getters__[i] === propertyName) {
                                getter = i;
                                break;
                            }
                        }
                        kc.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                    }
                }
            }
        }

        // And make this Class extendable
        Class.extend = kc.Class.extend;

        //add implementation method
        Class.implement = function (prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };
})();


/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config<br/>
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 * @param {String}   getterName Name of getter function for the property
 * @param {String}   setterName Name of setter function for the property
 */
kc.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName) {
    if (proto.__defineGetter__) {
        getter && proto.__defineGetter__(prop, getter);
        setter && proto.__defineSetter__(prop, setter);
    } else if (Object.defineProperty) {
        var desc = { enumerable: false, configurable: true };
        getter && (desc.get = getter);
        setter && (desc.set = setter);
        Object.defineProperty(proto, prop, desc);
    } else {
        throw new Error("browser does not support getters");
    }

    if (!getterName && !setterName) {
        // Lookup getter/setter function
        var hasGetter = (getter != null), hasSetter = (setter != undefined), props = Object.getOwnPropertyNames(proto);
        for (var i = 0; i < props.length; i++) {
            var name = props[i];

            if ((proto.__lookupGetter__ ? proto.__lookupGetter__(name)
                                        : Object.getOwnPropertyDescriptor(proto, name))
                || typeof proto[name] !== "function")
                continue;

            var func = proto[name];
            if (hasGetter && func === getter) {
                getterName = name;
                if (!hasSetter || setterName) break;
            }
            if (hasSetter && func === setter) {
                setterName = name;
                if (!hasGetter || getterName) break;
            }
        }
    }

    // Found getter/setter
    var ctor = proto.constructor;
    if (getterName) {
        if (!ctor.__getters__) {
            ctor.__getters__ = {};
        }
        ctor.__getters__[getterName] = prop;
    }
    if (setterName) {
        if (!ctor.__setters__) {
            ctor.__setters__ = {};
        }
        ctor.__setters__[setterName] = prop;
    }
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @return {Array|object} The created object
 */
kc.clone = function (obj) {
    var newObj = (obj.constructor) ? new obj.constructor : {};

    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) == "object") && copy && !(copy instanceof HTMLElement)) {
            newObj[key] = kc.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

/**
 * inject a object all properties to anothor
 * @function
 * @param {object|Array} obj The source object
 */
kc.inject = function (srcPrototype, destPrototype) {
    for (var key in srcPrototype)
        destPrototype[key] = srcPrototype[key];
};

/**
 * generate uuid function
 * @function
 * @author http://www.broofa.com/Tools/Math.uuid.htm
 * @return {String} a uuid string
 */
kc.generateUUID = (function() {

    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36);
    var rnd = 0,
        r;

    return function() {
        for (var i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid[i] = '-';
            } else if (i === 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }

        return uuid.join('');
    };
})();

/**
 * get a http request
 * @return {XMLHttpRequest} XMLHttpRequest object
 */
kc.getXMLHttpRequest = function () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
};

/**
 * gets a url that point to the javascript file by the resource id
 * @param {String} resId javascript file id
 */
kc.GenJsUrl = function (resId) {
	var path = null;
	if (DEBUG) {
		path = APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + (PROJECTID || '') + "&instanceid=" + resId;
	} else {
		path = ScriptRoot + 'material/' + USERID + '/' + (GAMEID || '') + '/logic/' + resId + '.js';
	}

	return path;
};

kc.g_loadList = {};

/**
 * load javascript file from server
 * @param  {String}   jsPath javascript url
 * @param  {Boolean}  isAsync is async
 * @param  {Function} cb      called when javascript file loaded end
 */
kc.loadJs = function (jsPath, isAsync, cb) {
    if (kc.g_loadList[jsPath]) {
        setTimeout(function () {
            if(cb) {
                cb();
            }
        }, 16);
        return;
    }

    kc._loadTry(jsPath, isAsync, cb,0);
};

kc._loadTry = function(jsPath, isAsync, cb,times){
	var d = document,
        s = d.createElement('script');
    s.async = isAsync;
    s.type = 'application/javascript';
    s.src = jsPath;

    var loadFun = null;
    var errorFun = null;

    loadFun = function(){
    	kc.g_loadList[jsPath] = true;
        if(s.parentNode) {
        	s.parentNode.removeChild(s);
        }
        this.removeEventListener('load', loadFun, false);
        this.removeEventListener('error', errorFun, false);
        cb();
    };
    s.addEventListener('load', loadFun, false);

    
    errorFun = function() {
    	if(s.parentNode) {
        	s.parentNode.removeChild(s);
        }
        this.removeEventListener('load', loadFun, false);
        this.removeEventListener('error', errorFun, false);
        if (times<5){
        	kc._loadTry(jsPath, isAsync, cb,times+1);
        }else{
        	cb("Load " + jsPath + " failed!");
        }
    };
    s.addEventListener('error', errorFun, false);
    d.body.appendChild(s);
};

/**
 * show kc start banner
 */
kc.showGameBanner = function () {
    var pDom = document.createElement('p');
    pDom.style.left = '0%';
    pDom.style.top = '0%';
    pDom.style.width = '100%';
    pDom.style.height = '100%';
    pDom.style.backgroundColor = "rgb(122,214,255)";
    pDom.style.margin = '0';
    pDom.style.zIndex = '998';
    pDom.style.position = 'absolute';
    pDom.id = 'gameBanner1';
    document.body.appendChild(pDom);

    var canvas = document.createElement('canvas');
    canvas.id = "CursorLayer";
    canvas.style.left = '0%';
    canvas.style.top = '0%';
    canvas.width = pDom.clientWidth;
    canvas.height = pDom.clientHeight;
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    canvas.style.background = "transparent";
    pDom.appendChild(canvas);

    kc.updateGameBanner(1);
};

/**
 * update kc start banner
 */
kc.updateGameBanner = function(index)
{
    var projectData = kc.Project.getProjectData();
    var sceneId = projectData.ResourceText.projectSetting.defaultSceneID;
    var aRes = kc.Project.getResBySceneId(sceneId);

    var len = aRes.length == 0 ? 1 : aRes.length;
    var percent = index / len * 100;
    var canvas = document.getElementById('CursorLayer');
    var context = canvas.getContext('2d'),
    centerX = canvas.width/2,
    centerY = canvas.height/2,
    rad = Math.PI*2/100;

    context.clearRect(0, 0, canvas.width, canvas.height);

    kc.showSmallCircle(context, centerX, centerY);
    kc.updateText(context, percent, centerX, centerY);
    kc.updateLargeCircle(context, percent, centerX, centerY, rad);
};

 /**
 * show kc start banner context smallCircle
 */
kc.showSmallCircle = function(context, centerX, centerY)
{
    context.save();
    context.beginPath();
    context.strokeStyle = "white";
    context.arc(centerX, centerY, 70 , 0, Math.PI*2, false);
    context.stroke();
    context.closePath();
    context.restore();
};

 /**
 * update kc start banner context text
 */
kc.updateText = function(context, percent, centerX, centerY)
{
    context.save();
    context.strokeStyle = "#fff";
    context.font = "30px Arial";
    var offsetX = 15;
    if (percent >= 100)
        offsetX = 35;
    else if (percent >= 10)
        offsetX = 25;
    context.strokeText(percent.toFixed(0)+"%", centerX-offsetX, centerY+10);
    context.stroke();
    context.restore();
};

/**
 * update kc start banner context largeCircle
 */
 kc.updateLargeCircle = function(context, percent, centerX, centerY, rad)
 {
    context.save();
    context.strokeStyle = "#fff";
    context.lineWidth = 10;
    context.beginPath();
    context.arc(centerX, centerY, 70 , -Math.PI/2, -Math.PI/2 +percent*rad, false);
    context.stroke();
    context.closePath();
    context.restore();
 };

/**
 * hide kc start banner
 */
kc.hideGameBanner = function () {
    var gameBanner1 = document.getElementById('gameBanner1');
    document.body.removeChild(gameBanner1);
};
/**
 * show kc loading icon
 */
kc.showLoading = function () {

	var loadingIcon = document.getElementById('loadingIcon');

	if(!loadingIcon) {
	    var tex = new Image();
	    tex.src = kc.LoadingIcon;

	    tex.addEventListener("load", function(e) {
	        document.body.appendChild(this);
	        this.style.left = '50%';
	        this.style.top = '50%';
	        this.style.width = this.width + 'px';
	        this.style.height = this.height + 'px';
	        this.style.display = 'block';
	        this.style.margin = -this.width / 2 + 'px' + ' 0 0 ' + -this.height / 2 + 'px';
	        this.style.zIndex = '999';
	        this.style.position = 'absolute';
	        this.id = 'loadingIcon';
	    });
	} else {
		loadingIcon.style.display = 'block';
	}
};

/**
 * hide kc loading icon
 */
kc.hideLoading = function () {
	var loadingIcon = document.getElementById('loadingIcon');
	loadingIcon.style.display = 'none';
};

/**
 * Get the ext name of a path.
 * @example
	kc.extname("a/b.png");//-->".png"
	kc.extname("a/b.png?a=1&b=2");//-->".png"
	kc.extname("a/b");//-->null
	kc.extname("a/b?a=1&b=2");//-->null
 * @param {string} pathStr
 * @returns {*}
 */
kc.extname = function (pathStr) {
    var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
    return temp ? temp[1].toLowerCase() : null;
};

/**
 * [bEmptyObject description]
 * @param  {Object} object [description]
 * @return {Bool}        [description]
 */
kc.bEmptyObject = function (object) {
	for(var i in object) {
		return false;
	}

	return true;
};

/**
 * use difined property characteristic.
 * @param  {Object} o     obj
 * @param  {String} name  key like (obj.key)
 * @param  {Function} setfn function
 * @param  {Function} getfn function
 */
kc.defineProperty = function (o,name,setfn,getfn) {
	if(getfn && setfn)
		Object.defineProperty(o,name,{get:getfn,set:setfn,configurable:true,enumerable:false});
	else{
		getfn && Object.defineProperty(o,name,{get:getfn,configurable:true,enumerable:false});
		setfn && Object.defineProperty(o,name,{set:setfn,configurable:true,enumerable:false});
	}
};

/**
 * choose pos is in object
 * @param  {Number}  x
 * @param  {Number}  y
 * @param  {Object}  gameObject
 * @return {Object}	 if post in it returned
 */
kc.isPosIn = function(x,y,gameObject){
	if ( typeof(x) =="number" && typeof(y) =="number" && gameObject){
		var pos = gameObject.convertToNodeSpace({x:x,y:y});
		var objSize = gameObject.size;
		var offset = gameObject.anchor;
		var leftX = -objSize.width*offset.x;
		var rightX = objSize.width*(1-offset.x);
		var upY = objSize.height*(1-offset.y);
		var dowmY = -objSize.height*offset.y;
		if (pos.x>=leftX&&pos.x<=rightX&&pos.y>=dowmY&&pos.y<=upY){
			return pos;
		}
	}
	return false;
};

/**
 * getAllScale
 * @param  {Object} obj
 * @return {Object}
 */
kc.getScale = function(obj,scale){
	var transformScale = obj.getComponents("Transform")[0].scale;
	var scaleLast = {};
	if (scale){
		scaleLast.x = transformScale.x * scale.x;
		scaleLast.y = transformScale.y * scale.y;
	}else{
		scaleLast.x = transformScale.x;
		scaleLast.y = transformScale.y;
	}
	if (obj.parent && !obj.parent.ObjType || obj.parent.ObjType != "scene"){
		return kc.getScale(obj.parent,scaleLast);
	}else{
		return scaleLast;
	}
};

/**
 * traverse children
 * @param  {Object} obj
 */
kc.traverseChildren = function(obj,fun){
	for (var k in obj.children){
		var one = obj.children[k];
		if (fun){
			fun(one);
		}

		if (one.children[0]){
			kc.traverseChildren(one,fun);
		}
	}
};

/**
 *  生成tmx（地图文件）
 */
kc.tmxForMap = function(obj) {
    // 初始化一个tmx模版
    // 如果存的话，这里需要判断，是否存在这个字符串
    var xmlDoc = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"20\" height=\"20\" tilewidth=\"20\" tileheight=\"20\" nextobjectid=\"1\">" +
        "<tileset firstgid=\"1\" name=\"1d3a7666d0160924687fd113d30735fae7cd34a3\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"36\" columns=\"6\">" +
        "<image source=\"1d3a7666d0160924687fd113d30735fae7cd34a3.jpg\" width=\"198\" height=\"198\"/>" +
        "</tileset>" +
        "<layer name=\"块层 1\" width=\"20\" height=\"20\">" +
        "<data encoding=\"csv\">" +

        "</data>" +
        "</layer>" +
        "</map>";

    // // 前端数据
    // var obj = vt.resourceCache.getResourceForKey(sId);
    // xml解析
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlDoc, "text/xml");
    // 修改地图属性
    var map = xmlDoc.getElementsByTagName("map")[0];
    var mapAtt = obj.prototypedata.mapScene.singlelayer;
    map.setAttribute("width", mapAtt["0"]);
    map.setAttribute("height", mapAtt["2"]);
    map.setAttribute("tilewidth", mapAtt["1"]);
    map.setAttribute("tileheight", mapAtt["3"]);

    // 添加节点
    var mapImg = obj.prototypedata.mapBlock;
    var imageList = xmlDoc.getElementsByTagName("image");
    var tilesetList = xmlDoc.getElementsByTagName("tileset");
    for (var i = 0; i < mapImg.length; ++i) {
        if (!tilesetList[i]) {
            var newNode = tilesetList[0].cloneNode(true);
            xmlDoc.documentElement.appendChild(newNode);
        }
        // 图块数据
        tilesetList[i].setAttribute("firstgid", mapImg[i].firstgid);
        tilesetList[i].setAttribute("name", mapImg[i].titletext);
        tilesetList[i].setAttribute("tilewidth", mapImg[i].w);
        tilesetList[i].setAttribute("tileheight", mapImg[i].h);
        tilesetList[i].setAttribute("tilecount", mapImg[i].conunt);

        // 图片数据
        imageList[i].setAttribute("width", mapImg[i].imgw);
        imageList[i].setAttribute("height", mapImg[i].imgh);
        imageList[i].setAttribute("source", mapImg[i].src);
    }

    // 删除多余的节点（存储才用）
    for (var ii = 0; ii < tilesetList.length; ++ii) {
        if (!mapImg[ii]) {
            xmlDoc.documentElement.removeChild(tilesetList[ii]);
        }
    }

    // 添加节点
    var layerList = xmlDoc.getElementsByTagName("layer");
    var urlList = obj.prototypedata.mapScene.mostlayer;
    var nameList = obj.prototypedata.Layer;
    var dataList = xmlDoc.getElementsByTagName("data");
    for (var j = 0; j < urlList.length; ++j) {
        if (!dataList[j]) {
            var newNode = layerList[0].cloneNode(true);
            xmlDoc.documentElement.appendChild(newNode);
        }

        var info = urlList[j];
        var info2 = nameList[j];
        for (var key in info) {
            var newCont = (info[key].data).join(",");
            dataList[j].textContent = newCont;

            // 图层数据
            layerList[j].setAttribute("name", info2[key].name);
            layerList[j].setAttribute("width", info[key].CW);
            layerList[j].setAttribute("height", info[key].CH);
        }
    }

    // 删除多余的节点（存储才用）
    for (var jj = 0; jj < dataList.length; ++jj) {
        if (!urlList[jj]) {
            xmlDoc.documentElement.removeChild(dataList[jj]);
            xmlDoc.documentElement.removeChild(layerList[jj]);
        }
    }

    // xml转成字符串
    var serialize = new XMLSerializer();
    xmlDoc = serialize.serializeToString(xmlDoc);
    return xmlDoc;
};

kc.quadrant = {
    firstQuadrant: 1,
    secondQuadrant: 2,
    thirdQuadrant: 3,
    fourthQuadrant: 4
};

/**
 * get rotated position
 * 根据所在象限和弧度获取新坐标
    象限，半径，弧度，（myRadian）两点初始弧度 centerPosX，Y（圆心）
 */
kc.getRotatedPosition = function(m_quadrant, randius, radian, centerPosX, centerPosY, angle) {
    var newPosition;

    if (m_quadrant == kc.quadrant.thirdQuadrant) {
        if (angle == 0) {
            var x = randius * Math.cos(radian);
            var y = randius * Math.sin(radian);
            newPosition = kc.p(-x + centerPosX, -y + centerPosY);
        }
        else {
            var x = randius * Math.cos(radian);
            var y = randius * Math.sin(radian);
            newPosition = kc.p(x + centerPosX, y + centerPosY);
        }
    }
    else if (m_quadrant == kc.quadrant.firstQuadrant) {
            var x = randius * Math.cos(radian);
            var y = randius * Math.sin(radian);
            newPosition = kc.p(x + centerPosX, y + centerPosY);
    }
    else if (m_quadrant == kc.quadrant.secondQuadrant) {
        if (angle == 0) {
            var x = -randius * Math.sin(radian);
            var y = randius * Math.cos(radian);
            newPosition = kc.p(x + centerPosX, y + centerPosY);
        }
        else {
            var x = randius * Math.cos(radian);
            var y = randius * Math.sin(radian);
            newPosition = kc.p(x + centerPosX, y + centerPosY);
        }
    }
    else {
        if (angle == 0) {
            var x = randius * Math.sin(radian);
            var y = randius * Math.cos(radian);
            newPosition = kc.p(x + centerPosX, -y + centerPosY);
        }
        else {
            var x = randius * Math.cos(radian);
            var y = randius * Math.sin(radian);
            newPosition = kc.p(x + centerPosX, y + centerPosY);
        }
    }
    return newPosition;
};

kc.GetRequest = function() {
    var url = location.search; //获取url中"?"符后的字串
    var strs = null; 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {         
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }

    if (!theRequest.userid) {
        theRequest.userid = USERID;
    }

    return theRequest;
};

/**
 * 判断点是否在多边形内
 * @param {Point} point  点坐标
 * @param {Array} vertex 多边形顶点数组
 * @return {Bool} 是否在多边形内
 */
kc.PointInPolygon = function(point, vertex) {
	var nCount = vertex.length;

	var nCross = 0;
	for(var i = 0, len = nCount; i < len; i++) {
		var p1 = vertex[i];
		var p2 = vertex[(i + 1) % nCount];
		if(p1.y == p2.y) {
			continue;
		}
		if(point.y < Math.min(p1.y, p2.y)) {
			continue;
		}
		if(point.y >= Math.max(p1.y, p2.y)) {
			continue;
		}

		var x = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
		if(x > point.x) {
			nCross++;
		}
	}

	return (nCross % 2 == 1);
};

kc.ColorRgb = function(data) {
    var colorArray = [];
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = data.toLowerCase();

    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值

        for (var i = 1; i < 7; i += 2) {
            colorArray.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
    }

    return colorArray;
};

/**
象限
*/
kc.radPOX = function(x, y) {
    if (x == 0 && y == 0) return 0;

    if (y == 0 && x > 0) return 0;
    if (y == 0 && x < 0) return Math.PI;
    if (x == 0 && y > 0) return Math.PI / 2;
    if (x == 0 && y < 0) return Math.PI / 2 * 3;

    if (x > 0 && y > 0) return Math.atan(y / x);
    if (x < 0 && y > 0) return Math.PI - Math.atan(y / -x);
    if (x < 0 && y < 0) return Math.PI + Math.atan(-y / -x);
    if (x > 0 && y < 0) return Math.PI * 2 - Math.atan(-y / x);

    return 0;
};

/**
    精灵之间夹角
*/
kc.SpriteAngle = function(sp1, sp2) {
    var len_Y = sp2.position.y - sp1.position.y;
    var len_X = sp2.position.x - sp1.position.x;

    var tan_yx = Math.abs(len_Y) / Math.abs(len_X);
    var angle = 0;
    if (len_Y > 0 && len_X < 0) {
        angle = Math.atan(tan_yx) * 180 / Math.PI - 90;
    } else if (len_Y > 0 && len_X > 0) {
        angle = 90 - Math.atan(tan_yx) * 180 / Math.PI;
    } else if (len_Y < 0 && len_X < 0) {
        angle = -Math.atan(tan_yx) * 180 / Math.PI - 90;
    } else if (len_Y < 0 && len_X > 0) {
        angle = Math.atan(tan_yx) * 180 / Math.PI + 90;
    }
    return angle;
};

/**
    精灵旋转一定弧度之后的坐标
    P 原点
    A 移动点
    rad 半径
    isClockwise 方向
*/
kc.RotatePoint = function(P, A, rad, isClockwise) {
    var Temp1 = kc.p(A.position.x - P.position.x, A.position.y - P.position.y);
    var lenO2Temp1 = kc.pDistance(Temp1, kc.p(0, 0));
    var angT1OX = radPOX(Temp1.x, Temp1.y);
    if (P.position.x != A.position.x && P.position.y != A.position.y) {
        rad = -rad;
    } else if (P.position.x == A.position.x || P.position.y == A.position.y) {
        rad = rad;
    }
    var p1_p2Angle = kc.SpriteAngle(P, A);
    var mn = p1_p2Angle + rad;
    var angle = (2 * Math.PI / 360) * mn;

    var angT2OX = angT1OX - (isClockwise ? 1 : -1) * angle;
    var Temp2;
    if (p1_p2Angle == 0 && P.position.y == A.position.y && A.position.x >= P.position.x) {
        Temp2 = kc.p((lenO2Temp1 * Math.cos(angle)), (lenO2Temp1 * Math.sin(angle)));
        var rotatedX = Temp2.x + P.position.x;
        var rotatedY = Temp2.y + P.position.y;
        return kc.p(rotatedX, rotatedY);
    } else if (p1_p2Angle == 0 && P.position.y == A.position.y && P.position.x > A.position.x) {
        angle = Math.PI + angle;
        Temp2 = kc.p((lenO2Temp1 * Math.cos(angle)), (lenO2Temp1 * Math.sin(angle)));
        var rotatedX = Temp2.x + P.position.x;
        var rotatedY = Temp2.y + P.position.y;
        return kc.p(rotatedX, rotatedY);
    } else if (p1_p2Angle == 0 && P.position.y >= A.position.y && P.position.x == A.position.x) {
        angle = (2 * Math.PI) / 4 * 3 + angle;
        Temp2 = kc.p((lenO2Temp1 * Math.cos(angle)), (lenO2Temp1 * Math.sin(angle)));
        var rotatedX = Temp2.x + P.position.x;
        var rotatedY = Temp2.y + P.position.y;
        return kc.p(rotatedX, rotatedY);
    } else if (p1_p2Angle == 0 && P.position.y < A.position.y && P.position.x == A.position.x) {
        angle = Math.PI / 2 + angle;
        Temp2 = kc.p((lenO2Temp1 * Math.cos(angle)), (lenO2Temp1 * Math.sin(angle)));
        var rotatedX = Temp2.x + P.position.x;
        var rotatedY = Temp2.y + P.position.y;
        return kc.p(rotatedX, rotatedY);
    } else if (p1_p2Angle < 0) {
        Temp2 = kc.p(lenO2Temp1 * Math.sin(angle), lenO2Temp1 * Math.cos(angle));
        var rotatedX = Temp2.x + P.position.x;
        var rotatedY = Temp2.y + P.position.y;
        return kc.p(rotatedX, rotatedY);
    }
    Temp2 = kc.p(lenO2Temp1 * Math.sin(angle), lenO2Temp1 * Math.cos(angle));
    var rotatedX = Temp2.x + P.position.x;
    var rotatedY = Temp2.y + P.position.y;
    return kc.p(rotatedX, rotatedY);
}

/**
保存游戏进度
*/
kc.SaveLocalStoreToServer = function(data) {
    $.ajax({
        url: '../gf/webapi/GameStateAdd',
        type: "post",
        data: {
            "gameid": data.projectID,
            "statedes": JSON.stringify(data)
        },
        success: function(data) {
            console.log(data);
        },
        error: function(err) {}
    });
};

/**
    检查象限
    p1(圆上某一点)  p2（圆心）
    1(第一象限) 2(第二象限) 3(第三象限) 4（第四想想）
*/
kc.getQuadrant = function(p1,p2) {
    var p1_p2X=p1.x-p2.x;
    var p1_p2Y=p1.y-p2.y;
    if (p1_p2X > 0 && p1_p2Y >= 0) {
        return kc.quadrant.firstQuadrant;
    }
    else if (p1_p2X <= 0 && p1_p2Y > 0) {
        return kc.quadrant.secondQuadrant;
    }
    else if (p1_p2X < 0 && p1_p2Y <= 0) {
        return kc.quadrant.thirdQuadrant;
    }
    else if (p1_p2X >= 0 && p1_p2Y <0) {
        return kc.quadrant.fourthQuadrant;
    }
};

kc.getSpritesAngleByPos = function(sp1, sp2) {
    var len_Y = sp2.position.y - sp1.position.y;
    var len_X = sp2.position.x - sp1.position.x;

    var tan_yx = Math.abs(len_Y) / Math.abs(len_X);
    var angle = 0;
    if (len_Y > 0 && len_X < 0) {
        angle = 180 - Math.atan(tan_yx) * 180 / Math.PI;
    } else if (len_Y > 0 && len_X > 0) {
        angle = Math.atan(tan_yx) * 180 / Math.PI;
    } else if (len_Y < 0 && len_X < 0) {
        angle = Math.atan(tan_yx) * 180 / Math.PI + 180;
    } else if (len_Y < 0 && len_X > 0) {
        angle = 360 - Math.atan(tan_yx) * 180 / Math.PI;
    }
    return angle;
};

/**
* 服务器打印log函数
*/
kc.sendLogFun = function(msg) {

    var createXmlHttpRequest = function () {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    var xmlHttpRequest = createXmlHttpRequest();
    xmlHttpRequest.open("POST", 'http://42.62.4.82:6048', true);

    xmlHttpRequest.send(msg);
};

kc.hexToColor = function (hex) {
    hex = hex.replace(/^#?/, "0x");
    var c = parseInt(hex);
    var r = c >> 16;
    var g = (c >> 8) % 256;
    var b = c % 256;

    return {
    	r: r, 
    	g: g, 
    	b: b
    };
};

kc.colorToHex = function (color) {
    var hR = color.r.toString(16), hG = color.g.toString(16), hB = color.b.toString(16);
    return "#" + (color.r < 16 ? ("0" + hR) : hR) + (color.g < 16 ? ("0" + hG) : hG) + (color.b < 16 ? ("0" + hB) : hB);
};

// plist.png 路径和数据
kc.getPlistTexture = function(src){
    var name = src.substr(src.lastIndexOf('/')+1);
    var plistData = kc.Cache.getPlistData(name);
    if(!plistData){
        return;
    }
    var src = ScriptRoot + 'img/packer/'+plistData.realTextureFileName;
    var texture = kc.Cache.get(src);
    return {texture:texture,plistData:plistData};
};

/**
 * Dynamic judge whether the browser is a PC or mobile!
 * @param  {[string]}	var u  		userAgent
 * @param  {[string]} 	var app  	appVersion
 * @return {[object]} 	the browser version
 */
kc.browserVersion = (function() {
	var u = navigator.userAgent, app = navigator.appVersion; 
	return {  
		trident: u.indexOf('Trident') > -1, //IE kernel   
		presto: u.indexOf('Presto') > -1, //opera kernel   
		webKit: u.indexOf('AppleWebKit') > -1, // Apple 、 Google kernel   
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // Gecko   
		mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), // Whether for mobile terminal   
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios terminal   
		android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android Terminal or uc Browser   
		iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // Whether as iPhone perhaps QQHD Browser   
		iPad: u.indexOf('iPad') > -1, // Whether iPad  
		webApp: u.indexOf('Safari') == -1 // Whether web Should program ， No head and bottom   
	};
})();

/**
 * get root window
 * @param  {[object]} root [cuurent window]
 * @return {[object]}      [the root window]
 */
kc.getRootWindow = function(root) {
    if (root.parent && root != root.parent) {
        return kc.getRootWindow(root.parent);
    } else {
        return root;
    }
};

/**
 * setupWebViewJavascriptBridge in iOS mobile
 */
kc.setupWebViewJavascriptBridge = function(callback) {
	var rootWindow = kc.getRootWindow(window);
    if (rootWindow.WebViewJavascriptBridge) {return callback(WebViewJavascriptBridge); }
    if (rootWindow.WVJBCallbacks) {return rootWindow.WVJBCallbacks.push(callback); }
    rootWindow.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
};



var kc = kc || {};

kc.webSocketResCache = {
    m_MsgList:null,

    init: function () {
        this.m_MsgList = [];
    },

    getOneMsg:function(key,isNotShift){
        if (key && this.m_MsgList[key] && isNotShift){
            return this.m_MsgList[key][0];
        }else if (key && this.m_MsgList[key]) {
            return this.m_MsgList[key].shift();
        }else if(isNotShift){
            return this.m_MsgList[0];
        }else{
            return this.m_MsgList.shift();
        }
    },

    addOneMsg:function(msg,key){
        if (key && this.m_MsgList[key]){
            this.m_MsgList[key].push(msg);
        }else if(key){
            this.m_MsgList[key] = [];
            this.m_MsgList[key].push(msg);
        }else{
            this.m_MsgList.push(msg);
        }
    },

    addOneMsgByKey:function(msg,key){
        this.m_MsgList[key] = msg;
    },

    getOneMsgByKey:function(key){
        var _this = this;
        var one = _this.m_MsgList[key];
        delete _this.m_MsgList[key];
        return one;
    },

    clearData:function(){
        this.m_MsgList=[];
    }
};
kc.webSocketResCache.init();
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Cache.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>
 * 文件缓存类,默认开启<br/>
 * <br/>
 * example<br/>
 * kc.Cache.add('hello.png', helloImage);<br/>
 * </p>
 * @class Cache
 * @name kc.Cache
 */
kc.Cache = /** @lends kc.Cache# */{

    /**
     * 启动/关闭缓存
     * @static
     * @memberOf! kc.Cache#
     * @type {Boolean}
     */
    enabled: true,

    /**
     * 已被缓存的文件列表
     * @memberOf kc.Cache#
     * @private
     * @type {Object.<string, *>}
     */
    files: {},

    /**
     * 已被缓存的plist文件列表
     * @memberOf kc.Cache#
     * @private
     * @type {Object.<string, *>}
     */
    plistFiles:{},

    /**
     * 添加文件到缓存
     * @param  {String} sKey 唯一标识
     * @param  {*} data 缓存内容
     * @return {Bool} 操作是否成功
     * @static
     * @memberOf! kc.Cache#
     */
    add: function(sKey, data) {
        var _this = this;

        var result = false;
        if (_this.enabled !== false) {
            _this.files[sKey] = data;
            result = true;
        }

        return result;
    },

    /**
     * 从缓存获取文件
     * @param  {String} sKey 唯一标识
     * @return {?*} 缓存内容或空
     * @static
     * @memberOf! kc.Cache#
     */
    get: function(sKey,fun) {
        var _this = this;

        var result = null;
        if (_this.enabled !== false) {
            result = _this.files[sKey];
            if(!result){
                kc.defaultImageLoader.load(sKey, function(context){
                    if (fun){
                        fun(context);
                    }
                });
            }else{
                if (fun){
                    fun(result);
                }else{
                    return result;
                }
            }
        }
    },

    /**
     * 根据图片名称找到相关数据
     * @param imageName
     * @returns {result|*}
     */
    getPlistData : function(imageName){
        var _this = this;

        var result = null;
        if(_this.enabled !== false){
            result = _this.plistFiles[imageName]
        }

        return result;
    },

    /**
     * 移除缓存内容
     * @param  {String} sKey 唯一标识
     * @return {Bool} 操作是否成功
     * @static
     * @memberOf! kc.Cache#
     */
    remove: function(sKey) {
        var _this = this;

        var result = false;
        if (_this.files.hasOwnProperty(sKey)) {
            delete this.files[sKey];
            result = true;
        }

        return result;
    },

    /**
     * 清空缓存内容
     * @static
     * @memberOf! kc.Cache#
     */
    clear: function() {
        this.files = {};
        this.plistFiles = {};
    }
};
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Core.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>
 * 快创引擎核心类.<br/>
 * <br/>
 * example<br/>
 * // 加载快创引擎<br/>
 * kc.Core.launch(document.body, 960, 640);<br/>
 * </p>
 * @class Core
 * @name kc.Core
 */
kc.Core = /** @lends kc.Core# */ {

	/**
	 * 游戏画布父元素
	 * @memberof kc.Core#
	 * @private
	 * @type {Element}
	 */
	_root: null,

	/**
	 * 游戏画布尺寸
	 * @memberof kc.Core#
	 * @private
	 * @type {kc.Size}
	 */
	_size: new kc.Size(),

	/**
	 * 场景切换标记
	 * @description 标记是否正在切换场景中
	 * @memberOf! kc.Core#
	 * @private
	 * @type {Bool}
	 */
	_bChanging: false,

	/**
	 * 当前场景
	 * @memberOf! kc.Core#
	 * @private
	 * @type {kc.Scene}
	 */
	currentScene: null,

	/**
	 * 上一帧系统时间
	 * @description 用来计算每帧间隔
	 * @memberOf! kc.Core#
	 * @private
	 * @type {Number}
	 */
	_lastTime: 0,

	/**
	 * 主循环中需要额外调用的函数列表
	 * @memberOf kc.Core#
	 * @type {Object.<string, function(...*)>}
	 * @private
	 */
	_extraFuncs: {},

	/**
	 * 加载引擎
	 * @param  {Element} element 画布父元素
	 * @param  {Number} width 画布宽
	 * @param  {Number} height 画布高
	 * @param  {Number} mode 适配模式
	 * @memberOf kc.Core#
	 */
	launch: function(element, width, height, mode) {
		var _this = this;

		_this._root = element;
		_this._size.width = width || 960;
		_this._size.height = height || 640;
		_this._mode = mode;

		kc.showGameBanner();

		this.mainLoop();
		
		for(var i = 0;i<100;i++){
			kc.TweenPool.putInPool();
		}

		kc.EngineStart(_this._size.width, _this._size.height, mode, function() {
			var projectData = kc.Project.getProjectData();

			var sceneId = projectData.ResourceText.projectSetting.defaultSceneID;

			var aRes = kc.Project.getResBySceneId(sceneId);

			var ptype = projectData.ResourceText.ptype;
			var key;
			if (ptype == 'vr') {
				key = '3d';
			} else {
				key = '2d';
			}

			var gameEngine = 'cocos2djs';
			if (projectData.ResourceText.projectSetting && projectData.ResourceText.projectSetting.gameEngine) {
				gameEngine = projectData.ResourceText.projectSetting.gameEngine;
			}

			//add for AR by guo_f
			var hasAR = false;
			var _resources = projectData.ResourceText.origin.resources;
			for (var i in _resources) {
				var _resData = _resources[i];
				if(!_resData || !_resData.data || !_resData.data.arInstance) {
					continue;
				}

				for (var j in _resData.data.arInstance) {
					hasAR = true;
					break;
				}

				if(hasAR) {
					cc.renderer._clearColor = cc.color(0, 0, 0, 0);
					break;
				}
			}
			//add end

			var canvas = element.querySelectorAll('canvas')[1];
			if (canvas && canvas.id != "CursorLayer"){
				kc.System.canvas = element.querySelectorAll('canvas')[1];
			}else if(gameEngine == 'crafty'){
				kc.System.canvas = element.querySelectorAll('#cr-stage')[0];
			}else{
				kc.System.canvas = element.querySelectorAll('canvas')[0];
			}
			kc.System.registAllListeners();

			kc.Loader.load(aRes, function() {
				var func = function(){
				  	if (DEBUG){
				  		kc.loadJs(APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + PROJECTID + "&isglobal=1", false, function() {
	                        kc.loadJs(APIRoot + 'gf/sdk/GenTpl/'+projectData.FrameworkVersion+'/' + key + '/RenderScene?userid=' + USERID + '&projectid=' + PROJECTID + '&sceneid=' + sceneId, false, function() {
	                            _this.initPhysics(true);
	                            _this.currentScene = new window['MyScene_' + sceneId]();
	                            _this.currentScene.createObjects();
	                            _this.runScene(_this.currentScene);
	                            kc.hideGameBanner();
	                        });
	                    });
				  	}else{
				  		var _userId = null;
			            if (OWNER && OWNER !=""){
			                _userId = OWNER;
			            }else{
			                _userId = USERID;
			            }		            
	                    var jsScript = '/kcGame.min';
	                    if (CODE_DEBUG && CODE_DEBUG =="true"){
	                    	jsScript = '/kcGame';
	                    }		            
	                    kc.loadJs(ScriptRoot +jsScript+ '.'+BACK_SUFFIX, false, function() {
	                        _this.initPhysics(true);
	                        _this.currentScene = new window['MyScene_' + sceneId]();
	                        _this.currentScene.createObjects();
	                        _this.runScene(_this.currentScene);
	                        kc.hideGameBanner();
	                    });
				  	}
			  	};
                
                setTimeout(func, 800);
			}, function(index) {
				kc.updateGameBanner(index);
				//console.log(index);
			}, function(err) {
				console.log(err);
			});
		});
	},

	/**
	 * 初始化物理世界
	 * @description 只有项目中使用到物理类型组件时才会初始化
	 * @param  {Boolean} hasPhysicsComponent
	 * @private
	 * @memberOf! kc.Core
	 */
	initPhysics: function(hasPhysicsComponent) {
		if (hasPhysicsComponent) {
			var Engine = Matter.Engine;
			var world = Matter.World.create({
				bounds: {
					min: {
						x: -Infinity,
						y: -Infinity
					},
					max: {
						x: Infinity,
						y: Infinity
					}
				}
			});
			kc.PhysicsEngine = Engine.create({
				world: world,
				enableSleeping:true
			});
			kc.PhysicsEngine.MAtterRunner = Matter.Runner.create();
		}
	},

	/**
	 * 物理引擎刷新
	 * @private
	 * @memberOf! kc.Core
	 */
	updatePhysics: function() {
		if (kc.PhysicsEngine){
			Matter.Runner.tick(kc.PhysicsEngine.MAtterRunner,kc.PhysicsEngine,kc.deltaTime*1000);
		}else{
			return;
		}

		var bodies = Matter.Composite.allBodies(kc.PhysicsEngine.world);
		var scaleX = kc.System.canvas.width/kc.Core._size.width;
		var scaleY = kc.System.canvas.height/kc.Core._size.height;
		for (var i = 0; i < bodies.length; i += 1) {
			var bodyBox = bodies[i];

			bodyBox.KCsprite.setPosition(bodyBox.position.x,kc.Core._size.height - bodyBox.position.y,null,"physics");
			bodyBox.KCsprite.setRotation(Math.floor(0.5+bodyBox.angle*180/Math.PI),"physics");
		}

		var context = null;
		var showDebugCanvas = false;
		if (!kc.debugCanvas && showDebugCanvas){
			kc.debugCanvas = document.createElement('canvas');
			kc.debugCanvas.style.position = "absolute";
			kc.debugCanvas.style.left = "0px";
			kc.debugCanvas.style.top = "0px";
			context = kc.debugCanvas.getContext('2d');
	    	context.globalAlpha = 0.1;
			document.body.appendChild(kc.debugCanvas);
		}
		if (showDebugCanvas){
	    	context = kc.debugCanvas.getContext('2d');
			kc.debugCanvas.width = kc.System.canvas.width;
			kc.debugCanvas.height = kc.System.canvas.height;
	    	context.fillRect(0, 0, kc.System.canvas.width, kc.System.canvas.height);
			context.beginPath();
			for (var i = 0; i < bodies.length; i += 1) {
		        var vertices = bodies[i].vertices;

		        context.moveTo(vertices[0].x*scaleX, vertices[0].y*scaleY);

		        for (var j = 1; j < vertices.length; j += 1) {
		            context.lineTo(vertices[j].x*scaleX, vertices[j].y*scaleY);
		        }

		        context.lineTo(vertices[0].x*scaleX, vertices[0].y*scaleY);
		    }

		    context.lineWidth = 1;
		    context.strokeStyle = '#999';
		    context.stroke();
		}
	},

	/**
	 * 运行场景
	 * @memberOf kc.Core#
	 * @private
	 * @param {kc.Scene} 要运行的场景实例
	 */
	runScene: function(scene) {
		scene.run();
	},

	/**
	 * 获取设置的画布大小
	 * @public
	 * @memberOf kc.Core#
	 */
	getWinSize: function() {
		return this._size;
	},

	/**
	 * 切换场景
	 * @memberOf kc.Core#
	 * @public
	 * @param {String} id 场景id
	 * @param {function} callback 切换场景完成后调用的函数
	 */
	changeScene: function(id, callback) {
		var _this = this;

		if (_this._bChanging) {
			console.log('Error: can\'t change scene when anothor scene is changing!');
			return;
		}

		_this._bChanging = true;

		if (_this.currentScene){
			_this.currentScene.clear();
			_this.currentScene = null;
		}

		if (DEBUG) {
			kc.showLoading();

			var aRes = kc.Project.getResBySceneId(id);

			var projectData = kc.Project.getProjectData();

			var ptype = projectData.ResourceText.ptype;
			var key;
			if (ptype == 'vr') {
				key = '3d';
			} else {
				key = '2d';
			}
			
			kc.Loader.load(aRes, function() {

				kc.loadJs(APIRoot + 'gf/sdk/GenTpl/'+projectData.FrameworkVersion+'/' + key + '/RenderScene?userid=' + USERID + '&projectid=' + PROJECTID + '&sceneid=' + id, false, function() {
					kc.hideLoading();
					_this.currentScene = new window['MyScene_' + id]();
					_this.currentScene.createObjects();
					_this.runScene(_this.currentScene);
					_this._bChanging = false;
					if (callback) {
						callback();
					}
				});
			}, function(index) {
				//console.log(index);
			}, function(err) {
				console.log(err);
			});
		} else {
			kc.showLoading();

			var aRes = kc.Project.getResBySceneId(id);
			kc.Loader.load(aRes, function() {
				kc.hideLoading();
				_this.currentScene = new window['MyScene_' + id]();
				_this.currentScene.createObjects();
				_this.runScene(_this.currentScene);
				_this._bChanging = false;
				if (callback) {
					callback();
				}
			}, function(index) {
				//console.log(index);
			}, function(err) {
				console.log(err);
			});
		}
	},

	/**
	 * 添加额外循环函数
	 * @public
	 * @memberOf kc.Core#
	 * @param {String} key    唯一标识
	 * @param {function} func   执行的函数
	 * @param {?Object} target 函数执行时的上下文
	 */
	addExtraFunction: function(key, func, target) {
		this._extraFuncs[key] = {
			target: target,
			selector: func
		};
	},

	/**
	 * 额外主循环函数
	 * @private
	 * @memberOf kc.Core#
	 */
	mainLoopExtra: function() {
		for (var i in this._extraFuncs) {
			var one = this._extraFuncs[i];
			if (one.target) {
				one.selector.call(one.target);
			} else {
				one.selector();
			}
		}
	},

	/**
	 * 引擎主循环
	 * @private
	 * @memberOf kc.Core#
	 */
	mainLoop: function() {

		var now = Date.now();
		kc.deltaTime = (now - kc.Core._lastTime) / 1000;
		kc.deltaTimetest = now;
		kc.Core.updatePhysics();

		TWEEN.update();

		kc.scheduleManager.updateSchedule();
		kc.CollisionManager.updateCollision();
		kc.NetManager.update();
		kc.TweenPool.update();

		if (kc.Core.currentScene != null) {
			kc.Core.currentScene.update();
		}

		kc.Core.mainLoopExtra();

		kc.Core._lastTime = now;

		requestAnimationFrame(kc.Core.mainLoop);
	}
};

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Loader
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * 加载管理器
 * @class LoadingManager
 * @name kc.LoadingManager
 * @memberOf! kc#
 * @private
 * @param {function} onLoad 加载完成调用函数
 * @param {function} onProgress 下载进度改变调用函数
 * @param {function} onError 下载出错调用函数
 */
kc.LoadingManager = function(onLoad, onProgress, onError) {

    var scope = this;

    var isLoading = false,
        itemsLoaded = 0,
        itemsTotal = 0;

    this.onStart = undefined;
    this.onLoad = onLoad;
    this.onProgress = onProgress;
    this.onError = onError;

    this.itemStart = function(url) {

        itemsTotal++;

        if (isLoading === false) {
            if (scope.onStart !== undefined) {
                scope.onStart(url, itemsLoaded, itemsTotal);
            }
        }

        isLoading = true;
    };

    this.itemEnd = function(url) {

        itemsLoaded++;

        if (scope.onProgress !== undefined) {
            scope.onProgress(url, itemsLoaded, itemsTotal);
        }

        if (itemsLoaded === itemsTotal) {

            isLoading = false;

            if (scope.onLoad !== undefined) {
                scope.onLoad();
            }
        }
    };

    this.itemError = function(url) {

        if (scope.onError !== undefined) {
            scope.onError(url);
        }
    };
};

/**
 * 默认加载管理器
 * @private
 * @type {kc.LoadingManager}
 * @memberOf kc#
 */
kc.DefaultLoadingManager = new kc.LoadingManager();

/**
 * 图片下载器
 * @class ImageLoader
 * @name kc.ImageLoader
 * @private
 * @param {kc.LoadingManager} manager 管理器
 */
kc.ImageLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : kc.DefaultLoadingManager;
};

/**
 * 加载图片
 * @function load
 * @name load
 * @memberof kc.ImageLoader#
 * @private
 * @param  {String} url 图片下载地址
 * @param  {function|NULL} onLoad 下载完成调用函数
 * @param  {function|NULL} onProgress 进度改变调用函数
 * @param  {function|NULL} onError 发生错误调用函数
 * @return {Image} HTML Image 对象
 */
kc.ImageLoader.prototype.load = function(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) {
        url = this.path + url;
    }

    var scope = this;

    var cached = kc.Cache.files[url];

    if (cached !== undefined) {

        scope.manager.itemStart(url);

        if (onLoad) {

            setTimeout(function() {

                onLoad(cached);

                scope.manager.itemEnd(url);

            }, 0);

        } else {

            scope.manager.itemEnd(url);

        }

        return cached;

    }

    if (onProgress !== undefined) {

        image.addEventListener('progress', function(event) {
            onProgress(event);
        }, false);

    }

    scope.manager.itemStart(url);

    scope._tryLoad(url, onLoad, onProgress, onError,0);

};

kc.ImageLoader.prototype._tryLoad =function(url, onLoad, onProgress, onError,times){
    var image = new Image();
    var scope = this;
    // if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;

    image.addEventListener('load', function(event) {
        kc.Cache.add(url, this);
        if (onLoad) {
            onLoad(this);
        }
        scope.manager.itemEnd(url);
    }, false);
 
    image.addEventListener('error', function(event) {
        if (times < 5){
            scope._tryLoad(url, onLoad, onProgress, onError,times+1);
        }else{
            if (onError) onError(event);

            scope.manager.itemError(url);
        }
    }, false);

    if (GAMEENGINE != 'crafty') {
        image.crossOrigin = "Anonymous";      
    }
    
    image.src = url;
};

/**
 * 跨域设置
 * @private
 * @memberOf! kc.ImageLoader
 * @param  {String} value 跨域值
 */
kc.ImageLoader.prototype.setCrossOrigin = function(value) {
    this.crossOrigin = value;
};

/**
 * 基础路径设置
 * @private
 * @memberOf! kc.ImageLoader
 * @param {String} 基础路径
 */
kc.ImageLoader.prototype.setPath = function(value) {
    this.path = value;
};

/**
 * 默认图片下载器
 * @private
 * @type {kc.ImageLoader}
 * @memberOf kc#
 */
kc.defaultImageLoader = new kc.ImageLoader();

/**
 * 脚本下载器
 * @class ScriptLoader
 * @private
 * @param {kc.LoadingManager} manager 管理器
 * @memberOf kc#
 * @name kc.ScriptLoader
 */
kc.ScriptLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : kc.DefaultLoadingManager;
};

/**
 * 加载脚本
 * @public
 * @function load
 * @name load
 * @memberof! kc.ScriptLoader#
 * @private
 * @param  {String} url 脚本地址
 * @param  {Function|NULL} onLoad 下载成功调用函数
 * @param  {Function|NULL} onProgress 进度改变调用函数
 * @param  {Function|NULL} onError 错误调用函数
 * @return {HTMLScriptElement} script标签对象
 */
kc.ScriptLoader.prototype.load = function(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) {
        url = this.path + url;
    }

    var scope = this;

    var cached = kc.Cache.files[url];

    if (cached !== undefined) {

        scope.manager.itemStart(url);

        if (onLoad) {

            setTimeout(function() {

                onLoad(cached);

                scope.manager.itemEnd(url);

            }, 0);

        } else {

            scope.manager.itemEnd(url);

        }

        return cached;

    }

    if (onProgress !== undefined) {

        script.addEventListener('progress', function(event) {
            onProgress(event);
        }, false);

    }

    scope.manager.itemStart(url);

    scope._tryLoad(url, onLoad, onProgress, onError,0);
};

kc.ScriptLoader.prototype._tryLoad =function(url, onLoad, onProgress, onError,times){
    var script = document.createElement('script');
    var scope = this;
    var loadFun = null;
    var errorFun = null;

    loadFun = function(event) {
        kc.Cache.add(url, true);
        if (onLoad) {
            onLoad(this);
        }
        scope.manager.itemEnd(url);

        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }

        this.removeEventListener('load', loadFun, false);
        this.removeEventListener('error', errorFun, false);
    };
    script.addEventListener('load', loadFun, false);

    errorFun = function(event) {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        this.removeEventListener('load', loadFun, false);
        this.removeEventListener('error', errorFun, false);

        if (times < 5){
            scope._tryLoad(url, onLoad, onProgress, onError,times+1);
        }else{
            if (onError) onError(event);
            scope.manager.itemError(url);
        }

    };
    script.addEventListener('error', errorFun, false);
    script.src = url;
    document.body.appendChild(script);

};

/**
 * 基础路径设置
 * @private
 * @memberOf! kc.ScriptLoader
 * @param {String} value 基础路径
 */
kc.ScriptLoader.prototype.setPath = function(value) {
    this.path = value;
};

/**
 * 默认脚本下载器
 * @private
 * @type {kc.ScriptLoader}
 */
kc.defaultScriptLoader = new kc.ScriptLoader();

/**
 * 音频下载器
 * @class AudioLoader
 * @private
 * @param {kc.LoadingManager} manager 管理器
 * @memberOf kc#
 * @name kc.AudioLoader
 */
kc.AudioLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : kc.DefaultLoadingManager;
};

/**
 * 加载音频
 * @function load
 * @name load
 * @memberof! kc.AudioLoader#
 * @private
 * @param  {String} url 音频文件地址
 * @param  {Function|NULL} onLoad 下载成功调用函数
 * @param  {Function|NULL} onProgress 进度改变调用函数
 * @param  {Function|NULL} onError 错误调用函数
 */
kc.AudioLoader.prototype.load = function(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) {
        url = this.path + url;
    }

    var scope = this;

    var cached = kc.Cache.files[url];

    if (cached !== undefined) {

        scope.manager.itemStart(url);

        if (onLoad) {

            setTimeout(function() {

                onLoad(cached);

                scope.manager.itemEnd(url);

            }, 0);

        } else {

            scope.manager.itemEnd(url);

        }

        return cached;

    }

    scope.manager.itemStart(url);
    scope._tryLoad(url, onLoad, onProgress, onError,0);
    
};

kc.AudioLoader.prototype._tryLoad = function(url, onLoad, onProgress, onError,times){
    var scope = this;
    var httpRequest = new kc.getXMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.responseType = "arraybuffer";
    httpRequest.onreadystatechange = function() {
          if (httpRequest.readyState == 4 && (httpRequest.status == 200 || httpRequest.status == 0)) {
            var data = httpRequest.response;
            var timer = null;
            kc.System.AudioContext.decodeAudioData(data, function(buffer) {
                timer && window.clearTimeout(timer);
                var info = {
                    url: url,
                    buffer: buffer
                };
                kc.Cache.add(url, info);
                if (onLoad) {
                    onLoad(info);
                }
                scope.manager.itemEnd(url);
            }, function(err) {
                if (err && onError) onError(event);

                scope.manager.itemError(url);
            });
            timer = setTimeout(function() {
                onLoad && onLoad();
                scope.manager.itemEnd(url);
            }, 30000);
        }else if(httpRequest.readyState == 4 && httpRequest.status != 200){
            if (times < 5){
                httpRequest.abort();
                scope._tryLoad(url, onLoad, onProgress, onError,times+1);
            }else{               
                if (onError) onError(httpRequest.status);
                scope.manager.itemError(url);
            }
        }
    };
    httpRequest.send();
};

/**
 * 跨域设置
 * @private
 * @memberOf! kc.AudioLoader
 * @param  {String} value 跨域值
 */
kc.AudioLoader.prototype.setCrossOrigin = function(value) {
    this.crossOrigin = value;
};

/**
 * 基础路径设置
 * @private
 * @memberOf! kc.AudioLoader
 * @param {String} value 基础路径
 */
kc.AudioLoader.prototype.setPath = function(value) {
    this.path = value;
};
/**
 * 默认音频下载器
 * @private
 * @type {kc.AudioLoader}
 */
kc.defaultAudioLoader = new kc.AudioLoader();

/**
 * fnt下载器
 * @class FntLoader
 * @private
 * @param {kc.LoadingManager} manager 管理器
 * @author mrdoob / http://mrdoob.com/
 */
kc.FntLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : kc.DefaultLoadingManager;
};

/**
 * 下载fnt
 * @private
 * @function load
 * @name load
 * @memberof! kc.FntLoader#
 * @param  {String} url        Audio url
 * @param  {Function|NULL} onLoad     onLoad hanlder
 * @param  {Function|NULL} onProgress onProgress hanlder
 * @param  {Function|NULL} onError    onError hanlder
 * @return {Image}            DomImage instance
 */
kc.FntLoader.prototype.load = function(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) {
        url = this.path + url;
    }

    var scope = this;

    var cached = kc.Cache.files[url];

    if (cached !== undefined) {

        scope.manager.itemStart(url);

        if (onLoad) {

            setTimeout(function() {

                onLoad(cached);

                scope.manager.itemEnd(url);

            }, 0);

        } else {

            scope.manager.itemEnd(url);

        }

        return cached;

    }
    scope.manager.itemStart(url);
    scope._tryLoad(url, onLoad, onProgress, onError,0);
};

kc.FntLoader.prototype._tryLoad = function(url, onLoad, onProgress, onError,times){
    var scope = this;
    var httpRequest = new kc.getXMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && (httpRequest.status == 200 || httpRequest.status == 0)) {
            var data = httpRequest.response;
            var stringToXML = function(xmlData) {
                var xmlDoc = null;
               if (window.ActiveXObject) {
                  //for IE
                  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                  xmlDoc.async="false";
                  xmlDoc.loadXML(xmlData);
                  return xmlDoc;
               }
               else if (document.implementation && document.implementation.createDocument) {
                  //for Mozila
                  var parser=new DOMParser();
                  xmlDoc=parser.parseFromString(xmlData,"text/xml");
                  return xmlDoc;
               }
            };
            var data1 = stringToXML(data);
            kc.Cache.add(url, data1);
            if (onLoad) {
                onLoad(this);
            }
            scope.manager.itemEnd(url);
        }else if(httpRequest.readyState == 4 && httpRequest.status != 200){
            if (times < 5){
                httpRequest.abort();
                scope._tryLoad(url, onLoad, onProgress, onError,times+1);
            }else{               
                if (onError) onError(httpRequest.status);
                scope.manager.itemError(url);
            }
        }
    };
    httpRequest.send();
};

/**
 * 跨域设置
 * @private
 * @memberOf! kc.FntLoader
 * @param  {String} value        crossOrigin value
 */
kc.FntLoader.prototype.setCrossOrigin = function(value) {
    this.crossOrigin = value;
};

/**
 * 基础路径设置
 * @private
 * @memberOf! kc.FntLoader
 * @param {String} value base path
 */
kc.FntLoader.prototype.setPath = function(value) {
    this.path = value;
};
/**
 * 默认fnt下载器
 * @private
 * @type {kc.FntLoader}
 */
kc.defaultFntLoader = new kc.FntLoader();


/**
 * ApplicationLoader下载器********************************************************************
 * @class ApplicationLoader
 * @private
 * @param {kc.LoadingManager} manager 管理器
 * @author mrdoob / http://mrdoob.com/
 */
kc.ApplicationLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : kc.DefaultLoadingManager;
};

/**
 * 应用下载
 * @private
 * @function load
 * @name load
 * @memberof! kc.ApplicationLoader#
 * @param  {String} url        ApplicationLoader url
 * @param  {Function|NULL} onLoad     onLoad hanlder
 * @param  {Function|NULL} onProgress onProgress hanlder
 * @param  {Function|NULL} onError    onError hanlder
 * @return {Image}            DomImage instance
 */
kc.ApplicationLoader.prototype.load = function(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) {
        url = this.path + url;
    }
    var scope = this;
    var cached = kc.Cache.files[url];
    if (cached !== undefined) {
        scope.manager.itemStart(url);
        if (onLoad) {
            setTimeout(function() {
                onLoad(cached);
                scope.manager.itemEnd(url);
            }, 0);
        } else {
            scope.manager.itemEnd(url);
        }
       return cached;
    }
    scope.manager.itemStart(url);
    scope._tryLoad(url, onLoad, onProgress, onError,0);
};

kc.ApplicationLoader.prototype._tryLoad = function(url, onLoad, onProgress, onError,times){
    var scope = this;
    var httpRequest = new kc.getXMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && (httpRequest.status == 200 || httpRequest.status == 0)) {
            var data = httpRequest.response;
            kc.Cache.add(url, data);
            if (onLoad) {
                onLoad(this);
            }
            if (scope.manager){
                scope.manager.itemEnd(url);
            }       
        }else if(httpRequest.readyState == 4 && httpRequest.status != 200){
            if (times < 5){
                httpRequest.abort();
                scope._tryLoad(url, onLoad, onProgress, onError,times+1);
            }else{               
                if (onError) onError(httpRequest.status);
                scope.manager.itemError(url);
            }
        }
    };
    httpRequest.send();
};

/**
 * 跨域设置
 * @private
 * @memberOf! kc.ApplicationLoader
 * @param  {String} value 跨域值
 */
kc.ApplicationLoader.prototype.setCrossOrigin = function(value) {
    this.crossOrigin = value;
};

/**
 * 基础路径设置
 * @private
 * @memberOf! kc.ApplicationLoader
 * @param {String} value 基础路径
 */
kc.ApplicationLoader.prototype.setPath = function(value) {
    this.path = value;
};
/**
 * 默认应用下载器
 * @private
 * @type {kc.ApplicationLoader}
 * @memberOf kc#
 */
kc.defaultApplicationLoader = new kc.ApplicationLoader();

/**
 * plist下载器
 * @class PlistLoader
 * @private
 * @param {kc.LoadingManager} manager 管理器
 * @author mrdoob / http://mrdoob.com/
 */
kc.PlistLoader = function(manager) {
    this.manager = (manager !== undefined) ? manager : kc.DefaultLoadingManager;
};

/**
 * 下载plist
 * @private
 * @function load
 * @name load
 * @memberof! kc.PlistLoader#
 * @param  {String} url        Audio url
 * @param  {Function|NULL} onLoad     onLoad hanlder
 * @param  {Function|NULL} onProgress onProgress hanlder
 * @param  {Function|NULL} onError    onError hanlder
 * @return {Image}            DomImage instance
 */
kc.PlistLoader.prototype.load = function(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) {
        url = this.path + url;
    }

    var scope = this;

    var cached;

    var name = url.substr(url.lastIndexOf('/')+1);
    name = name.substring(0,name.lastIndexOf('.'));
    var plistFiles = kc.Cache.plistFiles;
    for (var i = 0; i < plistFiles.length; i++) {
        var one = plistFiles[i].realTextureFileName;
        var plistname = one.substring(0,one.lastIndexOf('.'));
        if(plistname == name ){
            cached = plistFiles[i];
        }
    }

    if (cached !== undefined) {

        scope.manager.itemStart(url);

        if (onLoad) {

            setTimeout(function() {

                onLoad(cached);

                scope.manager.itemEnd(url);

            }, 0);

        } else {

            scope.manager.itemEnd(url);

        }

        return cached;

    }
    scope.manager.itemStart(url);
    scope._tryLoad(url, onLoad, onProgress, onError,0);
};

/**
 * 下载plist 文件
 * @param url  文件地址
 * @param onLoad
 * @param onProgress
 * @param onError
 * @param times
 * @private
 */
kc.PlistLoader.prototype._tryLoad = function(url, onLoad, onProgress, onError,times){
    var scope = this;
    var httpRequest = new kc.getXMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && (httpRequest.status == 200 || httpRequest.status == 0)) {
            var data = httpRequest.response;
            var data1 = kc.PlistParser.parse(data);
            kc.FrameCache.addData(kc.Cache.plistFiles,data1);
            if (onLoad) {
                onLoad(this);
            }
            scope.manager.itemEnd(url);
        }else if(httpRequest.readyState == 4 && httpRequest.status != 200){
            if (times < 5){
                httpRequest.abort();
                scope._tryLoad(url, onLoad, onProgress, onError,times+1);
            }else{
                if (onError) onError(httpRequest.status);
                scope.manager.itemError(url);
            }
        }
    };
    httpRequest.send();
};

/**
 * 跨域设置
 * @private
 * @memberOf! kc.PlistLoader
 * @param  {String} value        crossOrigin value
 */
kc.PlistLoader.prototype.setCrossOrigin = function(value) {
    this.crossOrigin = value;
};

/**
 * 基础路径设置
 * @private
 * @memberOf! kc.PlistLoader
 * @param {String} value base path
 */
kc.PlistLoader.prototype.setPath = function(value) {
    this.path = value;
};
/**
 * 默认fnt下载器
 * @private
 * @type {kc.PlistLoader}
 */
kc.defaultPlistLoader = new kc.PlistLoader();



/**
 * 下载器
 * @class Loader
 * @name kc.Loader
 * @public
 * @memberOf kc#
 */
kc.Loader = {

    /**
     * 注册类型
     * @type {Object}
     */
    loaderType: {
        '.png': kc.defaultImageLoader,
        '.jpg': kc.defaultImageLoader,
        '.gif': kc.defaultImageLoader,
        '.js': kc.defaultScriptLoader
    },

    /**
     * 下载资源
     * @memberOf! kc.Loader#
     * @public
     * @param  {Array.<string>} urls       下载资源地址列表
     * @param  {function} onLoad     下载成功调用函数
     * @param  {function} onProgress 进度改变调用函数
     * @param  {function} onError    下载失败调用函数
     */
    load: function(urls, onLoad, onProgress, onError) {
        var _this = this;

        if (Object.prototype.toString.call(urls) == '[object Object]') {
            var tmp = urls;
            urls = [tmp];
        }

        if (urls.length === 0) {
            if (onLoad) {
                onLoad();
            }
        }

        var loaded = 0;
        var len = urls.length;
        var loadRes = function(loaded) {
        	var one = urls[loaded];
            var url = one.url;
            var dLoadUrl = document.getElementById("loadUrl");
            dLoadUrl.textContent = url;
            if (one.type == 'image') {
                var extname = kc.extname(url);

                var loader = _this.loaderType[extname];
                if (loader) {
                    _this.loaderType[extname].load(url, function() {
                    	console.log(url);
                        loaded++;
                        if (onProgress) {
                            onProgress(loaded);
                        }

                        if (loaded >= len) {
                            if (onLoad) {
                                onLoad();
                            }
                        } else {
                        	loadRes(loaded);
                        } 
                    }, undefined, function(err) {
                        if (onError) {
                            onError(err);
                        }
                    });
                } else {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded);
                    }
                    if (loaded >= len) {
                        if (onLoad) {
                            onLoad();
                        }
                    }
                }
            } else if (one.type == 'script') {
                var loader = kc.defaultScriptLoader;
                if (loader) {
                    loader.load(url, function() {
                    	console.log(url);
                        loaded++;
                        if (onProgress) {
                            onProgress(loaded);
                        }

                        if (loaded >= len) {
                            if (onLoad) {
                                onLoad();
                            }
                        } else {
                        	loadRes(loaded);
                        } 
                    }, undefined, function(err) {
                        if (onError) {
                            onError(err);
                        }
                    });
                } else {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded);
                    }
                    if (loaded >= len) {
                        if (onLoad) {
                            onLoad();
                        }
                    }
                }
            } else if (one.type == 'audio') {
                var loader = kc.defaultAudioLoader;
                if (loader) {
                    loader.load(url, function() {
                   		 console.log(url);
                        loaded++;
                        if (onProgress) {
                            onProgress(loaded);
                        }

                        if (loaded >= len) {
                            if (onLoad) {
                                onLoad();
                            }
                        } else {
                        	loadRes(loaded);
                        } 
                    }, undefined, function(err) {
                        if (onError) {
                            onError(err);
                        }
                    });
                } else {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded);
                    }
                    if (loaded >= len) {
                        if (onLoad) {
                            onLoad();
                        }
                    }
                }
            }else if (one.type == 'fnt') {
                var loader = kc.defaultFntLoader;
                if (loader) {
                    loader.load(url, function() {
                    	 console.log(url);
                        loaded++;
                        if (onProgress) {
                            onProgress(loaded);
                        }

                        if (loaded >= len) {
                            if (onLoad) {
                                onLoad();
                            }
                        } else {
                        	loadRes(loaded);
                        } 
                    }, undefined, function(err) {
                        if (onError) {
                            onError(err);
                        }
                    });
                } else {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded);
                    }
                    if (loaded >= len) {
                        if (onLoad) {
                            onLoad();
                        }
                    }
                }
            }else if (one.type == 'application') {
                var loader = kc.defaultApplicationLoader;
                if (loader) {
                    loader.load(url, function() {
                     console.log(url);
                        loaded++;
                        if (onProgress) {
                            onProgress(loaded);
                        }

                        if (loaded >= len) {
                            if (onLoad) {
                                onLoad();
                            }
                        } else {
                        	loadRes(loaded);
                        } 
                    }, undefined, function(err) {
                        if (onError) {
                            onError(err);
                        }
                    });
                } else {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded);
                    }
                    if (loaded >= len) {
                        if (onLoad) {
                            onLoad();
                        }
                    }
                }
            }else if (one.type == 'plist') {
                var loader = kc.defaultPlistLoader;
                if (loader) {
                    loader.load(url, function() {
                     console.log(url);
                        loaded++;

                        if (onProgress) {
                            onProgress(loaded);
                        }

                        if (loaded >= len) {
                            if (onLoad) {
                                onLoad();
                            }
                        } else {
                        	loadRes(loaded);
                        } 
                    }, undefined, function(err) {
                        if (onError) {
                            onError(err);
                        }
                    });
                } else {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded);
                    }
                    if (loaded >= len) {
                        if (onLoad) {
                            onLoad();
                        }
                    }
                }
            }
        }

       loadRes(0);
       var dTotalCount = document.getElementById("totalCount");
       dTotalCount.textContent = len;
       console.log("total:", len);
    }
};

kc.Loader.loaderType['.'+ BACK_SUFFIX] = kc.defaultScriptLoader;
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Macro.js
 * @author Chang Fei
 */

/**
 * @namespace
 */
var kc = kc || {};

kc.Macro = kc.Macro || {};
    
kc.Macro.ActionTo = 10000;
kc.Macro.ActionBy = 10001;

kc.Macro.Event_Start = 0;
//键盘按键表
kc.Macro.KeyBoardList = {
    0: 'none',
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause',
    20: 'capslock',
    27: 'escape',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    96: 'num0',
    97: 'num1',
    98: 'num2',
    99: 'num3',
    100: 'num4',
    101: 'num5',
    102: 'num6',
    103: 'num7',
    104: 'num8',
    105: 'num9'
};
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Object.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.Object is the Object of game, contains all the components.<br/>
 * <br/>
 * example<br/>
 * // create kc.Object<br/>
 * var object = new kc.Object();<br/>
 * </p>
 * @class
 * @name kc.Object
 * @extends kc.Class
 */

kc.Object = kc.Class.extend({

	/**
	 * object list of all the components
	 * @type {Object}
	 * @private
	 * @memberof! kc.Object#
	 */
	components: null,

	/**
	 * parent of the object
	 * @type {Scene|Object}
	 * @memberof! kc.Object#
	 */
	parent: null,

	/**
	 * children list of the object
	 * @memberof! kc.Object#
	 * @type {Array}
	 */
	children: null,

	/**
	 * tag of this object
	 * @type {String}
	 * @private
	 * @memberof! kc.Object#
	 */
	tag: null,

	/**
	 * zOrder
	 * @type {Number}
	 * @memberof! kc.Object#
	 */
	zOrder:0,

	/**
	 * the engine object
	 * @private
	 * @memberOf! kc.Object#
	 */
	engineObject: null,

	/**
	 * 被打击目标
	 * hit target
	 * @type {Boolean}
	 * @memberOf! kc.Object#
	 */
	hitTarget:null,

	/**
	 * 对象尺寸大小
	 * object size
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	size:null,

	/**
	 * 锚点
	 * anchor size
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	anchor:null,

	/**
	 * 缩放百分比
	 * scale size
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	scale:null,

	/**
	 * 坐标点
	 * position size
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	position:null,

	/**
	 * 角度
	 * rotation size
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	rotation:null,

	/**
	 * 倾斜
	 * skew size
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	skew: null,

	/**
	 * 透明度
	 * alpha value
	 * @type {Object}
	 * @memberOf! kc.Object#
	 */
	alpha:null,

	/**
	 * 是否可见
	 * visible value
	 * @type {Boolean}
	 * @memberOf! kc.Object#
	 */
	visible:null,

	/**
	 * 翻转
	 * flip
	 * @memberOf! kc.Object#
	 */
	flip:null,

	/**
	 * tween list
	 * @memberOf! kc.Object#
	 */
	tweenList:null,

	/**
	 * schedule list
	 * @memberOf! kc.Object#
	 */
	scheduleList:null,

	/**
	 * group
	 * @memberOf! kc.Object#
	 */
	group:"默认",

	/**
	 * instruct list
	 * @memberOf! kc.Object#
	 */
	instructList: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;

		_this.components = {};
		_this.logics = {};
		_this.engineObject = new kc.EngineObject();
		_this.children = [];
		_this.tweenList = [];
		_this.scheduleList = [];
		_this.instructList = {};

		_this.size = {width:0,height:0};
		_this.anchor = {x:0.5,y:0.5};
		_this.scale = {x:1,y:1};
		_this.position = {x:0,y:0,z:0};
		_this.rotation = {x:0};
		_this.flip = {x:false,y:false};
		_this.skew = {x:0,y:0};
	},

	/**
	 * 设置对象属于哪个组
	 * set the object group
	 * @memberOf! kc.Object#
	 * @param {string} group
	 */
	setGroup:function(group){
		this.group = group || this.group;
	},

	/**
	 * 注册指令
	 * Registration instructions
	 * @param {String} instruct
	 * @param {Function} func
	 */
	subscribe : function(instruct,func){
		var notifyToken = NotifyCenter.getInstance().subscribe(instruct,func);

		if(!this.instructList[instruct]){
			this.instructList[instruct] = [];
		}
		this.instructList[instruct].push(notifyToken);
	},

	/**
	 * 给自己发布一个指令
	 * Issued a directive to oneself
	 * @param {String} instruct
	 */
	publish : function(instruct){
		var temp = this.instructList[instruct];
		if(!temp)return;

		for(var i = 0;i < temp.length;i ++){
			NotifyCenter.getInstance().publishByToken(temp[i]);
		}
	},

	/**
	 * 为自己清除一个指令
	 * To remove an instruction
	 * @param {String} instruct
	 */
	clearInstruct : function(instruct){
		var temp = this.instructList[instruct];
		if(!temp){return};

		for(var i = 0;i < temp.length;i ++){
			NotifyCenter.getInstance().unsubscribe(temp[i]);
		}
		delete this.instructList[instruct];
	},

	/**
	 * 设置对象大小
	 * set the object size
	 * @memberOf! kc.Object#
	 * @param {Number} width
	 * @param {Number} height
	 */
	setSize:function(width,height){
		var _this = this;
		_this.size.width = width;
		_this.size.height = height;
	},

    /**
     * 获取对象大小
     */
    getSize: function(){
        return this.size;
    },


    /**
	 * 设置锚点大小,并且遍历派发需要锚点的组件
	 * set the anchor and dispatch anchor position
	 * @memberOf! kc.Object#
	 * @param {Number} x
	 * @param {Number} y
	 */
	setAnchor:function(x,y){
		var _this = this;
		_this.anchor.x = typeof(x) =="number" ? x : _this.anchor.x;
		_this.anchor.y = typeof(y) =="number" ? y : _this.anchor.y;
		_this.anchor.z = typeof(z) =="number" ? z : _this.anchor.z;
		for (var k in _this.components){
			if (k != "Anchor"){
				var componentList = _this.components[k];
				var count = componentList.length;
				if(count > 0){
					for (var i=count; i>0 ;i--) {
						var component =  componentList[i-1];
						component._setAnchorPoint && component._setAnchorPoint(_this.anchor.x,_this.anchor.y);
					}
				}
			}
		}
	},

    /**
     * 获取对象锚点
     * @returns {Object}
     */
    getAnchor: function(){
        return this.anchor;
    },

	/**
	 * 设置缩放百分比
	 * set the scale
	 * @memberOf! kc.Object#
	 * @param {Number} x
	 * @param {Number} y
	 */
	setScale:function(x,y){
		var _this = this;
		_this.scale.x = typeof(x) =="number" ? x : _this.scale.x;
		_this.scale.y = typeof(y) =="number" ? y : _this.scale.y;
		_this.scale.z = typeof(z) =="number" ? z : _this.scale.z;
		_this.engineObject.setScale(_this.scale.x, _this.scale.y, _this.scale.z);
	},

	_traverseZorder:function(z){
		var _this = this;

		var index = _this.parent.children.indexOf(_this);
		var obj = null;
		if (index >=0){
			obj = _this.parent.children[index];
			_this.parent.children.splice(index,1);
		}else{
			console.error("is not child");
			return;
		}

		var _index;
		for(_index =_this.parent.children.length;_index > 0;_index--){
			var child = _this.parent.children[_index-1];
			if (child.zOrder > z) continue;
		 	else if (child.zOrder == z || child.zOrder < z) break;
		}

		_this.parent.children.splice(_index,0,obj);
		obj.zOrder = z;
	},

	/**
	 * 设置坐标点
	 * set the position size
	 * @memberOf! kc.Object#
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 */
	setPosition:function(x,y,z){
		var _this = this;
		_this.position.x = typeof(x) =="number" ? x : _this.position.x;
		_this.position.y = typeof(y) =="number" ? y : _this.position.y;
		_this.position.z = typeof(z) =="number" ? z : _this.position.z;
		_this.engineObject.setPosition(_this.position.x, _this.position.y, _this.position.z);
		_this.setZOrder(_this.position.z);
		_this._traverseZorder(_this.position.z);
		var arg = arguments[3];
		if (!arg || arg != "physics"){
			var component  = _this.getComponents("PhysicsBox") || _this.getComponents("PhysicsCircle");
			if (component[0]){
				component[0].setPhysicsPosition({x:_this.position.x, y:_this.position.y});
			}
		}
	},

	/**
	 * 设置角度
	 * set the rotation
	 * @memberOf! kc.Object#
	 * @param {Number} Rotation
	 */
	setRotation:function(Rotation){
		var _this = this;
	
		var rotation = _this.rotation, arg = arguments[1];
		if(Rotation.constructor == Number) {
			_this.rotation.x = Rotation;
		}

		_this.engineObject.setRotation(rotation.x, rotation.y, rotation.z);

		if (!arg || arg != "physics"){
			var component  = _this.getComponents("PhysicsBox") || _this.getComponents("PhysicsCircle");
			if (component[0]){
				component[0].setPhysicsAngle(_this.rotation.x);
			}
		}
	},

	/**
	 * 设置倾斜度
	 * set the skew
	 * @memberOf! kc.Object#
	 * @param {Number} x
	 * @param {Number} y
	 */
	setSkew:function(x,y){
		var _this = this;
		_this.skew.x = typeof(x) =="number" ? x : _this.skew.x;
		_this.skew.y = typeof(y) =="number" ? y : _this.skew.y;
		_this.engineObject.setSkew(_this.skew.x , _this.skew.y);
	},

	/**
	 * 设置透明度
	 * set the alpha
	 * @memberOf! kc.Object#
	 * @param {Number} valueNumber
	 */
	setAlpha:function(valueNumber){
		var _this = this;
		_this.alpha = valueNumber;
		_this.engineObject.setAlpha(_this.alpha);
	},

	/**
	 * 设置翻转水平方向
	 * @memberOf! kc.Object#
	 */
	setFlipX:function(boolX){
		var _this = this;
		_this.flip.x = boolX;
		_this.engineObject.setFlipX(_this.flip.x);
	},

	/**
	 * 设置翻转垂直方向
	 * @memberOf! kc.Object#
	 */
	setFlipY:function(boolY){
		var _this = this;
		_this.flip.y = boolY;
		_this.engineObject.setFlipY(_this.flip.y);
	},

	/**
     * set Visible
     * @param {Boolean} visible
     * @memberOf! kc.Object#
     */
	setVisible:function(visible){
		var _this = this;
		_this.visible = visible;
		_this.engineObject.setVisible(visible);
	},

	/**
     * set zOrder
     * @param {Boolean} visible
     * @memberOf! kc.Object#
     */
    setZOrder:function(ZOrder){
		var _this = this;
		_this.position.z = typeof(ZOrder) =="number" ? ZOrder : _this.position.z;
		_this.zOrder = _this.position.z;
		_this.engineObject.setZOrder(_this.position.z);
		_this._traverseZorder(_this.position.z);
	},

	/**
	 * add a component to this object
	 * @memberof! kc.Object#
	 * @public
	 * @param {String} key       component key
	 * @param {kc.Component} component a component instance
	 */
	addComponent: function (key, component) {
		var _this = this;

		if(!_this.components[key]) {
			_this.components[key] = [];
		}

		_this.components[key].push(component);

		component.gameObject = _this;

		if(component.onAwake) {
			component.onAwake();
		}
	},

	/**
	 * remove a component
	 * @memberOf! kc.Object#
	 * @public
	 * @param {kc.Component} component component to remove
	 * @param {Bool} bCleanup if destory the component
	 */
	removeComponent: function(component, bCleanup) {
		var _this = this;
		bCleanup === undefined ? true : false;
		for (var key in _this.components) {
			if (_this.components[key]){
				for (var i = 0, len = _this.components[key].length; i < len; i++) {
					if (_this.components[key][i] && _this.components[key][i] === component) {
						_this.components[key].splice(i, 1);
						if (_this.components[key].length == 0) {
							delete _this.components[key];
						}
						component.gameObject = null;
						break;
					}
				}
			}
		}
	},

	/**
	 * remove all components
	 * @memberOf! kc.Object#
	 */
	removeAllComponents: function() {
		var _this = this;

		for(var key in _this.components){
			var oneComponent = _this.components[key];
			if (oneComponent){
				for (var ii = 0; oneComponent.length > ii; ii++) {
					if (oneComponent[ii]){
						oneComponent[ii].clear();
					}			
				}
				oneComponent.length = 0;
			}
		}
		
		_this.components = {};
	},

	/**
	 * remove all components by the key
	 * @memberOf! kc.Object#
	 * @public
	 * @param  {String} key of components to remove
	 * @param {Bool} bCleanup if destory the components
	 */
	removeComponents: function(key, bCleanup) {
		var _this = this;
		if (_this.components[key]) {
			bCleanup === undefined ? true : false;
			for (var i = 0, len = _this.components[key].length; i < len; i++) {
				var one = _this.components[key][i];
				if (one) {
					one.gameObject = null;
				}
			}
		}
	},

	/**
	 * get the component array of this object
	 * @memberof! kc.Object#
	 * @public
	 * @param  {String} key component key
	 * @return {Array}     array of components
	 */
	getComponents: function (key) {
		return this.components[key] || [];
	},

	/**
	 * get the components list
	 * @memberof! kc.Object#
	 * @public
	 * @return {Object} object list of all the components
	 */
	getAllComponents: function () {
		return this.components;
	},

	/**
	 * set the object tag
	 * @memberof! kc.Object#
	 * @public
	 * @param {String} tag the tag of this object
	 */
	setTag: function (tag) {
		this.tag = tag;
	},

	/**
	 * set the object name
	 * @memberof! kc.Object#
	 * @public
	 * @param {String} name the name of this object
	 */
	setName: function (name) {
		this.name = name;
	},

    /**
     * add a child object to the object
     * @memberOf! kc.Object#
     * @function
     * @param {kc.Object} child child to add
     */
    addChild: function (child) {
    	var _this = this;
    	_this.children.push(child);
    	child.parent = _this;

    	_this.engineObject.addChild(child.engineObject);

    },

    /**
     * this function can get child and not clear
     * @memberOf! kc.Object#
     * @return {kc.Object}
     */
    _keeppingChild:function(cleanup){
    	var _this = this;
    	_this.engineObject.removeChild(cleanup);
    	if (_this.parent){
    		var len = _this.parent.children.length;
			for (var i=0;i<len;i++){
				var one = _this.parent.children[i];
				if (one && one.tag == _this.tag){
					_this.parent.children.splice(i,1);
					break;
				}
			}
		}
    },

    /**
     * remove children object from the object
     * @memberOf! kc.Object#
     * @function
     * @param  {kc.Object} child object to remove
     */
    removeChildren: function () {
    	var _this = this;
    	var len = _this.children.length;
    	for (var i=0;i<len;i++){
    		if (_this.children[i]){
    			_this.children[i]._clear();
    		} 		
    	}
    	_this.children.length = 0;
    },

    /**
     * remove a child object from the object by tag
     * @memberOf! kc.Object#
     * @function
     * @param  {string} tag the removed object's tag
     */
	removeChildByTag: function(tag, cleanup) {
		var _this = this;
		if (cleanup === undefined) {
			cleanup = true;
		}
		if (cleanup) {
			var len = _this.children.length;
			for (var i = 0; i < len; i++) {
				var one = _this.children[i];
				if (one && one.tag == tag) {
					one._clear();
					_this.children.splice(i, 1);
					break;
				}
			}
		} else {
			_this._keeppingChild(cleanup);
		}
	},

    /**
     * remove from parent 
     * @memberOf! kc.Object#
     */
	removeFromParent: function(cleanup) {
		var _this = this;
		if (cleanup === undefined) {
			cleanup = true;
		}
		if (cleanup) {
			if (_this.parent) {
				for (var i = 0; i < _this.parent.children.length; i++) {
					var one = _this.parent.children[i];
					if (one && one.tag == _this.tag) {
						_this.parent.children.splice(i, 1);
						_this._clear();
						break;
					}
				}
			}
		} else {
			_this._keeppingChild(cleanup);
		}
	},

    /**
     * add tweenObj
     * @param {TWEEN} tween
     * @memberOf! kc.Object#
     */
    addTweenObj:function(tween){
    	this.tweenList.push(tween);
    },

    /**
     * del tween obj
     * @param {TWEEN} tween
     * @memberOf! kc.Object#
     */
    delTweenOjb:function(tween){
    	var _this = this;
    	if (tween){
    		var i = _this.tweenList.indexOf(tween);
			if (i !== -1) {
				tween.stop();
				kc.TweenPool.releaseTween(tween);
				_this.tweenList.splice(i, 1);
			}
    	}else{
    		for (var k in _this.tweenList){
    			_this.tweenList[k].stop();
    			kc.TweenPool.releaseTween(_this.tweenList[k]);
    		}
    		_this.tweenList.length = 0;
    	}    	
    },

    /**
     * add schdule
     * @memberOf! kc.Object#
     * @param {Number} deltaTime
	 * @param {callback} func
	 * @param {bool} doing
     */
    addSchdule:function(time,func,doing){
    	var _this = this;
    	kc.scheduleManager.addSchedule(time,func,doing);
    	_this.scheduleList.push(func);
    },

    /**
     * del schdule
     * @param {callback} func
     * @memberOf! kc.Object#
     */
    delSchdule:function(fun){
    	var _this = this;
    	if (fun){
    		kc.scheduleManager.removeSchedule(fun);
    		var index = _this.scheduleList.indexOf(fun);
			if (index >= 0){
				_this.scheduleList.splice(index,1);
			}
    	}else{
    		for (var i in _this.scheduleList){
    			kc.scheduleManager.removeSchedule(_this.scheduleList[i]);
    		}
    		_this.scheduleList.length = 0;
    	}
    },

    /**
     * self And Children Clear
     * @memberOf! kc.Object#
     */
    _selfAndChildrenClear:function(){
    	var _this = this;
    	var len = _this.children.length;
    	for (var i=0;i<len;i++){
    		_this.children[i]._clear(true);
    	}
    	_this.children.length = 0;
    },

    /**
     * del 
     * @memberOf! kc.Object#
     */
    _clear:function(parentClear){
    	var _this = this;
    	kc.ObjectManager.removeObject(_this.tag);
    	_this._selfAndChildrenClear();
		_this.removeAllComponents();
		if (!parentClear){
    		_this.engineObject.cleanup();
    	} 	
		_this.engineObject = null;
		_this.delSchdule();
		_this.delTweenOjb();
    },

    /**
     * kc engine loop
     * @memberOf! kc.Object#
     */
    update: function () {
    	var _this = this;

    	var components = _this.components, aComponet, component;
    	for(var key in components) {
    		aComponet = components[key];
    		if (aComponet){
    			var aLen = aComponet.length - 1;
	    		for(var i = aLen; i >=0 ; i--) {
	    			component = aComponet[i];
	    			if (component){
	    				if(!component.bStart) {
		    				component.onStart();
		    				component.bStart = true;
		    			}
		    			component.update();
	    			}
	    		}
    		}		
    	}

    	var children = _this.children, child;
		var len = children.length - 1;
		
        for (var i = len; i >= 0; i--) {
            child = children[i];
            if (child){
            	child.update();
            }    
        }
    },

    /**
     * 派发给所有子节点
     * event : dispatch to children
     * @memberOf! kc.Object#
     * @param  {Object} event
     * @return {Boolean}
     */
    onEvent:function(event){
		var _this = this;
		var count = _this.children.length;
		if(count > 0){
			for (var i=count; i>0 ;i--) {
				var child =  _this.children[i-1];
				if (child && child.onEvent(event)){
					return true;
				}
			}
		}

		for (var k in _this.components){
			var componentList = _this.components[k];
			var count = componentList.length;
			if(count > 0){
				for (var i=count; i>0 ;i--) {
					var component =  componentList[i-1];
					if (component && component.onEvent(event)){
						return true;
					}
				}
			}
		}
		
		return;
	},

	/**
	 * 转换成节点内的坐标
	 * change world position to node position
	 * @memberOf! kc.Object#
	 * @param  {Object} worldPoint {x:x,y:y}
	 * @return {Object} nodePoint  {x:x,y:y}
	 */
	convertToNodeSpace: function (worldPoint) { 
		return this._pointApplyAffineTransform(worldPoint.x,worldPoint.y,this._getWorldToNodeTransform());
    },

    /**
     * 转换成世界坐标
	 * change node position to world position
	 * @param  {Object} worldPoint {x:x,y:y}
	 * @return {Object} nodePoint  {x:x,y:y}
	 */
	convertToWorldSpace: function (nodePoint) { 
		var nodePointLast = nodePoint || {x:0,y:0};
		return this._pointApplyAffineTransform(nodePointLast.x,nodePointLast.y,this._getNodeToWorldTransform());
    },


	_getNodeToWorldTransform: function(){
		var t = this._getNodeToParentTransform();
		for (var p = this.parent; (p !== null && !p.ObjType) || p.ObjType != "scene"; p = p.parent)
            t = this._affineTransformConcat(t, p._getNodeToParentTransform());
        return t;
	},

	_getWorldToNodeTransform: function(){
		return this._affineTransformInvert(this._getNodeToWorldTransform());
	},

    _getNodeToParentTransform:function(){
    	var _this = this;
        var basePos = _this.position;
        var rotation = _this.rotation;
        var scale = _this.scale;
        var offset =  _this.anchor;

	 	var t = {};
        t.tx = basePos.x;
        t.ty = basePos.y;

        // rotation Cos and Sin
        var a = 1, b = 0,
            c = 0, d = 1;

        if (rotation.x) {
            var rotationRadiansX = rotation.x * 0.017453292519943295;  //0.017453292519943295 = (Math.PI / 180);   for performance
            c = Math.sin(rotationRadiansX);
            d = Math.cos(rotationRadiansX);

            a = d;
        	b = -c;
        }

        // if (rotation.y) {
        //     var rotationRadiansY = rotation.y * 0.017453292519943295;  //0.017453292519943295 = (Math.PI / 180);   for performance
        //     a = Math.cos(rotationRadiansY);
        //     b = -Math.sin(rotationRadiansY);
        // }

        t.a = a;
        t.b = b;
        t.c = c;
        t.d = d;

        var lScaleX = scale.x, lScaleY = scale.y;
        var appX = offset.x, appY = offset.y;

        // Firefox on Vista and XP crashes
        // GPU thread in case of scale(0.0, 0.0)
        var sx = (lScaleX < 0.000001 && lScaleX > -0.000001) ? 0.000001 : lScaleX,
            sy = (lScaleY < 0.000001 && lScaleY > -0.000001) ? 0.000001 : lScaleY;

        // scale
        if (lScaleX !== 1 || lScaleY !== 1) {
            a = t.a *= sx;
            b = t.b *= sx;
            c = t.c *= sy;
            d = t.d *= sy;
        }

        // adjust anchorPoint
        t.tx -= a * appX + c * appY;
        t.ty -= b * appX + d * appY;

        return t;
    },

    _affineTransformConcat:function(t1,t2){
    	return {a: t1.a * t2.a + t1.b * t2.c,                       //a
        b: t1.a * t2.b + t1.b * t2.d,                               //b
        c: t1.c * t2.a + t1.d * t2.c,                               //c
        d: t1.c * t2.b + t1.d * t2.d,                               //d
        tx: t1.tx * t2.a + t1.ty * t2.c + t2.tx,                    //tx
        ty: t1.tx * t2.b + t1.ty * t2.d + t2.ty};				    //ty
    },

    _affineTransformInvert:function(t){
    	var determinant = 1 / (t.a * t.d - t.b * t.c);
	    return {a: determinant * t.d, b: -determinant * t.b, c: -determinant * t.c, d: determinant * t.a,
	        tx: determinant * (t.c * t.ty - t.d * t.tx), ty: determinant * (t.b * t.tx - t.a * t.ty)};

    },

    _pointApplyAffineTransform:function(x,y,t){    	
    	return {x: t.a * x + t.c * y + t.tx, y: t.b * x + t.d * y + t.ty};
    }

});

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file ObjectManager.js
 * @author Chang Fei
 */

var kc = kc || {};
/**
 * <p>
 * kc.ObjectManager is a singleton that handles all the Objects.</p>
 * @class
 * @name kc.ObjectManager
 */
kc.ObjectManager = /** @lends kc.ObjectManager# */{

	/**
	 * list of objects
	 * @type {Object}
	 * @memberof! kc.ObjectManager#
	 */
	objects: {},

	/**
	 * add a object to the list
	 * @static
	 * @memberof! kc.ObjectManager#
	 * @param {String} key object key
	 * @param {kc.Object} obj the kc.Object added to the list
	 */
	addObject: function (key, obj) {
		this.objects[key] = obj;
	},

	/**
	 * remove a object from the list
	 * @static
	 * @memberof! kc.ObjectManager#
	 * @param {String} key object key
	 */
	removeObject: function (key) {
		delete this.objects[key];
	},

	/**
	 * get the object by key
	 * @static
	 * @memberof! kc.ObjectManager#
	 * @param  {String} key object key
	 * @return {kc.Object}     the object named the key value
	 */
	getObject: function (key) {
		return this.objects[key];
	}
};

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Project.js
 * @author Chang Fei
 */

var kc = kc || {};
/**
 * <p>
 * kc.Project is a singleton that handles the project data.</p>
 * @class
 * @name kc.Project
 */
kc.Project = /** @lends kc.Project# */{

	/**
	 * project data
	 * @memberof! kc.Project#
	 * @public
	 * @type {Object}
	 */
	_projectData: null,

	/**
	 * resources list of the project
	 * @memberOf! kc.Project#
	 * @public
	 * @type {Object}
	 */
	_resources: null,

	/**
	 * load project data
	 * @memberOf! kc.Project#
	 * @static
	 * @param  {Function} callback called when project data loaded end.
	 */
	prepare: function(callback) {
		var _this = this;

        var xhr = kc.getXMLHttpRequest();
        var data = null;
        if (DEBUG) {
            var qrcode = kc.GetRequest().qrcode;
          
            data = APIRoot + '/gf/webapi/ReadProject_Preview' + '?pid=' + PROJECTID || "";
            if(qrcode) {
                data += "&qrcode=" + qrcode;
            }
            xhr.open('GET', 'http://' + SERVERIP + ':' + SERVERPORT + '/api/getProjectData?' + data);
        }else{
            var _userId = null;
            if (OWNER && OWNER !=""){
                _userId = OWNER;
            }else{
                _userId = USERID;
            }

            data = ScriptRoot + 'project/' + _userId + '/' + GAMEID + '.' + BACK_SUFFIX;
            xhr.open('GET', 'http://' + SERVERIP + ':' + SERVERPORT + "/api/getProjectData?" + data);
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 )) {
                var httpStatus = xhr.responseText;
                var datas = JSON.parse(httpStatus);

                // console.log(datas);
                if (DEBUG) {
                    if (datas.state == 'ok') {
                        _this._projectData = datas.projectinfo;
                        _this._resources = datas.projectinfo.ResourceText.origin.resources;
                    }
                }else{
                    _this._projectData = datas;
                    _this._resources = datas.ResourceText.origin.resources;
                }
                var convertUnit8Array = function(projectData){
                    var resources = projectData.ResourceText.origin.resources;
                    for(var i in resources){
                        if(resources[i].resType == 'map'){
                            var data = resources[i].data;
                            var objArray = data && data.mapScene && data.mapScene.pathCanMove || null;
                            if(!objArray){
                                continue;
                            }
                            var w = data.mapScene.singlelayer[0] || 0;
                            var h = data.mapScene.singlelayer[2] || 0;
                            var len = Math.ceil(w * h / 8);
                            var uint8Array  = new Uint8Array(len);
                            for (var i=0; i<len; ++i){
                                uint8Array[i] = objArray[i];
                            }
                            data.mapScene.pathCanMove = uint8Array;
                        }
                    }
                }
                convertUnit8Array(_this._projectData);
                if(callback) {
                    callback();
                }
            }
        };

        xhr.send("");
	},
	/**
	 * get the project data
	 * @static
	 * @memberOf! kc.Project
	 * @return {Object} the project data
	 */
	getProjectData: function () {
		return this._projectData;
	},

	/**
	 * gets the resource info by key
	 * @static
	 * @memberOf! kc.Project
	 * @return {Object} resource info
	 */
	getResourceForKey: function (key) {
		return this._resources[key];
	},


    _getResInstance:function(res,aRes,instance){
        for (var wrapperId in instance) {
            var wrapper = instance[wrapperId];
            if(wrapper.resources) {
                for(var resourceIndex = 0; resourceIndex < wrapper.resources.length; resourceIndex++) {
                    var resId = wrapper.resources[resourceIndex].resId;
                    if(!resId){
                        resId = wrapper.resources[resourceIndex];
                    }
                    var resInfo = res[resId];
                    if(!resInfo) {
                        continue;
                    }

                    if(resInfo.resType === "logic") {
                        var jsPath;
                        if(DEBUG) {
                            jsPath = APIRoot + "gf/sdk/GenJs?userid=" + USERID + "&projectid=" + (PROJECTID || '') + "&instanceid=" + resId;
                            aRes.push({
                                type: 'script',
                                url: jsPath
                            });
                        }
                    } else if (resInfo.resType === "image"){
                        if(DEBUG) {
                        aRes.push({
                            type: 'image',
                            url: ResRoot + resInfo.resURL.substr(1)
                        });
                        }
                    }else if (resInfo.resType === "audio"){
                        aRes.push({
                            type: 'audio',
                            url: ResRoot + resInfo.resURL.substr(1)
                        });
                    }else if (resInfo.resType === "fnt"){
                        aRes.push({
                            type: 'fnt',
                            url: ResRoot + resInfo.resURL.substr(1)
                        });
                    }else if (resInfo.resType === "application"){
                        aRes.push({
                            type: 'application',
                            url: ResRoot + resInfo.resURL.substr(1)
                        });
                    }else if (resInfo.resType === "map"){
                        var list = resInfo.data.mapBlock;
                        for (var i=0;i<list.length;i++){
                            var one = list[i];
                            aRes.push({
                                type: 'image',
                                url: ResRoot + one.src.substr(1)
                            });
                        }                       
                    }
                }
            }
        }
    },

	/**
     * gets the resources by scene id
     * @memberOf! kc.Project
     * @private
     * @param  {String} sceneId 场景ID
     * @return {Array}         资源列表
     */
    getResBySceneId: function (sceneId) {
        var _this = this;

        var aRes = [];
        var oResName = {};

        var res = _this._projectData.ResourceText.origin.resources;
        var scene = res[sceneId];
        if (scene) {
            var instance = scene.data.instance;
            _this._getResInstance(res,aRes,instance);
        }

        for (var k in res){
            if (res[k].resType == "prototype"){
                var data = res[k].data.instance;
                _this._getResInstance(res,aRes,data);
            }
        }

        // png plist 资源
        var packerFiles = this._projectData.ResourceText.packerFiles;
        if (!DEBUG){
            for (var file in packerFiles){
                if (file == sceneId){
                    var files = packerFiles[file];
                    for(var one in files){
                        if(files[one].substr(files[one].indexOf(".")+1) == 'plist'){
                            aRes.push({
                                type: 'plist',
                                url: ScriptRoot + files[one]
                            });
                        }else{
                            aRes.push({
                                type: 'image',
                                url: ScriptRoot + files[one]
                            });
                        }
                    }
                }
            }
        }
        
        return aRes;
    }
};

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Scene.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.Scene is the scene of game, contains all the objects</p>
 * @class
 * @name kc.Scene
 * @extends kc.Class
 */

kc.Scene = kc.Class.extend({
	/**
	 * obj type
	 * @memberof! kc.Scene#
	 * @type {String}
	 */
	ObjType :"scene",
	/**
	 * array of objects in this scene
	 * @type {Array}
	 * @private
	 * @memberof! kc.Scene#
	 */
	children: null,

	/**
	 * the engine scene
	 * @private
	 * @memberOf! kc.Scene
	 */
	engineScene: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;

		_this.children = [];

		this.engineScene = new kc.EngineScene();
	},

	/**
	 * add a kc.Object to this scene
	 * @memberof! kc.Scene#
	 * @public
	 * @param {kc.Object} child object to added
	 */
	addChild: function (child) {
		var _this = this;

		if(child.parent !== null) {
			throw new Error('child already have a parent');
			return;
		}

		child.parent = this;

		_this.children.push(child);

		this.engineScene.addChild(child.engineObject);
	},

	/**
	 * remove a kc.Object from this scene
	 * @memberof! kc.Scene#
	 * @public
	 * @param {kc.Object} child object to remove
	 * @param {Bool} bCleanup if destory the object
	 */
	removeChild: function (child, bCleanup) {

	},

	/**
	 * remove a kc.Object from this scene by object's tag
	 * @memberof! kc.Scene#
	 * @public
	 * @param {String} tag of object
	 * @param {Bool} bCleanup if destory the object
	 */
	removeChildByTag: function (tag, bCleanup) {

	},

	/**
	 * remove all children in the scene.
	 * @memberOf! kc.Scene#
	 * @public
	 * @param {Bool} bCleanup if destory the object
	 */
	removeAllChildren: function (bCleanup) {

	},

	addCamera: function () {

	},

	/**
	 * traverse Object
	 * @memberOf! kc.Scene#
	 * @private
	 * @param  {Object} start object
	 * @return {Object}
	 */
	_traverseObject:function(object,key){
		var _this = this;
		if (object.tag == key){
			return object;
		}else if(object.children && object.children[0]){
			for (var i=0;i<object.children.length;i++){
				var findObject = _this._traverseObject(object.children[i],key);
				if (findObject){
					return findObject;
				}
			}
		}
	},

	/**
	 * select all child By Key
	 * @memberOf! kc.Scene#
	 * @param  {String} key
	 * @return {Object}
	 */
	selectAllChildByKey:function(key){
		var _this = this;
		var obj = _this._traverseObject(_this,key);
		if(obj){
			return obj;
		}
	},

	/**
     * del
     * @memberOf! kc.Scene#
     */
    clear:function(parentClear){
    	var _this = this;
    	var len = _this.children.length;
    	for (var i=len-1;i>=0;i--){
    		if (_this.children[i]){
    			_this.children[i]._clear(true);
    		}		
    	}
    	_this.children.length = 0;
    	if (!parentClear){
    		_this.engineScene.cleanup();
    	}
    	_this.engineScene = null;
    },

	getCanvas:function(){
		if(this.engineScene){
			return this.engineScene.getCanvas();
		}
	},

	run: function () {
		if(this.engineScene) {
			this.engineScene.run();
			console.log('scene run');
		}
	},

	update: function () {
		var _this = this;

		var children = _this.children,
			len = children.length,
			child = null;

        for (var i = len - 1; i >= 0; i--) {
            child = children[i];
          	if (child){
          		child.update();
          	}
            
        }
	},

	/**
	 * the base obj of windows event dispatch
	 * @param  {Object} event
	 */
	onEvent: function(event) {
		var _this = this;

		var count = _this.children.length,
			child = null;

		for (var i = count; i > 0; i--) {
			child = _this.children[i - 1];
			if (child && child.onEvent(event)) {
				break;
			}
		}
	}
});

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Storage.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>
 * 快创引擎存储.<br/>
 * </p>
 * @class Storage
 * @name kc.Storage
 */
kc.Storage = {
	/**
	 * 拖拽信息存储
	 * @memberof kc.Storage#
	 * @private
	 * @type {Element}
	 */
	Darg:null,

	/**
	 * init
	 * @memberof kc.Storage#
	 */
	init:function(){
		this.Darg = [];
	},

	/**
	 * clear
	 * @memberof kc.Storage#
	 */
	clear:function() {
		this.Darg = null;
	}
};
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * 此模块用于监听和派发系统事件，捕捉用户操作
 * this module is the system that can be used to listen and dispatch system event,the operating of user. 
 * @description this mode is dispatch to scene.
 * @file system.js
 * @author wang_ch
 */
var kc = kc || {};

kc.System = {
	/**
	 * 监听canvas
	 * listenning canvas
	 * @memberof! kc.System#
	 * @type {Object}
	 * @public
	 */
	canvas :null,

	/**
	 * 加载会自动执行
	 * auto running
	 * @memberOf! kc.System#
	 */
	init:function(){
		var _this = this;
		_this.isOpenKeyBoard = false;
		_this.isTouchOpen = false;
		_this.isMouseOpen = false;
		_this.AudioContext = new AudioContext();
	},

	/**
	 * 触摸的监听事件
	 * touch listeners
	 * @memberOf! kc.System#
	 * @type {Array}
	 */
	touchList : ["touchstart","touchmove","touchend","touchcancel"],

	/**
	 * 鼠标的监听事件
	 * mouse listeners
	 * @memberOf! kc.System#
	 * @type {Array}
	 */
	mouseList : ["click","mousedown","mouseup","mousemove","mouseout","mouseover","mousewheel","DOMMouseScroll"],

	/**
	 * 键盘的监听事件
	 * keyBoard listeners
	 * @memberOf! kc.System#
	 * @type {Array}
	 */
	keyBoardList : ["keydown","keypress","keyup"],

	/**
	 * 所有监听的列表
	 * the list of all listeners
	 * @memberOf! kc.System#
	 * @type {Object}
	 */
	typList : {"keydown":"onKeyDown","keypress":"onKeyPress","keyup":"onKeyUp",
			"click":"onClick","mousedown":"onMouseDown","mouseup":"onMouseUp","mousemove":"onMouseMove","mouseout":"onMouseOut",
			"mouseover":"onMouseOver","mousewheel":"onMouseWheel","DOMMouseScroll":"onDOMMouseScroll",
			"touchstart":"onMouseDown","touchmove":"onMouseMove","touchend":"onMouseUp","touchcancel":"onTouchCancel"},

	/**
	 * 判断是不是键盘事件
	 * determine keyBoard event
	 * @memberOf! kc.System#
	 * @param  {String}  type keys list
	 * @return {Boolean}      true or false
	 */
	isKeyBoard:function(type){
		return this.keyBoardList.indexOf(type)>=0?true:false;
	},

	/**
	 * 判断是不是鼠标事件
	 * determine Mouse event
	 * @memberOf! kc.System#
	 * @param  {String}  type keys list
	 * @return {Boolean}      true or false
	 */
	isMouse:function(type){
		return this.mouseList.indexOf(type)>=0?true:false;
	},

	/**
	 * 判断是不是点击事件
	 * determine Touch event
	 * @memberOf! kc.System#
	 * @param  {String}  type keys list
	 * @return {Boolean}      true or false
	 */
	isTouch:function(type){
		return this.touchList.indexOf(type)>=0?true:false;
	},

	/**
	 * 判断是不是移动端
	 * determine mobile device
	 * @memberOf! kc.System#
	 * @param  {String}  type keys list
	 * @return {Boolean}      true or false
	 */
	isMobile:function() {
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod"];
	    var flag = false;
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > 0) {
	            flag = true;
	            break;
	        }
	    }
    	return flag;
	},

	/**
	 * 将浏览器坐标转换成canvas坐标
	 * change windows position to canvas position
	 * @memberOf! kc.System#
	 * @param  {Number} x 
	 * @param  {Number} y 
	 * @return {Object}  
	 */
	windowToCanvas:function(x,y){
		var _this = this;
		if (!_this.canvas){
			return console.assert(null,"not canvas! please addCanvas!");
		}
		var bbox = _this.canvas.getBoundingClientRect();
		// var _x = x - bbox.left * ((_this.canvas.width || _this.canvas.clientWidth)  / bbox.width);
		// var _y = y - bbox.top * ((_this.canvas.height || _this.canvas.clientHeight) / bbox.height);
		var _x = x - bbox.left;
		var _y = y - bbox.top;

		var winSize = kc.Core.getWinSize();
		var scaleX = bbox.width/winSize.width;
		var scaleY = bbox.height/winSize.height;

		if (String(kc.Core._mode) == '1'){//noborder
			if (scaleX > scaleY){
				scaleY = scaleX;
			}else{
				scaleX = scaleY;
			}
		}else if(String(kc.Core._mode) == '3'){//fixedheight
			scaleX = scaleY;
		}else if(String(kc.Core._mode) == '4'){//fixedwidth
			scaleY = scaleX;
		}

		var pos = {x:_x/scaleX,y:(bbox.height - _y)/scaleY};
		kc.InputPosition = pos;
		return pos;
	},

	/**
	 * 默认的注册所有监听事件
	 * default register all the listener.
	 * @memberOf! kc.System#
	 */
	registAllListeners:function(){
		var _this = this;
		if (_this.isMobile()) {
			_this.addTouchListener(_this.touchList);
		} else {
			_this.addMouseListener(_this.mouseList);
		}
		_this.addKeyBoardListener(_this.keyBoardList);
	},

	/**
	 * add touch listener
	 * @memberOf! kc.System#
	 * @param {Array} list touchlist
	 */
	addTouchListener:function(list){
		var _this = this;
		if (!_this.canvas){
			console.assert(null,"not canvas! please addCanvas!");
			return;
		}
		for (var one in list){
			_this.canvas.addEventListener(list[one],function(e){
				var touch = e.changedTouches[0];
				if (!touch){
					return;
				}
				var pos = _this.windowToCanvas(touch.clientX,touch.clientY);
				var event = {type:_this.typList[e.type],x:pos.x,y:pos.y};
				kc.Core.currentScene && kc.Core.currentScene.onEvent(event);
			},false);
		}
	},

	/**
	 * add moush listener
	 * @memberOf! kc.System#
	 * @param {Array} list 
	 */
	addMouseListener:function(list){
		var _this = this;
		if (!_this.canvas){
			console.assert(null,"not canvas! please addCanvas!");
			return;
		}
		for (var one in list){
			_this.canvas.addEventListener(list[one],function(e){
				// if (e.type == "mousedown"){
					var pos = _this.windowToCanvas(e.x,e.y);
					var event = {type:_this.typList[e.type],x:pos.x,y:pos.y};
					kc.Core.currentScene && kc.Core.currentScene.onEvent(event);
				// }									
			},true);
		}
	},

	/**
	 * add keyboardListener
	 * @memberOf! kc.System#
	 * @param {Array} list 
	 */
	addKeyBoardListener:function(list){
		var _this = this;		
		for (var one in list){
			window.addEventListener(list[one],function(e){
				var event = {type:_this.typList[e.type]};
				kc.Core.currentScene && kc.Core.currentScene.onEvent(event);
			},true);
		}
	}
};
kc.System.init();
/**
 * @file TweenPool.js
 * @author he_lt
 */

var kc = kc || {};

kc.TweenPool = {
	_pool: [],
	size: 100,
	minSize: 20,

	putInPool: function(){
		var tween = new TWEEN.Tween();
		this._pool.push(tween);
	},
	acquireTween: function(){
		var tween = this._pool.pop();
		
		return tween;
	},
	releaseTween: function(twe){
		twe.clear();
		this._pool.push(twe);
	},
	releaseAllPools: function(){
		this._pool.length = 0;
	},
	update: function(){
		var _this = this;
		if(this._pool.length < this.minSize){
			this.putInPool();
		}else if(this._pool.length > this.size){
			this.acquireTween();
		}
	}
};
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Component.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Component is the base class of component.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Component
 * @extends kc.Class
 */
kc.Component = kc.Class.extend({

	/**
	 * the wrapper of the component
	 * @type {kc.Object}
	 * @memberOf! kc.Component#
	 */
	gameObject: null,

	/**
	 * is onStart event called
	 * @memberOf! kc.Component#
	 * @type {Boolean}
	 */
	bStarted: null,

	/**
	 * tag of component
	 * @memberOf! kc.Component#
	 * @type {String}
	 */
	stag: null,

	/**
	 * component logics
	 * @memberOf! kc.Component#
	 * @type {object}
	 */
	logics:null,

	/**
	 * 禁止冒泡事件向下传递
	 * stop  propagation
	 * @type {Boolean}
	 * @memberOf! kc.Render#
	 */
	stopPropagation:true,

	/**
	 * 数据参数
	 * @type {Array}
	 */
	_propertys:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		_this.bStarted = false;
		_this.gameObject = null;
		_this.logics =	{};
	},

	/**
	 * set the component property data
	 * @public
	 * @memberOf! kc.Component#
	 */
	setProperty: function (propertyData) {
		this._propertys = propertyData;
		this._parse();
	},

	/**
	 * component addLogic
	 * @memberOf! kc.Component#
	 * @param {Number} id
	 */
	addLogic:function(id){
		var _this = this;
		if (id){
			_this.logics[id] = kc["LogicClass_" + id];
		}		
	},

	/**
	 * run logic if has
	 * @memberOf! kc.Component#
	 * @private
	 */
	doLogic:function(id,target){
		var _this = this;
		var logic = _this.logics[id];
		if (logic){
			var obj = new logic();
			obj.run(_this,target);
		}
	},


	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Component#
	 */
	_parse: function () {

	},

	/**
	 * set Tag
	 * @memberOf! kc.Component#
	 * @param {String} tag
	 */
	setTag: function (tag) {
		this.stag = tag;
	},

	/**
	 * set touch or hit stopPropagation
	 * @memberOf! kc.Component#
	 * @param  {Boolean}  bool
	 */
	setStopPropagation:function(isPropagation){
		this.stopPropagation = isPropagation;
	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.Component#
	 */
	onDestory: function () {
		var _this = this;
		_this.bStarted = null;
		_this.gameObject = null;
		_this.logics =	{};
	},

	/**
	 * dispatch to component
	 * @memberOf! kc.Component#
	 * @param  {Object} event
	 * @return {Boolean} stopPropagation;
	 */
	onEvent:function(event){
		var _this = this;
		return _this[event.type]&&_this[event.type](event);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Component#
	 */
	onAwake: function () {},

	/**
	 * called before the first update called
	 * @memberOf! kc.Component#
	 */
	onStart: function () {},

	/**
	 * called every frame before draw
	 * @memberOf! kc.Component#
	 */
	update: function () {},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.Component#
	 */
	lateUpdate: function () {},

	/**
	 * clear object
	 * @memberOf! kc.Component#
	 */
	clear:function(){
		var _this = this;
		_this.controlObj = null;
		_this.gameObject = null;
		_this.update = function(){
			console.log("clear component!!!");
		};
	}

});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Render.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Render is the base class of component.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Render
 * @extends kc.Class
 */
kc.Render = kc.Component.extend({

	/**
	 * 禁用状态，如果有图片会显示禁用图片
	 * disabled state,if the component has texture, change it
	 * @type {Boolean}
	 * @memberOf! kc.Render#
	 */
	disabled:false,

	/**
	 * rander size rect
	 * @type {Object}
	 * @private
	 * @memberOf! kc.Render#
	 */
	// _randerRect:null,

	/**
	 * 重置大小的标志
	 * rest size
	 * @type {Object}
	 * @private
	 * @memberOf! kc.Render#
	 */
	_reSize:null,
	
	/**
	 * srcId
	 * @memberOf kc.Render
	 * @type {String}
	 */
	srcId:null,

	/**
	 * 图片原始纹理大小
	 * @private
	 * @memberOf! kc.Render#
	 */
	_textureSize:null,

	/**
	 * src
	 * @memberOf kc.Render
	 * @type {String}
	 */
	src:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this._textureSize = {width:0,height:0};

		// _this._randerRect = {x:0,y:0,width:0,height:0,offsetX:0,offsetY:0};
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
	 * set user use or not
	 * @memberOf! kc.Render#
	 * @param {Boolean} bool 
	 */
	setDisabled :function(bool){
		this.disabled = bool;
	},

	/**
	 * set texture 
	 * @param {String} src url
	 * @memberOf! kc.Render#
	 */
	setSrc: function (src,callback) {
		var _this = this;
		_this.src = src;
		var plistData = kc.getPlistTexture(src);
		
		if (!DEBUG && plistData) {
			var txt = plistData;

			_this.controlObj.setPlistTexture(txt.texture,txt.plistData);
			_this.gameObject.setSize(txt.plistData.sourceSize.width,txt.plistData.sourceSize.height);

			_this._textureSize.width = txt.plistData.sourceSize.width;
			_this._textureSize.height = txt.plistData.sourceSize.height;
			_this._reSize = true;

		}else{
			var texture = kc.Cache.get(src,function(text){

				_this.controlObj.setObjectTexture(text);

				_this.gameObject.setSize(text.width,text.height);

				_this._textureSize.width = text.width;
				_this._textureSize.height = text.height;
				if(callback){
					callback();
				}
				_this._reSize = true;
			});	
		}
	},
	
		/**
	 * Set texture by ID
	 * @memberOf! kc.Render#
	 * @override
	 */
	setSrcId: function (srcId) {
		var _this = this;
		
		var resInfo = kc.Project.getResourceForKey(srcId);
		if(resInfo && resInfo.resURL && resInfo.resURL!=''){
			_this.srcId = srcId;
			var imgUrl = resInfo.resURL.substr(1);
			_this.setSrc(ResRoot + imgUrl);
		}
	},

	/**
	 * change image
	 * @param  {String} src url
	 * @memberOf! kc.Render#
	 */
	changeSrc: function (src) {
		var _this = this;
		var plistData = kc.getPlistTexture(src);
		if (!DEBUG && plistData) {
			var txt = plistData;
			_this.controlObj.setPlistTexture(txt.texture,txt.plistData);
			_this.gameObject.setSize(txt.plistData.sourceSize.width,txt.plistData.sourceSize.height);
			_this._textureSize.width = txt.plistData.sourceSize.width;
			_this._textureSize.height = txt.plistData.sourceSize.height;
			_this._reSize = true;
		}else{
			var texture = kc.Cache.get(src,function(text){
				_this.controlObj.changeTexture(text);

				_this.gameObject.setSize(text.width,text.height);

				_this._textureSize.width = text.width;
				_this._textureSize.height = text.height;

				_this._reSize = true;
			});
		}
	},

	/**
	 * set anchorpoint
	 * @memberOf! kc.Render#
	 * @param {Number} x 
	 * @param {Number} y 
	 * @private
	 */
	_setAnchorPoint:function(x,y){
		var _this = this;
		_this.controlObj.setAnchorPoint(x,y);
	},

	/**
     * set Alpha
     * @param {Number} opacity
     * @memberOf! kc.Render#
     */
    setAlpha: function(alpha) {
        this.gameObject.setAlpha(Number(alpha));
    },

    /**
     * set Visible
     * @param {Boolean} visible
     * @memberOf! kc.Render#
     */
    setVisible: function(visible) {
        this.gameObject.setVisible(visible);
    },

    /**
     * 设置渲染区域
     * set rander size
     * @memberOf! kc.Render#
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h
     */
    // setRanderSize:function(x,y,w,h,offsetX,offsetY){
    // 	var _this = this;
    // 	_this.controlObj.setSize(w,h);
    // 	_this.gameObject.setSize(w,h);
    // 	_this._reSize = true;
    // 	_this._randerRect.x = x;
    // 	_this._randerRect.y = y;
    // 	_this._randerRect.width = w;
    // 	_this._randerRect.height = h;
    // 	_this._randerRect.offsetX = offsetX || 0;
    // 	_this._randerRect.offsetY = offsetY || 0;
    // },

    /**
	 * 设置对象大小
	 * set the object size
	 * @memberOf! kc.Render#
	 * @param {Number} width
	 * @param {Number} height
	 */
    setSize:function(w,h){
    	var _this = this;
    	// _this.controlObj.setSize(w,h);
    	_this.gameObject.setSize(w,h);
    	_this._reSize = true;
		if (_this._textureSize.width != 0 && _this._textureSize.height != 0) {
			_this.controlObj.setScale(w/_this._textureSize.width,h/_this._textureSize.height);
		}
    },

    /**
     * 获取对象大小
     */
    getSize: function(){
        var _this = this;
        return _this.gameObject.getSize();
    },

	/**
	 * called when the Button just is loaded
	 * @memberOf! kc.Render#
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
	}

});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Anchor.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Anchor handles the component's anchor.<br/>
 * <br/>
 * </p>
 * @class
 * @todo do nothing now
 * @name kc.Anchor
 * @extends kc.Class
 */
kc.Anchor = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Anchor#
	 */
	ObjType: 'Anchor',
	
	/**
	 * default point
	 * @memberOf! kc.Anchor#
	 * @type {Object}
	 */
	anchorPoint:null,
	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		_this.anchorPoint = {x:0.5,y:0.5};
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Anchor#
	 */
	_parse: function () {
		var _this = this;
		_this.setAnchorPoint(_this._propertys.x,_this._propertys.y);
	},

	/**
	 * AnchorPoint interface
	 * @memberOf! kc.Anchor#
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	setAnchorPoint: function(x,y) {
		var posX = Number(x);
		var posY = Number(y);
		this.anchorPoint = {x:posX,y:posY};
		this.gameObject.setAnchor(posX, posY);
	},

	/**
	 * _AnchorPoint interface
	 * @memberOf! kc.Anchor#
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	_setAnchorPoint: function(x,y) {
		var posX = Number(x);
		var posY = Number(y);
		this.anchorPoint = {x:posX,y:posY};
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Animate.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Animate is a component draw frame based animation.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Animate
 * @extends kc.Component
 */
kc.Animate = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Animate#
	 */
	ObjType: 'Animate',
	/**
	 * frame list
	 * @memberOf! kc.Animate#
	 * @type {array}
	 */
	_frames: null,

	/**current frame
	 * current index
	 * @memberOf! kc.Animate#
	 * @type {Number}
	 */
	currentIndex: 0,

	/**
	 * next frame
	 * @type {Number}
	 * @memberOf! kc.Animate#
	 */
	_nextFrameTime: 0,

	/**
	 * play status
	 * @memberOf! kc.Animate#
	 * @type {Boolean}
	 */
	bPlaying: false,
	/**
	 * auto play
	 * @type {Boolean}
	 * @memberOf! kc.Animate#
	 */
	bAutoPlay: false,

	/**
	 * support run between in begin or end
	 * @memberOf! kc.Animate#
	 * @type {String}
	 */
	// currentKey: null,

	/**
	 * speed 
	 * @memberOf! kc.Animate#
	 * @type {Number}
	 */
	speed:1,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	
	ctor: function() {
		kc.Component.prototype.ctor.call(this);

		this._frames = {};

		this.image = new kc.EngineImage();
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
		_this.image = null;
		_this._frames = null;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Animate#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var animateInfo = propertys.animate;
		var autoPay = propertys.autoPlay;
		var speed = propertys.speed;
		var scrId = animateInfo.id;
		var animateData = kc.Project.getResourceForKey(scrId).data;
		var actions = animateData.actions;

		_this._setActions(actions);
		_this.setSpeed(speed);
		if (autoPay){
			_this.play(1);
		}
	},

	/**
	 * set action info
	 * @memberOf! kc.Animate#
	 * @param {Object} actions
	 */
	_setActions:function(actions){
		this._frames = actions;
	},

	/**
	 * set display frame
	 * @param {Number} index
	 */
	setDisplayFrame:function(index){
		this.currentIndex = index - 1;
		this._nextFrameTime = 0;
		this._changeImage(index -1);
	},

	/**
	 * reset animate component
	 * @memberOf! kc.Animate#
	 * @public
	 */
	reset: function () {
		this.currentIndex = 0;
		this._nextFrameTime = 0;
		this.bPlaying = false;
	},

	/**
	 * play the animation
	 * @memberOf! kc.Animate#
	 * @property {number} index
	 */
	play: function(index) {
		// this.currentKey = key;
		this.currentIndex = typeof(x) == "number" ? index : 0;
		this._nextFrameTime = 0;
		this.bPlaying = true;
	},

	/**
	 * pause the animation
	 * @memberOf! kc.Animate#
	 */
	pause: function () {
		this.bPlaying = false;
	},

	/**
	 * resume the animation
	 * @memberOf! kc.Animate#
	 */
	resume: function () {
		this.bPlaying = true;
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Animate#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.image);
	},

	/**
	 * set Speed
	 * @memberOf! kc.Animate#
	 * @param {Number} speed
	 */
	setSpeed:function(speed){
		this.speed = speed;
	},

	/**
	 * called before the first update called
	 * @memberOf! kc.Animate#
	 * @override
	 */
	onStart: function () {

	},

	/**
	 * called before the first update called
	 * @memberOf! kc.Animate#
	 * @override
	 */
	_changeImage: function (index) {
		var _this = this;
		var frames = _this._frames['frames'];
		var length = frames.length;
		var frame = frames[index];
		if (!frame && frames[0]){
			frame = frames[0];
		}else if(!frame && !frames[0]){
			console.log("is not frame!");
			return;
		}

		var resourceId = frame.resourceID;
		var info = kc.Project.getResourceForKey(resourceId);
		var url = ResRoot + info.resURL.substr(1);
		var texture = null;
		var plistData = kc.getPlistTexture(url);
		if (!DEBUG && plistData) {
			var txt = plistData;
			_this.image.setPlistTexture(txt.texture,txt.plistData);
			_this.gameObject.setSize(txt.plistData.sourceSize.width,txt.plistData.sourceSize.height);
		}else{
			texture = kc.Cache.get(url, function (texture) {
				_this.image.changeTexture(texture);
				_this.gameObject.setSize(texture.width,texture.height);
			});
		}
	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.Animate#
	 * @override
	 */
	update: function () {
		var _this = this;

		if(!_this.bPlaying) {
			return;
		}

		var index = _this.currentIndex;
		//var frames = _this.frames[_this.currentKey]["frames"];
		//把动作的那一层去掉了
		var frames = _this._frames['frames'];
		var length = frames.length;
		var frame = frames[index];
		if (!frame && frames[0]){
			frame = frames[0];
		}else if(!frame && !frames[0]){
			return;
		}
		
		if(_this._nextFrameTime <= 0) {
			var duration = Number(frame.duration)/_this.speed;
			_this._changeImage(index);
			_this._nextFrameTime = duration;
			if(index >= length - 1) {
				_this.currentIndex = 0;
			} else {
				_this.currentIndex++;
			}
		} else {
			_this._nextFrameTime -= kc.deltaTime;
		}
	},

	/**
	 * get size
	 * @memberOf! kc.Animate#
	 * @return {object} size
	 */
	getSize:function(){
		return this.gameObject.size;
	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.Animate#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.Animate#
	 * @override
	 */
	onDestory: function () {
		
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file ArModel.js
 * @author Guo_f
 */

var kc = kc || {};

/**
 * <p>kc.ArModel .<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.ArModel
 * @extends kc.Component
 */
kc.ArModel = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.ArModel#
	 */
	ObjType: 'ArModel',

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;

		kc.Component.prototype.ctor.call(_this);
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.ArModel#
	 */
	_parse: function () {
		var _this = this;

	}

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file ArModel3D.js
 * @author du_jg
 */

var kc = kc || {};

/**
 * <p>kc.ArModel3D .<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.ArModel3D
 * @extends kc.Component
 */
kc.ArModel3D = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.ArModel3D#
	 */
	ObjType: 'ArModel3D',

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;

		kc.Component.prototype.ctor.call(_this);
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.ArModel#
	 */
	_parse: function () {
		var _this = this;
	}

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Audio.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Audio is a component plays music/effect.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Audio
 * @extends kc.Component
 */
kc.Audio = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Audio#
	 */
	ObjType: 'Audio',
	
	/**
	 * music source
	 * @type {Object}
	 * @private
	 * @memberOf! kc.Audio#
	 */
	source: null,

	/**
	 * auto play
	 * @type {Boolean}
	 * @memberOf! kc.Audio#
	 */
	bAutoPlay: false,

	/**
	 * 
	 * @type sourceId
	 * @memberOf! kc.Audio#
	 */
	sourceId: null,

	/**
	 * run it again
	 * @type {Boolean}
	 * @memberOf! kc.Audio#
	 */
	bLoop: false,

	/**
	 * Loop Playback
	 * @type {Boolean}
	 * @memberOf! kc.Audio#
	 */
	btype: null,

	/**
	 * running obj
	 * @type {Object}
	 * @memberOf! kc.Audio#
	 */
	currentAudio: null,

	/**
	 * volume of sound 
	 * @memberOf! kc.Audio#
	 * @type {Number}
	 */
	bVolumne : null,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;

		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineAudio();
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Audio#
	 */
	_parse: function () {
		var _this = this;
		var audioPropertys = _this._propertys;
		var resource = kc.Project.getResourceForKey(audioPropertys.src.id);
		_this.sourceId = audioPropertys.src.id;

		if(resource && resource.resURL && resource.resURL!=''){
			var audioSrc = ResRoot + resource.resURL.substr(1);
			var audioTypeArray = ["MusicType","EffectType"];
			var audioType = audioTypeArray[audioPropertys.playType];
			var audioIsLoop = audioPropertys.isLoop;
			var autoPay = audioPropertys.autoPlay;
			var audioVolume = audioPropertys.Volume;

			_this._setAudio(audioSrc,audioVolume,audioIsLoop,autoPay,audioType);
		}
	},

	/**
	 * change source
	 * @param  {string} url
	 * @memberOf! kc.Audio#
	 */
	changeSource:function(url){
		var _this = this;
		_this.source = kc.Cache.get(url);
		_this.stop();
		_this.play();
	},
	/**
	 * change source by id
	 * @param  {string} url
	 * @memberOf! kc.Audio#
	 */
	changeSourceById: function(id){
		var resource = kc.Project.getResourceForKey(audioPropertys.src.id);
		_this.sourceId = audioPropertys.src.id;
		if(resource && resource.resURL && resource.resURL!=''){
			var sourceUrl = ResRoot + resource.resURL.substr(1);
			_this.source = kc.Cache.get(sourceUrl);
			_this.stop();
			_this.play();
		}
	},

	/**
	 * get audio sourceId 
	 * @memberOf! kc.Audio#
	 */
	getSourceId :function(){
		return this.sourceId;
	},



	/**
	 * set audio info 
	 * @memberOf! kc.Audio#
	 * @param {String}  src    	this music path
	 * @param {Number}  volume 	1-100
	 * @param {Boolean}  loop  
	 * @param {Boolean}  autoPay  auto pay
	 * @param {String}  type   	Music or Effect
	 */
	_setAudio: function(src, volume, loop, autoPay, type) {
		var _this = this;
		_this.source = kc.Cache.get(src);
		_this.bAutoPlay = autoPay;
		_this.bLoop = loop;
		_this.btype = type;
		_this.bVolumne = volume;
		if (_this.bAutoPlay) {
			_this.play();
		}
	},

	/**
	 * set audio info 
	 * @memberOf! kc.Audio#
	 * @param {Number}  volume 	1-100
	 */
	 setAudioVolume: function(volume){
	 	var _this = this;
	 	_this.bVolumne = volume;
	 	_this.controlObj.setAudioVolume(_this.bVolumne);
	 },

	 /**
	 * get audio info 
	 * @memberOf! kc.Audio#
	 * @param {Number}  volume 	1-100
	 */
	 getAudioVolume: function(){
	 	return this.bVolumne;
	 },

	/**
	 * play interfaces
	 * @memberOf! kc.Audio#
	 */
	play: function() {
		var _this = this;
		if (_this.source) {
			var funcName = null;
			switch (_this.btype) {
				case 'MusicType':
					funcName = 'playMusic';
					break;
				case 'EffectType':
					funcName = 'playEffect';
					break;
				default:
					break;
			}

			if (funcName) {
				_this.currentAudio = _this.controlObj[funcName](_this.source, _this.bVolumne, _this.bLoop);
			}
		}
	},

	

	/**
	 * stop interfaces
	 * @memberOf! kc.Audio#
	 */
	stop: function () {
		var _this = this;
		if(this.btype === 'MusicType') {
			_this.controlObj.stopMusic();
		} else if(this.btype === 'EffectType' && this.currentAudio) {
			_this.controlObj.stopEffect(this.currentAudio);
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file BMap.js
 * @author langcheng.lai
 */

var kc = kc || {};

/**
 * <p>kc.BMap is the component BaiDu Map.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.BMap
 * @extends kc.Component
 */
kc.BMap = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType:'BMap',

	/**
	 * Destination
	 * @memberOf kc.BMap#
	 * @type {String}
	 */
	destination:null,


	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineBMap();

	},

	clear: function () {
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.BMap#
     */
    _parse: function () {
        var _this = this;
        var BMapPropertys = _this._propertys;

		var destination = BMapPropertys.destination;
		var width = BMapPropertys.width;
		var height = BMapPropertys.height;

		_this.setDestination(destination, "drive");
		_this.setSize(width, height);
    },

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.BMap#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	/**
	 * Set BMap destination info
	 * @memberOf! kc.BMap#
	 * @override
	 */
	setDestination: function (destination, type) {
		var _this = this;
		_this.destination = destination;
		_this.controlObj.setDestination(destination, type);
	},

	/**
	 * Get BMap destination 
	 * @memberOf! kc.BMap#
	 */
	getDestination: function () {
		var _this = this;
		return _this.destination;
	},

	/**
	 * Set BMap size info
	 * @memberOf! kc.BMap#
	 * @override
	 */
	setSize: function (width, height) {
		var _this = this;
		_this.controlObj.setSize(width, height);
		_this.gameObject.setSize(width, height);
	},

	/**
	 * Get BMap size 
	 * @memberOf! kc.BMap#
	 */
	getSize: function () {
		var _this = this;
		return _this.gameObject.size;
	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file BroadCast.js
 * @author geng_qz
 */

var kc = kc || {};

/**
 * <p>kc.BroadCast is the component handles  BroadCast.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.BroadCast
 * @extends kc.Class
 */
kc.BroadCast = kc.Component.extend({
    /**
     * object type
     * @type {String}
     * @memberOf! kc.BroadCast#
     */
    ObjType: 'BroadCast',


    /**
     * logic id
     * @type {Number}
     * @memberOf! kc.BroadCast#
     */
    logicId:null,

    /**
     * construct Function of Object
     * @extends {kc.Component}
     * @ignore
     */
    ctor: function() {
        var _this = this;
        kc.Component.prototype.ctor.call(_this);

    },

    clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

    /**
     * parse component data
     * @override
     * @memberOf! kc.Input#
     */
    _parse: function () {
        console.log("~~~~~~~~~~~~~~_parse msg is:");
        var _this = this;
        var propertys = _this._propertys;
        var name = propertys.label;
        if(name){
            _this._createRoom(name);
        }
        _this.logicId = propertys.logicSrc.id;
        if(_this.logicId){
            _this._reciveSocketMsg();
        }

    },

    /**
     * called when the component just is loaded
     * @memberOf! kc.Component#
     */
    onEvent:function(event){
        var _this = this;
        return _this[event.type]&&_this[event.type](event);
    },


    _reciveSocketMsg:function(){
        var _this = this;
        console.log("kc.NetManagersssssssss",kc.NetManager._mSocket);
        kc.NetManager._mSocket.on('message',function(obj){

            for (var k in obj){
                var _data = {};
                _data.data = obj[k];
                kc.webSocketResCache.addOneMsg(obj[GUESTUSERID]);
                var id =  _this.logicId;
                _this._doLogic(id);
                break;
            }
        });
    },

    _createRoom :function(name){
        var data = {
            title:name,
            ip:SERVERIP,
            port:SERVERPORT,
            isNew:0
        };
        kc.NetManager.sendMessage([0x5,0x1],data,true,"/ClientMsg",function(msg){
            console.log("create a zoom for broadCast!!!");
        });
    },


    /**
     * run logic if has
     * @memberOf! kc.Button#
     * @private
     */
    _doLogic:function(id){
        console.log("~~~~~~~~~~~~~~~doLogic function~~~~~~~~~~~~~~~~~~~");
        if(!id){
            return ;
        }
        var _this = this;
        var logic = kc["LogicClass_" + id];
        if (logic){
            var obj = new logic();
            obj.run(_this);
        }
    }

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Bullet.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Bullet is a component draw frame based animation.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Bullet
 * @extends kc.Component
 */
kc.Bullet = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Bullet#
	 */
	ObjType: 'Bullet',

	/**
	 * texture Cache
	 * @type {Object}
	 * @memberOf kc.Bullet#
	 * @private
	 */
	_textureCache: null,

	/**
	 * 发射间隔
	 * @memberOf! kc.Bullet#
	 * @type {array}
	 */
	launchInterval: null,

	/**
	 * 下一次发射时间
	 * @memberOf! kc.Bullet#
	 * @type {Number}
	 */
	_nextLaunchTime: 0,

	/**
	 * 自动删除
	 * @memberOf! kc.Bullet#
	 * @type {Number}
	 */
	autoRemove: null,

	/**
	 * 发射模式
	 * @type {Number}
	 * @memberOf! kc.Bullet#
	 */
	launchMode: null,

	/**
	 * playing
	 * @type {Boolean}
	 * @memberOf! kc.Bullet#
	 */
	bPlaying: false,

	/**
	 * 速度
	 * @memberOf! kc.Bullet#
	 * @type {Boolean}
	 */
	speed: 0,

	/**
	 * 子弹方向
	 * @memberOf! kc.Bullet#
	 * @type {Boolean}
	 */
	bulletsDirection: "UP",

	/**
	 * 所有目标
	 * @type {Array}
	 * @memberOf! kc.Bullet#
	 */
	_targets: null,

	/**
	 * 重新修改目标值
	 * @type {Boolean}
	 */
	restTargets: null,

	/**
	 * 所有的子弹数组
	 * @type {Array}
	 * @memberOf! kc.Bullet#
	 */
	_bullets: null,

	/**
	 * 所有碰撞子弹
	 * @type {Array}
	 * @memberOf! kc.Bullet#
	 */
	_hitBullerts: null,

	/**
	 * 发射的子弹
	 * @type {Array}
	 * @memberOf! kc.Bullet#
	 */
	_launchBullerts: null,

	/**
	 * 最大子弹数量
	 * @type {Array}
	 * @memberOf! kc.Bullet#
	 */
	maxBulletNum: 10,

	/**
	 * plist 数据
	 * @type {Object}
	 * @memberOf! kc.Bullet#
	 */
	_mPlistData:{},
	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this._targets = [];
		_this._bullets = [];
		_this._launchBullerts = [];

	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
		for (var ii in _this._bullets){
			_this._bullets[ii].obj.cleanup();
		}
		_this._bullets.length = 0;
		_this._targets.length = 0;
		_this._launchBullerts.length = 0;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Bullet#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var imgID = propertys.imageFile.id;
		var launchInterval = propertys.launchInterval;
		var autoRemove = propertys.autoRemove;
		var launchMode = propertys.launchMode;
		var flySpeed = propertys.flySpeed;

		var resInfo = kc.Project.getResourceForKey(propertys.imageFile.id);
		if(resInfo && resInfo.resURL && resInfo.resURL!=''){
			_this.setBulletPng(ResRoot + resInfo.resURL.substr(1));
		}

		_this.setLaunchMode(launchMode);
		_this.setLaunchInterval(launchInterval);
		_this.setSpeed(flySpeed);
		_this.setAutoRemove(autoRemove);
		_this.play();
	},

	/**
	 * set Max Bullet Mun
	 * @param {Number} maxMun
	 * @memberOf! kc.Bullet#
	 */
	setMaxBulletMun:function(maxMun){
		this.maxBulletNum = maxMun;
	},

    /**
     * get max Bullet Mun
     * @returns {Array}
     */
    getMaxBulletMun:function(){
        return this.maxBulletNum;
    },

	/**
	 * set bullets direction
	 * @param {number} 0,1,2,3 分别代表上下左右
	 * @memberOf! kc.Bullet#
	 */
	setBulletsDirection: function(direction) {
		var _this = this;
		switch (direction) {
			case 0:
				_this.bulletsDirection = "UP";
				break;
			case 1:
				_this.bulletsDirection = "DOWN";
				break;
			case 2:
				_this.bulletsDirection = "LEFT";
				break;
			case 3:
				_this.bulletsDirection = "RIGHT";
				break;
			default:
				_this.bulletsDirection = "UP";
		}
	},

	/**
	 * create bullerts pool
	 * @param {number} number max number
	 * @private
	 * @memberOf! kc.Bullet#
	 */
	createBullerts: function(number) {
		var _this = this;
		var createCount = number || _this.maxBulletNum;
		if (_this._bullets.length > 0){
			for (var ii in _this._bullets){
				_this._bullets[ii].obj.cleanup();
			}
			_this._bullets.length = 0;
		}
		for (var i = 0; i < createCount; i++) {
			var object = {};
			var bullert = new kc.EngineImage();
			if(!DEBUG && _this._mPlistData){
				bullert.setPlistTexture(_this._textureCache,_this._mPlistData);
			}else{
				bullert.setObjectTexture(_this._textureCache);
			}
			object.obj = bullert;
			object.used = false;
			object.bHitState = false;
			object.pos = {
				x: -99999,
				y: -99999
			};
			kc.Core.currentScene.engineScene.addChild(bullert);
			//_this.gameObject.engineObject.addChild(bullert);
			object.obj.setVisible(false);
			_this._bullets.push(object);
		}
	},

    /**
     * 获取子弹目标的数量
     * @returns {Number}
     */
    getBulletTargetNum: function(){
        return this._bullets.length;
    },

	/**
	 * 获得一个未使用的子弹
	 * get one bullet that it`s not used
	 * @memberOf! kc.Bullet#
	 */
	getUnBullet: function() {
		var bullets = this._bullets;
		var bullet = null;
		for (var i = 0; i < bullets.length; i++) {
			if (bullets[i] && !bullets[i].used) {
				bullet = bullets[i];
				bullet.index = i;
				break;
			}
		}
		return bullet;
	},

	// /**
	//  * 得到所有碰撞子弹
	//  * get hit bullets
	//  * @memberOf! kc.Bullet#
	//  */
	// getHitBullets: function() {
	// 	var bullets = this._bullets;
	// 	var hitBullerts = [];

	// 	var nCount = bullets.length;

	// 	for (var i = 0; i < nCount; i++) {
	// 		if (bullets[i]) {
	// 			if (bullets[i].bHitState) {
	// 				hitBullerts.push(bullets[i]);
	// 			}
	// 		}
	// 	}
	// 	return hitBullerts;
	// },

	/**
	 * 边界检测，如果子弹飞出则返回true
	 * get hit bullets
	 * @memberOf! kc.Bullet#
	 */
	_bulletBorderCheck: function(x, y) {
		var _this = this;
		var checkPos = {
			x: x,
			y: y
		};
		// if (_this.bulletsDirection == "UP") {
		// 	checkPos.x = x;
		// 	checkPos.y = y - _this.gameObject.size.height * 0.5;
		// } else if (_this.bulletsDirection == "DOWN") {
		// 	checkPos.x = x;
		// 	checkPos.y = y + _this.gameObject.size.height * 0.5;
		// } else if (_this.bulletsDirection == "LEFT") {
		// 	checkPos.x = x + _this.gameObject.size.width * 0.5;
		// 	checkPos.y = y;
		// } else if (_this.bulletsDirection == "RIGHT") {
		// 	checkPos.x = x - _this.gameObject.size.width * 0.5;
		// 	checkPos.y = y;
		// }
		var wordPos = checkPos;//_this.gameObject.convertToWorldSpace(checkPos);
		var winSize = kc.Core.getWinSize();

		if (wordPos.x < 0 || wordPos.x > winSize.width || wordPos.y < 0 || wordPos.y > winSize.height) {
			return true;
		}
	},

	/**
	 * 获取子弹目标
	 * get hit bullets
	 * @memberOf! kc.Bullet#
	 */
	getTagertList: function() {
		var _this = this;
		var targets = [];
		//if (!_this._targets[0]) {
			kc.traverseChildren(kc.Core.currentScene, function(obj) {
				if (obj.hitTarget && obj.group != _this.gameObject.group) {
					targets.push(obj);
				}
			});
		//}
		_this._targets = targets;

		return _this._targets;
	},

	/**
	 * 碰撞检测
	 * @memberOf! kc.Bullet#
	 */
	_bulletCollisionCheck: function(x, y) {
		var _this = this;
		var tagerts = _this.getTagertList();
		if (!tagerts[0]) {
			return;
		}
		var checkPos = {
			x: x,
			y: y
		};
		// if (_this.bulletsDirection == "UP") {
		// 	checkPos.x = x;
		// 	checkPos.y = y + _this.gameObject.size.height * 0.5;
		// } else if (_this.bulletsDirection == "DOWN") {
		// 	checkPos.x = x;
		// 	checkPos.y = y - _this.gameObject.size.height * 0.5;
		// } else if (_this.bulletsDirection == "LEFT") {
		// 	checkPos.x = x - _this.gameObject.size.width * 0.5;
		// 	checkPos.y = y;
		// } else if (_this.bulletsDirection == "RIGHT") {
		// 	checkPos.x = x + _this.gameObject.size.width * 0.5;
		// 	checkPos.y = y;
		// }
		var wordPos = checkPos;//_this.gameObject.convertToWorldSpace(checkPos);
		for (var k in tagerts) {
			var one = tagerts[k];
			if (one.tag !=_this.gameObject.tag){
				if (kc.isPosIn(wordPos.x, wordPos.y, one)) {
					var events = one.getComponents("Event");
					for (var kk in events) {
						var eventOne = events[kk];
						if (eventOne.eventType == "by-bullet-hit") {
							eventOne.doLogic(eventOne.logicId);
						}
					}
					tagerts.splice(Number(k),1);
					return true;
				}
			}
		}
	},

	/**
	 * 发射子弹
	 * @memberOf! kc.Bullet#
	 */
	launchBullet: function() {
		var oneBullet = this.getUnBullet();
		if (oneBullet) {
			var pos = this.gameObject.convertToWorldSpace({x:0, y:0});
			oneBullet.pos.x = pos.x;
			oneBullet.pos.y = pos.y;
			oneBullet.used = true;
			oneBullet.obj.setVisible(true);
			this._launchBullerts.push(oneBullet);
		}
	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.Bullet#
	 * @override
	 */
	update: function() {
		var _this = this;

		if (!_this.bPlaying) {
			return;
		}

		if (_this.launchMode == 1 && !_this._launchBullerts[0]){
			_this.bPlaying = false;
		}

		for (var k = _this._launchBullerts.length-1;k>=0;k--){
			var one = _this._launchBullerts[k];
			var isRemove = false;

			if (_this._bulletCollisionCheck(one.pos.x, one.pos.y)) {
				isRemove = true;
			} else if (_this._bulletBorderCheck(one.pos.x, one.pos.y)) {
				isRemove = true;
			}
			
			if (isRemove) {
				if (_this.autoRemove) {
					_this._removeBullet(one);
					_this._launchBullerts.splice(Number(k),1);
					_this._bullets.splice(one.index,1);
				} else {
					_this._launchBullerts.splice(Number(k),1);
					_this._resBullet(one);
				}
			}else{
				var nextPos = _this._nextPos(one.pos.x, one.pos.y);
				one.pos.x = nextPos.x;
				one.pos.y = nextPos.y;
				one.obj.setPosition(nextPos.x, nextPos.y);
			}
		}

		_this._nextLaunchTime -= kc.deltaTime;
		if (_this._nextLaunchTime <= 0) {
			_this._nextLaunchTime = _this.launchInterval;
			if (_this.launchMode == 0) {
				_this.launchBullet();
			}
		}
	},

	/**
	 * bulle remove
	 * @memberOf! kc.Bullet#
	 */
	_removeBullet:function(bullet){
		bullet.obj.cleanup();
	},

	_resBullet: function(obj) {
		obj.used = false;
		obj.bHitState = false;
		obj.pos = {
			x: -99999,
			y: -99999
		};
		obj.obj.setPosition(-99999, -99999);//放在屏幕外
		obj.obj.setVisible(false);
	},

	/**
	 * get next position
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Object}
	 */
	_nextPos: function(x, y) {
		var _this = this;
		var nextX = 0;
		var nextY = 0;
		if (_this.bulletsDirection == "UP") {
			nextX = x;
			nextY = y + _this.speed;
		} else if (_this.bulletsDirection == "DOWN") {
			nextX = x;
			nextY = y - _this.speed;
		} else if (_this.bulletsDirection == "LEFT") {
			nextX = x - _this.speed;
			nextY = y;
		} else if (_this.bulletsDirection == "RIGHT") {
			nextX = x + _this.speed;
			nextY = y;
		}
		var pos = {
			x: nextX,
			y: nextY
		};
		return pos;
	},

	/**
	 * set png src
	 * @param {String} pngSrcUrl
	 * @memberOf! kc.Bullet#
	 */
	setBulletPng: function(pngSrcUrl) {
		var _this = this;
		var plistTexture = kc.getPlistTexture(pngSrcUrl);
		if(!DEBUG && plistTexture.plistData){
			_this._textureCache = plistTexture.texture;
			var plistData = plistTexture.plistData;
			_this._mPlistData = plistTexture.plistData;
			_this.gameObject.setSize(plistData.sourceSize.width, plistData.sourceSize.height);
		}else{
			_this._textureCache = kc.Cache.get(pngSrcUrl);
			_this.gameObject.setSize(_this._textureCache.width, _this._textureCache.height);
		}
		_this.createBullerts();
	},

	/**
	 * get size
	 * @memberOf! kc.Bullet#
	 * @return {object} size
	 */
	getSize:function(){
		return this.gameObject.size;
	},

	/**
	 * 设置对象模式
	 * @param {Number} mode
	 * @memberOf! kc.Bullet#
	 */
	setLaunchMode: function(mode) {
		var _this = this;
		_this.launchMode = Number(mode);
	},

	/**
	 * 设置间隔时间
	 * @param {Number} mode
	 * @memberOf! kc.Bullet#
	 */
	setLaunchInterval: function(interval) {
		var _this = this;
		_this.launchInterval = Number(interval);
	},

	/**
	 * set speed
	 * @memberOf! kc.Bullet#
	 * @param {Number} speed
	 */
	setSpeed: function(speed) {
		this.speed = Number(speed);
	},

	/**
	 * set auto remove
	 * @memberOf! kc.Bullet#
	 * @param {Number} speed
	 */
	setAutoRemove: function(remove) {
		this.autoRemove = remove;
	},

	/**
	 * 设置对象
	 * add Target
	 * @memberOf! kc.Bullet#
	 * @param {Object} tar
	 */
	addTarget: function(target) {
		if (target) {
			this._targets.push(target);
		}
	},

	/**
	 * 移除对象
	 * remove Target
	 * @memberOf! kc.Bullet#
	 * @param {Object} tar
	 */
	removeTarget: function(target) {
		if (target) {
			for (var i = 0; i < this._targets.length; i++) {
				if (this._targets[i] == target) {
					this._targets.splice(i, 1);
				}
			}
		}
	},

	/**
	 * 获取当前对象数量
	 * get Target Count
	 * @memberOf! kc.Bullet#
	 * @param {Object} tar
	 */
	getTargetCount: function() {
		return this._targets.length;
	},

	/**
	 * 获取当前位置对象
	 * get Target Count
	 * @memberOf! kc.Bullet#
	 * @param {Object} tar
	 */
	getTargetByIndex: function(index) {
		var targets = this._targets;
		var target = null;
		if (index >= 0 && index < targets.length) {
			if (targets[index]) {
				target = targets[index];
			}
		}
		return target;
	},

	/**
	 * play the animation
	 * @memberOf! kc.Bullet#
	 * @param {String} key
	 */
	play: function() {
		this.bPlaying = true;
	},

	/**
	 * pause the animation
	 * @memberOf! kc.Bullet#
	 */
	pause: function() {
		this.bPlaying = false;
	},

	/**
	 * resume the animation
	 * @memberOf! kc.Bullet#
	 */
	resume: function() {
		this.bPlaying = true;
	},

	/**
	 * inherit onClick
	 * @memberOf! kc.Event#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onClick: function(event) {
		var _this = this;
		if (!_this.launchMode) {
			return;
		}
		if (_this.launchMode == 1) {
			_this.launchBullet();
			_this.bPlaying = true;
			return _this.stopPropagation;
		}
	}

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Button.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Button is a component provide button function.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Button
 * @extends kc.Component
 */
kc.Button = kc.Render.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Button#
	 */
	ObjType: 'Button',

	/**
	 * set change list:"normalSrc,selectedSrc,movedSrc,disabledSrc"
	 * @type {Object}
	 * @memberOf! kc.Button#
	 */
	changeList:null,

	/**
	 * button event:"into","outside"
	 * @type {Boolean}
	 * @memberOf! kc.Button#
	 * @private
	 */
	_isInto:null,

	/**
	 * logic id
	 * @type {Number}
	 * @memberOf! kc.Button#
	 */
	logicId:null,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Render.prototype.ctor.call(_this);

		_this.changeList = {};
		_this._isInto = false;
		_this.controlObj = new kc.EngineImage();
		_this.logicId = null;
	},

	clear:function(){
		var _this = this;
		kc.Render.prototype.clear.call(_this);
		_this.changeList = null;
		_this._isInto = false;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Button#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys,
		resId = propertys.logicSrc.id;

		_this.addLogic(resId);
		_this.logicId = resId;
		//normalSrc,selectedSrc,movedSrc,disabledSrc
		var list = {};
		for (var srcId in propertys) {
			var obj = kc.Project.getResourceForKey(propertys[srcId].id);
			obj && obj.resURL && obj.resURL!='' && (list[srcId] = ResRoot + obj.resURL.substr(1));
		}

		_this._setChangeList(list);
		_this.setSrc(list["normalSrc"]);
	},

    /**
     * 设置逻辑ID
     * @param logicId
     */
    setLogicId: function(logicId){
        this.logicId = logicId;
    },

    /**
     * 获取逻辑ID
     * @returns {Number}
     */
    getLogicId: function(){
        return this.logicId;
    },

	/**
	 * set user can use or not in this button
	 * @param {Boolean} bool 
	 * @memberOf! kc.Button#
	 */
	setDisabled :function(bool){
		var _this = this;
		_this.disabled = bool;
		if (bool){
			_this.changeSrc(_this.changeList["disabledSrc"]);
		}else{
			_this.changeSrc(_this.changeList["normalSrc"]);
		}
	},

	/**
	 * called when the Button just is loaded
	 * @memberOf! kc.Button#
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
	},

	/**
	 * the button has four pictures,set it
	 * @memberOf! kc.Button#
	 * @param {Object} list
	 */
	_setChangeList:function(list){
		this.changeList = list;
	},

	/**
	 * inherit onMouseDown
	 * @memberOf! kc.Button#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}
	 */
	onMouseDown: function (event) {
		var _this = this;
		var changeObj = _this.changeList["selectedSrc"];
		if (changeObj && !_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
			_this.changeSrc(changeObj);
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseUp
	 * @memberOf! kc.Button#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseUp: function (event) {
		var _this = this;
		var changeObj = _this.changeList["normalSrc"];
		if (!_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){		
			_this.changeSrc(changeObj);
			_this.doLogic(_this.logicId);
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseMove
	 * @memberOf! kc.Button#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseMove:function(event){
		var _this = this;
		var changeObj = _this.changeList["movedSrc"];
		if (changeObj && !_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
			if (!_this._isInto){
				_this._isInto = true;
				_this.changeSrc(changeObj);
				return _this.stopPropagation;
			}
			_this.changeSrc(changeObj);
			return _this.stopPropagation;			
		}else if (!_this.disabled){
			if (_this._isInto){
				_this._isInto = false;
				_this.changeSrc(_this.changeList["normalSrc"]);
			}	
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Call.js
 * @author langcheng.lai
 */

var kc = kc || {};

/**
 * <p>kc.Call is the component Write text.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Call
 * @extends kc.Component
 */
kc.Call = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType:'Call',

	/**
	 * telephoneNum
	 * @memberOf kc.Call#
	 * @type {String}
	 */
	telephoneNum:null,

	/**
	 * text
	 * @memberOf kc.Call#
	 * @type {String}
	 */
	text:null,

	/**
	 * font
	 * @memberOf kc.Call#
	 * @type {String}
	 */
	font:null,

	/**
	 * font size
	 * @memberOf kc.Call#
	 * @type {Number}
	 */
	fontSize:null,

	/**
	 * color
	 * @memberOf kc.Call#
	 * @type {String}
	 */
	color:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineCall();

	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.Call#
     */
    _parse: function () {
        var _this = this;
        var CallPropertys = _this._propertys;
		var fonts = ["宋体","微软雅黑","黑体","楷书","华文行楷","华文新魏","隶书"];

		var telephoneNum = CallPropertys.telephoneNumber;
		var text = CallPropertys.label;
		var font = fonts[CallPropertys.font];
		var fontSize = CallPropertys.size;
		var color = CallPropertys.color;
		var width = CallPropertys.width;
		var height = CallPropertys.height;

		_this.setTelephoneNumber(telephoneNum);
		_this.setText(text);
		_this.setFont(font);
		_this.setFontSize(fontSize);
		_this.setColor(color);
		_this.setSize(width,height);
    },

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Call#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	/**
	 * inherit onMouseUp
	 * @memberOf! kc.call#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseUp: function(event) {
		var _this = this;
		if (kc.isPosIn(event.x,event.y,_this.gameObject)) {
			_this.controlObj.callPhone();
			return _this.stopPropagation;
		}
	},

	/**
	 * Set telephoneNum
	 * @memberOf! kc.Call#
	 * @override
	 */
	setTelephoneNumber: function (telephoneNum) {
		this.telephoneNum = telephoneNum;
		this.controlObj.setTelephoneNumber(telephoneNum);
	},

	/**
	 * get telephoneNum
	 * @memberOf kc.Call#
	 * @return {String}
	 */
	getTelephoneNumber:function(){
		return this.telephoneNum;
	},

	/**
	 * Set write text
	 * @memberOf! kc.Call#
	 * @override
	 */
	setText: function (text) {
		this.text = text;
		this.controlObj.setText(text);
	},

	/**
	 * get text
	 * @memberOf kc.Call#
	 * @return {String}
	 */
	getText:function(){
		return this.text;
	},

	/**
	 * Set font info
	 * @memberOf! kc.Call#
	 * @override
	 */
	setFont: function (font) {
		this.font = font;
		this.controlObj.setFont(font);
	},

	/**
	 * Set font size info
	 * @memberOf! kc.Call#
	 * @override
	 */
	setFontSize: function (fontSize) {
		this.fontSize = fontSize;
		this.controlObj.setFontSize(fontSize);
	},

	/**
	 * Set color info
	 * @memberOf! kc.Call#
	 * @override
	 */
	setColor: function (color) {
		this.color = color;
		this.controlObj.setColor(color);
	},

	/**
	 * Set text size info
	 * @memberOf! kc.Call#
	 * @override
	 */
	setSize: function (width,height) {
		var _this = this;
		_this.controlObj.setSize(width,height);
		_this.gameObject.setSize(width,height);
	},

	/**
	 * Get text size 
	 * @memberOf! kc.Call#
	 */
	getSize: function () {
		var _this = this;
		return _this.gameObject.size;
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Change.js
 * @author he_lt
 */

var kc = kc || {};

/**
 * <p>kc. is the component Change.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Change
 * @extends kc.Component
 */
kc.Change = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType:'Change',

	changeType:null,

	prototypes:null,
	proArray:[],

	id:0,
	nextId:null,
	preId:null,

	downPos:null,
	upPos:null,
	movePos:null,
	_movePos:null,

	isChanging:false,
	isClick:false,
	isNew:false,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
	},

	/**
     * parse component data
     * @override
     * @memberOf! kc.Change#
     */
    _parse: function () {
        var _this = this;
        var changePropertys = _this._propertys;
        var changeType = changePropertys.ChangeType;
        _this.changeType = changeType;
        _this.prototypes = changePropertys.number;
        var pos = {x:0,y:0};
		_this.proArray[1] = _this.newPrototype(_this.id,pos);
		_this.newAnothers();
		_this.completeLogic(_this.proArray[1]);
    },
    /**
     * parse new around two prototypes
     * @override
     * @memberOf! kc.Change#
     */
    newAnothers: function(){
    	var _this = this;
    	_this.isNew = true;
    	_this.nextId = _this.id + 1;
		_this.preId = _this.id - 1;
		_this.nextId = _this.nextId >=_this.prototypes.length?0:_this.id+1;
		_this.preId = _this.preId <0?null:_this.id - 1;
    	//新建前后两个原型
		var nextPosition,prePosition;
		var width = parseInt(kc.Core.getWinSize().width);
		var height = parseInt(kc.Core.getWinSize().height);
		if(_this.changeType=="0"){
			nextPosition = {x:0,y:height};
			prePosition = {x:0,y:-height};
		}else if(_this.changeType=="1"){
			nextPosition = {x:0,y:-height};
			prePosition = {x:0,y:height};
		}if(_this.changeType=="2"){
			nextPosition = {x:-width,y:0};
			prePosition = {x:width,y:0};
		}else if(_this.changeType=="3"){
			nextPosition = {x:width,y:0};
			prePosition = {x:-width,y:0};
		}
		_this.proArray[2] = _this.newPrototype(_this.nextId,nextPosition);
		_this.proArray[0] = _this.newPrototype(_this.preId,prePosition);
		if(_this.proArray[0]){
			_this.proArray[0].setVisible(false);
		}
		_this.proArray[2].setVisible(false);
		_this.isNew = false;
	},
    newPrototype: function(id,pos){
    	var _this = this;
    	if(id==undefined||id<0||id>=_this.prototypes.length) return;

        var fileInfo = kc.Project.getResourceForKey(_this.prototypes[id].id);
    	var parent = kc.Core.currentScene;
		var data = fileInfo.data;
		_this.resetWraperId(data.instance,  data.gameSetting);
		data.id = data.gameSetting[0].id;
		_this.createObject(data.instance,  data.gameSetting, parent);

		var obj = kc.ObjectManager.getObject(data.id);
		if(obj){
			obj.setPosition(pos.x + obj.position.x,pos.y + obj.position.y);
		}
		return obj;
    },
    createObject: function(wraperList, childs, parent){
		if(!childs || childs.length==0){
	        return;
	    }
	    var _this = this;

	    for(var i = 0; i < childs.length; i++) {
	    	var id = childs[i].id;
	    	var obj = new kc.Object();
	    	obj.setTag(id);
	    	parent.addChild(obj);
	    	kc.ObjectManager.addObject(obj.tag, obj);

	    	var components = wraperList[id].components;
	        for(var key in components){
	            var componentArray = components[key] || [];
	            for(var j=0,len=componentArray.length;j<len;++j){
	                if(kc[key]){
	                    var oneComponent = new kc[key]();
	                    obj.addComponent(key, oneComponent);
	                    oneComponent.setProperty(components[key][j].propertys);
	                }
	            }
	        }
	        _this.createObject(wraperList, childs[i].child, obj);
	    }
    },
    resetWraperId: function(wraperList, childs){
		if(!childs || childs.length==0){
	        return;
	    }
	    var _this = this;
	    var id, oldID;
	    for(var i = 0; i < childs.length; i++) {
	        id = UUID.generate();
	        oldID = childs[i].id;

	        wraperList[id] = wraperList[oldID];
	        delete wraperList[oldID];

	        childs[i].id = id;

	        _this.resetWraperId(wraperList, childs[i].child);
	    }
    },

	onMouseUp: function(event){
		var _this = this;
		
		if (_this.changeType==undefined||!_this.isClick||_this.isChanging){return;}
		_this.isClick = false;
		if(_this.downPos){
			_this.upPos = {x:event.x,y:event.y};
			var tempPos = {x:_this.upPos.x - _this.downPos.x,y:_this.upPos.y - _this.downPos.y};
			if(tempPos.x===0&&tempPos.y === 0){
				if(_this.proArray[0]){
					_this.proArray[0].setVisible(false);
				}
				_this.proArray[2].setVisible(false);
				return _this.stopPropagation;
			}
			if(_this.changeType=="0"){
				if(tempPos.y>100){//上移 切上一个原型
					if(_this.id===0){//第一张复位
						var pos = {x:0,y:-tempPos.y};
						_this.changeMove(1,pos,true,100);
					}else{
						var pos = {x:0,y:parseInt(kc.Core.getWinSize().height)- tempPos.y};
						_this.changeMove(0,pos,false);
					}
				}else if(tempPos.y<-100){//下移 切下一个原型
					var pos = {x:0,y:-(parseInt(kc.Core.getWinSize().height)+tempPos.y)};
					_this.changeMove(2,pos,false);
				}else{//复位
					if(tempPos.y<0){
						var pos = {x:0,y:-tempPos.y};
						_this.changeMove(1,pos,true,100);
					}else if(tempPos.y>0){
						var pos = {x:0,y:-tempPos.y};
						_this.changeMove(1,pos,true,100);
					}
				}
			}else if(_this.changeType=="1"){
				if(tempPos.y>100){//上移 切下一个原型
					var pos = {x:0,y:parseInt(kc.Core.getWinSize().height)- tempPos.y};
					_this.changeMove(2,pos,false);
				}else if(tempPos.y<-100){//下移 切上一个原型
					if(_this.id===0){//第一张复位
						var pos = {x:0,y:-tempPos.y};
						_this.changeMove(1,pos,true,100);
					}else{
						var pos = {x:0,y:-(parseInt(kc.Core.getWinSize().height)+tempPos.y)};
						_this.changeMove(0,pos,false);
					}
					
				}else{//复位
					if(tempPos.y<0){
						var pos = {x:0,y:-tempPos.y};
						_this.changeMove(1,pos,true,100);
					}else if(tempPos.y>0){
						var pos = {x:0,y:-tempPos.y};
						_this.changeMove(1,pos,true,100);
					}
				}
			}if(_this.changeType=="2"){
				if(tempPos.x>100){//右移 切后一个原型
					var pos = {x:parseInt(kc.Core.getWinSize().width)- tempPos.x,y:0};
					_this.changeMove(2,pos,false);
				}else if(tempPos.x<-100){//左移  切前一个原型
					if(_this.id===0){//第一张复位
						var pos = {x:-tempPos.x,y:0};
						_this.changeMove(1,pos,true,100);
					}else{
						var pos = {x:-(parseInt(kc.Core.getWinSize().width)+tempPos.x),y:0};
 						_this.changeMove(0,pos,false);
					}
					
				}else{//复位
					if(tempPos.x<0){
						var pos = {x:-tempPos.x,y:0};
						_this.changeMove(1,pos,true,100);
					}else if(tempPos.x>0){
						var pos = {x:-tempPos.x,y:0};
						_this.changeMove(1,pos,true,100);
					}
				}
			}else if(_this.changeType=="3"){
				if(tempPos.x>100){//右移 切前一个原型 
					if(_this.id===0){//第一张复位
						var pos = {x:-tempPos.x,y:0};
						_this.changeMove(1,pos,true,100);
					}else{
						var pos = {x:parseInt(kc.Core.getWinSize().width)- tempPos.x,y:0};
						_this.changeMove(0,pos,false);
					}
				}else if(tempPos.x<-100){//左移  切后一个原型
					var pos = {x:-(parseInt(kc.Core.getWinSize().width)+tempPos.x),y:0};
					_this.changeMove(2,pos,false);
				}else{//复位
					if(tempPos.x<0){
						var pos = {x:-tempPos.x,y:0};
						_this.changeMove(1,pos,true,100);
					}else if(tempPos.x>0){
						var pos = {x:-tempPos.x,y:0};
						_this.changeMove(1,pos,true,100);
					}
				}
			}
			
		}
		return _this.stopPropagation;
	},
	/**
	 * inherit onMouseMove
	 * @memberOf! kc.Change#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseMove:function(event){
		var _this = this;
		if (_this.changeType==undefined||_this.isChanging||!_this.isClick){return _this.stopPropagation;}
		
		//跟随移动
		_this._movePos = {x:event.x,y:event.y};
		var pos = {x:_this.movePos.x - _this._movePos.x,y:_this.movePos.y - _this._movePos.y};
		if(_this.changeType=="0"||_this.changeType=="1"){
			_this.proArray[1].setPosition(_this.proArray[1].position.x,_this.proArray[1].position.y-pos.y);
			_this.proArray[2].setPosition(_this.proArray[2].position.x,_this.proArray[2].position.y-pos.y);
			if(_this.proArray[0]!=undefined){
				_this.proArray[0].setPosition(_this.proArray[0].position.x,_this.proArray[0].position.y-pos.y);
			}	
		}else if(_this.changeType=="2"||_this.changeType=="3"){
			_this.proArray[1].setPosition(_this.proArray[1].position.x-pos.x,_this.proArray[1].position.y);
			_this.proArray[2].setPosition(_this.proArray[2].position.x-pos.x,_this.proArray[2].position.y);
			if(_this.proArray[0]!=undefined){
				_this.proArray[0].setPosition(_this.proArray[0].position.x-pos.x,_this.proArray[0].position.y);
			}	
		}
		_this.movePos = {x:event.x,y:event.y};
			
		return _this.stopPropagation;
	},

	/**
	 * inherit onMouseDown
	 * @memberOf! kc.Change#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseDown: function (event) {
		var _this = this;
		if (_this.changeType==undefined||_this.isChanging||_this.isNew){return _this.stopPropagation;}

		_this.isClick = true;

		if(_this.proArray[0])
			_this.proArray[0].setVisible(true);
		_this.proArray[2].setVisible(true);
		
		_this.downPos = {x:event.x,y:event.y};
		_this.movePos = {x:event.x,y:event.y};
	
		return _this.stopPropagation;
	},

	/**
	 * inherit changeMove
	 * @memberOf! kc.Change#
	 * @param  {number} 
	 * @param  {Object}  
	 * @param  {Boolean}  
	 */
	changeMove: function(id,pos,reset,time){
		var _this = this;
		var t = time||800;
		_this.isChanging = true;
		
		var srcCurX = _this.proArray[1].position.x;
		var srcCurY = _this.proArray[1].position.y;
		var targetCurX = srcCurX+pos.x;
		var targetCurY = srcCurY+pos.y;
		var src = {positionX:srcCurX,positionY:srcCurY};
		var tween = kc.TweenPool.acquireTween();
		tween.setValuesStart(src);
		tween.to({positionX:targetCurX,positionY:targetCurY},t);
		tween.onUpdate(function(percent){
			_this.proArray[1].setPosition(this.positionX,this.positionY);	
		});
		tween.onComplete(function(){
			_this.proArray[1].delTweenOjb(tween);
			if(!reset){
				_this.proArray[1].removeFromParent();
				delete _this.proArray[1];
			}
			_this.isChanging = false;
		}); 
		_this.proArray[1].addTweenObj(tween);
		tween.start();

		if(_this.proArray[0]){
			var srcPreX = _this.proArray[0].position.x;
			var srcPreY = _this.proArray[0].position.y;
			var targetPreX = srcPreX+pos.x;
			var targetPreY = srcPreY+pos.y;
			var src = {positionX:srcPreX,positionY:srcPreY};
			var PreTween = kc.TweenPool.acquireTween();
			PreTween.setValuesStart(src);
			PreTween.to({positionX:targetPreX,positionY:targetPreY},t);
			PreTween.onUpdate(function(percent){
				_this.proArray[0].setPosition(this.positionX,this.positionY);	
			});
			PreTween.onComplete(function(){
				_this.proArray[0].delTweenOjb(PreTween);
				
				_this.isChanging = false;
			});
			_this.proArray[0].addTweenObj(PreTween);
			PreTween.start();
		}

		var srcNextX = _this.proArray[2].position.x;
		var srcNextY = _this.proArray[2].position.y;
		var targetNextX = srcNextX+pos.x;
		var targetNextY = srcNextY+pos.y;
		var src = {positionX:srcNextX,positionY:srcNextY};
		var nextTween = kc.TweenPool.acquireTween();
		nextTween.setValuesStart(src);
		nextTween.to({positionX:targetNextX,positionY:targetNextY},t);
		nextTween.onUpdate(function(percent){
			_this.proArray[2].setPosition(this.positionX,this.positionY);	
		});
		nextTween.onComplete(function(){
			_this.proArray[2].delTweenOjb(nextTween);

			if(reset){
				if(_this.proArray[0]){
					_this.proArray[0].setVisible(false);	
				}
				_this.proArray[2].setVisible(false);

			}else{
				_this.proArray[1] = _this.proArray[id];
				if(id===2){
					_this.id = _this.nextId;
					if(_this.proArray[0]){
						_this.proArray[0].removeFromParent();
						delete _this.proArray[0];		
					}
				}else if(id===0){
					_this.id = _this.preId;
					_this.proArray[2].removeFromParent();
					delete _this.proArray[2];
				}
				_this.newAnothers();
				_this.completeLogic(_this.proArray[1]);
			}
			
			_this.isChanging = false;
		});
		_this.proArray[2].addTweenObj(nextTween);
		nextTween.start();
		

		
	},
	completeLogic:function(obj){
		if(!obj || obj.length==0){
	        return;
	    }
	    var _this = this;
    	var components = obj.components;
    	for(var events in components){
    		if(events == "Event"){
    			for(var j = 0;j<components[events].length;j++){
    				var type = components[events][j].eventType;
    				if(type == "completeChange")
    				{
    					var id = components[events][j].logicId;
    					components[events][j].doLogic(id);
    				}
    			}
    		}
    	}
    	for(var i=0;i<obj.children.length;i++){
    		_this.completeLogic(obj.children[i]);
    	}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file CheckBox.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.CheckBox is a component provide CheckBox function.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.CheckBox
 * @extends kc.Component
 */
kc.CheckBox = kc.Render.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.CheckBox#
	 */
	ObjType: 'CheckBox',

	/**
	 * set change list:"normalSrc,selectedSrc,movedSrc,disabledSrc"
	 * @memberOf! kc.CheckBox#
	 * @type {Object}
	 */
	changeList:null,

	/**
	 * CheckBox event:"into","outside"
	 * @memberOf! kc.CheckBox#
	 * @type {Boolean}
	 * @private
	 */
	_isInto:null,

	/**
	 * logic id
	 * @type {Number}
	 * @memberOf! kc.CheckBox#
	 */
	logicId:null,

	/**
	 * 0、normal 1、select
	 * @memberOf! kc.CheckBox#
	 * @private
	 */
	_state:false,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Render.prototype.ctor.call(_this);
		
		_this.changeList = {};
		_this._isInto = false;
		_this.controlObj = new kc.EngineImage();
		_this.logicId = null;
	},

	clear:function(){
		var _this = this;
		kc.Render.prototype.clear.call(_this);
		_this.changeList = null;
		_this._isInto = false;
	},

	/**
	 * get state
	 * @return {Boolean} state
	 */
	getState:function(){
		return this._state;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.CheckBox#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var	resId = propertys.logicSrc.id;

		_this.addLogic(resId);
		_this.logicId = resId;
		//normalSrc,selectedSrc,nodeNormalSrc,nodeDisabledSrc
		var list = {};
		for (var srcId in propertys) {
			var obj = kc.Project.getResourceForKey(propertys[srcId].id);
			obj && obj.resURL && obj.resURL!='' && (list[srcId] = ResRoot + obj.resURL.substr(1));
		}

		_this._setChangeList(list);
		_this.setSrc(list["normalSrc"]);
	},

    /**
     * 设置逻辑ID
     * @param logicId
     */
    setLogicId: function(logicId){
        this.logicId = logicId;
    },

    /**
     * 获取逻辑ID
     * @returns {Number}
     */
    getLogicId: function(){
        return this.logicId;
    },

	/**
	 * set user can use this button
	 * @memberOf! kc.CheckBox#
	 * @param {Boolean} bool 
	 */
	setDisabled :function(bool){
		var _this = this;
		_this.disabled = bool;
		if (bool){
			var changeObj = _this._state? _this.changeList["nodeDisabledSrc"] : _this.changeList["nodeNormalSrc"];
			_this.changeSrc(changeObj);
		}else{
			var changeObj = _this._state? _this.changeList["normalSrc"] : _this.changeList["selectedSrc"];
			_this.changeSrc(changeObj);
		}
	},
	
	/**
	 * called when the CheckBox just is loaded
	 * @memberOf! kc.CheckBox#
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
	},

	/**
	 * the CheckBox has four pictures,set it
	 * @memberOf! kc.CheckBox#
	 * @param {Object} list
	 */
	_setChangeList:function(list){
		this.changeList = list;
	},

	/**
	 * inherit onMouseDown
	 * @param  {Object} event event.type/event.x/event.y
	 * @memberOf! kc.CheckBox#
	 * @return {Boolean}      
	 */
	onMouseDown: function (event) {
		var _this = this;
		if (!_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
			var changeObj = _this._state? _this.changeList["normalSrc"] : _this.changeList["selectedSrc"];
			_this._state = !_this._state;
			_this._isInto = true;
			_this.changeSrc(changeObj);
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseUp
	 * @param  {Object} event event.type/event.x/event.y
	 * @memberOf! kc.CheckBox#
	 * @return {Boolean}      
	 */
	onMouseUp: function (event) {
		var _this = this;
		if (!_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
			// _this._state && _this._doLogic();
			_this.doLogic(_this.logicId);
			_this._isInto = false;
			return _this.stopPropagation;
		}
	}

	/**
	 * inherit onMouseMove
	 * @param  {Object} event event.type/event.x/event.y
	 * @memberOf! kc.CheckBox#
	 * @return {Boolean}
	 */
	/*onMouseMove:function(event){
		var _this = this;
		if (_this._isInto && !kc.isPosIn(event.x,event.y,_this.gameObject)){
			_this._isInto = false;
			var changeObj = _this._state? _this.changeList["normalSrc"] : _this.changeList["selectedSrc"];
			_this._state = !_this._state;
			_this.changeSrc(changeObj);
		}
	}*/
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Collision.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Collision is a component draw frame based animation.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Collision
 * @extends kc.Component
 */
kc.Collision = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Collision#
	 */
	ObjType: 'Collision',
	/**
	 * Collision with
	 * @memberOf! kc.Collision#
	 * @type {array}
	 */
	collisionWidth: 1,

	/**
	 * collision height
	 * @memberOf! kc.Collision#
	 * @type {Number}
	 */
	collisionHeight: 1,

	/**
	 * group
	 * @type {Number}
	 * @memberOf! kc.Collision#
	 */
	group: 0,
	
	ctor: function() {
		kc.Component.prototype.ctor.call(this);
	},

	clear:function(){
		var _this = this;
		kc.CollisionManager.removeCollision(_this.gameObject);
		_this._collisionWith = 1;
		_this._collisionWith = 1;
		_this._group = 0;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Collision#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var width = propertys.size.width;
		var height = propertys.size.height;
		var group = propertys.group;

		kc.CollisionManager.addCollision(_this.gameObject);
		_this.setCollisionSize(width,height);
		_this.setGroup(group);
	},

	/**
	 * set collision Size
	 * @memberOf! kc.Collision#
	 * @param {Object} actions
	 */
	setCollisionSize:function(width,height){
		var _this = this;
		_this.collisionWidth = Number(width) || 1;
		_this.collisionHeight = Number(height) || 1;
		kc.CollisionManager.setSize(_this.gameObject,_this.collisionWidth,_this.collisionHeight);
	},

	/**
	 * set group
	 * @memberOf! kc.Collision#
	 * @param {Number} index
	 */
	setGroup:function(index){
		var _this = this;
		this.group = Number(index) || 0;
		kc.CollisionManager.setGroup(_this.gameObject,this.group);
	}
});

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file PerspectiveCamera.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.DeviceOrientationControls is the component draw on screen.
 * </p>
 * @class
 * @name kc.DeviceOrientationControls
 * @extends kc.Class
 */
kc.DeviceOrientationControls = kc.Component.extend({

	camera: null,
	effects: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function (camera) {
		this.camera = camera;
		kc.Component.prototype.ctor.call(this);

		if (window.DeviceOrientationEvent) {
			this.controllor = new kc.EngineDeviceOrientationControls(camera);
		} else {
			this.controllor = new THREE.OrbitControls(camera, kc.Core._root);

			this.controllor.target.set(
				camera.position.x + 0.1,
				camera.position.y,
				camera.position.z
			);
			this.controllor.enableZoom = true;
			this.controllor.enablePan = true;
			this.controllor.autoRotate = true;
		}
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.DeviceOrientationControls#
	 * @override
	 */
	onAwake: function () {

	},

	/**
	 * called before the first update called
	 * @memberOf! kc.DeviceOrientationControls#
	 * @override
	 */
	onStart: function () {
		this.bStarted = true;
	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.DeviceOrientationControls#
	 * @override
	 */
	update: function () {
		var width = kc.Core._root.offsetWidth;
		var height = kc.Core._root.offsetHeight;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		//kc.renderer.setSize(width, height);
		//effect.setSize(width, height);

		this.controllor.update();
	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.DeviceOrientationControls#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.DeviceOrientationControls#
	 * @override
	 */
	onDestory: function () {

	}
});


// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file DirectionalLight.js
 * @author Zhao Hui
 */

var kc = kc || {};

/**
 * <p>kc.DirectionalLight is the component contains an DirectionalLight.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.DirectionalLight
 * @extends kc.Class
 */
kc.DirectionalLight = kc.Component.extend({

	directionalLight:null,
	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		kc.Component.prototype.ctor.call(this);
		this.directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.DirectionalLight#
	 * @override
	 */
	onAwake: function () {
		if(this.gameObject) {
			var component = this.gameObject.getComponents('DirectionalLight')[0];
		}
	},

	/**
	 * called before the first update called
	 * @memberOf! kc.DirectionalLight#
	 * @override
	 */
	onStart: function () {

	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.DirectionalLight#
	 * @override
	 */
	update: function () {

	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.DirectionalLight#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.DirectionalLight#
	 * @override
	 */
	onDestory: function () {

	}
});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Drag.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Drag is the component handles object's Drag.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Drag
 * @extends kc.Class
 */
kc.Drag = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Drag#
	 */
	ObjType: 'Drag',

	/**
	 * current position
	 * @type {Object}
	 * @memberOf! kc.Drag#
	 */
	currentPos: null,


	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.currentPos = {};
		kc.Storage.Darg = kc.Storage.Darg || [];
		kc.Storage.Darg.push(_this);
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
		_this.currentPos = null;

		for (var k in kc.Storage.Darg){
			var one = kc.Storage.Darg[k];
			if (one == _this){
				kc.Storage.Darg.splice(Number(k),1);
				return;
			}
		}
	},
	
	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Drag#
	 */
	_parse: function () {
		var _this = this;
		var eventPropertys = _this._propertys;
		for(var i = 0;i < 3;i ++){
		    var key = "file" + i;
		    var resId = eventPropertys[key].id;
		    _this._addLogic(resId,i);
		}
	},

	/**
	 * inherit component addLogic
	 * @memberOf! kc.Drag#
	 * @param {Number} id
	 * @param {Number} key 0、before 1、moving 2、last
	 */
	_addLogic: function(id, key) {
		var _this = this;
		if (id) {
			_this.logics[key] = kc["LogicClass_" + id];
		}
	},

	/**
	 * drag in
	 * @memberOf! kc.Drag#
	 * @param  {Object} event
	 * @return {boolean}
	 */
	_dragIn:function(event){
		if (kc.isPosIn(event.x, event.y, this.gameObject)) {
			return true;
		}
	},

	/**
	 * inherit onMouseDown
	 * @memberOf! kc.Drag#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseDown: function(event) {
		var _this = this;
		if (kc.isPosIn(event.x, event.y, _this.gameObject)) {
			_this.currentPos.x = event.x;
			_this.currentPos.y = event.y;
			_this.doLogic(0);
			_this.draggedStart = true;
			NotifyCenter.getInstance().publish("NotifyDraged", _this.draggedStart);
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseUp
	 * @memberOf! kc.Drag#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseUp: function(event) {
		var _this = this;
		if (_this.draggedStart) {
			_this.draggedStart =false;
			_this.doLogic(2);
			NotifyCenter.getInstance().publish("NotifyDraged", _this.draggedStart);
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseMove
	 * @memberOf! kc.Drag#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseMove: function(event) {
		var _this = this;
		if (_this.draggedStart) {
			var objPosX = _this.gameObject.position.x;
			var objPosY = _this.gameObject.position.y;

			_this.gameObject.setPosition(objPosX + event.x - _this.currentPos.x, objPosY + event.y - _this.currentPos.y);

			_this.currentPos.x = event.x;
			_this.currentPos.y = event.y;

			_this.doLogic(1);
			return _this.stopPropagation;
		}

	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Event.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Event is the component handles object's event.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Event
 * @extends kc.Class
 */
kc.Event = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Event#
	 */
	ObjType: 'Event',

	/**
	 * run logic type
	 * @memberOf! kc.Event#
	 * @type {String}
	 */
	eventType:null,

	/**
	 * logic id
	 * @type {Number}
	 * @memberOf! kc.Event#
	 */
	logicId:null,

	/**
	 * is doing
	 * @memberOf! kc.Event#
	 * @type {Boolean}
	 */
	_isDoing:null,

	/**
	 * is draged
	 * @memberOf! kc.Event#
	 * @type {Boolean}
	 */
	_isDraged:false,


	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
		NotifyCenter.getInstance().subscribe("NotifyDraged", function(topic, bool) {
			_this._isDraged = bool;
		});
	},

	clear:function(){
		var _this = this;
		NotifyCenter.getInstance().unsubscribe("NotifyDraged");
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Event#
	 */
	_parse: function () {
		var _this = this;
		var eventPropertys = _this._propertys;
		var eventList = ["intoScene","click","mousedown","mouseup","dragged","cross","anywhereDown","anywhereUp","into","outside","by-bullet-hit","be-collision","completeChange"];
		var resId = eventPropertys.file.id;
		var eventType = eventList[eventPropertys.EventType];

		_this.setLogicId(resId);
		_this.setEventType(eventType);
	},

	/**
	 * set event type
	 * @memberOf! kc.Event#
	 * @param {String} type {"intoScene","click","mousedown","mouseup","dragged","cross","anywhereDown","anywhereUp","into","outside"}
	 */
	setEventType:function(type){
		var _this = this;
		_this.eventType = type;
		if (type == "intoScene"){
			_this._isDoing = false;
		}else if (type == "by-bullet-hit"){
			_this.gameObject.hitTarget = true;
		}
	},

	/**
	 * set Logic ID
	 * @memberOf! kc.Event#
	 * @param {Number} id
	 */
	setLogicId:function(resId){
		var _this = this;
		_this.addLogic(resId);
		_this.logicId = resId;
	},

	/**
	 * 判断事件是否是此对象最后一个，因为事件和事件之间也会出现冒泡屏蔽。
	 * @memberOf! kc.Event#
	 * @return {Boolean}
	 */
	_isLastEvent:function(){
		return this.gameObject.getComponents("Event")[0] == this;
	},

	/**
	 * inherit onClick
	 * @memberOf! kc.Event#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	_onClick:function (event) {
		var _this = this;
		if (_this.eventType != "click"){return;}
		if (kc.isPosIn(event.x,event.y,_this.gameObject)){
			_this.doLogic(_this.logicId);
			return _this.stopPropagation;
		}
	},

	_dargStop:function(event){
		for (var k in kc.Storage.Darg){
			var one = kc.Storage.Darg[k];
			if (one._dragIn(event)){
				return true;
			}
		}
	},

	/**
	 * inherit onMouseDown
	 * @memberOf! kc.Event#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseDown: function (event) {
		var _this = this;
		if (!_this.eventType || _this._isDraged){return;}

		if (_this.eventType=="anywhereDown" ){
			if (_this._dargStop(event)){
				return false;
			}else{
				_this.doLogic(_this.logicId);
				return _this.stopPropagation;
			}			
		}else if(kc.isPosIn(event.x,event.y,_this.gameObject)){
			if(_this.eventType=="dragged"){
				_this.draggedStart = true;
				return _this.stopPropagation &&_this._isLastEvent();
			}else if(_this.eventType=="mousedown"){
				_this.doLogic(_this.logicId);
				return _this.stopPropagation &&_this._isLastEvent();
			}
			if (_this.eventType=="mousedown" || _this.eventType=="click" ||_this.eventType=="mouseup"){
				return _this.stopPropagation &&_this._isLastEvent();
			}
		}
	},

	/**
	 * inherit onMouseUp
	 * @memberOf! kc.Event#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseUp: function (event) {
		var _this = this;
		if (!_this.eventType || _this._isDraged){return;}

		if (_this.eventType=="anywhereUp" ){
			if (_this._dargStop(event)){
				return false;
			}else{
				_this.doLogic(_this.logicId);
				return _this.stopPropagation;
			}
		}else if(_this.eventType=="dragged"){
			_this.draggedStart = false;
		}else if (kc.isPosIn(event.x,event.y,_this.gameObject)){
			if(_this.eventType=="mouseup"){
				_this.doLogic(_this.logicId);
				return _this.stopPropagation && _this._isLastEvent();
			}else if(_this.eventType=="click"){
				return _this._onClick(event);
			}
			if (_this.eventType=="mousedown" || _this.eventType=="click" ||_this.eventType=="mouseup"){
				return _this.stopPropagation &&_this._isLastEvent();
			}
		}
	},

	/**
	 * inherit onMouseMove
	 * @memberOf! kc.Event#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseMove:function(event){
		var _this = this;
		if (!_this.eventType || _this._isDraged){return;}

		if (kc.isPosIn(event.x,event.y,_this.gameObject)){
			if(_this.eventType=="dragged"){
				_this.draggedStart && _this.doLogic(_this.logicId);
			}else if(_this.eventType=="into"){
				if (!_this.isInto){
					_this.isInto = true;
					_this.doLogic(_this.logicId);
				}
			}
			_this.isInto = true;
			return (_this.eventType=="dragged" || _this.eventType=="into") && _this.stopPropagation && _this._isLastEvent();
		}else{
			if (_this.eventType=="outside" || _this.eventType=="cross"){
				if (_this.isInto){
					_this.isInto = false;
					_this.doLogic(_this.logicId);
					return _this.stopPropagation;
				}			
			}
			_this.isInto = false;
		}

	},

	/**
	 * called evert
	 * @memberOf! kc.Event#
	 * @override
	 */
	update: function () {
		var _this = this;
		if (!_this._isDoing &&_this.eventType == "intoScene" && kc.Core.currentScene && kc.Core.currentScene.m_inited){
			_this.doLogic(_this.logicId);
			_this._isDoing = true;
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file GamePay.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.GamePay is the component handles object's event.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.GamePay
 * @extends kc.Class
 */
kc.GamePay = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.GamePay#
	 */
	ObjType: 'GamePay',

	/**
	 * client Logic Id
	 * @type {Number}
	 * @memberOf! kc.GamePay#
	 */
	clientLogicId:null,

	/**
	 * server Logic Id
	 * @type {Number}
	 * @memberOf! kc.GamePay#
	 */
	serverLogicId:null,

	/**
	 * money
	 * @type {Number}
	 * @memberOf! kc.GamePay#
	 */
	money:0,

	/**
	 * message
	 * @type {Object}
	 * @memberOf! kc.GamePay#
	 */
	message:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.GamePay#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var clientLogicId = propertys.clientLogic.id;
		var money = Number(propertys.money);

		_this.setClientLogic(clientLogicId);
		_this.setMoney(money);
	},

	/**
	 * set server logic id
	 * @param {Number} id
	 * @memberOf kc.GamePay
	 */
	setServerLogic:function(id){
		var _this = this;
		_this.serverLogicId = id;
	},

	/**
	 * set client logic id
	 * @param {Number} id
	 * @memberOf kc.GamePay
	 */
	setClientLogic:function(id){
		var _this = this;
		_this.clientLogicId = id;
		if (id){
			_this.logics[id] = kc["LogicClass_" + id];
		}	
	},

	/**
	 * do logic
	 * @memberOf! kc.GamePay#
	 * @private
	 */
	doLogic:function(){
		var _this = this;
		var logic = _this.logics[_this.clientLogicId];
		if (logic){
			var obj = new logic();
			obj.run(_this);
		}
	},

	/**
	 * set money
	 * @memberOf! kc.GamePay#
	 * @param {Number} the money value
	 */
	setMoney:function(v){
		this.money = v;
	},

	/**
	 * update
	 * @memberOf! kc.GamePay#
	 */
	update:function(){
		var delta = kc.deltaTime;


	}

});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file GodRayFilter.js
 * @author chang_f
 */

var kc = kc || {};

/**
 * <p>遮罩滤镜.<br/>
 * <br/>
 * </p>
 * @class
 * @遮罩滤镜类
 * @name kc.GodRayFilter
 * @extends kc.Class
 */
kc.GodRayFilter = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.GodRayFilter#
	 */
	ObjType: 'GodRayFilter',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.GodRayFilter#
	 */
	_parse: function () {
		var _this = this;

		var propertys = _this._propertys;
		var weight = propertys.weight;

		var textures = _this.gameObject.getComponents('Texture');
		for(var i = 0; i < textures.length; i++) {
			var one = textures[i];
			kc.Filter.godray(one.controlObj.sprite, weight);
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file GrayFilter.js
 * @author chang_f
 */

var kc = kc || {};

/**
 * <p>滤镜类.<br/>
 * <br/>
 * </p>
 * @class
 * @灰度图滤镜类
 * @name kc.GrayFilter
 * @extends kc.Class
 */
kc.GrayFilter = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.GrayFilter#
	 */
	ObjType: 'GrayFilter',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.GrayFilter#
	 */
	_parse: function () {
		var _this = this;

		var textures = _this.gameObject.getComponents('Texture');
		for(var i = 0; i < textures.length; i++) {
			var one = textures[i];
			kc.Filter.gray(one.controlObj.sprite);
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Input.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Input is the component wirte text <br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Input
 * @extends kc.Component
 */
kc.Input = kc.InputBox = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType:'Input',

	/**
	 * text
	 * @memberOf kc.Input
	 * @type {String}
	 */
	text:null,

	/**
	 * default text
	 * @memberOf kc.Input
	 * @type {String}
	 */
	defaultText:null,

	/**
	 * color
	 * @memberOf kc.Input
	 * @type {String}
	 */
	color:null,

	/**
	 * font
	 * @memberOf kc.Input
	 * @type {String}
	 */
	font:null,

	/**
	 * font size
	 * @memberOf kc.Input
	 * @type {Number}
	 */
	fontSize:null,

	/**
	 * background srcId
	 * @memberOf kc.Input
	 * @type {String}
	 */
	backgroundSrcId:null,

	/**
	 * background src
	 * @memberOf kc.Input
	 * @type {String}
	 */
	backgroundSrc:null,

	/**
	 * get self content
	 * @type {Object}
	 * @memberOf kc.Input
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
		_this.controlObj = new kc.EngineInput();
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * get text
	 * @memberOf kc.Input
	 * @return {String}
	 */
	getText:function(){
		var _this = this;
		_this.text = _this.controlObj.getText();
		return _this.text;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Input#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var fontArray = ["宋体","微软雅黑","黑体","楷书","华文行楷","华文新魏","隶书"];
		var placeholder = propertys.placeHolder.toString();
		var strValue;
		if(placeholder.length == 0) {
			strValue = "";
		}
		else {
			strValue = propertys.placeHolder;
		}

		var DefaultText = strValue;
		var text = propertys.text;
		var font = fontArray[propertys.font];
		var fontSize = propertys.size;
		var color = propertys.color;
		var width = propertys.width;
		var height = propertys.height;

		_this.setBackgroundSrcId(propertys.editboxBGsrc.id);
		_this.setText(text);
		_this.setDefaultText(DefaultText);
		_this.setColor(color);
		_this.setFont(font);
		_this.setFontSize(fontSize);
		_this.setSize(width,height);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Input#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	/**
	 * Set backround picture by ID
	 * @memberOf! kc.Input#
	 * @override
	 */
	setBackgroundSrcId: function (srcId) {
		var _this = this;

		var resInfo = kc.Project.getResourceForKey(srcId);
		if(resInfo && resInfo.resURL && resInfo.resURL!=''){
			var imgUrl = resInfo.resURL.substr(1);
			_this.setBackgroundSrc(ResRoot + imgUrl, function(){
				_this.backgroundSrcId = srcId;
			});
		}
	},

	/**
	 * Set backround picture
	 * @memberOf! kc.Input#
	 * @override
	 */
	setBackgroundSrc: function (src, onSuccess) {
		var _this = this;
		var txt = kc.getPlistTexture(src);
		if(!DEBUG && txt){
			if(txt){
				_this.controlObj.setPlistTexture(txt.texture,txt.plistData,_this._propertys.width,_this._propertys.height);
				_this.backgroundSrc = src;
				if(onSuccess){
					onSuccess();
				}
			}else{
				kc.defaultImageLoader.load(src, function(){
					_this.setBackgroundSrc(src, onSuccess);
				});
			}
		}else{
			var texture = kc.Cache.get(src);
			if(texture){
				_this.controlObj.setObjectTexture(texture);
				_this.backgroundSrc = src;
				if(onSuccess){
					onSuccess();
				}
			}else{
				kc.defaultImageLoader.load(src, function(){
					_this.setBackgroundSrc(src, onSuccess);
				});
			}
		}
	},

	/**
	 * Set default text
	 * @memberOf! kc.Input#
	 * @override
	 */
	setDefaultText: function(text){
		this.defaultText = text;
		this.controlObj.setDefaultText(text);
	},

	/**
	 * Set write text
	 * @memberOf! kc.Input#
	 * @override
	 */
	setText: function (text) {
		this.text = text || "";
		this.controlObj.setText(this.text);
	},

	/**
	 * Set font info
	 * @memberOf! kc.Input#
	 * @override
	 */
	setFont: function (font) {
		this.font = font;
		this.controlObj.setFont(font);
	},

	/**
	 * Set font size info
	 * @memberOf! kc.Input#
	 * @override
	 */
	setFontSize: function (fontSize) {
		this.fontSize = fontSize;
		this.controlObj.setFontSize(fontSize);
	},

	/**
	 * Set color info
	 * @memberOf! kc.Input#
	 * @override
	 */
	setColor: function (color) {
		this.color = color;
		this.controlObj.setColor(color);
	},

	/**
	 * Set text size info
	 * @memberOf! kc.Input#
	 * @override
	 */
	setSize: function (width,height) {
		var _this = this;
		_this.controlObj.setSize(width,height);
		_this.gameObject.setSize(width,height);
	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Joystick.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Joystick is the component handles object's Joystick.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Joystick
 * @extends kc.Class
 */
kc.Joystick = kc.Render.extend({

    /**
     * object type
     * @type {String}
     * @memberOf! kc.Joystick#
     */
    ObjType: 'Joystick',

    /**
     * touch type
     * 点击类型：跟随或者固定
     * @type {String}
     * @memberOf! kc.Joystick#
     */
    clickType: [
        "DEFAULT",
        "FOLLOW"
    ],

    /**
     * direction type
     * 方向类型：全方向、8方向、4方向
     * @type {String}
     * @memberOf! kc.Joystick#
     */
    directionType: [
        "FOUR",
        "EIGHT",
        "ALL"
    ],

    /**
     * Joystick Direction
     * 控制器方向 8个
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    joystickDirection: {
        UP: "UP",
        DOWN: "DOWN",
        LEFT: "LEFT",
        RIGHT: "RIGHT",
        LEFTUP: "LEFTUP",
        RIGHTUP: "RIGHTUP",
        LEFTDOWN: "LEFTDOWN",
        RIGHTDOWN: "RIGHTDOWN"
    },

    /**
     * 控杆
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _stick: null,

    /**
     * 控杆背景
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _stickBG: null,

    /**
     * 半径
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _radius: 0,

    /**
     * 角度
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _angle: null,

    /**
     * 弧度
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _radian: null,

    /**
     * 操控的目标 id
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _targetID: 0,

    /**
     * 实际速度
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _speed: 0,

    /**
     * 一段速度
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _speed1: 1,

    /**
     * 二段速度
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _speed2: 2,

    /**
     * 点击类型
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _clickType: null,

    /**
     * 方向类型
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _directionType: null,

    /**
     * 当前方向
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _currDirection: null,

    /**
     * 透明度
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    _opacity: 0,

    /**
     * 回调函数
     * @type {Object}
     * @memberOf! kc.Joystick#
     */
    callback: null,

    /**
     * joystick obj
     * @memberOf! kc.Joystick#
     * @type {Object}
     */
    joystick: null,

    /**
     * joystick size
     * @memberOf! kc.Joystick#
     * @type {kc.Size}
     */
    joystickSize: null,

    /**
     * joystick position
     * @memberOf! kc.Joystick#
     * @type {kc.Point}
     */
    joystickPosition: null,

    /**
     * is can rotated
     * @memberOf! kc.Joystick#
     * @type {Boolean}
     */
    isCanRotated:true,

    /**
     * construct Function of Object
     * @ignore
     */
    ctor: function() {
        var _this = this;
        kc.Render.prototype.ctor.call(_this);

        _this.joystick = new kc.EngineImage();
        _this.joystickSize = {
            width: 0,
            height: 0
        };
        _this.joystickPosition = {
            x: 0,
            y: 0
        };

        _this.controlObj = new kc.EngineImage();
        _this.controlObj.addChild(_this.joystick);

    },

    clear:function(){
        var _this = this;
        kc.Render.prototype.clear.call(_this);
        _this.joystick = null;
    },

    /**
     * parse component data
     * @override
     * @memberOf! kc.Joystick#
     */
    _parse: function () {
        var _this = this;
        var joystickPropertys = _this._propertys;
        var joystickBGInfo = kc.Project.getResourceForKey(joystickPropertys.stickBGsrc.id);
        var joystickInfo = kc.Project.getResourceForKey(joystickPropertys.sticksrc.id);
        var joystickSpeed = joystickPropertys.speed;
        var joystickSOpacity = joystickPropertys.Opacity;
        var joystickTargetID = joystickPropertys.object.id;
        var directionType = joystickPropertys.directionType;
        var touchType   = joystickPropertys.touchType;

        _this._setJoystickInfo(joystickSpeed,directionType,touchType,joystickTargetID);
        _this.setAlpha(joystickSOpacity);

        if(joystickBGInfo && joystickBGInfo.resURL && joystickBGInfo.resURL!=''){
            _this.setSrc(ResRoot + joystickBGInfo.resURL.substr(1));
        }
        if(joystickInfo && joystickInfo.resURL && joystickInfo.resURL!=''){
            _this.setJoystickTexture(ResRoot + joystickInfo.resURL.substr(1));
        }
    },

    /**
     * 方向类型：全方向、8方向、4方向"FOUR""EIGHT""ALL"
     * @type {String}
     * @memberOf! kc.Joystick#,
     */
    setDirectionType:function(directionType){
        this._directionType = directionType;
    },

    /**
     * 方向类型：全方向、8方向、4方向"FOUR""EIGHT""ALL"
     * @type {String}
     * return {string}
     * @memberOf! kc.Joystick#,
     */
    getDirectionType:function(){
        return this._directionType;
    },

    /**
     * set Rotated
     * @param {boolean} bool
     */
    setRotated:function(bool){
        this.isCanRotated = bool;
    },

    /**
     * set joystickInfo
     * @param {Number} speed
     * @param {Number} directionType
     * @param {Nmuber} clickType
     * @param {Number} targetID
     * @memberOf! kc.Joystick#
     */
    _setJoystickInfo: function(speed, directionType, clickType, targetID) {
        var _this = this;
        _this._clickType = _this.clickType[Number(clickType)];
        _this._directionType = _this.directionType[Number(directionType)];
        _this._targetID = targetID;
        _this._speed = _this._speed1 = _this._speed2 = Number(speed);
    },

    /**
     * set Joystick texture
     * @memberOf! kc.Joystick#
     * @param {String} src url
     */
    setJoystickTexture: function(src) {
        var _this = this;
        var txt = kc.getPlistTexture(src);
        if(!DEBUG && txt){
            _this.joystick.setPlistTexture(txt.texture,txt.plistData);

            _this.joystickSize.width = txt.plistData.sourceSize.width;
            _this.joystickSize.height = txt.plistData.sourceSize.height;
        }else{
            var texture = kc.Cache.get(src);
            _this.joystick.setObjectTexture(texture);

            _this.joystickSize.width = texture.width;
            _this.joystickSize.height = texture.height;
        }
    },

    /**
     * set Joystick texture
     * @memberOf! kc.Joystick#
     * @param {String} src url
     */
    setJoystickBackgroundTexture: function(src) {
        var _this = this;
        _this.setSrc(src);
    },

    /**
     * Reset the Joystick position
     * @memberOf! kc.Joystick#
     */
    _resPosition: function() {
        var _this = this;
        _this.joystick.setPosition(_this.gameObject.size.width * 0.5, _this.gameObject.size.height * 0.5);
    },

    /**
     * called every frame before draw
     * @memberOf! kc.Joystick#
     */
    update: function() {
        var _this = this;
        if (_this._reSize) {
            _this._resPosition();
            _this._reSize = false;
        }
        if (_this._moving) {
            if (_this._directionType == "FOUR") {
                this._fourDirectionsMove();
            } else if (_this._directionType == "EIGHT") {
                this._eightDirectionsMove();
            } else if (_this._directionType == "ALL") {
                this._allDirectionsMove();
            }
        }
    },

    /**
     * set Joystick Position
     * @memberOf! kc.Joystick#
     * @param {Number} x
     * @param {Number} y
     */
    _setJoystickPosition: function(x, y) {
        var _this = this;
        _this.joystick.setPosition(x, y);
        _this.joystickPosition.x = x;
        _this.joystickPosition.y = y;

    },

    /**
     * 计算角度并返回
     * @param  {Object} point {x:x,y:y}
     * @memberOf! kc.Joystick#
     * @private
     * @return {Number} angle
     */
    _getAngle: function(point) {
        var pos = {
            x: 0,
            y: 0
        };
        this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / Math.PI);
        return this._angle;
    },

    /**
     * set angle
     * 设置角度
     * @memberOf! kc.Joystick#
     * @param {Number} angle
     */
    setAngle: function(angle) {
        this._angle = angle;
    },

    /**
     * 计算弧度并返回
     * get Radian
     * @memberOf! kc.Joystick#
     * @private
     * @param  {Object} point
     * @return {Number} radian
     */
    _getRadian: function(point) {
        this._radian = Math.PI / 180 * this._getAngle(point);
        return this._radian;
    },

    /**
     * 计算两点间的距离并返回
     * @memberOf! kc.Joystick#
     * @private
     * @param  {Object} pos1
     * @param  {Object} pos2
     * @return {Number} Distance
     */
    _getDistance: function(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2));
    },

    /**
     * inherit onMouseDown
     * @memberOf! kc.Joystick#
     * @param  {Object} event event.type/event.x/event.y
     * @return {Boolean}
     */
    onMouseDown: function(event) {
        var _this = this;

        if (_this._clickType == "FOLLOW") {
            var pos = {};
            var parent = _this.gameObject.parent;
            if (parent && parent.ObjType && parent.ObjType == "scene") {
                pos = {
                    x: event.x,
                    y: event.y
                };
            } else {
                pos = _this.gameObject.parent.convertToNodeSpace({
                    x: event.x,
                    y: event.y
                });
            }
            _this.gameObject.setPosition(pos.x, pos.y);
            _this.draggedStart = true;
            _this.setVisible(true);
            return _this.stopPropagation;
        } else if (_this._clickType == "DEFAULT") {
            var pos = kc.isPosIn(event.x, event.y, _this.gameObject);
            if (pos) {
                var size = _this.gameObject.size;
                _this._setJoystickPosition(pos.x + size.width * 0.5, pos.y + size.height * 0.5);
                _this.draggedStart = true;

                return _this.stopPropagation;
            }
        }
    },
    /**
     * inherit onMouseMove
     * @memberOf! kc.Joystick#
     * @param  {Object} Joystick event.type/event.x/event.y
     * @return {Boolean}
     */
    onMouseMove: function(event) {
        var _this = this;
        if (_this.draggedStart) {
            var objPosX = _this.gameObject.position.x;
            var objPosY = _this.gameObject.position.y;
            _this._moving = true;
            //坐标转换
            var pos = _this.gameObject.convertToNodeSpace({
                x: event.x,
                y: event.y
            });

            //点与圆心的距离
            var distance = _this._getDistance(pos, {
                x: 0,
                y: 0
            });
            //圆的半径
            var radius = _this.gameObject.size.width * 0.5;

            var size = _this.gameObject.size;
            var x = Math.cos(this._getRadian(pos)) * radius;
            var y = Math.sin(this._getRadian(pos)) * radius;
            //如果点与圆心距离小于圆的半径,控杆跟随触摸点
            if (radius > distance) {
                _this.joystick.setPosition(pos.x + size.width * 0.5, pos.y + size.height * 0.5);
                _this._setSpeed(1);
            } else {
                _this._setJoystickPosition(x + size.width * 0.5, y + size.height * 0.5);
                _this._setSpeed(2);
            }

            _this._updateCallback();
            return _this.stopPropagation;
        }

    },

    /**
     * inherit onMouseUp
     * @memberOf! kc.Joystick#
     * @param  {Object} event event.type/event.x/event.y
     * @return {Boolean}
     */
    onMouseUp: function(event) {
        var _this = this;
        if (_this.draggedStart) {
            _this.draggedStart = false;
            _this._moving = false;
            _this._resPosition();
            if (_this._clickType == "FOLLOW") {
                _this.setVisible(false);
            }
            return _this.stopPropagation;
        }
    },

    //更新回调
    _updateCallback: function() {
        var _this = this;
        if (_this.callback && typeof(_this.callback) === "function") {
            _this.callback();
        }
    },

    //设置实际速度
    _setSpeed: function(speedType) {
        var _this = this;
        if (speedType == 1) {
            _this._speed = _this._speed1;
        } else {
            _this._speed = _this._speed2;
        }
    },

    //设置一段速度
    setSpeedwithLevel1: function(speed) {
        var _this = this;
        _this._speed1 = speed || _this._speed;
    },

    getSpeedwithLevel1: function(){
        return this._speed1;
    },

    //设置二段速度
    setSpeedwithLevel2: function(speed) {
        var _this = this;
        _this._speed2 = speed || _this._speed1 || _this._speed;
    },

     getSpeedwithLevel2: function(){
        return this._speed2;
    },

    //设置当前方向
    setCurrDirection: function(key) {
        var _this = this;
        var joysKey = null;
        if (typeof(key) =="number"){
            var index = 0;
            for (var k in _this.joystickDirection){
                if (index == key){
                    joysKey = _this.joystickDirection[k];
                    break;
                }
                index = index + 1;
            }
        }else{
            joysKey = key;
        }
        _this._currDirection = joysKey;
    },

    //获取当前方向
    getCurrDirection: function() {
        var _this = this;
        return _this._currDirection;
    },

    //四个方向移动(上下左右)
    _fourDirectionsMove: function() {
        var _this = this;
        var target = kc.ObjectManager.getObject(_this._targetID); //_this._targetID);
        if (!target) {
            console.log("not target1");
            return;
        }
        var x = target.position.x,
            y = target.position.y;
        if (_this._angle > 45 && _this._angle < 135) {
            x = x;
            y = y + _this._speed;
            _this._currDirection = _this.joystickDirection.UP;
            _this.isCanRotated && target.setRotation(90*3);
        } else if (_this._angle > -135 && _this._angle < -45) {
            x = x;
            y = y - _this._speed;
            _this.isCanRotated && target.setRotation(90);
            _this._currDirection = _this.joystickDirection.DOWN;
        } else if (_this._angle < -135 && _this._angle > -180 || _this._angle > 135 && _this._angle < 180) {
            x = x - _this._speed;
            y = y;
            _this._currDirection = _this.joystickDirection.LEFT;
            _this.isCanRotated && target.setRotation(90*2);
        } else if (_this._angle < 0 && _this._angle > -45 || _this._angle > 0 && _this._angle < 45) {
            x = x + _this._speed;
            y = y;
            _this._currDirection = _this.joystickDirection.RIGHT;
            _this.isCanRotated && target.setRotation(0);
        }
        target.setPosition(x, y);
        // if(_this._angle>90*3 && _this._angle <90){
        //     target.setScale(null,Math.abs(target.scale.y));
        // }else{
        //     target.setScale(null,Math.abs(target.scale.y)*-1);
        // }
    },

    //八个方向移动(上下左右、左上、右上、左下、右下)
    _eightDirectionsMove: function() {
        var _this = this;
        var target = kc.ObjectManager.getObject(_this._targetID); //(_this._targetID);
        if (!target) {
            console.log("not target1");
            return;
        }
        var x = target.position.x,
            y = target.position.y;
        if (this._angle > 67.5 && this._angle < 112.5) {
            x = x;
            y = y + _this._speed;
            this._currDirection = _this.joystickDirection.UP;
            _this.isCanRotated && target.setRotation(90*3);
        } else if (this._angle > -112.5 && this._angle < -67.5) {
            x = x;
            y = y - _this._speed;
            this._currDirection = _this.joystickDirection.DOWN;
            _this.isCanRotated && target.setRotation(90);
        } else if (this._angle < -157.5 && this._angle > -180 || this._angle > 157.5 && this._angle < 180) {
            x = x - _this._speed;
            y = y;
            this._currDirection = _this.joystickDirection.LEFT;
            _this.isCanRotated && target.setRotation(90*2);
        } else if (this._angle < 0 && this._angle > -22.5 || this._angle > 0 && this._angle < 22.5) {
            x = x + _this._speed;
            y = y;
            this._currDirection = _this.joystickDirection.RIGHT;
            _this.isCanRotated && target.setRotation(0);
        } else if (this._angle > 112.5 && this._angle < 157.5) {
            x = x - this._speed / 1.414;
            y = y + this._speed / 1.414;
            this._currDirection = _this.joystickDirection.LEFTUP;
            _this.isCanRotated && target.setRotation(360/8*5);
        } else if (this._angle > 22.5 && this._angle < 67.5) {
            x = x + this._speed / 1.414;
            y = y + this._speed / 1.414;
            _this.isCanRotated && target.setRotation(360/8*7);
            this._currDirection = _this.joystickDirection.RIGHTUP;
        } else if (this._angle > -157.5 && this._angle < -112.5) {
            x = x - this._speed / 1.414;
            y = y - this._speed / 1.414;
            _this.isCanRotated && target.setRotation(360/8*3);
            this._currDirection = _this.joystickDirection.LEFTDOWN;
        } else if (this._angle > -67.5 && this._angle < -22.5) {
            x = x + this._speed / 1.414;
            y = y - this._speed / 1.414;
            this._currDirection = _this.joystickDirection.RIGHTDOWN;
            _this.isCanRotated && target.setRotation(360/8*1);
        }
        target.setPosition(x, y);
        // if(_this._angle <= 360 &&_this._angle>90*3 || _this._angle <=0 && _this._angle >-90){
        //     target.setScale(null,Math.abs(target.scale.y));
        // }else{
        //     target.setScale(null,Math.abs(target.scale.y)*-1);
        // }
    },

    //全方向移动
    _allDirectionsMove: function() {
        var _this = this;
        var target = kc.ObjectManager.getObject(_this._targetID); //(_this._targetID);
        if (!target) {
            console.log("not target1");
            return;
        }
        var x = target.position.x + Math.cos(_this._angle * (Math.PI / 180)) * _this._speed;
        var y = target.position.y + Math.sin(_this._angle * (Math.PI / 180)) * _this._speed;
        target.setPosition(x, y);
        _this.isCanRotated && target.setRotation(-this._angle);
        // if(_this._angle>90*3 && _this._angle <90){
        //     target.setScale(null,Math.abs(target.scale.y));
        // }else{
        //     target.setScale(null,Math.abs(target.scale.y)*-1);
        // }
    }

    // onExit: function() {
    //     this._super();
    //     //移除触摸监听
    //     if (this._listener != null) {
    //         cc.JoystickManager.removeListener(this._listener);
    //     }
    // }

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file JsBridge
 * @author  lai_lc
 */

var kc = kc || {};

/**
 * <p>kc.JsBridge handles the component's jsBridge.<br/>
 * <br/>
 * </p>
 * @class
 * @todo do nothing now
 * @name kc.JsBridge
 * @extends kc.Class
 */
kc.JsBridge = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.JsBridge#
	 */
	ObjType: 'JsBridge',

	bridge: null,

	handlerName: null,
	
	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Anchor#
	 */
	_parse: function () {
		var _this = this;
		_this.bridge = _this._propertys.objectName;
		_this.handlerName = _this._propertys.funcName;
	}

});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Lable.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Lable is the component Write text.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Lable
 * @extends kc.Component
 */
kc.Label = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType:'Label',

	/**
	 * text
	 * @memberOf kc.Label#
	 * @type {String}
	 */
	text:null,

	/**
	 * font
	 * @memberOf kc.Label#
	 * @type {String}
	 */
	font:null,

	/**
	 * font size
	 * @memberOf kc.Label#
	 * @type {Number}
	 */
	fontSize:null,

	/**
	 * color
	 * @memberOf kc.Label#
	 * @type {String}
	 */
	color:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineLabel();

	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.Label#
     */
    _parse: function () {
        var _this = this;
        var labelPropertys = _this._propertys;
		var fonts = ["宋体","微软雅黑","黑体","楷书","华文行楷","华文新魏","隶书"];

		var text = labelPropertys.label;
		var font = fonts[labelPropertys.font];
		var fontSize = labelPropertys.size;
		var color = labelPropertys.color;
		var width = labelPropertys.width;
		var height = labelPropertys.height;
		var horizontal = labelPropertys.horizontal;

		_this.setText(text);
		_this.setFont(font);
		_this.setFontSize(fontSize);
		_this.setColor(color);
		_this.setSize(width,height);
		_this.setHorizontal(horizontal);
    },

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Label#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	/**
	 * Set write text
	 * @memberOf! kc.Label#
	 * @override
	 */
	setText: function (text) {
		this.text = text;
		this.controlObj.setText(text);
	},

	/**
	 * get text
	 * @memberOf kc.Label#
	 * @return {String}
	 */
	getText:function(){
		return this.text;
	},

	/**
	 * Set font info
	 * @memberOf! kc.Label#
	 * @override
	 */
	setFont: function (font) {
		this.font = font;
		this.controlObj.setFont(font);
	},

	/**
	 * Set font size info
	 * @memberOf! kc.Label#
	 * @override
	 */
	setFontSize: function (fontSize) {
		this.fontSize = fontSize;
		this.controlObj.setFontSize(fontSize);
	},

	/**
	 * Set color info
	 * @memberOf! kc.Label#
	 * @override
	 */
	setColor: function (color) {
		this.color = color;
		this.controlObj.setColor(color);
	},

	/**
	 * Set text size info
	 * @memberOf! kc.Label#
	 * @override
	 */
	setSize: function (width,height) {
		var _this = this;
		_this.controlObj.setSize(width,height);
		_this.gameObject.setSize(width,height);
	},

	/**
	 * Get text size 
	 * @memberOf! kc.Label#
	 */
	getSize: function () {
		var _this = this;
		return _this.gameObject.size;
	},

	/**
	 * Set text horizontal 
	 * @memberOf! kc.Label#
	 * @override
	 */
	setHorizontal: function (horizontal) {
        this.horizontal = horizontal;
        this.controlObj.setHorizontal(horizontal);
    }
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file LabelBMFontOwnFnt.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.LabelBMFontOwnFnt is the component Write text.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.LabelBMFontOwnFnt
 * @extends kc.Component
 */
kc.LabelBMFontOwnFnt = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	ObjType:'LabelBMFontOwnFnt',

	/**
	 * font dictionary
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @private
	 */
	_fontCharDic:null,

	/**
	 * texture Cache
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @private
	 */
	_textureCache:null,

	/**
	 * char objcet list
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @private
	 */
	_charObjectList:null,

	/**
	 * text
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	text :null,

	/**
	 * pngSrcId
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	pngSrcId :null,

	/**
	 * fntSrcId
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	fntSrcId :null,

	/**
	 * font width with user set
	 * @type {Object}
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @private
	 */
	_fontWidth:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineObject();
		_this._charObjectList = [];
		_this._fontCharDic = {};
		_this._fontWidth = 0;
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
        _this._charObjectList.length = 0;
		_this._fontCharDic = null;
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.LabelBMFontOwnFnt#
     */
    _parse: function () {
        var _this = this;
        var labelPropertys = _this._propertys;
		var width = labelPropertys.width;
		var fontLabel = labelPropertys.labelBMFont;
		var pngSrcId = labelPropertys.src.id;
		var fntSrcId = labelPropertys.fnt.id;

		var pngRes = kc.Project.getResourceForKey(pngSrcId);
		if(pngRes && pngRes.resURL && pngRes.resURL!=''){
			_this.setBMFontPng(ResRoot + pngRes.resURL.substr(1));
		}
		var fntRes = kc.Project.getResourceForKey(fntSrcId);
		if(fntRes && fntRes.resURL && fntRes.resURL!=''){
			_this.setFntUrl(ResRoot + fntRes.resURL.substr(1));
		}
		_this.setFontWidth(width);
		_this.setText(fontLabel);

		_this.pngSrcId = labelPropertys.src.id;
		_this.pngSrcId = labelPropertys.fnt.id;
    },

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	/**
	 * Set write text
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @override
	 */
	setText: function (text) {
		var _this = this;
		_this.text = text;
		_this._updateText();
	},

	/**
	 * get text
	 * @memberOf kc.LabelBMFontOwnFnt#
	 * @return {String}
	 */
	getText:function(){
		return this.text;
	},

	/**
	 * set font width
	 * @property {Number} width
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	setFontWidth:function(width){
		this._fontWidth = Number(width);
	},

	/**
	 * get font width
	 * @property {Number} width
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	getFontWidth:function(width){
		return this._fontWidth;
	},

	/**
	 * update the BMFont string
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	_updateText :function(){
		var _this = this;
		if (!_this.text ){
			return;
		}

		var strWidth = 0;//_this._fontCharDic.leftPadding;
		var newCharObjectList = [];
		for (var i=0;_this.text.length>i;i++){
			var key = _this.text.charCodeAt(i);
			var info = _this._fontCharDic[key];
			var textureObj = _this._hasCharObject(key);
			if (info){
				var texture = null;
				if (!textureObj){
					texture = new kc.EngineImage();
					texture.setTextureWithRanderSize(_this._textureCache,info);
					_this.controlObj.addChild(texture);
				}else{
					texture = textureObj;
				}
				
				texture.setPosition(strWidth,_this._fontCharDic.maxHeight*0.5);
				var obj = {};
				obj.x = strWidth;
				obj.y = _this._fontCharDic.maxHeight*0.5;
				obj.isUse = true;
				obj.id = key;
				obj.obj = texture;
				newCharObjectList.push(obj);
				strWidth = strWidth + info.width + info.xOffset + this._fontWidth;
			}
		}

		_this._rmCharObject();
		_this._charObjectList = newCharObjectList;
		_this.setSize(strWidth,_this._fontCharDic.maxHeight);
		_this.controlObj.setPosition(-strWidth*0.5,0);
	},

	/**
	 * find char object
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	_rmCharObject: function() {
		var _this = this;
		for (var index in _this._charObjectList) {
			_this._charObjectList[index].obj.cleanup();
		}
	},

	/**
	 * find char object
	 * @param  {String}  key
	 * @return {Ojbect}  texture
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	_hasCharObject: function(key) {
		var _this = this;
		var has = false;
		for (var index in _this._charObjectList) {
			var one = _this._charObjectList[index];
			if (one.id == key) {
				delete _this._charObjectList[index];
				return one;
			}
		}
	},

	/**
	 * Set text size info
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 * @override
	 */
	setSize: function (width,height) {
		var _this = this;
		_this.width = width;
		_this.height = height;
		_this.gameObject.setSize(width,height);
	},



	/**
	 * set png src
	 * @param {String} pngSrcUrl
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	setBMFontPng :function(pngSrcUrl){
		this._textureCache = kc.Cache.get(pngSrcUrl);
		this.pngSrcId= null;
	},

	/**
	 * set png src by id
	 * @param {String} pngSrcUrl
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	setBMFontPngById :function(pngSrcId){
		var pngRes = kc.Project.getResourceForKey(pngSrcId);
		var pngSrcUrl = ResRoot + fntRes.resURL.substr(1);
		this._textureCache = kc.Cache.get(pngSrcUrl);
		this.pngSrcId = pngSrcId;
	},

	/**
	 * get png src
	 * @param {String} pngSrcUrl
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	getBMFontPngId :function(){
		return this.pngSrcId;
	},	

	/**
	 * xml resources (ttf)
	 * @param {String} url
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	setFntUrl:function(url){
		this._parseFont(url);
		this.fntSrcId = null;
	},

	/**
	 * xml resources (ttf) by id
	 * @param {String} url
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	setFntUrlById:function(id){
		var fntRes = kc.Project.getResourceForKey(id);
		var fntSrcUrl = ResRoot + fntRes.resURL.substr(1);
		this._parseFont(fntSrcUrl);
		this.fntSrcId = id;
	},

	/**
	 * get xml resources id
	 * @param {String} url
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	getFntUrlId: function(){
		return this.fntSrcId;
	},

	/**
	 * parse Font
	 * @param  {XMLObject} fntUrl
	 * @memberOf! kc.LabelBMFontOwnFnt#
	 */
	_parseFont :function(fntUrl){
		var _this = this;
		var xmlCache = kc.Cache.get(fntUrl);
		var tX=0;
		var tScale=1;
		var tInfo=xmlCache.getElementsByTagName("info");
		// this.fontSize=parseInt(tInfo[0].attributes["size"].nodeValue);
		var tPadding=tInfo[0].attributes["padding"].nodeValue;
		var tPaddingArray=tPadding.split(",");
		var tUpPadding=parseInt(tPaddingArray[0]);
		var tDownPadding=parseInt(tPaddingArray[2]);

		_this._fontCharDic["upPadding"] = parseInt(tPaddingArray[0]);
		_this._fontCharDic["downPadding"] = parseInt(tPaddingArray[2]);
		_this._fontCharDic["leftPadding"] = parseInt(tPaddingArray[3]);
		_this._fontCharDic["rightPadding"] = parseInt(tPaddingArray[1]);
		_this._fontCharDic.maxHeight = 0;
		_this._fontCharDic.maxWidth = 0;
		var chars=xmlCache.getElementsByTagName("char");
		var i=0;
		for (i=0;i < chars.length;i++){
			var tAttribute=chars[i].attributes;
			var info = {};
			info.id = parseInt(tAttribute["id"].nodeValue);
			info.xOffset=parseInt(tAttribute["xoffset"].nodeValue)/ tScale;
			info.yOffset=parseInt(tAttribute["yoffset"].nodeValue)/ tScale;
			info.xAdvance=parseInt(tAttribute["xadvance"].nodeValue)/ tScale;
			info.x=parseInt(tAttribute["x"].nodeValue);
			info.y=parseInt(tAttribute["y"].nodeValue);
			info.width=parseInt(tAttribute["width"].nodeValue);
			info.height=parseInt(tAttribute["height"].nodeValue);
			
			var tHeight = tUpPadding+tDownPadding+info.height;
			if ( tHeight>= _this._fontCharDic.maxHeight){
				_this._fontCharDic.maxHeight = tHeight;
			}
			_this._fontCharDic[info.id]=info;
		}
	}

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file LoadingBar.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.LoadingBar is the component  <br/>
 * <br/>
 * </p>
 * @class
 * @name kc.LoadingBar
 * @extends kc.Render
 */
kc.LoadingBar = kc.Render.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.LoadingBar
	 */
	ObjType: 'LoadingBar',

	/**
	 * progress value 1-100
	 * @memberOf kc.LoadingBar
	 */
	progressValue:null,

	/**
	 * direction
	 * @memberOf kc.LoadingBar
	 */
	direction:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Render.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineImage();

		_this.loading = new kc.EngineBar();

        this.progressValue = 100;//给进度条一个初始值

		_this.controlObj.addChild(_this.loading);

	},

	clear:function(){
        var _this = this;
        kc.Render.prototype.clear.call(_this);
		_this.loading = null;
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.LoadingBar#
     */
    _parse: function () {
        var _this = this;
		var propertys = _this._propertys;
		var backgroundInfo = kc.Project.getResourceForKey(propertys.backgroundSrc.id);
		var foregroundInfo = kc.Project.getResourceForKey(propertys.foregroundSrc.id);
		var type = propertys.type;
		var direction = propertys.direction;

		var backgroundRes = kc.Project.getResourceForKey(propertys.backgroundSrc.id);
		if(backgroundRes && backgroundRes.resURL && backgroundRes.resURL!=''){
			_this.setbackground(ResRoot + backgroundRes.resURL.substr(1));
		}
		var foregroundRes = kc.Project.getResourceForKey(propertys.foregroundSrc.id);
		if(foregroundRes && foregroundRes.resURL && foregroundRes.resURL!=''){
			_this.setForeground(ResRoot + foregroundRes.resURL.substr(1));
		}
		_this.setDirection(direction);
		_this.setStyle(type);
    },

	/**
	 * 设置前景进度条
	 * set bar
	 * @param {String} scr url
	 * @memberOf! kc.LoadingBar#
	 */
	setForeground:function(scr){
		var _this = this;
		var txt = kc.getPlistTexture(scr);
		if(!DEBUG&&txt){
			_this.loading.setPlistTexture(txt.texture,txt.plistData);
		}else{
			var texture = kc.Cache.get(scr);
			_this.loading.setObjectTexture(texture);
		}
	},

	/**
	 * 设置背景
	 * set background bar
	 * @memberOf! kc.LoadingBar#
	 * @param  {String} scr 
	 */
	setbackground:function(scr){
		var _this = this;
		kc.Render.prototype.setSrc.call(_this,scr);
	},

	/**
	 * 设置样式 例如圆形或者条形
	 * @memberOf! kc.LoadingBar#
	 * @param {Number} type
	 */
	setStyle:function(type){
        if(!type){
            type = 0;
        }
		this.style = type;
	},

    /**
     * 获取进度条的样式
     * @returns {Number|*|kc.LoadingBar.style}
     */
    getStyle: function(){
        return this.style;
    },

	/**
	 * 设置进度条方向
	 * set processbar direction
	 * @memberOf! kc.LoadingBar#
	 * @param {Number} direction
	 */
	setDirection:function(direction){
		var _this = this;
		var _direction = parseInt(direction);
        _this.direction = (_direction >=0 && _direction <= 3)? _direction : (_this.direction||0);
		_this.loading.setDirection(_this.direction);

		if(_this.progressValue) {
			_this.loading.setBarValue(this.progressValue);
		}
	},

    /**
     * 获取进度条的方向
     * @returns {kc.EngineBar.direction|*}
     */
    getDirection: function(){
        return this.loading.direction;
    },

	/**
	 * the value is 1-100
	 * @memberOf! kc.LoadingBar#
	 * @param {Number} v
	 */
	setBarValue:function(v){
		this.progressValue = v;
		this.loading.setBarValue(v);
	},

	/**
	 * return progress value
	 * @memberOf! kc.LoadingBar#
	 * @return {Number}
	 */
	getBarValue:function(){
		return this.progressValue;
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.LoadingBar#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.LoadingBar#
	 */
	update: function () {
		var _this = this;
		if(_this._reSize){
			_this._reSize = false;
			_this.loading.setPosition(_this.gameObject.size.width*0.5,_this.gameObject.size.height*0.5);
		}
	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file MaskFilter.js
 * @author chang_f
 */

var kc = kc || {};

/**
 * <p>遮罩滤镜.<br/>
 * <br/>
 * </p>
 * @class
 * @遮罩滤镜类
 * @name kc.MaskFilter
 * @extends kc.Class
 */
kc.MaskFilter = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.MaskFilter#
	 */
	ObjType: 'MaskFilter',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.MaskFilter#
	 */
	_parse: function () {
		var _this = this;

		var propertys = _this._propertys;
		var mask = propertys.mask.id;

		var textures = _this.gameObject.getComponents('Texture');
		for(var i = 0; i < textures.length; i++) {
			var one = textures[i];
			kc.Filter.mask(one.controlObj.sprite, mask);
		}
	}
});

// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Material.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.Material is the component contains an mesh.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Material
 * @extends kc.Class
 */
kc.Material = kc.Component.extend({

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		kc.Component.prototype.ctor.call(this);

		this.material = new kc.EngineMaterial();
	},

	setSide: function (type) {
		this.material.setSide(type);
	},

	setTexture: function (texture) {
		this.material.setTexture(texture);
	},

	setResourceUrl: function(resurl) {
		this.material.setResourceUrl(resurl);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Material#
	 * @override
	 */
	onAwake: function () {
		if(this.gameObject) {
			//this.gameObject.engineObject.addChild(this.mesh);
			var component = this.gameObject.getComponents('MeshFilter')[0];
			if(component) {
				component.setMaterial(this.material);
			}
		}
	},


	/**
	 * called before the first update called
	 * @memberOf! kc.Material#
	 * @override
	 */
	onStart: function () {

	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.Material#
	 * @override
	 */
	update: function () {

	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.Material#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.Material#
	 * @override
	 */
	onDestory: function () {

	}
});


// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file MeshFilter.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.MeshFilter is the component contains an mesh.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.MeshFilter
 * @extends kc.Class
 */
kc.MeshFilter = kc.Component.extend({

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		kc.Component.prototype.ctor.call(this);

		this.mesh = new kc.EngineMesh();
	},

	/**
	 * set the mesh's geometry
	 * @param {Geometry} geometry
	 */
	setGeometry: function (geometry) {
		this.mesh.geometry = geometry;
	},

	/**
	 * set the mesh's material
	 * @param {Material} material
	 */
	setMaterial: function (material) {
		this.mesh.material = material;
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.MeshFilter#
	 * @override
	 */
	onAwake: function () {
		if(this.gameObject) {
			this.gameObject.engineObject.addChild(this.mesh);
		}
	},

	/**
	 * called before the first update called
	 * @memberOf! kc.MeshFilter#
	 * @override
	 */
	onStart: function () {

	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.MeshFilter#
	 * @override
	 */
	update: function () {

	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.MeshFilter#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.MeshFilter#
	 * @override
	 */
	onDestory: function () {

	}
});



"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Navigation.js
 * @author langcheng.lai
 */

var kc = kc || {};

/**
 * <p>kc.Navigation is a component provide Navigation function.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Navigation
 * @extends kc.Component
 */
kc.Navigation = kc.Render.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Navigation#
	 */
	ObjType: 'Navigation',

	/**
	 * set change list:"normalSrc,selectedSrc,movedSrc,disabledSrc"
	 * @type {Object}
	 * @memberOf! kc.Navigation#
	 */
	changeList:null,

	/**
	 * Navigation event:"into","outside"
	 * @type {Boolean}
	 * @memberOf! kc.Navigation#
	 * @private
	 */
	_isInto:null,

	/**
	 * Destination
	 * @memberOf kc.BMap#
	 * @type {String}
	 */
	destination:null,

	/**
	 * Navigation has Map
	 * @memberOf kc.BMap#
	 * @type {Boolean}
	 * @private
	 */
	_isMap:null,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Render.prototype.ctor.call(_this);

		_this.changeList = {};
		_this._isInto = false;
		_this.controlObj = new kc.EngineImage();
		_this.mapArea = new kc.EngineObject();
	},

	clear:function(){
		var _this = this;
		kc.Render.prototype.clear.call(_this);
		_this.changeList = null;
		_this._isInto = false;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Navigation#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;

		_this.destination = propertys.destination;

		//normalSrc,selectedSrc,movedSrc,disabledSrc
		var list = {};
		for (var srcId in propertys) {
			var obj = kc.Project.getResourceForKey(propertys[srcId].id);
			obj && obj.resURL && obj.resURL!='' && (list[srcId] = ResRoot + obj.resURL.substr(1));
		}

		_this._setChangeList(list);
		_this.setSrc(list["normalSrc"]);
	},


	/**
	 * set user can use or not in this Navigation
	 * @param {Boolean} bool 
	 * @memberOf! kc.Navigation#
	 */
	setDisabled :function(bool){
		var _this = this;
		_this.disabled = bool;
		if (bool){
			_this.changeSrc(_this.changeList["disabledSrc"]);
		}else{
			_this.changeSrc(_this.changeList["normalSrc"]);
		}
	},

	/**
	 * called when the Navigation just is loaded
	 * @memberOf! kc.Navigation#
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
		_this.gameObject.engineObject.addChild(_this.mapArea);
	},

	/**
	 * the Navigation has four pictures,set it
	 * @memberOf! kc.Navigation#
	 * @param {Object} list
	 */
	_setChangeList:function(list){
		this.changeList = list;
	},


	/**
	 * the Navigation add map child
	 * @memberOf! kc.Navigation#
	 */
	_addMap:function(){
		var _this = this;
		var iframe = document.createElement('iframe');
		iframe.src = 'Navigation';
		iframe.style.cssText = "width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:1;border:none";
		var stage = document.getElementById('cr-stage');
		stage.appendChild(iframe);

		iframe.onload = function () {
			iframe.contentWindow.addMap(_this.destination);
		}

		window.removeFrame = function () {
			stage.removeChild(iframe);
			_this._isMap = false;
		}
		
	},


	/**
	 * inherit onMouseDown
	 * @memberOf! kc.Navigation#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}
	 */
	onMouseDown: function (event) {
		var _this = this;
		var changeObj = _this.changeList["selectedSrc"];
		if (_this.mapArea.sprite.visible && _this._isMap) {
			return _this.stopPropagation;
		} else if (changeObj && !_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
			_this.changeSrc(changeObj);
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseUp
	 * @memberOf! kc.Navigation#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseUp: function (event) {
		var _this = this;
		var changeObj = _this.changeList["normalSrc"];
		if (_this.mapArea.sprite.visible && _this._isMap) {
			return _this.stopPropagation;
		} else if (!_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){		
			_this.changeSrc(changeObj);
			if (_this._isMap) {
				_this.mapArea.setVisible(true);
			} else {
				_this._addMap();
				_this._isMap = true;
			}
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseMove
	 * @memberOf! kc.Navigation#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseMove:function(event){
		var _this = this;
		var changeObj = _this.changeList["movedSrc"];
		if (changeObj && !_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
			if (!_this._isInto){
				_this._isInto = true;
				_this.changeSrc(changeObj);
				return _this.stopPropagation;
			}
			_this.changeSrc(changeObj);
			return _this.stopPropagation;			
		}else if (!_this.disabled){
			if (_this._isInto){
				_this._isInto = false;
				_this.changeSrc(_this.changeList["normalSrc"]);
			}	
		}
	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Particle.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Particle is the component wirte text <br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Particle
 * @extends kc.Component
 */
kc.Particle = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType:'Particle',

	/**
	 * parse data
	 * @type {Object}
	 * @memberOf kc.Particle
	 */
	parseData:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
		_this.controlObj = new kc.EngineParticle();
		_this._initParseData();
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.Particle#
     */
    _parse: function () {
        var _this = this;
		var propertys = _this._propertys;
		var particleId = propertys.src.id;

		var data1 = kc.Project.getResourceForKey(particleId);
		_this._addParticleData(data1);
    },

	/**
	 * _initParseData description
	 */
	_initParseData:function(){
		var table = {
			angle:0, //发射角度
			angleVariance:0, //发射角度弧度范围
			blendFuncDestination:0,//混合模式SRC
			blendFuncSource:0,//混合模式DST
			duration:1, //粒子持续时间 s
			emitterType:0,
			finishColorAlpha:0,//结束的最小透明度
			finishColorBlue:0,//结束的最小b
			finishColorGreen:0,//结束的最小g
			finishColorRed:0,//结束的最小r
			finishColorVarianceAlpha:0,//结束的最大透明度
			finishColorVarianceBlue:0,//结束的最大b
			finishColorVarianceGreen:0,//结束的最大g
			finishColorVarianceRed:0,//结束的最大r
			finishParticleSize:0,//结束时候的最小粒子尺寸
			finishParticleSizeVariance:0, //结束时候的最大粒子尺寸
			gravityx:0,//受重力影响x反向
			gravityy:0,//受重力影响y方向
			maxParticles:1, //粒子数量
			maxRadius:0,//最大的半径
			maxRadiusVariance:0,//最大半径区间比
			minRadius:0,//最小的半径
			particleLifespan:0, //粒子存活时间
			particleLifespanVariance:0, //粒子存活时间随机比
			radialAccelVariance:0,//径向加速度方差
			radialAcceleration:0,//径向加速度
			rotatePerSecond:0,//旋转速度
			rotatePerSecondVariance:0,//旋转速度区间
			rotationEnd:0,//结束最小旋转角度
			rotationEndVariance:0,//结束最大旋转角度
			rotationStart:0,//开始最小旋转角度
			rotationStartVariance:0,//开始最大旋转角度
			sourcePositionVariancex:0,//粒子渲染宽度范围
			sourcePositionVariancey:0,//粒子渲染高度范围
			sourcePositionx:0, //粒子开始渲染的顶点坐标x位置
			sourcePositiony:0,	//粒子开始渲染的顶点坐标y位置
			speed:0, //速度
			speedVariance:0,//速度区间
			startColorAlpha:0,//开始的最小透明度
			startColorBlue:0,//开始的最小b
			startColorGreen:0,//开始的最小g
			startColorRed:0,//开始的最小r
			startColorVarianceAlpha:0,//开始的最大透明度
			startColorVarianceBlue:0,//开始的最大b
			startColorVarianceGreen:0,//开始的最大g
			startColorVarianceRed:0,//开始的最大r
			startParticleSize:0, //开始的最小粒子尺寸
			startParticleSizeVariance:0,//开始的最大粒子尺寸
			tangentialAccelVariance:0,//切向加速度方差
			tangentialAcceleration:0,//切向加速度
			textureFileName:null,
			textureImageData:null,
			textureBase64Data:null
		};

		this.parseData = table;
	},

	/**
	 * add particle data
	 * @param {Object} data
	 * @memberOf kc.Particle
	 */
	_addParticleData:function(data){
		this._parseParticle(data);
	},

	/**
	 * set texture cache
	 * @memberOf kc.Particle
	 * @param {Number} textureId
	 */
	// setTextureCache:function(textureId){
	// 	var _this = this;
	// 	var texture = nulll;
	// 	_this.setTextureCache(texture);
	// },

	/**
	 * parse particle
	 * @param {Object} data
	 * @memberOf kc.Particle
	 */
	_parseParticle:function(data){
		var _this = this;
		for (var k in _this.parseData){
			var value = data.data.particle.cocosData[k];
			if (value){
				_this.parseData[k] = value;
			}
		}
		_this.controlObj.addParticleData(_this.parseData, data);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Particle#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file PathFind.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.PathFind is a component draw frame based animation.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.PathFind
 * @extends kc.Component
 */
kc.PathFind = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.PathFind#
	 */
	ObjType: 'PathFind',

	/**
	 * //完成时回调
	 * @memberOf! kc.PathFind#
	 * @type {Number}
	 */
	callBack: 0,

	/**
	 * //移动对象
	 * @type {Number}
	 * @memberOf! kc.PathFind#
	 */
	moveTarget: 0,

	/**
	 * //当前目标点
	 * @memberOf! kc.PathFind#
	 * @type {Boolean}
	 */
	currentTargetPos: false,

	/**
	 * //移动数据
	 * @type {Boolean}
	 * @memberOf! kc.PathFind#
	 */
	moveList: false,

	/**
	 * //状态值[0：停止  1：移动  2：  3：异常]
	 * @memberOf! kc.PathFind#
	 * @type {String}
	 */
	fitness: null,

	/**
	 * speed 
	 * @memberOf! kc.PathFind#
	 * @type {Number}
	 */
	speed:1,

	/**
	 * path Type 
	 * @memberOf! kc.PathFind#
	 * @type {Number}
	 */
	pathType:0,

	/**
	 * one path Worker
	 * @memberOf! kc.PathFind#
	 * @type {Object}
	 */
	m_pathWorker: null,

	/**
	 * map
	 * @type {list}
	 * @memberOf! kc.PathFind#
	 */
    map: {},

	/**
	 * construct Function of Object
	 * @ignore
	 */
	
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
		_this.speed = 100;
        _this.fitness = 0;//状态值[0:停止  1:移动  2:暂停  3:异常]
        _this.moveList = [];//移动数据
        _this.currentTargetPos = null;//当前目标点
        _this.moveTarget = null;//移动对象
        _this.callBack = null;//完成时回调

        if(!_this.m_pathWorker) {
        	if (DEBUG){
        		_this.m_pathWorker = new Worker(APIRoot + "kcInterface/lib/" + "PathWorker?Root=" + ScriptRoot+"&Lib=" + DEBUG_LIB_ROOT+"&Suffix="+BACK_SUFFIX);
        	}else{
        		_this.m_pathWorker = new Worker(APIRoot + "kcInterface/lib/" + "PathWorker?Root=" + ScriptRoot+"&Lib=" + RELEASE_LIB_ROOT+"&Suffix="+BACK_SUFFIX);
        	}
            
            _this.m_pathWorker.onmessage = function (event) {
                var event = JSON.parse(event.data);
                if (_this.map[event.uuid]){
                    _this.map[event.uuid](event.pathPosList);
                    delete _this.map[event.uuid];
                }
            };
        }
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this); 
        _this.moveList.length = 0 ;//移动数据
        _this.currentTargetPos = null;//当前目标点
        _this.moveTarget = null;//移动对象
        _this.callBack = null;//完成时回调
        _this.m_pathWorker = null;
    },

	/**
     * parse component data
     * @override
     * @memberOf! kc.PathFind#
     */
    _parse: function () {
        var _this = this;
		var propertys = _this._propertys;

		_this.setSpeed(propertys.speed);
		_this.setPathType(propertys.pathType);
		_this.addTarget(_this.gameObject);
    },

	/**
	 * 设置对象
	 * add move Target
	 * @memberOf! kc.PathFind#
	 * @param {Object} tar
	 */
    addTarget:function(tar){
        this.moveTarget = tar;
    },

    /**
	 * 设置路径寻路方式
	 * set Path Type
	 * @memberOf! kc.PathFind#
	 * @param {Object} tar
	 */  
    setPathType:function(type){
    	this.pathType = type;
    },
 
    /**
	 * 设置移动点
	 * add move List
	 * @memberOf! kc.PathFind#
	 * @param {Array} list
	 */
    addMoveList:function(list){
        list.shift();
        this.moveList = list;
    },

    /**
	 * 设置完成时回调
	 * add call back
	 * @memberOf! kc.PathFind#
	 * @param {function} call
	 */
    addCallBack:function(call){
        this.callBack = call;
    },

    /**
	 * 改变状态值
	 * change fitness
	 * @memberOf! kc.PathFind#
	 * @param {function} call
	 */
    changeFitness:function(e){
        switch (e){
            case 0:
                this.fitness = 0;
                break;
            case 1:
                this.fitness = 1;
                break;
            case 2:
                break;
            default :
                this.fitness = 0;
                break;
        }
    },

	/**
	 * set Speed
	 * @memberOf! kc.PathFind#
	 * @param {Number} speed
	 */
	setSpeed:function(speed){
		this.speed = speed*10;
	},

	/**
     * 移动函数
     * @param {Number} 上次间隔
     */
    _moveFunc: function (duration) {
        var _this = this;
        if(!_this.currentTargetPos) {
            _this.currentTargetPos = _this.moveList.shift();
        }

        if(!_this.currentTargetPos || !_this.currentTargetPos[0]) {
        	_this.changeFitness(0);
        	if (this.callBack){
                this.callBack(this);
            }
            return;
        }

        var toX = _this.currentTargetPos[0];
        var toY = _this.currentTargetPos[1];
        var beforeX = _this.moveTarget.position.x;
        var beforeY = _this.moveTarget.position.y;

        var maxSetp = kc.pDistance({x:beforeX, y:beforeY}, {x:toX, y:toY});
        var step = _this.speed*duration;

        if (step >= maxSetp){
        	_this.moveTarget.setPosition(toX,toY);
        	_this.currentTargetPos = _this.moveList.shift();
        }else{
        	var ratio = step/maxSetp;
        	var targetPos = kc.pLerp({x:beforeX, y:beforeY}, {x:toX, y:toY}, ratio);
        	_this.moveTarget.setPosition(targetPos.x,targetPos.y);
        }

        //before>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // _this.offset = _this.speed*duration*0.70;
        // if(!_this.currentTargetPos) {
        //     _this.currentTargetPos = _this.moveList.shift();
        // }

        // if (!_this.currentTargetPos || !_this.currentTargetPos[0]){
        // 	return;
        // }

        // var x = _this.currentTargetPos[0];
        // var y = _this.currentTargetPos[1];

        // var pos = _this.moveTarget.position;

        // var step = duration * _this.speed;
        // var distance = kc.pDistance(pos, {x:x, y:y});
        // if (distance<=this.offDacen){
        //     if(_this.moveList.length == 0) {
        //         _this.changeFitness(0);
        //         return;
        //     }
        //     _this.currentTargetPos = _this.moveList.shift();
        //     x = _this.currentTargetPos[0];
        //     y = _this.currentTargetPos[1];
        //     distance = kc.pDistance(pos, {x:x, y:y});
        // }

        // var rate = step / distance;
        // var targetPos = kc.pLerp(pos, {x:x, y:y}, rate);

        // _this.moveTarget.setPosition(targetPos.x,targetPos.y);
    },

	stopFunc: function () {
        var _this = this;

        _this.currentTargetPos = null;
        _this.moveList = null;
    },

	/**
	 * called every frame before draw
	 * @memberOf! kc.PathFind#
	 * @override
	 */
	update: function () {
		var _this = this;

        switch(_this.fitness) {
            case 0:
                _this.stopFunc(kc.deltaTime);
                break;
            case 1:
                _this._moveFunc(kc.deltaTime);
                break;
            case 2:
                break;
        }
	},

	/**
	 * set end pos
	 * @memberOf! kc.PathFind#
	 * @param {Number} x
	 * @param {Number} y
	 */
	setEndPos : function(x,y){
		var _this = this;
		var matrix = null;
		var canDiagonal = _this.pathType;
		var countWH = {};
		var oneWH = {};
		var beganPoint = _this.moveTarget.position;
		var endPoint = kc.p(x,y);
		var offXY = null;
		var mapWH = null;
		var map = _this._getCurrentMap();
		if (map){
			var _w = map._mapSize.width*map._tileSize.width;
			var _h = map._mapSize.height*map._tileSize.height;
			mapWH = {width:_w,height:_h};
			var mapPoint = map.gameObject.position;
			var offXY = kc.p(mapPoint.x-(_w*0.5),mapPoint.y-(_h*0.5));

			var obj = map._MapDataInfo;
			//obj.data.mapScene.pathCanMove  --矩阵信息
    		//obj.data.mapScene.singlelayer[1、3] 块的像素 参数：宽、高
    		//obj.data.mapScene.singlelayer[0、2] tildmap 
			// var count = obj.data.mapScene.pathCanMove.length;
			// if (count !=0){
				matrix = obj.data.mapScene.pathCanMove;
		        countWH.width = obj.data.mapScene.singlelayer[0];
		        countWH.height = obj.data.mapScene.singlelayer[2];

		        oneWH.width = obj.data.mapScene.singlelayer[1];
		        oneWH.height = obj.data.mapScene.singlelayer[3];

		        // var callFun = function () {
		        //     // {{BLOCK[0]|s}};
		        // };

		        var callFunRunAction = function (info) {
		            _this.addMoveList(info);
		            _this.changeFitness(1);
		        };

		        // _this.addCallBack(callFun);

		        var dataInfo = {};
		        dataInfo.matrix = matrix;
		        dataInfo.canDiagonal = canDiagonal;
		        dataInfo.countWH = countWH;
		        dataInfo.oneWH = oneWH;
		        dataInfo.beganPoint = beganPoint;
		        dataInfo.endPoint = endPoint;
		        dataInfo.offXY = offXY;
		        dataInfo.mapWH = mapWH;

		        _this.getMatrixPath(dataInfo,callFunRunAction);
			// }
		}else{
			console.log("error! not tildMap!");
		}
	},

	/**
	 * get Matrix Path
	 * @param  {Object} data
	 * @param  {function} func
	 */
	getMatrixPath:function(data,func){
		var _this = this;
        var uuid = UUID.generate();
        _this.map[uuid.toString()] = func;
        data.uuid = uuid;
        _this.m_pathWorker.postMessage(JSON.stringify(data));
	},

	/**
	 * Get Current Map
	 * @return {Object} map
	 */
	_getCurrentMap:function(){
		for (var i in kc.Core.currentScene.children){
			var child = kc.Core.currentScene.children[i];
			var map = child.getComponents("TiledMap");
			if (map && map[0]){
				return map[0];
			}
		}
	}
});

// if (this.fitness == 1) {
//             if (this.onePosList.length != 0) {
//                 if (this.moveTarget) {
//                     this.moveTarget.setPosition(cc.p(this.onePosList[0][0], this.onePosList[0][1]))
//                     this.onePosList.shift();
//                 }
//             } else {
//                 if(this.moveList.length != 0){
//                     if (this.moveList[1]){
//                         this._getPosOnTimes(this.moveList[0],this.moveList[1]);
//                         this.moveList.shift();
//                     }else {
//                         this.moveList = [];
//                     }
//                 }else{
//                     console.log("someThing To Notifacation!")
//                     if (this.callBack){
//                         this.callBack()
//                     }
//                     this.fitness = 0
//                 }
//             }
//         }else if(this.fitness == 0){
//             if (! cc.director.getScheduler().isTargetPaused(this)){
//                 cc.director.getScheduler().pauseTarget(this);
//             }
//         }
// */
//     },

//     _getPosOnTimes :function(starPos,endPos)
//     {
//         var starX = starPos[0];
//         var starY = starPos[1];
//         var endX = endPos[0];
//         var endY = endPos[1];

//         var k = (endY-starY)/(endX-starX);
//         var timeCount = Math.abs((endX-starX)/this.speed);
//         var directionX = 1;
//         if (endX-starX < 0){
//             directionX = -1
//         }
//         if (timeCount < 1){
//             this.onePosList.push([endX,endY])
//         }else {
//             for (var i = 0; timeCount > i; i++) {
//                 if (timeCount < i+1 ){
//                     this.onePosList.push([starX + this.speed * (i + 1)*directionX, starY + this.speed * (i + 1) * k]);
//                 }else{
//                     this.onePosList.push([endX, endY]);
//                 }
//             }
//         }
//     }
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file PerspectiveCamera.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.PerspectiveCamera is the component draw on screen.
 * </p>
 * @class
 * @name kc.PerspectiveCamera
 * @extends kc.Class
 */
kc.PerspectiveCamera = kc.Component.extend({

	camera: null,
	effects: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		kc.Component.prototype.ctor.call(this);

		this.camera = new kc.EnginePerspectiveCamera();
		var projectData = kc.Project.getProjectData();
		this.camera.aspect = projectData.ResourceText.resolution.width/projectData.ResourceText.resolution.height;
		this.effects = [];
	},

	addEffect: function (effect) {
		this.camera.addEffect(effect);
	},

	setFov: function (value) {
		this.camera.setFov(value);
	},

	setNear: function (near) {
		this.camera.setNear(near);
	},

	setFar: function (far) {
		this.camera.setFar(far);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.PerspectiveCamera#
	 * @override
	 */
	onAwake: function () {

		if(this.gameObject) {
			this.gameObject.engineObject.addChild(this.camera);
		}

		this.camera.start();
	},

	/**
	 * called before the first update called
	 * @memberOf! kc.PerspectiveCamera#
	 * @override
	 */
	onStart: function () {

	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.PerspectiveCamera#
	 * @override
	 */
	update: function () {
		this.camera.updateProjectionMatrix();
	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.PerspectiveCamera#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.PerspectiveCamera#
	 * @override
	 */
	onDestory: function () {

	}
});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Physics.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Physics is the base class of Physics.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Physics
 * @extends kc.Component
 */
kc.Physics = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Physics#
	 */
	ObjType: 'Physics',

	/**
	 * 碰撞的约束条件点
	 * @memberOf! kc.Physics#
	 * @type {Object}
	 */
	constraintPosition:null,

	/**
	 * 密度设置
	 * @memberOf! kc.Physics#
	 * @type {Number}
	 */
	density:0,

	/**
	 * 摩擦力设置
	 * @memberOf! kc.Physics#
	 * @type {Number}
	 */
	friction:0,

	/**
	 * 弹力设置
	 * @memberOf! kc.Physics#
	 * @type {Number}
	 */
	elasticity:0,

	/**
	 * 组别，应该是-或+，按照级别优先级，负为不碰撞。正为碰撞条件分为4种
	 * @memberOf! kc.Physics#
	 * @type {Number}
	 */
	group:0,

	/**
	 * 是否静止
	 * @type {Number}
	 * @memberOf! kc.Physics#
	 */
	staticBox:false,

	/**
	 * 是否显示
	 * @memberOf! kc.Physics#
	 * @type {Boolean}
	 */
	show:true,

	/**
	 * 是否受到重力影响
	 * @memberOf! kc.Physics#
	 * @type {Boolean}
	 */
	gravity:true,

	/**
	 * 物理球大小
	 * @memberOf! kc.Physics#
	 * @type {Boolean}
	 */
	physicsSize:null,

	/**
	 * 类型 1、矩形 2、圆形
	 * @memberOf! kc.Physics#
	 * @type {Number}
	 */
	boxType:1,

	/**
	 * 半径
	 * @type {Number}
	 * @memberOf! kc.Physics#
	 */
	radius:1,

	/**
	 * 速度
	 * @type {Object}
	 * @memberOf! kc.Physics#
	 */
	velocity: null,

	/**
	 * 物理对象本身
	 * @type {Object}
	 * @memberOf! kc.Physics#
	 */
	_body : null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.constraintPosition = {x:0,y:0};
		_this.physicsSize = {width:0,height:0};
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
        Matter.World.remove(kc.PhysicsEngine.world, [_this._body]);
    },

	/**
	 * 碰撞的约束条件点
	 * @param {Number} x 
	 * @param {Number} y
	 * @memberOf! kc.Physics#
	 */
	setConstraintPosition:function(x,y){
		var posX = Number(x);
		var posY = Number(y);
		this.constraintPosition={x:posX,y:posY};
		// this.gameObject.setAnchor(posX, posY);
	},

	/**
	 * set density
	 * @memberOf! kc.Physics#
	 * @param {Number} density
	 */
	setDensity:function(density){
		var _this = this;
		_this.density = Number(density);
		if(_this._body){
			Matter.Body.setDensity(_this._body,_this.density);
		}
	},

	/**
	 * set friction
	 * @memberOf! kc.Physics#
	 * @param {Number} friction
	 */
	setFriction:function(friction){
		this.friction = Number(friction);
	},

	/**
	 * set elasticity
 	 * @memberOf! kc.Physics#
	 * @param {Number} elasticity
	 */
	setElasticity:function(elasticity){
		this.elasticity = Number(elasticity);
	},

	/**
	 * set group
 	 * @memberOf! kc.Physics#
	 * @param {Number} group
	 */
	setGroup:function(group){
		this.group = Number(group);
	},

	/**
	 * set visible
 	 * @memberOf! kc.Physics#
	 * @param {Number} visible
	 */
	setVisible:function(visible){
		this.show = visible;
	},

	/**
	 * set physics Angle
	 * @memberOf! kc.Physics#
	 * @param {Object} angle
	 */
	setPhysicsAngle:function(angle){
		var _this = this;
		_this.angle = angle;
		if(_this._body){
			Matter.Body.setAngle(_this._body,angle/(180/Math.PI));
		}
	},

	/**
	 * set physics position
	 * @memberOf! kc.Physics#
	 * @param {Object} position
	 */
	setPhysicsPosition:function(position){
		var _this = this;
		_this.position = position;
		var pos = position;	
		pos.y = kc.Core._size.height - pos.y;
		if(_this._body){
			Matter.Body.setPosition(_this._body,pos);
		}
	},

	/**
	 * set staticBox
 	 * @memberOf! kc.Physics#
	 * @param {boolean} staticBox
	 */
	setStaticBox:function(staticBox){
		var _this = this;
		_this.staticBox = staticBox;
		if(_this._body){
			Matter.Body.setStatic(_this._body,staticBox);
		}
	},

	/**
	 * set gravity
 	 * @memberOf! kc.Physics#
	 * @param {boolean} gravity
	 */
	setGravity:function(gravity){
		var _this = this;
		_this.gravity = gravity;
		if(_this._body){
			Matter.Sleeping.set(_this._body,!gravity);
		}
	},

	/**
	 * 设置对象大小
	 * set the object size
	 * @memberOf! kc.Physics#
	 * @param {Number} width
	 * @param {Number} height
	 */
    setSize:function(w,h){
    	var _this = this;
    	_this.physicsSize = {width:Number(w),height:Number(h)};
    },

    /**
	 * 设置半径大小
	 * set the object size
	 * @memberOf! kc.Physics#
	 * @param {Number} width
	 * @param {Number} height
	 */
    setRadius:function(radius){
    	this.radius = Number(radius);
    },

    /**
	 * setType
	 * 设置类型，默认1为矩形，2为圆形
	 * @memberOf! kc.Physics#
	 * @param {Number} width
	 * @param {Number} height
	 */
    setType:function(key){
    	this.boxType = key;
    },

    /**
	 * set velocity
	 * 设置速度
	 * @memberOf! kc.Physics#
	 * @param {Number} value
	 */
    setVelocity:function(value){
    	var _this = this; 	
    	_this.velocity = value;
    	if(_this._body){
			Matter.Body.setVelocity(_this._body,value);
		}
    },

    /**
	 * apply Impulse
	 * 设置脉冲
	 * @memberOf! kc.Physics#
	 * @param {Number} value
	 */
    applyImpulse:function(value){
    	var _this = this; 	
    	if(_this._body){
			_this._body.force.x = value.x;
    		_this._body.force.y = -value.y;
		} 	
    },
	/**
	 * update body
 	 * @memberOf! kc.Physics#
	 */
	updateBody:function(){
		var _this = this;
		if (!_this.show){
			return;
		}
		var worldPos = _this.gameObject.convertToWorldSpace();
		var Bodies = Matter.Bodies;
		var box = null;
		var info = {
			collisionFilter: {
				group: _this.group
			},
			density: _this.density,
			friction: _this.friction,
			restitution: _this.elasticity,
			isSleeping: !_this.gravity,
			isStatic: _this.staticBox
		};
		if (_this.boxType == 1) {
			box = Bodies.rectangle(worldPos.x, kc.Core._size.height - worldPos.y, _this.physicsSize.width, _this.physicsSize.height,info);
		} else {
			box = Bodies.circle(worldPos.x, kc.Core._size.height - worldPos.y,_this.radius ,info);
		}

		box.KCsprite = _this.gameObject;
		_this._body = box;
		Matter.World.add(kc.PhysicsEngine.world, [box]);
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file PhysicsBox.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.PhysicsBox is the component draw an image.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.PhysicsBox
 * @extends kc.Class
 */
kc.PhysicsBox = kc.Physics.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.PhysicsBox
	 */
	ObjType: 'PhysicsBox',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Physics.prototype.ctor.call(_this);
	},

	clear:function(){
        var _this = this;
        kc.Physics.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.PhysicsBox#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		_this.setSize(propertys.size.width,propertys.size.height);
		_this.setConstraintPosition(propertys.offsetX,propertys.offsetY);//应该是约束点?
		_this.setDensity(propertys.mass);//mass?质量?
		_this.setFriction(propertys.friction);//摩擦力
		_this.setElasticity(propertys.Elasticity);//restitution弹力
		_this.setGroup(propertys.contactGroup);//碰撞组??
		_this.setVisible(propertys.show);
		_this.setType(1);
		_this.setStaticBox(propertys.static);
		_this.setGravity(propertys.gravity);
		_this.updateBody();
	}

});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file PhysicsCircle.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.PhysicsCircle is the component draw an image.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.PhysicsCircle
 * @extends kc.Class
 */
kc.PhysicsCircle = kc.Physics.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.PhysicsCircle
	 */
	ObjType: 'PhysicsCircle',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Physics.prototype.ctor.call(_this);
	},

	clear:function(){
        var _this = this;
        kc.Physics.prototype.clear.call(_this);
    },
	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.PhysicsCircle#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		_this.setRadius(propertys.radius);
		_this.setConstraintPosition(propertys.offsetX,propertys.offsetY);//应该是约束点?
		_this.setDensity(propertys.mass);//mass?质量?
		_this.setFriction(propertys.friction);//摩擦力
		_this.setElasticity(propertys.Elasticity);//restitution弹力
		_this.setGroup(propertys.contactGroup);//碰撞组??
		_this.setVisible(propertys.show);
		_this.setType(2);
		_this.setStaticBox(propertys.static);
		_this.setGravity(propertys.gravity);
		_this.updateBody();
	}

});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Scale9Sprite.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Scale9Sprite is the picture of component  with nine Bitmap.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Scale9Sprite
 * @extends kc.Component
 */
kc.Scale9Sprite = kc.Render.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Scale9Sprite#
	 */
	ObjType:'Scale9Sprite',


	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Render.prototype.ctor.call(_this);
		
		_this.controlObj = new kc.Engine9sprite();

	},

	clear:function(){
        var _this = this;
        kc.Render.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Scale9Sprite#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var resInfo = kc.Project.getResourceForKey(propertys.file.id);
		var width = Number(propertys.scale9SpriteW);
		var height = Number(propertys.scale9SpriteH);
		var posX = Number(propertys.scaleAreaX);
		var posY = Number(propertys.scaleAreaY);
		var pictureW = Number(propertys.scaleAreaW);
		var pictureH = Number(propertys.scaleAreaH);

		if(resInfo && resInfo.resURL && resInfo.resURL!=''){
			_this.setSrc(ResRoot + resInfo.resURL.substr(1));
		}

		_this.setSize(width,height);
		_this.set9SpriteArea(posX,posY,pictureW,pictureH);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Scale9Sprite#
	 * @override
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
	},

	/**
	 * picture width or height
	 * @memberOf! kc.Scale9Sprite#
	 * @param {Number} width 
	 * @param {Number} height
	 */
	setSize:function(width,height){
		var _this = this;
		_this.controlObj.setContentSize(width,height);
		_this.gameObject.setSize(width,height);
	},

	/**
	 * picture size
	 * @memberOf! kc.Scale9Sprite#
	 * @return {Number} width 
	 * @return {Number} height
	 */
	 getSize: function(){
	 	var _this = this;
	 	return _this.gameObject.size;
	 },


 	/**
 	 * set Margins with left、 right、 up and down.
 	 * @memberOf! kc.Scale9Sprite#
 	 * @param  {Number} posX     start x
 	 * @param  {Number} posY     start y
 	 * @param  {Number} pictureW margin width
 	 * @param  {Number} pictureH margin height
 	 */
 	set9SpriteArea:function(posX,posY,pictureW,pictureH){
 		var _this = this;
 		_this.controlObj.set9SpriteArea(posX,posY,pictureW,pictureH);
 	}

 });
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Scroll.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Scroll is a component moved object if you want.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Scroll
 * @extends kc.Component
 */
kc.Scroll = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Scroll#
	 */
	ObjType: 'Scroll',

	/**
	 * move image
	 * @memberOf! kc.Scroll#
	 * @type {Object}
	 * @private
	 */
	_image :null,

	/**
	 * x speed
	 * @type {Number}
	 * @memberOf! kc.Scroll#
	 */
	speedX:0,
	/**
	 * y speed
	 * @type {Number}
	 * @memberOf! kc.Scroll#
	 */
	speedY:0,
	/**
	 * texture init
	 * @type {Boolean}
	 * @memberOf! kc.Scroll#
	 * @private
	 */
	_isInit:null,
	/**
	 * play status
	 * @memberOf! kc.Scroll#
	 * @type {Boolean}
	 */
	bPlaying: false,
	/**
	 * auto play
	 * @type {Boolean}
	 * @memberOf! kc.Scroll#
	 */
	bAutoPlay: false,

	/**
	 * store plist data
	 * @type {Object}
	 * @memberOf! kc.Scroll#
	 */
	mPlistData:null,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */

	ctor: function() {
		kc.Component.prototype.ctor.call(this);

		this._isInit = false;
		this.imageList = {};
		this.imageList.x = [];
		this.imageList.y = [];
		// this.image = new kc.EngineImage();
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
		this.imageList.x.length = 0;
		this.imageList.y.length = 0;
		this.imageList = null;
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Scroll#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var speedX = parseInt(propertys.speedX);
		var speedY = parseInt(propertys.speedY);
		var resInfo = kc.Project.getResourceForKey(propertys.src.id);
		var audioPay = propertys.autoPlay;

		if(resInfo && resInfo.resURL && resInfo.resURL!=''){
			_this.setImage(ResRoot + resInfo.resURL.substr(1));
		}
		_this.setSpeed(speedX,speedY);
		// if (audioPay){
		_this.play(1);
		// }
	},

	/**
	 * set move object
	 * @memberOf! kc.Scroll#
	 * @param {textrue} url
	 */
	setImage:function(src){
		var _this = this;
		var txt = kc.getPlistTexture(src);
		if(!DEBUG&&txt){
			_this.mPlistData = txt.plistData;
			_this._image = txt.texture;
			_this._isInit = false;
			for (var key in _this.imageList.x){
				var one = _this.imageList.x[key];
				one.obj.setPlistTexture(txt.texture,txt.plistData);
			}
			for (var key in _this.imageList.y){
				var one = _this.imageList.y[key];
				one.obj.setPlistTexture(txt.texture,txt.plistData);
			}

		}else{
			var texture = kc.Cache.get(src,function(text){
				_this._image = text;
				_this._isInit = false;
				for (var key in _this.imageList.x){
					var one = _this.imageList.x[key];
					one.obj.changeTexture(text);
				}
				for (var key in _this.imageList.y){
					var one = _this.imageList.y[key];
					one.obj.changeTexture(text);
				}
			});
		}
	},

	/**
	 * set speed support x and y
	 * @memberOf! kc.Scroll#
	 * @param {Number} x
	 * @param {Number} y
	 */
	setSpeed:function(x,y){
		var _this = this;
		_this.speedX = x || _this.speedX;
		_this.speedY = y || _this.speedY;
		_this._isInit = false;
	},

	/**
	 * set speed support x
	 * @param x
	 */
	setSpeedX: function(x){
		var _this = this;
		_this.speedX = x || _this.speedX;
		_this._isInit = false;
	},

	/**
	 * get speed support x
	 * @returns {Number}
	 */
	getSpeedX: function(){
		return this.speedX;
	},

	/**
	 * set speed support y
	 * @param y
	 */
	setSpeedY: function(y){
		var _this = this;
		_this.speedY = y || _this.speedY;
		_this._isInit = false;
	},

	/**
	 * get speed support y
	 * @returns {Number}
	 */
	getSpeedY: function(){
		return this.speedY;
	},

	/**
	 * clear texture
	 * @memberOf! kc.Scroll#
	 */
	_clearTexture:function(){
		this._isInit = false;
		this.imageList = {};
		this.imageList.x = [];
		this.imageList.y = [];
	},

	/**
	 * init all the texture if it not enough wide or high.
	 * @memberOf! kc.Scroll#
	 * @private
	 */
	_initTexture:function(){
		var _this = this;
		if (_this._isInit){return;}
		if (!_this._image){return;}
		var scrollHeight,scrollWidth;
		if(_this.speedX == 0 && _this.speedY ==0) {
			var image = new kc.EngineImage();
			if(!DEBUG && _this.mPlistData){
				image.setPlistTexture(_this._image,_this.mPlistData);
				scrollHeight = _this.mPlistData.sourceSize.height;
				scrollWidth =  _this.mPlistData.sourceSize.width;
			}else{
				image.setObjectTexture(this._image);
				scrollHeight = _this._image.height;
				scrollWidth = _this._image.width;
			}

			_this.gameObject.engineObject.addChild(image);
			return;
		}
		_this._clearTexture();
		var winSize = kc.Core.getWinSize();
		var scale = kc.getScale(_this.gameObject);
		if(!DEBUG &&_this.mPlistData){
			scrollHeight = _this.mPlistData.sourceSize.height;
			scrollWidth =  _this.mPlistData.sourceSize.width;
		}else{
			scrollHeight = _this._image.height;
			scrollWidth = _this._image.width;
		}


		if (_this.speedX != 0){
			var times = Math.ceil(winSize.width*2/ (scrollWidth*scale.x));
			for (var i=0;i<times;i++){
				var image = new kc.EngineImage();
				if(!DEBUG && _this.mPlistData){
					image.setPlistTexture(_this._image,_this.mPlistData);
				}else{
					image.setObjectTexture(_this._image);
				}
				_this.gameObject.engineObject.addChild(image);
				var table = {};
				table.obj = image;
				table.x = _this.speedX > 0 ? -i*scrollWidth : i*scrollWidth;
				table.times = times;
				_this.imageList.x.push(table);
				image.setPosition(table.x,0);
			}
		}

		if (_this.speedY != 0){
			var times = Math.ceil(winSize.height*2/ (scrollHeight*scale.y));
			for (var i=0;i<times;i++){
				var image = new kc.EngineImage();
				if(!DEBUG&&_this.mPlistData){
					image.setPlistTexture(_this._image,_this.mPlistData);
				}else{
					image.setObjectTexture(_this._image);
				}
				_this.gameObject.engineObject.addChild(image);
				var table = {};
				table.obj = image;
				table.y = _this.speedY>0? -i*scrollHeight : i*scrollHeight;
				table.times = times;
				_this.imageList.y.push(table);
				image.setPosition(0,table.y);
			}
		}

		_this._isInit = true;
	},

	/**
	 * reset animate component
	 * @memberOf! kc.Scroll#
	 * @public
	 */
	reset: function () {
		this.bPlaying = false;
	},

	/**
	 * run the action
	 * @memberOf! kc.Scroll#
	 */
	play: function () {
		var _this = this;
		_this._initTexture();
		_this.bPlaying = true;

	},

	/**
	 * pause the animation
	 * @memberOf! kc.Scroll#
	 */
	pause: function () {
		this.bPlaying = false;
	},

	/**
	 * resume the animation
	 * @memberOf! kc.Scroll#
	 */
	resume: function () {
		this.bPlaying = true;
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Scroll#
	 * @override
	 */
	onAwake: function () {
		// this.gameObject.engineObject.addChild(this.image);
	},

	/**
	 * called before the first update called
	 * @memberOf! kc.Scroll#
	 * @override
	 */
	onStart: function () {

	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.Scroll#
	 * @override
	 */
	update: function () {
		var _this = this;

		if(!_this.bPlaying || (_this.speedX == 0 && _this.speedY ==0)) {
			return;
		}

		if(!_this.imageList.x[0] && !_this.imageList.y[0]){
			_this._initTexture();
			return;
		}
		// kc.deltaTime
		var scale = kc.getScale(_this.gameObject);
		var winSize = kc.Core.getWinSize();
		var scrollHeight,scrollWidth;
		if(!DEBUG && _this.mPlistData){
			scrollHeight = _this.mPlistData.sourceSize.height;
			scrollWidth = _this.mPlistData.sourceSize.width;
		}else{
			scrollHeight = _this._image.height;
			scrollWidth = _this._image.width;
		}

		if (_this.speedX != 0 ){
			for (var key in _this.imageList.x){
				var one = _this.imageList.x[key];
				var posX = one.x+kc.deltaTime*_this.speedX;
				var posWorld = _this.gameObject.convertToWorldSpace({x:posX,y:0});
				one.x = posX;
				one.obj.setPosition(posX,0);
				if (_this.speedX >0 && posWorld.x > winSize.width+scrollWidth*0.5*scale.x ){
					one.x = one.x - scrollWidth*one.times;
				}else if (_this.speedX <0 &&  posWorld.x < -scrollWidth*0.5*scale.x){
					one.x = one.x + scrollWidth*one.times;
				}
			}
		}


		if (_this.speedY != 0 ){
			for (var key in _this.imageList.y){
				var one = _this.imageList.y[key];
				var posY = one.y+kc.deltaTime*_this.speedY;
				var posWorld = _this.gameObject.convertToWorldSpace({x:0,y:posY});
				one.y = posY;
				one.obj.setPosition(0,posY);
				if (_this.speedY >0 && posWorld.y > winSize.height+scrollHeight*0.5*scale.x ){
					one.y = one.y - scrollHeight*one.times;
				}else if (_this.speedY <0 &&  posWorld.y < -scrollHeight*0.5*scale.y){
					one.y = one.y + scrollHeight*one.times;
				}
			}
		}

	},

	/**
	 * called every frame after update called before draw
	 * @memberOf! kc.Scroll#
	 * @override
	 */
	lateUpdate: function () {

	},

	/**
	 * called when this component is about to destory
	 * @memberOf! kc.Scroll#
	 * @override
	 */
	onDestory: function () {
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file SepiaFilter.js
 * @author chang_f
 */

var kc = kc || {};

/**
 * <p>滤镜类.<br/>
 * <br/>
 * </p>
 * @class
 * @圆形滤镜类
 * @name kc.SepiaFilter
 * @extends kc.Class
 */
kc.SepiaFilter = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.SepiaFilter#
	 */
	ObjType: 'SepiaFilter',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.SepiaFilter#
	 */
	_parse: function () {
		var _this = this;

		var propertys = _this._propertys;
		var degree = propertys.degree;

		var textures = _this.gameObject.getComponents('Texture');
		for(var i = 0; i < textures.length; i++) {
			var one = textures[i];
			kc.Filter.sepia(one.controlObj.sprite, degree);
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Server.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Server is the base class of component.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Server
 * @extends kc.Class
 */
kc.Server = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.Server
	 */
	ObjType: 'Server',

	/**
	 * 服务器逻辑代码id
	 * @type {Number}
	 * @memberOf kc.Server
	 */
	serverLogicId:null,

	/**
	 * 客户端逻辑代码id
	 * @type {Number}
	 * @memberOf kc.Server
	 */
	clientLogicId:null,

	/**
	 * 客户端返回的mssage
	 * @type {Number}
	 * @memberOf kc.Server
	 */
	message:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Server#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var serverLogicId = propertys.serverLogic.id;
		var clientLogicId = propertys.clientLogic.id;
		_this.clientLogicId = propertys.clientLogic.id;
		_this.serverLogicId = propertys.serverLogic.id;

		_this.setServerLogic(serverLogicId);
		_this.setClientLogic(clientLogicId);
	},

	/**
	 * set server message
	 * @param  message
	 * @memberOf kc.Server
	 */

	 setMessage: function(message){
	 	this.message =  message;
	 },

	 /**
	 * get server message
	 * @param  message
	 * @memberOf kc.Server
	 */

	 getMessage: function(){
	 	return this.message; 
	 },

	/**
	 * set server logic id
	 * @param {Number} id
	 * @memberOf kc.Server
	 */
	setServerLogic:function(id){
		var _this = this;
		_this.serverLogicId = id;
	},

	/**
	 * get server logic id
	 * @param {Number} id
	 * @memberOf kc.Server
	 */
	getServerLogic:function(id){
		return this.serverLogicId;
	},

	/**
	 * set client logic id
	 * @param {Number} id
	 * @memberOf kc.Server
	 */
	setClientLogic:function(id){
		var _this = this;
		_this.clientLogicId = id;
		if (id){
			_this.logics[id] = kc["LogicClass_" + id];
		}	
	},

	/**
	 * get client logic id
	 * @param {Number} id
	 * @memberOf kc.Server
	 */
	getClientLogic:function(id){
		return this.clientLogicId;
	},



	/**
	 * run logic if has
	 * @memberOf! kc.Server#
	 * @private
	 */
	doLogic:function(){
		var _this = this;
		var logic = _this.logics[_this.clientLogicId];
		if (logic){
			var obj = new logic();
			obj.run(_this);
		}
	}

});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Shake.js
 * @author langcheng.lai
 */

var kc = kc || {};

/**
 * <p>kc.Shake is a component provide Shake function.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Shake
 * @extends kc.Component
 */
kc.Shake = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Shake#
	 */
	ObjType: 'Shake',

	/**
	 * logic id
	 * @type {Number}
	 * @memberOf! kc.Shake#
	 */
	logicId: null,

	/**
	 * criticalValue
	 * @type {Number}
	 * @memberOf! kc.Shake#
	 */
	criticalValue: 0,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineObject();
		_this.curShakeX = _this.curShakeY = _this.curShakeZ = _this.lastShakeX = _this.lastShakeY = _this.lastShakeZ = 0;
		_this.lastUpdate = 0;
		_this.logicId = null;

		this.setupShake();

		if(window.DeviceMotionEvent){
			window.addEventListener('devicemotion', _this.deviceMotion, false);
		}else{
			alert('您好，你目前所用的设备好像不支持重力感应哦！');
		}
	},

	clear:function(){
		var _this = this;
		kc.Component.prototype.clear.call(_this);
	},

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Shake#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;

		var criticalValue = propertys.criticalValue;
		var resId = propertys.logicSrc.id;

		_this.setCriticalvalue(criticalValue);
		_this.addLogic(resId);
		_this.setLogicId(resId);
	},

	/**
     * set criticalvalue
     * @param criticalValue
     */
	setCriticalvalue : function(criticalValue){
 		this.criticalValue = criticalValue;
 	},

 	/**
     * get criticalvalue
     * @returns {Number}
     */
 	getCriticalvalue : function(){
 	 	return this.criticalValue;
 	},

    /**
     * set logic id
     * @param logicId
     */
    setLogicId: function(logicId){
        this.logicId = logicId;
    },

    /**
     * get logic id
     * @returns {Number}
     */
    getLogicId: function(){
        return this.logicId;
    },

	/**
	 * called when the Shake just is loaded
	 * @memberOf! kc.Shake#
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
	},

	/**
	 * setup Shake override
	 * @memberOf! kc.Shake#
	 */
	setupShake: function () {
		var _this = this;
 		_this.deviceMotion = function (event) {
			var acceleration = event.accelerationIncludingGravity;

			var curTime = new Date().getTime();

		    if((curTime - _this.lastUpdate) > 100)
		    {
				var diffTime = curTime - _this.lastUpdate;

				_this.lastUpdate = curTime;

				_this.curShakeX = acceleration.x;

				_this.curShakeY = acceleration.y;

				_this.curShakeZ = acceleration.z;

				var speed = Math.abs(_this.curShakeX + _this.curShakeY + _this.curShakeZ - _this.lastShakeX - _this.lastShakeY - _this.lastShakeZ) / diffTime * 10000;
				if(speed > _this.criticalValue)
				{
					_this.doLogic(_this.logicId);
				}
			}
		}
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Share.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Share is the base class of component.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Share
 * @extends kc.Class
 */
kc.Share = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.Share
	 */
	ObjType: 'Share',

	/**
	 * imageId
	 * @type {String}
	 * @memberOf kc.Share
	 */
	resUrl: null,
	/**
	 * title
	 * @type {Number}
	 * @memberOf kc.Share
	 */
	title: null,
	/**
	 * myGlobal
	 * @type {String}
	 * @memberOf kc.Share
	 */
	myGlobal: null,
	/**
	 * describe1
	 * @type {String}
	 * @memberOf kc.Share
	 */
	describe1: null,
	/**
	 * describe2
	 * @type {String}
	 * @memberOf kc.Share
	 */
	describe2: null,

	/**
	 * appid
	 * @type {String}
	 * @memberOf kc.Share
	 */
	appid: null,

	/**
	 * secret
	 * @type {String}
	 * @memberOf kc.Share
	 */
	secret: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Share#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var imageId = propertys.image.id;
		var title = propertys.title;
		var myGlobal = propertys.var;
		var describe1 = propertys.describe1;
		var describe2 = propertys.describe2;
		var appid = propertys.appid;
		var secret = propertys.secret;
		if(myGlobal) {
			myGlobal='G_'+myGlobal;
		}
		var resInfo = kc.Project.getResourceForKey(imageId);

		_this.setShareInfo(ResRoot + resInfo.resURL.substr(1), appid, secret, title, myGlobal, describe1, describe2);
	},

	/**
	 * set share info
	 * @memberOf! kc.Share#
	 * @param {Number} resUrl  
	 * @param {String} title     
	 * @param {Object} myGlobal  
	 * @param {String} describe1 
	 * @param {String} describe2 
	 */
	setShareInfo: function(resUrl,appid, secret, title, myGlobal, describe1, describe2) {
		var _this = this;
		_this.resUrl = resUrl;
		_this.appid = appid;
		_this.secret = secret;
		_this.title = title;
		_this.myGlobal = myGlobal || "";
		_this.describe1 = describe1;
		_this.describe2 = describe2;
	},

	/**
	 * share in WeiXin
	 * @memberOf! kc.Share#
	 */
	shareInWeiXin:function(){
		var _this = this;
		var globalValue = window[_this.myGlobal]? window[_this.myGlobal]: "";
		var des = _this.describe1 + globalValue + _this.describe2;
		WeChatShare(_this.appid, _this.secret, _this.title, des, _this.resUrl);
	}

});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file LoadingBar.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Slider is the component  <br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Slider
 * @extends kc.Component
 */
kc.Slider = kc.LoadingBar.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Slider#
	 */
	ObjType: 'Slider',

	/**
	 * button event:"into","outside"
	 * @memberOf! kc.Slider#
	 * @type {Boolean}
	 * @private
	 */
	_isInto: null,

	/**
	 * set change list:"normalSrc,selectedSrc,movedSrc,disabledSrc"
	 * @memberOf! kc.Slider#
	 * @type {Object}
	 */
	changeList: null,

	/**
	 * logic id
	 * @memberOf! kc.Slider#
	 * @type {Number}
	 */
	logicId: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.LoadingBar.prototype.ctor.call(_this);

		_this.Slider = new kc.EngineImage();
		_this.sliderSize = {
			width: 0,
			height: 0
		};
		_this.sliderPosition = {
			x: 0,
			y: 0
		};

		_this.controlObj.addChild(_this.Slider);
	},

	clear:function(){
        var _this = this;
        kc.LoadingBar.prototype.clear.call(_this);
        _this.Slider = null;
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Slider#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var resId = propertys.logicSrc.id;
		//trackSrc,sliderSrc,normalNodeSrc,selectedNodeSrc,disabledNodeSrc
		var list = {};
		for (var srcId in propertys) {
			var obj = kc.Project.getResourceForKey(propertys[srcId].id);
			obj && obj.resURL && obj.resURL!='' && (list[srcId] = ResRoot + obj.resURL.substr(1));
		}

		_this.addLogic(resId);
		_this.logicId = resId;
		_this.setbackground(list["trackSrc"]);
		_this.setForeground(list["sliderSrc"]);
		_this.setDirection(0);
		_this.setBarValue(0);
		
		_this.setSlider(list["normalNodeSrc"]);
		_this._setChangeList(list);
	},

	/**
	 * set Slider texture 
	 * @memberOf! kc.Slider#
	 * @param {String} src url
	 */
	setSlider: function(src) {
		var _this = this;
		var txt = kc.getPlistTexture(src);
		if(!DEBUG && txt){
			_this.Slider.setPlistTexture(txt.texture,txt.plistData);
			_this.sliderSize.width = txt.plistData.sourceSize.width;
			_this.sliderSize.height = txt.plistData.sourceSize.height;
		}else{
			var texture = kc.Cache.get(src);
			_this.Slider.changeTexture(texture);

			_this.sliderSize.width = texture.width;
			_this.sliderSize.height = texture.height;
		}
	},

	/**
	 * change Slider image 
	 * @memberOf! kc.Slider#
	 * @param  {String} src url   
	 */
	changeSliderSrc: function(src) {
		var _this = this;
		if(!DEBUG){
			var txt = kc.getPlistTexture(src);
			_this.Slider.setPlistTexture(txt.texture,txt.plistData);
			_this.sliderSize.width = txt.plistData.sourceSize.width;
			_this.sliderSize.height = txt.plistData.sourceSize.height;
		}else{
			var texture = kc.Cache.get(src);
			_this.Slider.changeTexture(texture);

			_this.sliderSize.width = texture.width;
			_this.sliderSize.height = texture.height;
		}
	},

	/**
	 * set user can use or not in this button
	 * @memberOf! kc.Slider#
	 * @param {Boolean} bool 
	 */
	setDisabled: function(bool) {
		var _this = this;
		_this.disabled = bool;
		if (bool) {
			_this.changeSliderSrc(_this.changeList["disabledNodeSrc"]);
		}
	},

	/**
	 * the button has four pictures,set it
	 * @memberOf! kc.Slider#
	 * @param {Object} list
	 */
	_setChangeList: function(list) {
		this.changeList = list;
	},

	/**
	 * Judge the position is in object 
	 * @memberOf! kc.Slider#
	 * @param  {Object}  event {x,y,type}
	 * @private
	 * @return {Boolean}       hit or not hit
	 */
	_isPosIn: function(event) {
		var _this = this;
		if (_this.disabled) {
			return false;
		}
		var pos = _this.gameObject.convertToNodeSpace({
			x: event.x,
			y: event.y
		});

		var x = pos.x;
		var y = pos.y;

		var offset = _this.gameObject.anchor;

		var objSize = _this.sliderSize;
		var sliderPos = _this.sliderPosition;
		var width = _this.gameObject.size.width;
		var height = _this.gameObject.size.height;

		var leftX = -width * offset.x + sliderPos.x - objSize.width * 0.5;
		var rightX = -width * offset.x + sliderPos.x + objSize.width * 0.5;
		var upY = -height * offset.y + sliderPos.y + objSize.height * 0.5;
		var dowmY = -height * offset.y + sliderPos.y - objSize.height * 0.5;

		if (x >= leftX && x <= rightX && y >= dowmY && y <= upY) {
			return true;
		}
		return false;
	},

	/**
	 * inherit onMouseDown
	 * @memberOf! kc.Slider#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseDown: function(event) {
		var _this = this;
		if (_this._isPosIn(event)) {
			var changeObj = _this.changeList["selectedNodeSrc"];
			_this.changeSliderSrc(changeObj);
			_this._isInto = true;
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseUp
	 * @memberOf! kc.Slider#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseUp: function(event) {
		var _this = this;
		if (_this._isInto) {
			var changeObj = _this.changeList["normalNodeSrc"];
			_this.changeSliderSrc(changeObj);
			_this._isInto = false;
			return _this.stopPropagation;
		}
	},

	/**
	 * inherit onMouseMove
	 * @memberOf! kc.Slider#
	 * @param  {Object} event event.type/event.x/event.y
	 * @return {Boolean}      
	 */
	onMouseMove: function(event) {
		var _this = this;
		if (_this._isInto) {
			var pos = this.gameObject.convertToNodeSpace({
				x: event.x,
				y: event.y
			});
			var result = _this._chooseDirection(pos);

			_this.setBarValue(result.barValue);
			_this.Slider.setPosition(result.nowPos.x, result.nowPos.y);
			_this.sliderPosition.x = result.nowPos.x;
			_this.sliderPosition.y = result.nowPos.y;
			_this.doLogic(_this.logicId);
			return _this.stopPropagation;
		}
	},

	_chooseDirection: function(pos) {
		var _this = this;
		var startPos = {
			x: 0,
			y: 0
		};
		var nowPos = {
			x: 0,
			y: 0
		};
		var barValue = 0;
		var contentSize = _this.gameObject.size;
		if (typeof (_this.direction) == "number" && (_this.direction == 0 || _this.direction == 1)) {
			if (pos.x < -contentSize.width * _this.gameObject.anchor.x) {
				pos.x = -contentSize.width * _this.gameObject.anchor.x;
			}
			if (pos.x > contentSize.width * (1 - _this.gameObject.anchor.x)) {
				pos.x = contentSize.width * (1 - _this.gameObject.anchor.x);
			}

			var posFromat = 0;
			if (_this.direction == 0){
				posFromat = contentSize.width * _this.gameObject.anchor.x + pos.x;
				startPos = {
					x: 0,
					y: contentSize.height * 0.5
				};
				nowPos = {x:posFromat,y:contentSize.height * 0.5};
			}else{
				posFromat = contentSize.width * (1-_this.gameObject.anchor.x) - pos.x;
				startPos = {
					x: contentSize.width,
					y: contentSize.height * 0.5
				};
				nowPos = {x:contentSize.width - posFromat,y:contentSize.height * 0.5};
			}
			barValue = posFromat / contentSize.width * 100;
			
			return {nowPos:nowPos,barValue:barValue,startPos:startPos};
		}else if (typeof (_this.direction) == "number" && (_this.direction == 2||_this.direction == 3)) {
			if (pos.y < -contentSize.height * _this.gameObject.anchor.y) {
				pos.y = -contentSize.height * _this.gameObject.anchor.y;
			}
			if (pos.y > contentSize.height * (1 - _this.gameObject.anchor.y)) {
				pos.y = contentSize.height * (1 - _this.gameObject.anchor.y);
			}

			var posFromat = 0;
			if (_this.direction == 2){
				posFromat = contentSize.height * (1-_this.gameObject.anchor.y) - pos.y;
				nowPos = {x:contentSize.width * 0.5,y:contentSize.height - posFromat};
				startPos = {
					x: contentSize.width * 0.5,
					y: contentSize.height
				};
			}else{
				posFromat = contentSize.height * _this.gameObject.anchor.y + pos.y;
				nowPos = {x:contentSize.width * 0.5,y:posFromat};
				startPos = {
				x: contentSize.width * 0.5,
					y: 0
				};
			}
			barValue = posFromat / contentSize.height * 100;
			return {nowPos:nowPos,barValue:barValue,startPos:startPos};
		}
	},

	_getNowPos:function(){
		var _this = this;
		var contentSize = _this.gameObject.size;
		var pos = {x:contentSize.width * 0.5,y:contentSize.height * 0.5};
		if (_this.direction == 0){
			pos.x = _this.progressValue/100*contentSize.width;
		}else if (_this.direction == 1) {
			pos.x = (100-_this.progressValue)/100*contentSize.width;
		}else if (_this.direction == 2) {
			pos.y = (100-_this.progressValue)/100*contentSize.height;
		}else if (_this.direction == 3) {
			pos.y = _this.progressValue/100*contentSize.height;
		}
		return pos;
	},

	/**
	 * the value is 1-100
	 * @memberOf! kc.Slider#
	 * @param {Number} v
	 */
	setBarValue:function(v){
		var _this = this;
		kc.LoadingBar.prototype.setBarValue.call(_this,v);

		var result = _this._getNowPos();
		_this.Slider.setPosition(result.x, result.y);
		_this.sliderPosition.x = result.x;
		_this.sliderPosition.y = result.y;
	},

	/**
	 * 设置进度条方向
	 * set processbar direction
	 * @memberOf! kc.Slider#
	 * @param {Number} direction
	 */
	setDirection:function(direction){
		var _this = this;
		kc.LoadingBar.prototype.setDirection.call(_this,direction);

		var result = _this._getNowPos();
		_this.Slider.setPosition(result.x, result.y);
		_this.sliderPosition.x = result.x;
		_this.sliderPosition.y = result.y;
	},

	/**
	 * called every frame before draw
	 * @memberOf! kc.Slider#
	 */
	update: function() {
		var _this = this;
		if (_this._reSize) {
			kc.LoadingBar.prototype.update.call(_this);
			var contentSize = _this.gameObject.size;
			_this._reSize = false;
			var pos = _this._chooseDirection({x:0,y:0});
			_this.Slider.setPosition(pos.startPos.x, pos.startPos.y);
			_this.sliderPosition.x = pos.startPos.x;
			_this.sliderPosition.y = pos.startPos.y;
		}
	}
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file SpineAnimate.js
 * @author wang_ch
 */

var kc = kc || {};

kc.spineTextureLoader = function(png) {
	var _this = this;

	_this.image = png;

	_this.loader = function(url) {
		console.log("loader!!!");
		return _this;
	};

	_this.setFilters = function(minFilter, magFilter) {
		console.log("setFilters!!!");
	};
	_this.setWraps = function(uWrap, vWrap) {
		console.log("setWraps!!!");
	};
	_this.update = function(useMipMaps) {
		console.log("update!!!");
	};
	_this.bind = function(unit) {
		console.log("bind!!!");
	};
	_this.unbind = function() {
		console.log("unbind!!!");
	};
	_this.dispose = function() {
		console.log("dispose!!!");
	};
	_this.dispose = function() {
		console.log("dispose!!!");
	};
	_this.getImage = function() {
		console.log("getImage!!!");
		return _this.image;
	};

	_this.load = function(){
		console.log("loader!!!");
		return _this;
	};

	_this.unload = function(){
		console.log("loader!!!");
		return _this;
	};
};


/**
 * <p>kc.SpineAnimate is the component wirte text <br/>
 * <br/>
 * </p>
 * @class
 * @name kc.SpineAnimate
 * @extends kc.Component
 */
kc.SpineAnimate = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.component
	 */
	ObjType: 'SpineAnimate',

	/**
	 * skeleton object
	 * @type {Object}
	 * @memberOf kc.SpineAnimate
	 */
	skeletonObj: null,

	/**
	 * animation state
	 * @type {Object}
	 * @memberOf kc.SpineAnimate
	 */
	animationState: null,

	/**
	 * animation skin
	 * @type {Object}
	 * @memberOf kc.SpineAnimate
	 */
	skinName: null,


	/**
	 * animation animation
	 * @type {Object}
	 * @memberOf kc.SpineAnimate
	 */
	animationNmae: null,

	/**
	 * animation loop
	 * @type {Object}
	 * @memberOf kc.SpineAnimate
	 */
	animationLoop: null,


	/**
	 * spine lodaer
	 * @type {Object}
	 * @memberOf kc.SpineAnimate
	 */
	_spineLodaer: null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function() {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);
		_this.controlObj = new kc.EngineObject();

	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.SpineAnimate#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		var resjson = ResRoot + kc.Project.getResourceForKey(propertys.jsonfile.id).resURL.substr(1);
		var resatlas = ResRoot + kc.Project.getResourceForKey(propertys.atlasfile.id).resURL.substr(1);
		var respng = ResRoot + kc.Project.getResourceForKey(propertys.pngfile.id).resURL.substr(1);
		var animateName = propertys.spineAnimate;
		var skin = propertys.skin;



		_this.setSkeletonAnimation(resjson,resatlas,respng);
		_this.setSkin(skin);
		_this.setAnimation(0, animateName, true);

		_this.skinName = propertys.skin;
		_this.animationNmae = propertys.spineAnimate;
		_this.animationLoop = true;
	},

	/**
	 * set skeleton animation
	 * @memberOf kc.SpineAnimate
	 * @param {String} json
	 * @param {String} atlas
	 * @param {String} png
	 */
	setSkeletonAnimation: function(json, atlas, png) {
		
		
		var _this = this;
		var jsonData = kc.Cache.get(json);
		var atlasData = kc.Cache.get(atlas);
		var pngData = kc.Cache.get(png);
		//new
		_this._spineLodaer = new kc.spineTextureLoader(pngData);
		var spineAtlas = new kcSpine.TextureAtlas(atlasData, _this._spineLodaer.loader);
		var spineAttachmentLoader = new kcSpine.TextureAtlasAttachmentLoader(spineAtlas);
		var spineJson = new kcSpine.SkeletonJson(spineAttachmentLoader);
		var skeletonData = spineJson.readSkeletonData(jsonData);

		_this.skeletonObj = new kcSpine.Skeleton(skeletonData);
		var animationStateData = new kcSpine.AnimationStateData(skeletonData);
		_this.animationState = new kcSpine.AnimationState(animationStateData);
		// 
		// 
		// 
		 
		//cocos2dx 
		// _this._spineLodaer = new kc.spineTextureLoader(pngData);
		// var atlas = new kcSpine.Atlas(atlasData, _this._spineLodaer);
		// var attachmentLoader = new kcSpine.AtlasAttachmentLoader(atlas);
  //       var skeletonJsonReader = new kcSpine.SkeletonJson(attachmentLoader);

  //       var skeletonData = skeletonJsonReader.readSkeletonData(jsonData);
  //       _this.skeletonObj = new kcSpine.Skeleton(skeletonData);
  //       atlas.dispose(skeletonJsonReader);

  //       var animationStateData = new kcSpine.AnimationStateData(skeletonData);
  //       _this.animationState = new kcSpine.AnimationState(animationStateData);

		// _this._createBone();

		// _this._createChildFormSkeletonData();
	},

	/**
	 * set skeleton animation by id
	 * @memberOf kc.SpineAnimate
	 * @param {String} jsonId
	 * @param {String} atlasId
	 * @param {String} pngId
	 */
	setSkeletonAnimationById: function(jsonId, atlasId, pngId) {
		var _this = this;
		var JsonResource = kc.Project.getResourceForKey(jsonId);
		var atlasResource = kc.Project.getResourceForKey(atlasId);
		var pngResource = kc.Project.getResourceForKey(pngId);
		var jsonUrl = ResRoot + JsonResource.resURL.substr(1);
		var atlasUrl =  ResRoot + atlasResource.resURL.substr(1);
		var pngUrl = ResRoot+ pngResource.resURL.substr(1);
		var jsonData = kc.Cache.get(jsonUrl);
		var atlasData = kc.Cache.get(atlasUrl);
		var pngData = kc.Cache.get(pngUrl);
		

		_this.controlObj.cleanup();
		_this.controlObj = new kc.EngineObject();
		this.gameObject.engineObject.addChild(this.controlObj);
		//new
		_this._spineLodaer = new kc.spineTextureLoader(pngData);
		var spineAtlas = new kcSpine.TextureAtlas(atlasData, _this._spineLodaer.loader);
		var spineAttachmentLoader = new kcSpine.TextureAtlasAttachmentLoader(spineAtlas);
		var spineJson = new kcSpine.SkeletonJson(spineAttachmentLoader);
		var skeletonData = spineJson.readSkeletonData(jsonData);

		_this.skeletonObj = new kcSpine.Skeleton(skeletonData);
		var animationStateData = new kcSpine.AnimationStateData(skeletonData);
		_this.animationState = new kcSpine.AnimationState(animationStateData);
	},


	setSkin: function(skinName) {
		this.skeletonObj.setSkinByName(skinName);
		this.skinName  =  skinName;
	},

	getSkin: function(){
		return this.skinName;
	},

	setAnimation: function(iframe, animateName, bloop) {
		this.animationState.setAnimation(0, animateName, bloop);
		this.animationNmae = animateName;
		this.animationLoop = bloop;
		// this.animationState.setAnimationByName(iframe, animate, bloop);
	},

	setAnimationLoop: function(bLoop){
		// this.animationState.loop = bLoop;
		var current = this.animationState.getCurrent(0);	
		if(current){
			current.loop = bLoop;
			current.time =  current.time%current.endTime;
			current.lastTime =  current.lastTime%current.endTime;
			this.animationLoop = bLoop;
		}
		
	},

	getAnimationLoop: function(){
		return this.animationLoop;
	},

	getAnimation: function(){
		return this.animationNmae;
	},

	onAwake: function() {
		this.gameObject.engineObject.addChild(this.controlObj);
	},

	_renderSkeleton: function(skeleton) {

	},

	/**
	 * called every frame before draw
	 * @memberOf kc.SpineAnimate
	 */
	update: function() {
		var _this = this;
		if (_this.animationState && _this.skeletonObj) {
			_this.animationState.update(kc.deltaTime);
			_this.animationState.apply(_this.skeletonObj);
			_this.skeletonObj.updateWorldTransform();
			_this._drawSpine();
		}
	},

	_drawSpine:function(){
		var _this = this;
		var drawOrder = _this.skeletonObj.drawOrder;

		for (var i = 0, n = drawOrder.length; i < n; i++) {
			var slot = drawOrder[i];
			var slotName = slot.data.name;
			var attachment = slot.getAttachment();
			var bone = slot.bone;
			var boneName = slot.bone.data.name;
			var boneIndex = slot.bone.data.index;
			var region = null;
			var image = null;
			var vertices = null;
			var slotSprite = null;
			if (attachment instanceof kcSpine.RegionAttachment) {
				var regionAttachment = attachment;
				vertices = regionAttachment.updateWorldVertices(slot, false);
				region = regionAttachment.region;
				image = _this._spineLodaer.image;
				if (slot.slotNode) {
					slot.slotNode.setVisible(true);
				}
			} else if (!attachment) {
				if (slot.slotNode) {
					slot.slotNode.setVisible(false);
				}
				continue;
			} else {
				continue;
			}

			var slotNode = slot.slotNode;
			if (!slotNode){
				slot.slotNode = new kc.EngineObject();
				slot.slotNode.sprites = {};
				_this.controlObj.addChild(slot.slotNode);
				slotNode = slot.slotNode;
			}			
			slotNode.setZOrder(i);

			if (!slotNode.sprites[attachment.name]){
				var sprite = _this._newKcSpineSprite(slot,attachment);
				slotNode.sprites[attachment.name] = sprite;
				slotNode.addChild(sprite);
				sprite.setPosition(attachment.x,attachment.y);
			}
			var spriteBefore = slotNode.sprites[slotNode.currentSpriteName || -1];
			var spriteNow = slotNode.sprites[attachment.name];
			slotNode.currentSpriteName = attachment.name;
			if (spriteBefore){
				spriteBefore.setVisible(false);
			}
			spriteNow.setVisible(true);
			spriteNow.setAlpha(slot.color.a*100);

			var boneWorldRotationX = bone.getWorldRotationX();
			slotNode.setPosition(bone.worldX,bone.worldY);
			slotNode.setRotation(-boneWorldRotationX);
			slotNode.setScale(bone.getWorldScaleX(),bone.getWorldScaleY());
		}

	},

	_newKcSpineSprite: function(slot, attachment) {
		var _this = this;
		var region = attachment.region;
		var sprite = new kc.EngineImage();
		var info = {};
		var rotate = region.rotate;
		if (rotate) {
			info.width = region.height;
			info.height = region.width;
		} else {
			info.width = region.width;
			info.height = region.height;
		}
		info.x = region.x;
		info.y = region.y;
		info.xOffset = region.offsetX;
		info.yOffset = region.offsetY;
		sprite.setTextureWithRanderSize(_this._spineLodaer.image,info);
		sprite.setAnchorPoint(0.5,0.5);
		sprite.setScale(attachment.width/region.width,attachment.height/region.height);
		if (rotate) {		
			sprite.setRotation(-attachment.rotation + 90);
		} else {
			sprite.setRotation(-attachment.rotation);
		}
		return sprite;
	},

	_createChildFormSkeletonData : function(){
        var node = this._node;
        var locSkeleton = this.skeletonObj, spriteName, sprite;
        for (var i = 0, n = locSkeleton.slots.length; i < n; i++) {
            var slot = locSkeleton.slots[i], attachment = slot.attachment;
            var slotNode = new kc.EngineObject();
            slot._slotNode = slotNode;
            this.controlObj.addChild(slotNode);

            if(attachment instanceof kcSpine.RegionAttachment){
                spriteName = attachment.rendererObject.name;
                sprite = this._createSprite(slot, attachment);
                slot.currentSprite = sprite;
                slot.currentSpriteName = spriteName;
                slotNode.addChild(sprite);
            } else if(attachment instanceof kcSpine.MeshAttachment){
                //todo for mesh
            }
        }
    },

    _createSprite : function(slot, attachment){
        var rendererObject = attachment.rendererObject;
        var info = {};
        if (rendererObject.rotate) {
			info.width = rendererObject.height;
			info.height = rendererObject.width;
		} else {
			info.width = rendererObject.width;
			info.height = rendererObject.height;
		}
		info.x = rendererObject.x;
		info.y = rendererObject.y;
		info.xOffset = 0;
		info.yOffset = 0;

        var sprite = new kc.EngineImage();
		sprite.setTextureWithRanderSize(this._spineLodaer.image, info);
		sprite.setAnchorPoint(0.5,0.5);
		sprite.setRotation(-attachment.rotation);
		sprite.setScale(rendererObject.width / rendererObject.originalWidth * attachment.scaleX,
            rendererObject.height / rendererObject.originalHeight * attachment.scaleY);

        slot.sprites = slot.sprites || {};
        slot.sprites[rendererObject.name] = sprite;

        return sprite;
    },

    _updateChild : function(){
        var locSkeleton = this.skeletonObj, slots = locSkeleton.slots;
        var i, n, selSprite;

        this.acttton = this.acttton + 1;
        var slot, attachment, slotNode;
        for(i = 0, n = slots.length; i < n; i++){
            slot = slots[i];
            attachment = slot.attachment;
            slotNode = slot._slotNode;
            if(!attachment){
                slotNode.setVisible(false);
                continue;
            }
            var type = attachment.type;
            if (type === kcSpine.AttachmentType.region){
                if(attachment.rendererObject){
                    if(!slot.currentSpriteName || slot.currentSpriteName !== attachment.name){
                         var spriteName = attachment.rendererObject.name;
                        if(slot.currentSprite !== undefined)
                            slot.currentSprite.setVisible(false);
                        slot.sprites = slot.sprites ||{};
                        if(slot.sprites[spriteName] !== undefined)
                            slot.sprites[spriteName].setVisible(true);
                        else{
                            var sprite = this._createSprite(slot, attachment);
                            slotNode.addChild(sprite);
                        }
                        slot.currentSprite = slot.sprites[spriteName];
                        slot.currentSpriteName = spriteName;
                    }
                }
                var bone = slot.bone;
                var posX = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
                var posY = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
                slotNode.setPosition(posX,
                    posY);
                slotNode.setScale(bone.worldScaleX, bone.worldScaleY);

                //set the color and opacity
                selSprite = slot.currentSprite;
                selSprite._flippedX = bone.worldFlipX;
                selSprite._flippedY = bone.worldFlipY;
                if(selSprite._flippedY || selSprite._flippedX){
                    slotNode.setRotation(bone.worldRotation);
                    selSprite.setRotation(attachment.rotation);
                }else{
                    slotNode.setRotation(-bone.worldRotation);
                    if (attachment.rendererObject.rotate){
                    	selSprite.setRotation(-attachment.rotation+90);
                    }else{
                    	selSprite.setRotation(-attachment.rotation);
                    }
                    
                }

                // //hack for sprite
                // selSprite._renderCmd._displayedOpacity = 0 | (locSkeleton.a * slot.a * 255);
                // var r = 0 | (locSkeleton.r * slot.r * 255), g = 0 | (locSkeleton.g * slot.g * 255), b = 0 | (locSkeleton.b * slot.b * 255);
                // selSprite.setColor(cc.color(r,g,b));
                // selSprite._renderCmd._updateColor();
            } else if (type === kcSpine.AttachmentType.skinnedmesh) {
                //todo for mesh
            } else {
                slotNode.setVisible(false);
                continue;
            }
            slotNode.setVisible(true);
        }
    }
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Texture.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Texture is the component draw an image.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Texture
 * @extends kc.Class
 */
kc.Texture = kc.Render.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf kc.Texture
	 */
	ObjType: 'Texture',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Render.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineImage();
	},

	clear:function(){
        var _this = this;
        kc.Render.prototype.clear.call(_this);
    },

	_parse: function() {
		var propertys = this._propertys;
		var resInfo = kc.Project.getResourceForKey(propertys.file.id);
		if (resInfo && resInfo.resURL && resInfo.resURL != "") {
			this.setSrc(ResRoot + resInfo.resURL.substr(1));
		}
		var mixedMode =  propertys.blendFunc;
		this.setMixedMode(mixedMode);
	},

	/**
	 * set Mixed Mode
	 * @memberOf! kc.Texture#
	 * @param arg
	 */
	setMixedMode:function (arg) {
		var value = Number(arg);
		// this.controlObj.setMixedMode(value);
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.Texture#
	 * @override
	 */
	onAwake: function () {
		var _this = this;
		_this.gameObject.engineObject.addChild(_this.controlObj);
	},

	/**
	*绘制一条线。
	*@param fromX X 轴开始位置。
	*@param fromY Y 轴开始位置。
	*@param toX X 轴结束位置。
	*@param toY Y 轴结束位置。
	*@param lineColor 颜色。
	*@param lineWidth 线条宽度。
	*@memberOf! kc.Texture#
	*/
	drawLine:function(){

	},

	/**
	*绘制圆形。
	*@param x 圆点X 轴位置。
	*@param y 圆点Y 轴位置。
	*@param radius 半径。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor 边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth 边框宽度。
	*@memberOf! kc.Texture#
	*/
	drawCircle:function(){

	},

	/**
	*绘制矩形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param width 矩形宽度。
	*@param height 矩形高度。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor 边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth 边框宽度。
	*@memberOf! kc.Texture#
	*/
	drawRect:function(){

	},

	/**
	 * 赛贝尔曲线
	 * Bezier curve
	 * @memberOf! kc.Texture#
     *@param x 开始绘制的 X 轴位置。
	 *@param y 开始绘制的 Y 轴位置。
	 *@param points 线段的点集合，格式[startx,starty,ctrx,ctry,startx,starty...]。
	 *@param lineColor 线段颜色，或者填充绘图的渐变对象。
	 *@param lineWidth 线段宽度。
	*/
	drawQuadBezier:function(){

	}

});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file TiledMap.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.TiledMap is the component Write text.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.TiledMap
 * @extends kc.Component
 */
kc.TiledMap = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.TiledMap#
	 */
	ObjType:'TiledMap',

	/**
	 * 瓦片
	 * @type {Object}
	 * @memberOf! kc.TiledMap#
	 */
	tile:null,

	/**
	 * 瓦片大小
	 * tile size
	 * @type {Number}
	 * @memberOf! kc.TiledMap#
	 */
	_tileSize:null,

	/**
	 * 瓦片的属性
	 * @type {Object}
	 * @memberOf! kc.TiledMap#
	 */
	_tileProperties:null,

	/**
	 * 地图大小
	 * map size
	 * @type {Number}
	 * @memberOf! kc.TiledMap#
	 */
	_mapSize:null,

	/**
	 * 地图组
	 * @type {Object}
	 * @memberOf! kc.TiledMap#
	 */
	_objectGroups:null,

	/**
	 * 地图属性
	 * @type {Object}
	 * @memberOf! kc.TiledMap#
	 */
	properties:null,

	/**
	 * 地图层
	 * @type {Object}
	 * @memberOf! kc.TiledMap#
	 */
	layers:null,

	/**
	 * 瓦片对象
	 * tile dictionary
	 * @type {Object}
	 * @memberOf! kc.TiledMap#
	 * @private
	 */
	_tileDic:null,

	/**
	 * tileset list
	 * @memberOf! kc.TiledMap#
	 * @type {Array}
	 */
	tilesetList:null,

	/**
	 * 路径寻路矩阵
	 * @memberOf! kc.TiledMap#
	 * @type {Aarry}
	 */
	pathMatrix:null,

	/**
	 * 原始地图数据
	 * @memberOf! kc.TiledMap#
	 * @type {Object}
	 */
	_MapDataInfo:null,

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {
		var _this = this;
		kc.Component.prototype.ctor.call(_this);

		_this.controlObj = new kc.EngineObject();

		_this._mapSize = {width:0,height:0};
		_this._tileSize = {width:0,height:0};
		_this.tilesetList = [];
		_this.layers = [];
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
        _this.tilesetList.length = 0;
		_this.layers.length = 0;
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.TiledMap#
	 */
	_parse: function () {
		var _this = this;
		var propertys = _this._propertys;
		_this.setResId(propertys.file.id);
	},

	/**
	 * tiledMap
	 * @param  {xml} dom
	 * @memberOf! kc.TiledMap#
	 * @return {Object}
	 */
	setResId: function(id) {
		var _this = this;
		var resInfo = kc.Project.getResourceForKey(id);
		_this._parseTileMap(resInfo);
	},

    /**
     * 更新瓦片地图
     * update
     * @memberOf! kc.TiledMap#
     */
    _updateTiledMap:function(){
        var _this = this;
        for (var i = 0; i < _this.layers.length; i++) {
            var layer = _this.layers[i];
            var _w = 0;
            var _h = 0;
            var _index = 0;
            for (var h = 0; _this._mapSize.height > h; h++) {
                _h = _this._tileSize.height * h;
                for (var w = 0; _this._mapSize.width > w; w++) {
                    _w = _this._tileSize.width * w;
                    var gid = layer.data[_index];
                    if ( gid && gid != 0) {
                        var renderImg = _this._getTileset(gid);
                        var _cont = gid - renderImg.firstgid+1;
                        var textureCache = kc.Cache.get(renderImg.source);
                        var texture = new kc.EngineImage();
                        var info = {};
                        info.x = ((_cont-1)%renderImg.widthCount)*renderImg.tilewidth;
                        info.y = (Math.ceil(_cont/renderImg.heightCount)-1)*renderImg.tileheight;
                        info.width = renderImg.tilewidth;
                        info.height = renderImg.tileheight;
                        texture.setTextureWithRanderSize(textureCache, info);
                        _this.controlObj.addChild(texture);
                        texture.setPosition(_w + layer.offset.x, -(_h + layer.offset.y));
                    }
                    _index = _index + 1;
                }
            }
        }
        _this.controlObj.setPosition(-_this._mapSize.width*_this._tileSize.width*0.5+_this._tileSize.width*0.5,_this._mapSize.height*_this._tileSize.height*0.5-_this._tileSize.height*0.5);
    },

	/**
	 * 根据瓦片位置获取渲染图片信息
	 * @memberOf! kc.TiledMap#
	 * @param  {Number} gid [description]
	 * @return {Object}
	 */
	_getTileset:function(gid){
		var _this = this;
		for (var i = 0; i < _this.tilesetList.length; i++) {
			var tileset = _this.tilesetList[i];
			var tilesetAfter = _this.tilesetList[i+1];
			if(!tilesetAfter){
				return tileset;
			}else if(tileset.firstgid <= gid && tilesetAfter.firstgid > gid){
				return tileset;
			}
		}
	},

	/**
	 * 解析瓦片地图
	 * tile map
	 * @private
	 */
	_parseTileMap:function(info){
		var _this = this;
		//地图的瓦片尺寸信息
		var map =  info.data.mapScene.singlelayer;
		_this._mapSize = {width:map["0"],height:map["2"]};
		_this._tileSize = {width:map["1"],height:map["3"]};
		_this._MapDataInfo = info;
		
		var pathCanMove = info.data.mapScene.pathCanMove;
		if (pathCanMove &&!(pathCanMove instanceof Uint8Array)){
            var byteLength = Math.ceil((_this._mapSize.width*_this._mapSize.height) / 8);
            var uint8Array  = new Uint8Array(byteLength);
            var list = pathCanMove;
            for (var i=0;i<byteLength;i++){
                uint8Array[i] = list[i];
            }
            _this.pathMatrix = uint8Array;
        }else{
        	_this.pathMatrix = pathCanMove;
        }
		//图片切割信息 tileset info
		var mapList = info.data.mapBlock;
		for (var i = 0; i < mapList.length; ++i) {
			var tileset = mapList[i];
			var parseTileset = {};
			parseTileset.firstgid = tileset.firstgid;
			parseTileset.tilewidth = tileset.w;
			parseTileset.tileheight = tileset.h;
			parseTileset.tilecount = tileset.count;
			parseTileset.width = tileset.imgw;
			parseTileset.height = tileset.imgh;
			parseTileset.widthCount = Math.floor(tileset.imgw/tileset.w);
			parseTileset.heightCount = Math.floor(tileset.imgh/tileset.h);
			parseTileset.source = ResRoot + tileset.src.substr(1);
			_this.tilesetList.push(parseTileset);
		}

		//层信息
		var layerList = info.data.Layer;
		var dataList = info.data.mapScene.mostlayer;
		for (var j = 0; j < layerList.length; ++j) {
			var layer = layerList[j];
			var data = dataList[j];
			for(var k in layer){
				var layerinfo = layer[k];
				var datainfo = data[k];
				var parseLayer = {};
				parseLayer.name = layerinfo.name;
				parseLayer.width = layerinfo.CW;
				parseLayer.height = layerinfo.CH;
				parseLayer.visible = layerinfo.visible || true;
				parseLayer.data = datainfo.data;
				parseLayer.offset = layerinfo.offset || {x:0,y:0};
				_this.layers.push(parseLayer);
			}
		}

		_this._updateTiledMap();
	},

	/**
	 * called when the component just is loaded
	 * @memberOf! kc.TiledMap#
	 * @override
	 */
	onAwake: function () {
		this.gameObject.engineObject.addChild(this.controlObj);
	}
});

"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Transform.js
 * @author Chang Fei
 */

var kc = kc || {};

/**
 * <p>kc.Transform is the component handles object's transform.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Transform
 * @extends kc.Class
 */
kc.Transform = kc.Component.extend({
	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Transform#
	 */
	ObjType:'Transform',

	/**
	 * construct Function of Object
	 * @ignore
	 */
	ctor: function () {

		kc.Component.prototype.ctor.call(this);

		this.position = new kc.Vector3();
		this.scale = new kc.Vector3();
		this.rotation = new kc.Vector3();
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
        this.position = null;
		this.scale = null;
		this.rotation = null;
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Transform#
	 */
	_parse: function () {
		var propertys = this._propertys;
		var position = propertys.transform.Position;
		var scale = propertys.transform.Scale;
		var roatation = propertys.transform.Rotation;
		var group = propertys.group;

		this.setPosition(Number(position.x), Number(position.y), Number(position.z));
		this.setScale(Number(scale.x), Number(scale.y));
		this.setRotation(Number(roatation.x), Number(roatation.y));
		this.setAlpha(propertys.alpha);
		this.setGroup(group);
	},

	setGroup: function (group) {
		this.group = group;
		this.gameObject.setGroup(this.group);
	},

	/**
	 * set transform position
	 * @memberOf! kc.Transform#
	 */
	setPosition: function (x, y, z) {
		var posX = Number(x);
		var posY = Number(y);
		var posZ = Number(z);

		this.position.x = posX;
		this.position.y = posY;
		this.position.z = posZ;

		this.gameObject.setPosition(posX, posY, posZ);
	},

	/**
	 * set transform scale
	 * @memberOf! kc.Transform#
	 */
	setScale: function (x, y, z) {
		var posX = Number(x);
		var posY = Number(y);
		var posZ = Number(z);

		this.scale.x = posX;
		this.scale.y = posY;
		this.scale.z = posZ;

		this.gameObject.setScale(posX, posY, posZ);
	},

	/**
	 * set transform rotation
	 * @memberOf! kc.Transform#
	 */
	setRotation: function (x, y, z) {
		var posX = Number(x);
		var posY = Number(y);
		var posZ = Number(z);

		this.rotation.x = posX;
		this.rotation.y = posY;
		this.rotation.z = posZ;

		this.gameObject.setRotation(posX, posY, posZ);
	},

	setAlpha :function(value){
		var valueNumber = Number(value);
		this.alpha = valueNumber;
		this.gameObject.setAlpha(valueNumber);
	}
});


"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file UploadPic.js
 * @author geng_qz
 */

var kc = kc || {};

/**
 * <p>kc.UploadPic is the base class of component.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.UploadPic
 * @extends kc.Class
 */

kc.UpLoadPic = kc.Render.extend({
    /**
     * object type
     * @type {String}
     * @memberOf! kc.UploadPic#
     */
    ObjType: 'UpLoadPic',

    /**
     * set change list:"normalSrc,selectedSrc,movedSrc,disabledSrc"
     * @type {Object}
     * @memberOf! kc.UploadPic#
     */
    changeList:null,

    /**
     * button event:"into","outside"
     * @type {Boolean}
     * @memberOf! kc.UploadPic#
     * @private
     */
    _isInto:null,

    /**
     * logic id
     * @type {Number}
     * @memberOf! kc.UploadPic#
     */
    logicId:null,
	
    /**
     * upload instance
     * @memberOf {[kc.UploadPic]}
     */
    uploader:null,

    /**
     * construct Function of Object
     * @extends {kc.UploadPic}
     * @ignore
     */
    ctor: function() {
        var _this = this;
        kc.Render.prototype.ctor.call(_this);

        _this.changeList = {};
        _this._isInto = false;
        _this.controlObj = new kc.EngineImage();
        _this.controlText = new kc.EngineLabel();
        _this.logicId = null;
        _this.createButton();
        _this.initUploader();
    },
    
    /**
     * [clear description]
     * @return {[type]} [description]
     */
    clear:function(){
        var _this = this;
        kc.Render.prototype.clear.call(_this);
        _this.changeList = null;
        _this._isInto = false;
    },

    /**
     * parse component data
     * @override
     * @memberOf! kc.UploadPic#
     */
    _parse: function () {
        var _this = this;
        var propertys = _this._propertys,
            resId = propertys.logicSrc.id;

        _this.addLogic(resId);
        //normalSrc,selectedSrc,movedSrc,disabledSrc
        var list = {};
        for (var srcId in propertys) {
            var obj = kc.Project.getResourceForKey(propertys[srcId].id);
            obj && obj.resURL && obj.resURL!='' && (list[srcId] = ResRoot + obj.resURL.substr(1));
        }
        _this.setText(propertys.label);
        _this.setChangeList(list);
        _this.setSrc(list["normalSrc"]);
    },

    /**
     * set user can use or not in this button
     * @param {Boolean} bool
     * @memberOf! kc.UploadPic#
     */
    setDisabled :function(bool){
        var _this = this;
        _this.disabled = bool;
        if (bool){
            _this.changeSrc(_this.changeList["disabledSrc"]);
        }
    },

    /**
     * called when the Button just is loaded
     * @memberOf! kc.UploadPic#
     */
    onAwake: function () {
        var _this = this;
        _this.gameObject.engineObject.addChild(_this.controlObj);
        _this.gameObject.engineObject.addChild(_this.controlText);
    },

    /**
     * inherit component addLogic
     * @memberOf! kc.UploadPic#
     * @param {Number} id
     */
    addLogic:function(id){
        var _this = this;
        _this.logicId = id;
        if (id){
            _this.logics[id] = kc["LogicClass_" + id];
        }
    },

    /**
     * run logic if has
     * @memberOf! kc.UploadPic#
     * @private
     */
    _doLogic:function(){
        var _this = this;
        var logic = _this.logics[_this.logicId];
        if (logic){
            var obj = new logic();
            obj.run(_this);
        }
    },

    /**
     * the button has four pictures,set it
     * @memberOf! kc.UploadPic#
     * @param {Object} list
     */
    setChangeList:function(list){
        this.changeList = list;
    },

    /**
     * inherit onMouseDown
     * @memberOf! kc.UploadPic#
     * @param  {Object} event event.type/event.x/event.y
     * @return {Boolean}
     */
    onMouseDown: function (event) {
        var _this = this;
        var changeObj = _this.changeList["selectedSrc"];
        if (changeObj && !_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
            _this.changeSrc(changeObj);
            return _this.stopPropagation;
        }
    },

    /**
     * inherit onMouseUp
     * @memberOf! kc.UploadPic#
     * @param  {Object} event event.type/event.x/event.y
     * @return {Boolean}
     */
    onMouseUp: function (event) {
        var _this = this;
        var changeObj = _this.changeList["normalSrc"];
        if (!_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
            _this.changeSrc(changeObj);
            //_this._doLogic();
            document.getElementById('uploadPic').click();
            return _this.stopPropagation;
        }
    },

    /**
     * inherit onMouseMove
     * @memberOf! kc.UploadPic#
     * @param  {Object} event event.type/event.x/event.y
     * @return {Boolean}
     */
    onMouseMove:function(event){
        var _this = this;
        var changeObj = _this.changeList["movedSrc"];
        if (changeObj && !_this.disabled && kc.isPosIn(event.x,event.y,_this.gameObject)){
            if (!_this._isInto){
                _this._isInto = true;
                _this.changeSrc(changeObj);
                return _this.stopPropagation;
            }
            _this.changeSrc(changeObj);
            return _this.stopPropagation;
        }else if (!_this.disabled){
            if (_this._isInto){
                _this._isInto = false;
                _this.changeSrc(_this.changeList["normalSrc"]);
            }
        }
    },

    /**
     * [create div for uploader plugin]
     * @return {[type]} [description]
     */
    createButton:function(){
        var canvas = null;
        if(GAMEENGINE == 'layaair'){
            canvas = document.getElementById("layaContainer");
        } else if (GAMEENGINE == 'crafty'){
            canvas = document.getElementById("cr-stage");
        } else {
            canvas = document.getElementById("Cocos2dGameContainer");
        }

        var uploadDom = document.getElementById("uploadPic");
        if (uploadDom){
            canvas.removeChild(uploadDom);
        }
        var m_div = document.createElement('BUTTON');
        m_div.id = "uploadPic";
        m_div.style.display = 'none';
        canvas.appendChild(m_div);
    },

    /**
     * Set write text
     * @memberOf! kc.Label#
     * @override
     */
    setText: function (text) {
        this.controlText.setText(text);
    },

    /**
     * uploader instance 
     * @return {[type]} [description]
     */
    initUploader :function(){
        var _this = this;

        _this.uploader = new plupload.Uploader({
            browse_button: 'uploadPic', //触发文件选择对话框的按钮，为那个元素
            runtimes: 'html5,html4',
            // drop_element: dropid,//拖拽上传位置
            url:'http://'+SERVERIP+":"+SERVERPORT+"/uploadPic",
            chunk_size: '0',
            rename: true,
            dragdrop: true,
            filters: {//限制上传文件的类型
                max_file_size: '100mb',
                mime_types: [
                    { title: "Image files", extensions: "jpg,png,gif"}
                ],
                prevent_duplicates: false//是否允许选取重复的文件，为true时表示不允许
            },
            multipart: true
        });

        _this.uploader.init();

        _this.uploader.bind('FilesAdded',function(uploader,files){
            console.log("FilesAdded !!!!!!!!!!");
            _this.uploader.start();
            console.log("uploader has start!!!");
        });

        _this.uploader.bind('UploadProgress',function(uploader,file){

        });

        _this.uploader.bind('FileUploaded',function(uploader,file,responseObject){
            _this.message = responseObject.response;
            console.log("xxxxxxxxxxxxxxxx",responseObject.response);
        });

        _this.uploader.bind('UploadComplete',function(up, files) {            
            up.stop();
            _this._doLogic();
        });
    }
});
"use strict";
// Copyright 2014-2020 大连文森特北京分公司. All Rights Reserved.

/**
 * @file Video.js
 * @author wang_ch
 */

var kc = kc || {};

/**
 * <p>kc.Video is a component plays music/effect.<br/>
 * <br/>
 * </p>
 * @class
 * @name kc.Video
 * @extends kc.Component
 */
kc.Video = kc.Component.extend({

	/**
	 * object type
	 * @type {String}
	 * @memberOf! kc.Video#
	 */
	ObjType: 'Video',

	/**
	 * music source
	 * @type {Object}
	 * @private
	 * @memberOf! kc.Video#
	 */
	source: null,

	/**
	 * music sourceId
	 * @type {Object}
	 * @private
	 * @memberOf! kc.Video#
	 */
	sourceId: null,

	/**
	 * Element Source
	 * @type {Object}
	 * @private
	 * @memberOf! kc.Video#
	 */
	ElementSource:null,

	/**
	 * auto play
	 * @type {Boolean}
	 * @memberOf! kc.Video#
	 */
	bAutoPlay: false,

	/**
	 * run it again
	 * @type {Boolean}
	 * @memberOf! kc.Video#
	 */
	bLoop: false,

	/**
	 * video object
	 * @type {object}
	 * @memberOf! kc.Video#
	 */
	video: null,

	/**
	 * is Playing
	 * @type {object}
	 * @memberOf! kc.Video#
	 */
	isPlaying:false,

	isPlayed: false,

	/**
	 * construct Function of Object
	 * @extends {kc.Component}
	 * @ignore
	 */
	ctor: function() {
		var _this = this;

		kc.Component.prototype.ctor.call(_this);
	},

	clear:function(){
        var _this = this;
        kc.Component.prototype.clear.call(_this);
        _this.parentDiv.parentNode.removeChild(_this.parentDiv);
    },

	/**
	 * parse component data
	 * @override
	 * @memberOf! kc.Video#
	 */
	_parse: function () {
		var _this = this;
		var videoPropertys = _this._propertys;
		var videoRes = kc.Project.getResourceForKey(videoPropertys.src.id);
		_this.sourceId = videoPropertys.src.id;
		if(videoRes && videoRes.resURL && videoRes.resURL!=''){
			var videoSrc = ResRoot + videoRes.resURL.substr(1);
			var videoWidth = videoPropertys.videoWidth;
			var videoHeight = videoPropertys.videoHeight;
			var videoIsLoop = videoPropertys.isLoop;
			var autoPlay = videoPropertys.autoPlay;

			_this.setVideoInfo(videoSrc,autoPlay,videoIsLoop,videoWidth,videoHeight);
		}
	},

	/**
	 * set Video info 
	 * @memberOf! kc.Video#
	 * @param {String}  src    	this music path
	 * @param {Number}  volume 	1-100
	 * @param {Boolean}  loop  
	 * @param {Boolean}  autoPay  play at once
	 * @param {String}  type   	Music or Effect
	 * @param {Function}  fun   backcall
	 */
	setVideoInfo: function(src, autoPlay, loop, videoWidth, videoHeight) {
		var _this = this;
		_this.source = src;
		_this.bAutoPlay = autoPlay;
		_this.bLoop = loop;
		_this._initVideo(videoWidth, videoHeight);
		_this._initStyle();
	},


	/**
	 * check Video source 
	 * @memberOf! kc.Video#
	 * @param {String}  src  
	 */
	_checkSource :function(source){
		var type = null;
		var video = this.video;
		if (source.indexOf(".mp4")) {
			type = "mp4";
		} else if (source.indexOf(".ogg")) {
			type = ".ogg";
		} else if (source.indexOf(".webm")) {
			type = ".webm";
		}
		if (!video.canPlayType("video/" + type)) {
			return;
		}
		return true;
	},

	/**
	 * init video and style
	 * @param {Number}  width  
	 * @param {Number}  height  
	 * @memberOf! kc.Video#
	 */
	_initVideo: function(width, height) {
		var _this = this;
		var video = document.createElement("video");
		_this.video = video;
		_this.video = video;

		if(!_this._checkSource(_this.source)){
			return;
		}
		
		_this._bindEvent();
		_this.gameObject.setSize(width, height);
		video.width = width;
		video.height = height;

		_this.ElementSource = document.createElement("source");
		_this.ElementSource.src = _this.source;
		video.appendChild(_this.ElementSource);

		var div = document.createElement("div");
		div.appendChild(video);
		_this.parentDiv = div;

		var leftMask = document.createElement("div");
		leftMask.style.width =  kc.System.canvas.parentNode.style.paddingLeft || kc.System.canvas.offsetLeft + "px";
		leftMask.style.height =  kc.System.canvas.parentNode.style.height || kc.System.canvas.parentNode.offsetHeight + "px";
 		leftMask.style.visibility = "visible"; //hidden
		leftMask.style.position = "absolute";
		leftMask.style.bottom = "0px";
		leftMask.style.backgroundColor = "white";

		var rightMask = document.createElement("div");
		rightMask.style.width =  kc.System.canvas.parentNode.style.paddingLeft || kc.System.canvas.offsetLeft + "px";
		rightMask.style.height =  kc.System.canvas.parentNode.style.height || kc.System.canvas.parentNode.offsetHeight + "px";
 		rightMask.style.visibility = "visible"; //hidden
		rightMask.style.position = "absolute";
		rightMask.style.bottom = "0px";
		// rightMask.style.left = (parseInt(kc.System.canvas.parentNode.style.paddingLeft) +  parseInt(kc.System.canvas.style.width)) + "px";
		rightMask.style.left = (kc.System.canvas.parentNode.offsetWidth - kc.System.canvas.offsetLeft) + "px";
		rightMask.style.backgroundColor = "white";
		
		div.appendChild(leftMask);
		div.appendChild(rightMask);

		kc.Core._root.appendChild(div);
		
		_this._updateMatrix();

		if (_this.bAutoPlay) {
			video.play();
		}
	},

	/**
	 * change video source
	 * @param {Number}  width  
	 * @param {Number}  height  
	 * @memberOf! kc.Video#
	 */
	changeSource :function(src){
		var _this =this;
		if (_this.ElementSource){

			if(!_this._checkSource(src)){
				return;
			}
			_this.video.src = src;
			_this.video.play();	

			_this.Source = src;
			_this.sourceId = null;
			_this.ElementSource.src = src;
		}

	},

	/**
	 * change video source by id
	 * @param {Number}  width  
	 * @param {Number}  height  
	 * @memberOf! kc.Video#
	 */
	changeSourceById :function(Id){
		var _this =this;
		if (_this.ElementSource){
			var videoRes = kc.Project.getResourceForKey(Id);
			var src = ResRoot + videoRes.resURL.substr(1);
			if(!_this._checkSource(src)){
				return;
			}
			_this.video.src = src;
			_this.video.play();	

			_this.Source = src;
			_this.sourceId = Id;
			_this.ElementSource.src = src;
		}
	},


	/**
	 * get video sourceId
	 * @param {Number}  width  
	 * @param {Number}  height  
	 * @memberOf! kc.Video#
	 */
	getSourceId :function(){
		return this.sourceId;
	},

	_updateMatrix: function() {
		var _this = this;
		var bbox = kc.System.canvas.getBoundingClientRect();
		var winSize = kc.Core.getWinSize();
		var scaleX = bbox.width / winSize.width;
		var scaleY = bbox.height / winSize.height;
		var cw = _this.gameObject.size.width;
		var ch = _this.gameObject.size.height;
		var posX = _this.gameObject.position.x;
		var posY = _this.gameObject.position.y;

		var t = {
			a: 1,
			b: 0,
			c: 0,
			d: 1,
			tx: 0,
			ty: 0
		};

		var a = t.a * scaleX,
			b = t.b,
			c = t.c,
			d = t.d * scaleY,
			tx = (t.tx * scaleX - cw / 2 + cw / 2 * scaleX) + posX*scaleX-(cw / 2 * scaleX),
			ty = (t.ty * scaleY - ch / 2 + ch / 2 * scaleY) + posY*scaleY-(ch / 2 * scaleY);
		var matrix = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + -ty + ")";
		_this.video.style["transform"] = matrix;
		_this.video.style["-webkit-transform"] = matrix;
	},

	/**
	 * init style setting
	 * @memberOf! kc.Video#
	 */
	_initStyle: function() {
		var _this = this;
		var video = _this.video;
		video.preload = "metadata";
		video.style.visibility = "visible"; //hidden
		video.style.position = "absolute";
		video.style.bottom = "0px";
		video.style.left = kc.System.canvas.parentNode.style.paddingLeft || kc.System.canvas.offsetLeft + "px";
		video.className = "kcVideo";
	},

	/**
	 * ended,play,pause event regist
	 * @memberOf! kc.Video#
	 */
	_bindEvent: function() {
		var _this = this;
		var video = _this.video;
		//binding event
		video.addEventListener("ended", function() {
			console.log("ended");
			_this.isPlaying = false;
			_this.isPlayed = true;
			if (_this.bLoop) {
				video.play();
			}
		});
		video.addEventListener("play", function() {
			_this.isPlaying = true;
			console.log("play");
		});
		video.addEventListener("pause", function() {
			_this.isPlaying = false;
			console.log("pause");
		});
	},

	/**
	 * play interfaces
	 * @memberOf! kc.Video#
	 */
	play: function() {
		this.video.play();
		this.isPlaying = true;
	},

	/**
	 * resumeVideo interfaces
	 * @memberOf! kc.Video#
	 */
	resumeVideo : function() {
		this.video.play();
	},

	/**
	 * get Is Playing
	 * @memberOf! kc.Video#
	 * @return {boolean}
	 */
	getIsPlaying:function(){
		return this.isPlaying;
	},
	/**
	 * get Is Played
	 * @memberOf! kc.Video#
	 * @return {boolean}
	 */
	getIsPlayed:function(){
		return this.isPlayed;
	},

	/**
	 * stop interfaces
	 * @memberOf! kc.Video#
	 */
	stop: function() {
		this.video.pause();
		this.isPlaying = false;
	},

	/**
	 * pause interfaces
	 * @memberOf! kc.Video#
	 */
	pause: function() {
		this.video.pause();
		this.isPlaying = false;
	}
});
