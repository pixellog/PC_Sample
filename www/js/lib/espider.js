/**
 * espider Web browser interface
 *
 * v1.3.0
 * 
 * + v1.3.0 [20170614 djlee]
 * 		- add show_log configuration. 
 * 		- add _log() function for show_log configuration.
 * 		- deprecate _logger (use _log() instead)
 * 		- print caller on log.
 * 
 * + v1.3.2 [20190524 marco]
 * 		- engine_version v2.1.7(SSL 엔진버전 만료에 따라 적용)
 * 
 * Support email : heenam.dev@gmail.com
 *
 * Copyright (c) Heenam Co.,Ltd All Rights Reserved
 *
 **/

var espider = {
	_connectedType 		: (typeof WebSocket !== "undefined"?2:(typeof espiderIO == "function"?1:0)),
	_port				: 49152,
	_connected			: false,
	_logger 			: (typeof console == "object"?console:{log:function(){/*nothing*/}}), // FIXME Deprecated : use _log() instead of _logger.console.log.
	_socket				: null,
	_iframe				: null,
	script_version 		: "1.3.0",
	engine_version		: "2.1.7",
	security			: false,
	
	_timerInter			: null,
	_jobRunning			: false,
	_jobInfo			: {},
	
	_show_log			: true,
	_print_caller		: true,
	_log 				: function(msg){
		if(typeof console != "object" || !this._show_log){
			return;
		}
		
		if(!this._print_caller){
			console.log(msg);
		}else{
			try {
				throw Error('')
			} catch (err) {
				try {
					var callerLine = err.stack.split("\n")[2];
					var caller = callerLine.slice(callerLine.lastIndexOf("/") + 1, callerLine.length);
					console.log("[" + caller + "] " + msg);
				} catch (err2) {
					console.log(msg);
				}
			}
		}
	},
	
	_getVersion			: function(callback) {
		$.ajax({
			url : this.security?"https://local.espider.co.kr:24636/getVersion.esm":"http://local.espider.co.kr:24635/getVersion.esm",
			type: "GET",
			dataType : "jsonp",
			jsonp : "espider_call",
			timeout: 5000,
			success : function(data){
				if(data != null) {
					var version = data.version;		// Current Version
			
					// check version
					if(version >= espider.engine_version) {
						callback(true);
					} else {
						// TODO Update Process
						callback(false, "E010001");
					}
				}
			},
			error: function(XHR, textStatus, errorThrown) {
				callback(false, "E010002");
			}
		});
	},

	_getPort			: function(callback) {
		$.ajax({
			url : this.security?"https://local.espider.co.kr:24636/getPort.esm":"http://local.espider.co.kr:24635/getPort.esm",
			dataType : "jsonp",
			jsonp : "espider_call",
			timeout: 5000,
			success : function(data){
				if(data != null && data.success) {
					espider._port = data.port;			// available port

					//excute espiderWin
					if(!espider._connected) {
						espider._connect();
					}
					callback(true);
				} else {
					callback(false, "E020001");
				}
			},
			error: function(XHR, textStatus, errorThrown) {
				callback(false, "E020002");
			}
		});
	},
		
	_connect			: function(call_back) {
		address = this.security?"wss://local.espider.co.kr":"ws://local.espider.co.kr";
		
		if (this._connected) return true;
		switch (this._connectedType) {
			case 1:
				this._socket = espiderIO.connect(address + ":" + this._port);
				this._socket.on("connect", this._Engine_onopen);
				this._socket.on("disconnect", this._Engine_onclose);
				this._socket.on("espider", this._Engine_onmessage);
				break;
			case 2:
				this._socket = new WebSocket(address + ":" + this._port);
				this._socket.onopen = this._Engine_onopen;
				this._socket.onmessage = this._Engine_onmessage;
				this._socket.onclose = this._Engine_onclose;
				this._socket.onerror = this._Engine_onerror;
				break;
			default:
				return false;
		}
	},
	
	options				: {},
	
	_disablePort		: [],
	
	_disconnect			: function() {
		espider._log("_disconnect");
		switch (this._connectedType) {
			case 1:
				if (!this._connected) return;
				this._socket.close();
				break;
			case 2:
				if (!this._connected) return;
				this._socket.close();
				break;
			default:
				return;
		}
	},
	
	_listener 			: {},
	
	addListner 			: function(name, fcall_back) {
		if (name && fcall_back && (typeof name === "string") && (typeof fcall_back === "function")) {
			this._listener[name] = fcall_back;
		} 
	},
	
	_sendcommand		: function(cmd, data) {
		if (!this._connected) return;
		
		switch (this._connectedType) {
			case 1:
				this._socket.emit(cmd, ((data && (typeof data === "object"))?data:""));
				break;
			case 2:
				var sockData = [];
				sockData.push(cmd);
				sockData.push(((data && (typeof data === "object"))?data:""));
				
				this._socket.send(JSON.stringify(sockData));
				
				break;
			default:
				return false;
		}
	},
	
	_Engine_onopen		: function() {
		espider._log("onopen");
		espider._connected = true;
        
		espider._socket = this;
        
		espider._sendcommand("espider_setOptions", espider.options);
	},
	
	_Engine_onclose		: function(evt) {
		espider._log("onclose");
		espider._connected = false;
	},

	_Engine_onmessage	: function(back_data) {
		if (!back_data) return;
		try {
			switch (espider._connectedType) {
				case 2 :
					var data = back_data.data;
				
					if (data && (typeof data === "string")) {
						var retData = JSON.parse(data);
						if (retData[0] === "espider" && retData.length == 2) {
							var datas = retData[1];
							if (typeof datas.call_back == "string") {
								var fn = espider._listener[datas.call_back];
								
								if (fn && (typeof fn === "function")) {
									fn(datas.data);
								} else if (typeof fn === "object") {
									//array
									fn = fn.shift();
									if (fn && (typeof fn === "function")) {
										fn(datas.data);	
									}
								}
							}
						}
					}
			
					break;
				case 1 :
					if (typeof back_data == "object") {
						var fn = espider._listener[back_data.call_back];
						if (fn && (typeof fn === "function")) {
							fn(back_data.data);
						} else if (typeof fn === "object") {
							//array
							fn = fn.shift();
							if (fn && (typeof fn === "function")) {
								fn(back_data.data);	
							}
						}
					}
					break;
				default:
					return;
			}
		} catch(e) {
			espider._log("onmessage err :: " + e);
		}
	},
	
	_Engine_onerror		: function(evt) {
		espider._log(evt);
	},
	
	_terminate			: function() {
		this._sendcommand("espider_terminate", "");
	},
	
	_runEngine			: function() {
	
	},

	initialization		: function(call_back) {
		// Check Protocol
		var url = window.location.href
		var protocol = url.split(":")[0];
		
		espider._log("url :: " + url);
		espider._log("protocol :: " + protocol);
		espider._log("this.security :: " + this.security);
		
		if(protocol == "https") {
			this.security = true;
		}

		if (this._connected) {
			if (call_back && typeof call_back === "function") {
				call_back(true);
			}
			return;
		}
		
		espider._getVersion(function callback(callback_version) {
			if(callback_version) {
				espider._getPort(function callback(callback_port) {
					if(callback_port) {
						call_back(callback_port);
					} else {
						call_back(arguments[0], arguments[1]);
					}
				});
			} else {
				call_back(arguments[0], arguments[1]);
			}
		});
	},
	
	finalization		: function() {
		if (this._connected) {
			this._terminate();
			this._disconnect();
		}
	},
	
	engineStartWithJob	: function(jobData, call_back) {
		if (!this._connected) {
			if (call_back && typeof call_back === "function") {
				call_back(false);
			}
		}
		
		if (call_back && typeof call_back === "function") {
			if (!this._listener["espider_engineStart"])
				this._listener["espider_engineStart"] = [];
				
			this._listener["espider_engineStart"].push(call_back);
		}
		this._sendcommand("espider_engineStart", jobData);
	},
	
	enginStop			: function() {
		this._sendcommand("espider_engineStop", null);
	},
	
	engineStartJob		: function(call_back) {
		if (!this._connected) {
			if (call_back && typeof call_back === "function") {
				call_back(false);
			}
		}

		if (call_back && typeof call_back === "function") {
			if (!this._listener["espider_startJob"])
				this._listener["espider_startJob"] = [];
				
			this._listener["espider_startJob"].push(call_back);
		}
		this._sendcommand("espider_startJob", null);
	},
	
	engineResume		: function() {
		this._sendcommand("espider_engineResume", null);
	},
	
	engineSuspend		: function() {
		this._sendcommand("espider_engineSuspend", null);
	},
	
	engineCancelAll		: function() {
		this._sendcommand("espider_cancelAll", null);
	},
	
	engineCancelJob		: function(threadIdx) {
		if (!threadIdx) return;

		var jarg = {};
		jarg.threadIdx = threadIdx;
		this_sendcommand("espider_cancelAll", jarg);
	},
	
	engineCancelAllForce: function() {
		this._sendcommand("espider_cancelAllForce", null);
	},
	
	engineSetParam		: function(data) {
		this._sendcommand("espider_setParam", data);
	},
	
	engineVersion		: function(call_back) {
		if (!this._connected) {
			if (call_back && typeof call_back === "function") {
				call_back("unknown");
			}
		}
		
		if (call_back && typeof call_back === "function") {
			if (!this._listener["espider_getVersion"])
				this._listener["espider_getVersion"] = [];
				
			this._listener["espider_getVersion"].push(call_back);
		}
		this._sendcommand("espider_getVersion", null);
	},
	
	engineGetCertification: function(drive, call_back) {
		if (!this._connected) {
			if (call_back && typeof call_back === "function") {
				call_back("");
			}
		}
		
		if (call_back && typeof call_back === "function") {
			if (!this._listener["espider_getCertification"])
				this._listener["espider_getCertification"] = [];
				
			this._listener["espider_getCertification"].push(call_back);
		}

		var external = {};
		external.external = "";
		if (drive && typeof drive === "string") {
			external.external = drive;
		}
		
		if (external.external != "") {
			this._sendcommand("espider_getCertification", external);
		} else {
			this._sendcommand("espider_getCertification", "");
		}
	},
	
	engineGetExternalDrive: function(call_back) {
		if (!this._connected) {
			if (call_back && typeof call_back === "function") {
				call_back([]);
			}
		}
		
		if (call_back && typeof call_back === "function") {
			if (!this._listener["espider_getExternalDrive"])
				this._listener["espider_getExternalDrive"] = [];
				
			this._listener["espider_getExternalDrive"].push(call_back);
		}
		this._sendcommand("espider_getExternalDrive", "");
	},
	
	engineConvertNOS 	: function(data, call_back) {
		if (!this._connected || !data ) {
			if (call_back && typeof call_back === "function") {
				call_back("");
			}
		}
		
		if (call_back && typeof call_back === "function") {
			if (!this._listener["espider_getConvertNOS"])
				this._listener["espider_getConvertNOS"] = [];
				
			this._listener["espider_getConvertNOS"].push(call_back);
		}
		
		this._sendcommand("espider_getConvertNOS", data);
	},
	
	engineConvertAhnlab : function(data, call_back) {
		if (!this._connected || !data ) {
			if (call_back && typeof call_back === "function") {
				call_back("");
			}
		}
		
		if (call_back && typeof call_back == "function") {
			if (!this._listener["espider_getConvertAhnlab"])
				this._listener["espider_getConvertAhnlab"] = [];
				
			this._listener["espider_getConvertAhnlab"].push(call_back);
		}
		
		this._sendcommand("espider_getConvertAhnlab", data);
	},
	
	engineGetDevice : function(infoKey, call_back) {
		
	  if (!this._connected) {
	   if (call_back && typeof call_back === "function") {
	    call_back("");
	   }
	  }
	  
	  if(infoKey){
	  	var data = {};
	  	data.info = infoKey;
	  	
	  	if (call_back && typeof call_back == "function") {
		   if (!this._listener["espider_getDeviceInfo"])
		    this._listener["espider_getDeviceInfo"] = [];
		   
		   this._listener["espider_getDeviceInfo"].push(call_back);
		  }
		  
		  this._sendcommand("espider_getDeviceInfo", data);
	  }
 	}
};


