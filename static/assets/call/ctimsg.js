function CmdResource() {}
CmdResource.LOGIN = "LOGIN";
CmdResource.LOGOUT = "LOGOUT";
CmdResource.CHANGESKILLGROUP="CHANGESKILLGROUP";
CmdResource.MONITOR="monitor".toUpperCase();
CmdResource.PARKAGENT="parkAgent".toUpperCase();
CmdResource.LISTENMONITOR="listenmonitor".toUpperCase();
CmdResource.TALKMONITOR="talkmonitor".toUpperCase();
CmdResource.ONCREATEMONITOR="ONCREATEMONITOR".toUpperCase();
CmdResource.ONRELEASEMONITOR="onReleaseMonitor".toUpperCase();
CmdResource.ONMONITORMSG="onMonitorMsg".toUpperCase();
CmdResource.REQUEST_HOLD = "RequestHold".toUpperCase();
CmdResource.FETCH_HOLD = "FetchHold".toUpperCase();
CmdResource.RESET = "reset".toUpperCase();
CmdResource.REQUEST_REST = "RequestRest".toUpperCase();
CmdResource.REQUEST_DINNER = "RequestDinner".toUpperCase();
CmdResource.REQUEST_TRAIN = "RequestTrain".toUpperCase();
CmdResource.REQUEST_BATHROOM = "RequestBathroom".toUpperCase();


CmdResource.Cancel_REST = "CancelRest".toUpperCase();
CmdResource.FORCE_LDLE = "Forceldle".toUpperCase();
CmdResource.FORCE_BUSY = "ForceBusy".toUpperCase();
CmdResource.FORCE_OUT = "ForceOut".toUpperCase();
CmdResource.WORK_BUSY = "WorkBusy".toUpperCase();
CmdResource.WORK_FREE = "WorkFree".toUpperCase();
CmdResource.SUBSCRIBE_CLIENT_STATSUS = "subscribeClientStatus".toUpperCase();
CmdResource.AUTO_CALL = "AutoCall".toUpperCase();
CmdResource.PAUSE_TALK = "PauseTalk".toUpperCase();
CmdResource.SEND_USER_DATA = "SendUserData".toUpperCase();
CmdResource.MANUAL_CALL = "ManualCall".toUpperCase();
CmdResource.GOTO_FLOW = "gotoFlow".toUpperCase();
CmdResource.PLAY_FILE = "PlayFile".toUpperCase();
CmdResource.STOP_PLAY_FILE = "StopPlayFile".toUpperCase();
CmdResource.PLAY_CONF_FILE = "PlayConfFile".toUpperCase();
CmdResource.STOP_PLAY_CONF_FILE = "StopPlayConfFile".toUpperCase();
CmdResource.REQUEST_IDLE = "RequestIdle".toUpperCase();
CmdResource.CHANGE_STATUS = "ChangeStatus".toUpperCase();

CmdResource.REQUEST_INTERCEPT = "RequestIntercept".toUpperCase();
CmdResource.TURN_SLIC = "TurnSlic".toUpperCase();
CmdResource.TURN_GROUP = "TurnGroup".toUpperCase();

CmdResource.REQUEST_SLIC = "RequestSlic".toUpperCase();
CmdResource.CALL_SEAT = "CallSeat".toUpperCase();
CmdResource.LISTEN_SLIC = "ListenSlic".toUpperCase();
CmdResource.INSERT_SLIC = "InsertSlic".toUpperCase();
CmdResource.DONOT_DISTURB = "DoNotDisturb".toUpperCase();
CmdResource.MUTE_ON = "MuteOn".toUpperCase();
CmdResource.MUTE_OFF = "MuteOff".toUpperCase();
CmdResource.REQUEST_SET_TRANSFER = "RequestSetTransfer".toUpperCase();
CmdResource.REFUSE = "Refuse".toUpperCase();
CmdResource.ANSWER_CALL = "AnswerCall".toUpperCase();
CmdResource.CONNECT_QUEUE = "ConnectQueue".toUpperCase();
CmdResource.CALL_OUT = "CallOut".toUpperCase();
CmdResource.CALL_IVR = "CallIvr".toUpperCase();
CmdResource.SEND_DTMF = "SendDtmf".toUpperCase();
CmdResource.TURN_OUT = "TurnOut".toUpperCase();
CmdResource.REQUEST_OUT = "RequestOut".toUpperCase();
CmdResource.HANG_UP = "HangUp".toUpperCase();
CmdResource.KEEP_ALIVE = "KeepAlive".toUpperCase();
CmdResource.GET_ALL_STATUS = "getAllSeatStatus".toUpperCase();
CmdResource.SUBSCRIBE = "GetRealTimeStatus".toUpperCase();
CmdResource.FLASH = "Flash".toUpperCase();
CmdResource.SENDMSG = "SendMsg".toUpperCase();
CmdResource.BOASTMSG = "BoastMsg".toUpperCase();
CmdResource.REQUESTMSG = "RequestMsg".toUpperCase();

CmdResource.EVENT_OFF_HOOK = "OnOffHook".toUpperCase();
CmdResource.EVENT_ON_HOOK = "onOnHook".toUpperCase();
CmdResource.EVENT_QUEUE = "OnQueue".toUpperCase();
CmdResource.EVENT_QUEUE_OFF = "OnQueueOff".toUpperCase();
CmdResource.EVENT_RING = "onRing".toUpperCase();
CmdResource.EVENT_ANSWER = "onAnswer".toUpperCase();
CmdResource.EVENT_NO_ANSWER = "onNoAnswer".toUpperCase();
CmdResource.EVENT_DIALING = "onDialing".toUpperCase();
CmdResource.EVENT_DIAL_SUCCESS = "onDialSuccess".toUpperCase();
CmdResource.EVENT_DIAL_FAIL = "onDialFail".toUpperCase();
CmdResource.EVENT_OFF_TALK = "onOffTalk".toUpperCase();
CmdResource.EVENT_STATUS = "onStatus".toUpperCase();
CmdResource.EVENT_DISCONNECTED = "onDisconnected".toUpperCase();
CmdResource.EVENT_CONNECTED = "onConnected".toUpperCase();
CmdResource.EVENT_USER_DATA = "onUserData".toUpperCase();
CmdResource.EVENT_RECVMSG = "onMsg".toUpperCase();
CmdResource.EVENT_ASRRESULT="onAsrResult".toUpperCase();

CmdResource.VER = "www.FastCall.cn CtiLink component V1.1".toUpperCase();
CmdResource.COPYRIGHT = " Copyright © 2015 China of ShengZhen City FastCall Information Technology Co., Ltd.";


function HashMap() {
	//定义长度
	var length = 0;
	//创建一个对象
	var obj = new Object();

	/**
	 * 判断Map是否为空
	 */
	this.isEmpty = function() {
		return length == 0;
	};

	/**
	 * 判断对象中是否包含给定Key
	 */
	this.containsKey = function(key) {
		return(key in obj);
	};

	/**
	 * 判断对象中是否包含给定的Value
	 */
	this.containsValue = function(value) {
		for(var key in obj) {
			if(obj[key] == value) {
				return true;
			}
		}
		return false;
	};

	/**
	 *向map中添加数据
	 */
	this.put = function(key, value) {
		if(!this.containsKey(key)) {
			length++;
		}
		obj[key] = value;
	};

	/**
	 * 根据给定的Key获得Value
	 */
	this.get = function(key) {
		return this.containsKey(key) ? obj[key] : null;
	};

	/**
	 * 根据给定的Key删除一个值
	 */
	this.remove = function(key) {
		if(this.containsKey(key) && (delete obj[key])) {
			length--;
		}
	};

	/**
	 * 获得Map中的所有Value
	 */
	this.values = function() {
		var _values = new Array();
		for(var key in obj) {
			_values.push(obj[key]);
		}
		return _values;
	};

	/**
	 * 获得Map中的所有Key
	 */
	this.keySet = function() {
		var _keys = new Array();
		for(var key in obj) {
			_keys.push(key);
		}
		return _keys;
	};

	/**
	 * 获得Map的长度
	 */
	this.size = function() {
		return length;
	};

	/**
	 * 清空Map
	 */
	this.clear = function() {
		length = 0;
		obj = new Object();
	};
}

function CtiAgent() {
	this.userName = '';
	this.passwd = '';
	this.serverAddr = '';
	this.serverPort = 0;
	this.doNotDisturbFlag = 0;
	this.idleFlag = 0;
	this.autoAnswerFlag = 0;
	this.incomingCallQueue = new Array();
	this.extensionNo = '';
	this.sipAccount = '';
	this.sipPasswd = '';
	this.sipDisplayName = '';
	this.sipServerAddr = '';
	this.sipPort = 1;
	this.sessionNo = '';
	this.gatewaydn = '';
	this.lastActive = 1;
	this.lastSendMsg = 1;
	this.status = false;
	this.subscribe = true;
	this.busy="0";
	this.ext="";
	this.skillGroup="";
}

CtiAgent.prototype = {
	constructor: CtiAgent
};

CtiAgent.prototype.setUserName = function(userName) {
	this.userName = userName;
}

CtiAgent.prototype.getUserName = function(){
	return this.userName;
}

CtiAgent.prototype.setPasswd = function(passwd){
	this.passwd = passwd;
}

CtiAgent.prototype.getPasswd = function(){
	return this.passwd;
}

CtiAgent.prototype.setBusy = function(is_busy){
    this.busy = is_busy;
}

CtiAgent.prototype.getBusy = function() {
    return this.busy;
}

CtiAgent.prototype.setExt = function(ext){
    this.ext = ext;
}

CtiAgent.prototype.getExt = function() {
    return this.ext;
}

CtiAgent.prototype.setServerAddr = function(serverAddr) {
	this.serverAddr = serverAddr;
}

CtiAgent.prototype.getServerAddr = function() {
	return this.serverAddr;
}

CtiAgent.prototype.setServerPort = function(serverPort) {
	this.serverPort = serverPort;
}

CtiAgent.prototype.getServerPort = function() {
	return this.serverPort;
}

CtiAgent.prototype.setSessionNo = function(sessionNo) {
	this.sessionNo = sessionNo;
}

CtiAgent.prototype.getSessionNo = function() {
	return this.sessionNo;
}

CtiAgent.prototype.setGatewaydn = function(gatewaydn) {
	this.gatewaydn = gatewaydn;
}

CtiAgent.prototype.getGatewaydn = function() {
	return this.gatewaydn;
}
CtiAgent.prototype.onInQueue = function(caller) {
	this.incomingCallQueue.push(caller);
}

CtiAgent.prototype.onOutQueue = function(caller) {
	this.incomingCallQueue.unshift(caller);
}

function CtiMsg() {

	this.sign = '';
	this.session_no = '';
	this.length = 0;

	this.body = '';
	this.cmd = '';
	this.no = '';
	this.ts = '';
	this.gatewaydn = '';
	this.version = '';
	this.request = '';
	this.sessionno = '';
	this.passwd = '';
	this.username = '';
	this.salt = '';
	this.info = '';

	this.properties = new HashMap();
}

CtiMsg.prototype = {
	constructor: CtiMsg
};

CtiMsg.prototype.setSign = function(sign) {
	this.sign = this.getSignStr();
}

CtiMsg.prototype.getSign = function() {
	return this.getSignStr();
}

CtiMsg.prototype.setSession_no = function(sessionNo) {
	this.session_no = sessionNo;
}

CtiMsg.prototype.getSession_no = function() {
	return this.session_no == '' ? "" : this.session_no;
}

CtiMsg.prototype.setLength = function(length) {
	this.length = length;
}

CtiMsg.prototype.getLength = function() {
	if(this.length == 0) {
		this.length = this.getBody().length;
	}
	return this.length;
}

CtiMsg.prototype.setCmd = function(cmd) {
	this.cmd = cmd;
}

CtiMsg.prototype.getCmd = function() {
	return this.cmd;
}

CtiMsg.prototype.setNo = function(no) {
	this.no = this.generator();
}

CtiMsg.prototype.getNo = function() {
	return this.generator();
}

CtiMsg.prototype.setTs = function(ts) {
	this.ts = this.generator();
}

CtiMsg.prototype.getTs = function() {
	return this.generator();
}

CtiMsg.prototype.setGatewaydn = function(gatewaydn) {
	this.gatewaydn = gatewaydn;
}

CtiMsg.prototype.getGatewaydn = function() {
	return this.gatewaydn == '' ? "" : this.gatewaydn;
}

CtiMsg.prototype.setVersion = function(version) {
	this.version = version;
}

CtiMsg.prototype.getVersion = function() {
	return 'FLASH CTILINK COMPONENT V1.1';
}

CtiMsg.prototype.setRequest = function(request) {
	this.request = request;
}

CtiMsg.prototype.getRequest = function() {
	return this.request;
}

CtiMsg.prototype.setSessionno = function(sessionno) {
	this.sessionno = sessionno;
}

CtiMsg.prototype.getSessionno = function() {
	return this.sessionno == '' ? "" : this.sessionno;
}

CtiMsg.prototype.setUserName = function(userName) {
	this.username = userName;
}

CtiMsg.prototype.getUserName = function() {
	return this.username == '' ? "" : this.username;
}

CtiMsg.prototype.setPasswd = function(passwd) {
	this.passwd = passwd;
}

CtiMsg.prototype.getPasswd = function() {
	return this.passwd == '' ? "" : this.passwd;
}

CtiMsg.prototype.setSalt = function(salt) {
	this.salt = salt;
}

CtiMsg.prototype.getSalt = function() {
	return this.salt == '' ? "" : this.salt;
}

CtiMsg.prototype.setInfo = function(info) {
	this.info = info;
}

CtiMsg.prototype.getInfo = function() {
	return this.info == '' ? "" : this.info;
}

CtiMsg.prototype.setProperty = function(key, value) {

	this.properties.put(key, value);

}

CtiMsg.prototype.getProperty = function(key) {
	return this.properties.get(key);
}

CtiMsg.prototype.getBody = function() {
	if(this.body == null || this.body == '') {
		this.body = "";
		this.body += "<cmd>" + this.cmd + "</cmd>";
		this.body += "<ts>" + this.getTs() + "</ts>";
		this.body += "<gatewaydn>" + this.getGatewaydn() + "</gatewaydn>";
		this.body += "<no>" + this.getNo() + "</no>";
		this.body += "<version>" + this.getVersion() + "</version>";
		var keySet = this.properties.keySet();
		for(var key in keySet) {
			if(typeof(keySet[key]) =="function"){
				continue;
			}
			this.body += "<" + keySet[key] + ">" + this.properties.get(keySet[key]) + "</" + keySet[key] + ">";
		}
		this.body = "<body>" + this.body + "</body>";
	}
	return this.body;
}

CtiMsg.prototype.getHead = function() {
	var head = "";
	head += "<sign>" + this.getSign() + "</sign>";
	head += "<session_no>" + this.getSession_no() + "</session_no>";
	head += "<length>" + this.getLength() + "</length>";
	return head;
}

CtiMsg.prototype.getCMD = function(agent, cmdName) {
	var ctiMsg = new CtiMsg();
	ctiMsg.setCmd(cmdName);
	ctiMsg.setSession_no(agent.getSessionNo());
	ctiMsg.setGatewaydn(agent.getGatewaydn());
	if(CmdResource.LOGIN == cmdName) {
		ctiMsg.setProperty("username", agent.userName);
		ctiMsg.setProperty("passwd", agent.passwd);
	}
	return ctiMsg;
}

CtiMsg.prototype.getMsg = function() {
	var realSignStr = this.getSignStr();
	if(realSignStr == this.getSign()) {
		return "<request>" + this.getHead() + this.getBody() + "</request>" + "\n";
	}

	return "\n";
}

CtiMsg.prototype.getResponseMsg = function() {
	var realSignStr = this.getSignStr();
	if(realSignStr == this.getSign()) {
		return "<response>" + this.getHead() + this.getBody() + "</response>" + "\n";
	}
	return "\n";
}

CtiMsg.prototype.verify = function(xmlstr) {
	return true;
}

CtiMsg.prototype.generator = function() {
	var timestamp = Date.parse(new Date());
	return timestamp;
}

CtiMsg.prototype.getSignStr = function() {
	return 'YjJkZjdhYTE0ZmU1MGY4MjdmYTNmMjljMzE5OGYzNzgzN2UxODU3OA==';
}

CtiMsg.prototype.getResponseMsg = function() {
	var realSignStr = this.getSignStr();
	if(realSignStr == this.getSign()) {
		return "<response>" + this.getHead() + this.getBody() +
			"</response>";
	}
	return "";
}

CtiMsg.prototype.instance = function(xmlstr) {
	var x2js = new X2JS();
	var jsonObj = x2js.xml_str2json(xmlstr);
	var ctiMsg = new CtiMsg();
	try {

		if(typeof(jsonObj.response) != "undefined") {
			ctiMsg.setSign(jsonObj.response.sign);
			ctiMsg.setSession_no(jsonObj.response.session_no);
			ctiMsg.setLength(jsonObj.response.length);
			bodyItems = jsonObj.response.body;
			for(var key in bodyItems) {
				attValue = bodyItems[key];
				if(key.toLowerCase() == "cmd") {
					ctiMsg.setCmd(attValue);
					continue;
				}
				if(key.toLowerCase() == "no") {
					ctiMsg.setNo(attValue);
					continue;
				}
				if(key.toLowerCase() == "ts") {
					ctiMsg.setTs(attValue);
					continue;
				}
				if(key.toLowerCase() == "gatewaydn") {
					ctiMsg.setGatewaydn(attValue);
					continue;
				}
				if(key.toLowerCase() == "version") {
					ctiMsg.setVersion(attValue);
					continue;
				}
				if(key.toLowerCase() == "request") {
					ctiMsg.setRequest(attValue);
					continue;
				}

				if(key.toLowerCase() == "sessionno") {
					ctiMsg.setSessionno(attValue);
					continue;
				}

				if(key.toLowerCase() == "username") {
					ctiMsg.setUserName(attValue);
					continue;
				}

				if(key.toLowerCase() == "passwd") {
					ctiMsg.setPasswd(attValue);
					continue;
				}

				if(key.toLowerCase() == "salt") {
					ctiMsg.setSalt(attValue);
					continue;
				}

				if(key.toLowerCase() == "info") {
					ctiMsg.setInfo(attValue);
					continue;
				}

				ctiMsg.setProperty(key, attValue);
			}
			ctiMsg.setProperty('msg_type', '1');
		}
	} catch(e) {}
	try {

		if(typeof(jsonObj.request) != "undefined") {

			ctiMsg.setSign(jsonObj.request.sign);
			ctiMsg.setSession_no(jsonObj.request.session_no);
			ctiMsg.setLength(jsonObj.request.length);
			bodyItems = jsonObj.request.body;
			for(var key in bodyItems) {

				attValue = bodyItems[key];

				if(key.toLowerCase() == "cmd") {
					ctiMsg.setCmd(attValue);
					continue;
				}
				if(key.toLowerCase() == "no") {
					ctiMsg.setNo(attValue);
					continue;
				}
				if(key.toLowerCase() == "ts") {
					ctiMsg.setTs(attValue);
					continue;
				}
				if(key.toLowerCase() == "gatewaydn") {
					ctiMsg.setGatewaydn(attValue);
					continue;
				}
				if(key.toLowerCase() == "version") {
					ctiMsg.setVersion(attValue);
					continue;
				}
				if(key.toLowerCase() == "request") {
					ctiMsg.setRequest(attValue);
					continue;
				}

				if(key.toLowerCase() == "sessionno") {
					ctiMsg.setSessionno(attValue);
					continue;
				}

				if(key.toLowerCase() == "username") {
					ctiMsg.setUserName(attValue);
					continue;
				}

				if(key.toLowerCase() == "passwd") {
					ctiMsg.setPasswd(attValue);
					continue;
				}

				if(key.toLowerCase() == "salt") {
					ctiMsg.setSalt(attValue);
					continue;
				}

				if(key.toLowerCase() == "info") {
					ctiMsg.setInfo(attValue);
					continue;
				}

				ctiMsg.setProperty(key, attValue);

			}
			ctiMsg.setProperty('msg_type', '0');
		}
	} catch(e) {}
	return ctiMsg;
}
