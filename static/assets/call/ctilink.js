function CtiLink () {
    this.connected = false;
    this.id = "CtiLink_" + (++CtiLink.last_id);
    CtiLink.sockets[this.id] = this;
    this.websocket;
    this.info = "";
}

CtiLink.sockets = {};
CtiLink.last_id = 0;
CtiLink.info = "";
CtiLink.Keep_Alive_Count = 0;
CtiLink.Keep_Alive_time = Date.parse (new Date ());
CtiLink.debug = 0;

CtiLink.status = {};
CtiLink.status["0"] = "未登录";
CtiLink.status["3"] = "在线空闲";
CtiLink.status["4"] = "小休";
CtiLink.status["5"] = "通话";
CtiLink.status["6"] = "闪断";
CtiLink.status["8"] = "事务处理";
CtiLink.status["9"] = "振铃";
CtiLink.status["10"] = "示忙";
CtiLink.status["12"] = "拨号";
CtiLink.status["21"] = "用餐";
CtiLink.status["22"] = "培训";
CtiLink.status["23"] = "洗手间";
CtiLink.prototype = {
    constructor: CtiLink
};

CtiLink.prototype.setup = function (data) {
    this.onReady ();
}

CtiLink.prototype.connect = function (host, port) {
    try {
        var wsServer = host + ':' + port;
        this.websocket = new WebSocket (wsServer, 'fs-protool');
        this.websocket.onopen = this.onWSOpen;
        this.websocket.onclose = this.onWSClose;
        this.websocket.onerror = this.onWSError;
        this.websocket.onmessage = this.onWSMsg;
        this.websocket.ctiLink = this;
        setInterval (this.refreshCount, 100000);
    } catch (e) {
        console.log (e);
    }
}

CtiLink.prototype.onWSOpen = function (evt) {
    this.ctiLink.onRx ("onWSOpen:" + evt);
    this.ctiLink.connected = true;
    this.ctiLink.onConnect (true);
}

CtiLink.prototype.onWSClose = function (evt) {
    this.ctiLink.onStatus (this.ctiLink.agent.userName, '0', 0, '', '');
    this.ctiLink.connected = false;
}

CtiLink.prototype.onWSError = function (evt) {
    this.ctiLink.onRx ("onWSError:" + evt);
    this.ctiLink.onError (evt.data);
    this.ctiLink.connected = false;
}

CtiLink.prototype.wSSend = function (data, cmd) {
    this.onRx ("wSSend:" + data);
    if (cmd == "login") {
        this.websocket.send (data);
    } else if (this.agent.status && this.connected) {
        this.websocket.send (data);
    } else {
        this.onClose ();
    }
}

CtiLink.prototype.onWSMsg = function (event) {
    
    this.ctiLink.Keep_Alive_time = Date.parse (new Date ());
    this.ctiLink.Keep_Alive_Count = 0;
    var dealData = this.ctiLink.info + event.data;
    var datas = dealData.split ("\n");
    this.ctiLink.onRx ('onWSMsg----->' + datas);
    if (datas.length > 1) {
        for (var i = 0; i < datas.length - 1; i++) {
            this.ctiLink.onRx ("datas[" + i + "]------->" + datas[i]);
            if (datas[i] != "" && datas[i] != null) {
                this.ctiLink.onWSDispath (datas[i]);
            }
        }
        if (datas[datas.length - 1] != null) {
            this.ctiLink.info = datas[i];
        }
    } else if (dealData != "") {
        this.ctiLink.info = dealData;
    }
}

CtiLink.prototype.refreshCount = function () {
    if (this.cti.connected) {
        var nowTime = Date.parse (new Date ());
        if (nowTime - this.cti.Keep_Alive_time > 20000) {
            if (this.cti.Keep_Alive_Count++ > 10) {
                this.cti.websocket.close ();
            } else {
                this.cti.Keep_Alive_time = nowTime;
                this.cti.requestKeepAlive ();
            }
        }
    }
}

CtiLink.prototype.onWSDispath = function (xmlstr) {
    let ctiMsg = new CtiMsg ();
    ctiMsg = ctiMsg.instance (xmlstr);
    this.onRx ("onWSMsg----cmd:" + ctiMsg.getCmd ().toUpperCase ());
    this.onRx (ctiMsg.getCmd ().toUpperCase ());
    let request = ctiMsg.getRequest ();
    let info = ctiMsg.getInfo ();
    if (request == "400") {
        this.onError (info);
        return;
    }
    if (ctiMsg == null || typeof (ctiMsg) == "undefined" || ctiMsg == '') {
        this.onDipatchError (this.id, xmlstr);
    } else if (CmdResource.LOGIN == ctiMsg.getCmd ().toUpperCase ()) {
        if ("500" == request) {
            this.agent.setSessionNo (ctiMsg.getSessionno ());
            if ("sessionno is null" == info) {
                this.login (this.agent.userName, this.agent.passwd, this.agent.busy, this.agent.ext, this.agent.skillGroup);
            } else {
                this.onLoginFail (info);
            }
        }
        if ("200" == request) {
            this.agent.status = true;
            this.onLoginSuccess ('success');
        } else {
            this.onLoginFail (ctiMsg.getInfo ());
        }
        
    } else if (CmdResource.LOGOUT == ctiMsg.getCmd ().toUpperCase ()) {
        
        let reason = ctiMsg.getProperty ("reason");
        this.onLogout (reason);
        
    } else if (CmdResource.CHANGESKILLGROUP == ctiMsg.getCmd ().toUpperCase ()) {
        
        let skillGroup = ctiMsg.getProperty ("skill_group");
        this.onChangeSkillGroup (skillGroup, request, info);
        
    } else if (CmdResource.EVENT_DISCONNECTED == ctiMsg.getCmd ().toUpperCase ()) {
        
        let msg = ctiMsg.getProperty ("msg");
        this.onDisconnected (msg);
        
    } else if (CmdResource.MONITOR == ctiMsg.getCmd ().toUpperCase ()) {
        
        info = ctiMsg.getInfo ();
        if (info) {
            info = info.replace (/%/g, '%25');
        }
        let infoEx = decodeURI (info);
        this.onMonitor (infoEx);
        
    } else if (CmdResource.LISTENMONITOR == ctiMsg.getCmd ().toUpperCase ()) {
        
        let uuid = ctiMsg.getProperty ("uuid");
        info = ctiMsg.getInfo ();
        if (info) {
            info = info.replace (/%/g, '%25');
        }
        let infoEx = decodeURI (info);
        this.OnStartlistenmonitor (uuid, infoEx);
        
    } else if (CmdResource.ONCREATEMONITOR == ctiMsg.getCmd ().toUpperCase ()) {
        
        let callee = ctiMsg.getProperty ("callee");
        let caller = ctiMsg.getProperty ("caller");
        let callNo = ctiMsg.getProperty ("callno");
        let confno = ctiMsg.getProperty ("confno");
        let icalltype = ctiMsg.getProperty ("icalltype");
        let no = ctiMsg.getProperty ("no");
        let project_no = ctiMsg.getProperty ("project_no");
        let task_no = ctiMsg.getProperty ("task_no");
        let ts = ctiMsg.getProperty ("ts");
        let msg = ctiMsg.getProperty ("msg");
        if (msg) {
            let msg = msg.replace (/%/g, '%25');
        }
        let msgEx = decodeURI (msg);
        this.OnCreatEmonitor (callee, caller, callNo, confno, icalltype, msgEx, no, project_no, task_no, ts);
        
    } else if (CmdResource.ONRELEASEMONITOR == ctiMsg.getCmd ().toUpperCase ()) {
        
        let callee = ctiMsg.getProperty ("callee");
        let caller = ctiMsg.getProperty ("caller");
        let callNo = ctiMsg.getProperty ("callno");
        let confno = ctiMsg.getProperty ("confno");
        let icalltype = ctiMsg.getProperty ("icalltype");
        
        let no = ctiMsg.getProperty ("no");
        let project_no = ctiMsg.getProperty ("project_no");
        let task_no = ctiMsg.getProperty ("task_no");
        let ts = ctiMsg.getProperty ("ts");
        let hangup = ctiMsg.getProperty ("hangup");
        let msg = ctiMsg.getProperty ("msg");
        if (msg) {
            let msg = msg.replace (/%/g, '%25');
        }
        let msgEx = decodeURI (msg);
        this.onReleaseMonitor (callee, caller, callNo, confno, icalltype, msgEx, no, project_no, task_no, ts, hangup);
        
    } else if (CmdResource.ONMONITORMSG == ctiMsg.getCmd ().toUpperCase ()) {
        
        let callee = ctiMsg.getProperty ("callee");
        let caller = ctiMsg.getProperty ("caller");
        let callNo = ctiMsg.getProperty ("callno");
        let confno = ctiMsg.getProperty ("confno");
        let icalltype = ctiMsg.getProperty ("icalltype");
        let no = ctiMsg.getProperty ("no");
        let project_no = ctiMsg.getProperty ("project_no");
        let task_no = ctiMsg.getProperty ("task_no");
        let ts = ctiMsg.getProperty ("ts");
        let msg = ctiMsg.getProperty ("msg");
        if (msg) {
            let msg = msg.replace (/%/g, '%25');
        }
        let msgEx = decodeURI (msg);
        this.onMonitorMsg (callee, caller, callNo, confno, icalltype, msgEx, no, project_no, task_no, ts);
        
    } else if (CmdResource.TALKMONITOR == ctiMsg.getCmd ().toUpperCase ()) {
        
        request = ctiMsg.getRequest ();
        info = ctiMsg.getInfo ();
        if (info) {
            info = info.replace (/%/g, '%25');
        }
        let infoEx = decodeURI (info);
        this.onTalkMonitor (request, infoEx);
        
    } else if (CmdResource.EVENT_STATUS == ctiMsg.getCmd ().toUpperCase ()) {
        
        let status = ctiMsg.getProperty ("status");
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let targetUserName = ctiMsg.getProperty ("targetusername");
        let statustime = ctiMsg.getProperty ("statustime");
        let extension = ctiMsg.getProperty ("extension");
        this.onStatus (targetUserName, status, statustime, caller, callee, extension);
        
    } else if (CmdResource.EVENT_RING == ctiMsg.getCmd ().toUpperCase ()) {
        
        let callee = ctiMsg.getProperty ("callee");
        let caller = ctiMsg.getProperty ("caller");
        let callNo = ctiMsg.getProperty ("callno");
        let confno = ctiMsg.getProperty ("confno");
        let icalltype = ctiMsg.getProperty ("icalltype");
        let msg = ctiMsg.getProperty ("msg");
        let no = ctiMsg.getProperty ("no");
        let project_no = ctiMsg.getProperty ("project_no");
        let task_no = ctiMsg.getProperty ("task_no");
        let ts = ctiMsg.getProperty ("ts");
        let xfer_type=ctiMsg.getProperty ("xfer_type");
        let xfer_ext=ctiMsg.getProperty ("xfer_ext");
        this.onRing (callee, caller, callNo, confno, icalltype, msg, no, project_no, task_no, ts,xfer_type,xfer_ext);
        
    } else if (CmdResource.EVENT_ANSWER == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let confno = ctiMsg.getProperty ("confno");
        let callNo = ctiMsg.getProperty ("callno");
        let fileName = ctiMsg.getProperty ("fileName");
        this.onAnswer (caller, callee, confno, callNo, fileName);
        
    } else if (CmdResource.EVENT_DIAL_FAIL == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let confno = ctiMsg.getProperty ("confno");
        let callNo = ctiMsg.getProperty ("callno");
        let reason = ctiMsg.getProperty ("reason");
        this.onDialFail (caller, callee, confno, callNo, reason);
        
    } else if (CmdResource.EVENT_DIAL_SUCCESS == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let confno = ctiMsg.getProperty ("confno");
        let callNo = ctiMsg.getProperty ("callno");
        let fileName = ctiMsg.getProperty ("fileName");
        this.onDialSuccess (caller, callee, confno, callNo, fileName);
        
    } else if (CmdResource.EVENT_DIALING == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let confno = ctiMsg.getProperty ("confno");
        let callNo = ctiMsg.getProperty ("callno");
        this.onDialing (caller, callee, confno, callNo);
        
    } else if (CmdResource.EVENT_NO_ANSWER == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let confno = ctiMsg.getProperty ("confno");
        let callNo = ctiMsg.getProperty ("callno");
        this.onNoAnswer (caller, callee, confno, callNo);
        
    } else if (CmdResource.EVENT_OFF_HOOK == ctiMsg.getCmd ().toUpperCase ()) {
        
        let extension = ctiMsg.getProperty ("extension");
        this.onOffHook (extension);
        
    } else if (CmdResource.EVENT_OFF_TALK == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        let callee = ctiMsg.getProperty ("callee");
        let confno = ctiMsg.getProperty ("confno");
        let callNo = ctiMsg.getProperty ("callno");
        let endDirection = ctiMsg.getProperty ("endDirection");
        this.onOffTalk (caller, callee, confno, callNo, endDirection);
        
    } else if (CmdResource.EVENT_ON_HOOK == ctiMsg.getCmd ().toUpperCase ()) {
        
        let confno = ctiMsg.getProperty ("confno");
        let icalltype = ctiMsg.getProperty ("icalltype");
        let caller = ctiMsg.getProperty ("caller");
        let callno = ctiMsg.getProperty ("callno");
        let callee = ctiMsg.getProperty ("callee");
        let hangup_disposition = ctiMsg.getProperty ("hangup_disposition");
        this.onOnHook (caller, callee, callno, confno, icalltype, hangup_disposition);
        
    } else if (CmdResource.EVENT_QUEUE == ctiMsg.getCmd ().toUpperCase ()) {
        let caller = ctiMsg.getProperty ("caller");
        this.onQueue (caller);
        
    } else if (CmdResource.EVENT_QUEUE_OFF == ctiMsg.getCmd ().toUpperCase ()) {
        
        let caller = ctiMsg.getProperty ("caller");
        this.onQueueOff (caller);
        
    } else if (CmdResource.EVENT_RECVMSG == ctiMsg.getCmd ().toUpperCase ()) {
        
        let username = ctiMsg.getProperty ("username");
        username = username == null ? "" : username;
        let msg = cmd.getProperty ("data");
        msg = msg == null ? "" : msg;
        this.onMsg (username, msg);
        
    } else if (CmdResource.EVENT_ASRRESULT == ctiMsg.getCmd ().toUpperCase ()) {
        
        let msg = ctiMsg.getProperty ("msg");
        let channel_type = ctiMsg.getProperty ("channel_type");
        this.onAsrResult (msg, channel_type);
        
    } else if (CmdResource.EVENT_USER_DATA == ctiMsg.getCmd ().toUpperCase ()) {
        
        let data = ctiMsg.getProperty ("data");
        this.onUserData (data);
        
    } else if (CmdResource.KEEP_ALIVE == ctiMsg.getCmd ().toUpperCase ()) {
        
        let date = new Date ();
        let msg_type = ctiMsg.getProperty ("msg_type");
        this.agent.lastActive = date.time;
        if (msg_type == "0") {
            this.responseKeepAlive ();
        }
        
    } else if (CmdResource.CALL_OUT == ctiMsg.getCmd ().toUpperCase ()) {
        
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ();
        this.onCallOut (response, msg);
        
    } else if (CmdResource.CALL_IVR == ctiMsg.getCmd ().toUpperCase ()) {
        
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ();
        this.onCallIvr (response, msg);
        
    } else if (CmdResource.WORK_BUSY == ctiMsg.getCmd ().toUpperCase ()) {
        
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ();
        this.onWorkBusy (response, msg);
        
    } else if (CmdResource.MUTE_ON == ctiMsg.getCmd ().toUpperCase ()) {
        
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ();
        this.onMuteOn (response, msg);
        
    } else if (CmdResource.MUTE_OFF == ctiMsg.getCmd ().toUpperCase ()) {
        
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ();
        this.onMuteOff (response, msg);
        
    } else if (CmdResource.SUBSCRIBE == ctiMsg.getCmd ().toUpperCase ()) {
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ()
        let bSubscribe = (msg != null && msg == "success");
        console.info (bSubscribe);
        this.agent.subscribe = bSubscribe;
        this.onSubscribe (response, msg);
        
    } else if (CmdResource.SUBSCRIBE_CLIENT_STATSUS == ctiMsg.getCmd ().toUpperCase ()) {
        let response = ctiMsg.getRequest ();
        let msg = ctiMsg.getInfo ()
        let bSubscribe = (msg != null && msg == "success");
        this.agent.subscribe = bSubscribe;
        this.onSubscribeClientStatus (response, msg);
        
    } else if (CmdResource.ASK_FOR_ASSISTANCE == ctiMsg.getCmd ().toUpperCase ()) {
        let data = ctiMsg.getProperty ("data");
        this.onAskFoRAssistance (data);
    } else {
        this.onDipatchError (this.id, xmlstr);
    }
}

CtiLink.prototype.responseKeepAlive = function (pauseType) {
    this.assertConnected ();
    var cmd = new CtiMsg ();
    let msg = "";
    var cmd = cmd.getCMD (this.agent, CmdResource.KEEP_ALIVE);
    cmd.setProperty ("data", '1');
    msg = cmd.getResponseMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestKeepAlive = function (pauseType) {
    this.assertConnected ();
    var cmd = new CtiMsg ();
    var msg = "";
    var cmd = cmd.getCMD (this.agent, CmdResource.KEEP_ALIVE);
    cmd.setProperty ("data", '0');
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.pauseTalk = function (pauseType) {
    this.assertConnected ();
    var cmd = new CtiMsg ();
    var msg = "";
    var cmd = cmd.getCMD (this.agent, CmdResource.PAUSE_TALK);
    cmd.setProperty ("pauseType", pauseType);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.sendUserData = function (data) {
    this.assertConnected ();
    var loginMsg = "";
    var cmd = cmd.getCMD (this.agent, CmdResource.SEND_USER_DATA);
    cmd.setProperty ("data", value);
    loginMsg = cmd.getMsg ();
    this.wSSend (loginMsg);
}

CtiLink.prototype.requestMsg = function (group, msg) {
    this.assertConnected ();
    var cmd = new CtiMsg ();
    var msg = "";
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUESTMSG);
    
    cmd.setProperty ("group", group);
    cmd.setProperty ("data", data);
    strMsg = cmd.getMsg ();
    this.wSSend (strMsg);
}

CtiLink.prototype.sendMsg = function (targetUserName, msg) {
    this.assertConnected ();
    var cmd = new CtiMsg ();
    var strMsg = "";
    var cmd = cmd.getCMD (this.agent, CmdResource.SENDMSG);
    cmd.setProperty ("username", targetUserName);
    cmd.setProperty ("sender", this.agent.userName);
    cmd.setProperty ("data", msg);
    strMsg = cmd.getMsg ();
    this.wSSend (strMsg);
}

CtiLink.prototype.boastMsg = function (msg) {
    this.assertConnected ();
    var strMsg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.BOASTMSG);
    cmd.setProperty ("data", msg);
    strMsg = cmd.getMsg ();
    this.wSSend (strMsg);
}

CtiLink.prototype.requestOut = function (callee) {
    this.assertConnected ();
    var strMsg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_OUT);
    cmd.setProperty ("callee", callee);
    strMsg = cmd.getMsg ();
    this.wSSend (strMsg);
}

CtiLink.prototype.requestIdle = function () {
    this.assertConnected ();
    var strMsg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_IDLE);
    strMsg = cmd.getMsg ();
    this.wSSend (strMsg);
}

CtiLink.prototype.login = function (userName, passwd, is_busy, ext, skill_group) {
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    this.agent.userName = userName;
    this.agent.passwd = passwd;
    this.agent.busy = is_busy;
    this.agent.ext = ext;
    this.agent.skillGroup = skill_group;
    var loginMsg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.LOGIN);
    cmd.setSession_no (this.agent.getSessionNo ());
    cmd.setUserName (this.agent.getUserName ());
    cmd.setPasswd (this.agent.getPasswd ());
    cmd.setProperty ("busy", is_busy);
    cmd.setProperty ("ext", ext);
    cmd.setProperty ("skill_group", skill_group);
    if (cmd.verify ()) {
        loginMsg = cmd.getMsg ();
        this.wSSend (loginMsg, 'login');
    }
}

CtiLink.prototype.changeSkillgroup = function (skillGroup) {
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.CHANGESKILLGROUP);
    cmd.setProperty ("skill_group", skillGroup);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.monitor = function (flag) {
    
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.MONITOR);
    cmd.setProperty ("data", flag);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}

CtiLink.prototype.parkAgent = function (msg) {
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.PARKAGENT);
    cmd.setProperty ("transfer", msg);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.monitorChangeFlow = function (flow_code) {
    
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.MONITORCHANGEFLOW);
    cmd.setProperty ("flow_code", flow_code);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}

CtiLink.prototype.listenmonitor = function (Uuid) {
    
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.LISTENMONITOR);
    cmd.setProperty ("Uuid", Uuid);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}

CtiLink.prototype.talkmonitor = function () {
    
    if (typeof (this.agent) == "undefined") {
        this.agent = new CtiAgent ();
    }
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.TALKMONITOR);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}


CtiLink.prototype.logout = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.LOGOUT);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    this.websocket.close ();
}

CtiLink.prototype.autoCall = function (flag) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.AUTO_CALL);
    cmd.setProperty ("data", flag);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}

CtiLink.prototype.gotoFlow = function (flowCode) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.GOTO_FLOW);
    cmd.setProperty ("FlowCode", flowCode);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestHold = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_HOLD);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.fetchHold = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.FETCH_HOLD);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestRest = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_REST);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestDinner = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_DINNER);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestTrain = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_TRAIN);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestBathroom = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_BATHROOM);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.cancelRest = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.Cancel_REST);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.forceldle = function (targetUserName) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.FORCE_LDLE);
    cmd.setProperty ("targetUserName", targetUserName);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.forceBusy = function (targetUserName) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.FORCE_BUSY);
    cmd.setProperty ("targetUserName", targetUserName);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.forceOut = function (targetUserName) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.FORCE_OUT);
    cmd.setProperty ("targetUserName", targetUserName);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.workBusy = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.WORK_BUSY);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.workFree = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.WORK_FREE);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.subscribeClientStatus = function (mode) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.SUBSCRIBE_CLIENT_STATSUS);
    cmd.setProperty ("mode", mode);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.hangUp = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.HANG_UP);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.turnSlic = function (extension) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.TURN_SLIC);
    cmd.setProperty ("extension", extension);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.turnGroup = function (groupName) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.TURN_GROUP);
    cmd.setProperty ("group", groupName);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestIntercept = function (extension) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_INTERCEPT);
    cmd.setProperty ("extension", extension);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestSlic = function (extension) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_SLIC);
    cmd.setProperty ("extension", extension);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.callSeat = function (extension) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.CALL_SEAT);
    cmd.setProperty ("extension", extension);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.listenSlic = function (extension) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.LISTEN_SLIC);
    cmd.setProperty ("extension", extension);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.insertSlic = function (extension) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.INSERT_SLIC);
    cmd.setProperty ("extension", extension);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.doNotDisturb = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.DONOT_DISTURB);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}

CtiLink.prototype.muteOn = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.MUTE_ON);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.muteOff = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.MUTE_OFF);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.flash = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.FLASH);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.requestSetTransfer = function (mode, callee) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REQUEST_SET_TRANSFER);
    cmd.setProperty ("mode", mode);
    cmd.setProperty ("callee", callee);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.refuse = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.REFUSE);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.answerCall = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.ANSWER_CALL);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.connectQueue = function (caller) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.CONNECT_QUEUE);
    cmd.setProperty ("caller", caller);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

//拨号
CtiLink.prototype.callOut = function (callee, caller, params) {
    if (this.assertConnected ()) {
        var msg = "";
        var cmd = new CtiMsg ();
        var cmd = cmd.getCMD (this.agent, CmdResource.CALL_OUT);
        cmd.setProperty ("callee", callee);
        cmd.setProperty ("caller", caller);
        cmd.setProperty ("args", params);
        msg = cmd.getMsg ();
        this.wSSend (msg);
    }
}

//坐席呼叫ivr流程
CtiLink.prototype.callIvr = function (callee, caller, params) {
    if (this.assertConnected ()) {
        var msg = "";
        var cmd = new CtiMsg ();
        var cmd = cmd.getCMD (this.agent, CmdResource.CALL_IVR);
        cmd.setProperty ("callee", callee);
        cmd.setProperty ("caller", caller);
        cmd.setProperty ("args", params);
        msg = cmd.getMsg ();
        this.wSSend (msg);
    }
}

//发送按键信息
CtiLink.prototype.sendDtmf = function (dtmf, dtmf_type) {
    if (this.assertConnected ()) {
        var msg = "";
        var cmd = new CtiMsg ();
        var cmd = cmd.getCMD (this.agent, CmdResource.SEND_DTMF);
        cmd.setProperty ("dtmf", dtmf);
        if (typeof (dtmf_type) != "undefined") {
            cmd.setProperty ("dtmf_type", dtmf_type);
        }
        msg = cmd.getMsg ();
        this.wSSend (msg);
    }
}

//拨号
CtiLink.prototype.reSet = function (agentName) {
    if (this.assertConnected ()) {
        var msg = "";
        var cmd = new CtiMsg ();
        var cmd = cmd.getCMD (this.agent, CmdResource.RESET);
        if (typeof (agentName) == "undefined" || agentName == "") {
        
        } else {
            cmd.setProperty ("targetusername", agentName);
        }
        msg = cmd.getMsg ();
        this.wSSend (msg);
    }
}

CtiLink.prototype.changeStatus = function (status) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.CHANGE_STATUS);
    cmd.setProperty ("status", status);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.playFile = function (fullFilePath) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.PLAY_FILE);
    cmd.setProperty ("filename", fullFilePath);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.turnOut = function (callee) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.TURN_OUT);
    cmd.setProperty ("callee", callee);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.getAllStatus = function () {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.GET_ALL_STATUS);
    msg = cmd.getMsg ();
    this.wSSend (msg);
    
}

CtiLink.prototype.subscribe = function (isSubscribe) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.SUBSCRIBE);
    var modeStr = isSubscribe == 1 ? "true" : "false";
    cmd.setProperty ("param", modeStr);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

/**
 *
 * @param enable 参数enable = 1 执行fastcall_realtime_detect_speech_start ，否则执行fastcall_realtime_detect_speech_stop
 * @param serviceId 识别id
 *        realTimeIdentification 实时识别功能为2 ，数据推送的指定http地址
 * @param releaseEndIdentification 释放哪端实时识别 0 坐席 1 客户 both 两端
 */
CtiLink.prototype.askForAssistanceStart = function (serviceId,releaseEndIdentification) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.ASK_FOR_ASSISTANCE);
    var realTimeIdentification=2 //实时识别功能 0 只识别，不推送。2 又识别，又推送
    cmd.setProperty ("enable","1");
    cmd.setProperty ("args","detect:fastcall_asr:service_id="+serviceId+" "+realTimeIdentification+" "+releaseEndIdentification);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}
/**
 *
 * @param releaseEndIdentification 释放哪端实时识别 0 坐席 1 客户 both 两端
 */
CtiLink.prototype.askForAssistanceStop = function (releaseEndIdentification) {
    this.assertConnected ();
    var msg = "";
    var cmd = new CtiMsg ();
    var cmd = cmd.getCMD (this.agent, CmdResource.ASK_FOR_ASSISTANCE);
    cmd.setProperty ("enable","0");
    cmd.setProperty ("args",releaseEndIdentification);
    msg = cmd.getMsg ();
    this.wSSend (msg);
}

CtiLink.prototype.getAgentInfo = function () {
    return this.agent;
}

CtiLink.prototype.setDebug = function (debugEn) {
    this.debugEn = debugEn;
}

CtiLink.prototype.getCopyright = function () {
    return CmdResource.COPYRIGHT;
}

CtiLink.prototype.getVer = function () {
    return CmdResource.VER;
}

CtiLink.prototype.onLogout = function (reason) {
}

CtiLink.prototype.onChangeSkillGroup = function (skillGroup, request, info) {
}

CtiLink.prototype.assertConnected = function () {
    return this.agent.status;
}

CtiLink.prototype.onTurnSlic = function (info) {
    return;
}

CtiLink.prototype.onStatus = function (targetUserName, status, statustime, caller, callee, extension) {
    return;
}
CtiLink.prototype.onUserData = function (data) {
    return;
}

CtiLink.prototype.onStatus_note = function (targetUserName, status, statustime) {
    return;
}

CtiLink.prototype.onAnswer = function (caller, callee, confno, callNo, fileName) {
    return;
}

CtiLink.prototype.onMsg = function (username, msg) {
    return;
}
CtiLink.prototype.onAsrResult = function (msg, channel_type) {
    return;
}

CtiLink.prototype.onRequestRest = function (response, msg) {
    return;
}

CtiLink.prototype.onRequestIdle = function (response, msg) {
    return;
}

CtiLink.prototype.onDoNotDisturb = function (response, msg) {
    return;
}

CtiLink.prototype.onCallOut = function (response, msg) {
    return;
}
CtiLink.prototype.onCallIvr = function (response, msg) {
    return;
}
CtiLink.prototype.onWorkBusy = function (response, msg) {
    return;
}

CtiLink.prototype.onWorkFree = function (response, msg) {
    return;
}

CtiLink.prototype.onDialFail = function (caller, callee, confno, callNo, reason) {
    return;
}

CtiLink.prototype.onDialing = function (caller, callee, confno, callNo) {
    return;
}

CtiLink.prototype.onDialSuccess = function (caller, callee, confno, callNo, fileName) {
    return;
}

CtiLink.prototype.onNoAnswer = function (caller, callee, confno, callNo) {
    return;
}

CtiLink.prototype.onOffHook = function (extension) {
    return;
}

CtiLink.prototype.onOffTalk = function (caller, callee, confno, callNo, endDirection) {
    return;
}

CtiLink.prototype.onOnHook = function (caller, callee, callno, confno, icalltype, hangup_disposition) {
    return;
}

CtiLink.prototype.onQueue = function (callers) {
    return;
}

CtiLink.prototype.onQueueOff = function (callers) {
    return;
}

CtiLink.prototype.onRing = function (callee, caller, callNo, confno, icalltype, msg, no, project_no, task_no, ts,xfer_type,xfer_ext) {
}


CtiLink.prototype.OnCreatEmonitor = function (callee, caller, callNo, confno, icalltype, msg, no, project_no, task_no, ts) {
    return;
}

CtiLink.prototype.onReleaseMonitor = function (callee, caller, callNo, confno, icalltype, msg, no, project_no, task_no, ts) {
    return;
}

CtiLink.prototype.OnStartlistenmonitor = function (callNo, info) {
    return;
}

CtiLink.prototype.onMonitorMsg = function (callee, caller, callNo, confno, icalltype, msg, no, project_no, task_no, ts) {
    return;
}

CtiLink.prototype.onTalkMonitor = function (request, info) {
    return;
}

CtiLink.prototype.onMonitor = function (msg) {
    return;
}

CtiLink.prototype.onLoginFail = function (msg) {
    return;
}

CtiLink.prototype.onLoginSuccess = function (code, msg) {
    return;
}
CtiLink.prototype.onSubscribe = function (response, msg) {
    return;
}
CtiLink.prototype.onSubscribeClientStatus = function (response, msg) {
    return;
}

CtiLink.prototype.onError = function (msg) {
    return;
}

CtiLink.prototype.onMuteOn = function (response, msg) {
    return;
}

CtiLink.prototype.onMuteOff = function (response, msg) {
    return;
}

CtiLink.prototype.onAskFoRAssistance = function () {
    return;
}

CtiLink.prototype.onDipatchError = function (xmlstr) {
    return;
}

CtiLink.prototype.onDisconnected = function (reason) {
    return;
}

CtiLink.prototype.setDebug = function (debugEn) {
    this.debug = debugEn;
}


CtiLink.prototype.onRx = function (msg) {
    if (this.debug) {
        console.log (msg);
    }
    return;
}
