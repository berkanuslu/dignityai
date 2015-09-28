function DignityMission() {
	DignityObject.call(this);
	this.desc = "";
        
    this.actionStart = new DignityAction; //execute action when start mission
    this.actionStartName = ""; //method name for action start
    this.actionEnd = new DignityAction; //execute action when end mission
    this.actionEndName = ""; //method name for action end
    this.actionTime = new DignityAction; //execute action when timing mission
    this.actionTimeName = ""; //method name for action time

    this.finishTime = 0; //run end action for after finishTime
    this.time = 0; //time milisecond for actionTime
    this.continuous = false; //if true actionTime works continuously, execute each time interval
    this.async = false; //actions start same time
    this.end = false; //learn for mission end to execute actionEnd
};

DignityMission.prototype = Object.create(DignityObject.prototype);
DignityMission.prototype.constructor = DignityMission;

DignityMission.prototype.executeAction = function(_dignityObject, _name) {
    _dignityObject[_name]();
};

DignityMission.prototype.executeEndAction = function() {
    if(this.actionEndName !== "")
        this.actionEnd[this.actionEndName]();
};

DignityMission.prototype.execute = function() {
    if(this.finishTime > 0) {
        this.executeAction(this.actionStart, this.actionStartName);
        window.setTimeout(this.executeAction, this.finishTime, this.actionEnd, this.actionEndName);
    } else if(this.time <= 0) {
        if(this.end) {
            this.executeAction(this.actionEnd, this.actionEndName);
        }
        else {
            this.executeAction(this.actionStart, this.actionStartName);
        }
    }
    
    if(this.time > 0) {
        if(this.continuous) {
            window.setInterval(this.executeAction, this.time, this.actionTime, this.actionTimeName); //run every time seconds
        } else {
            window.setTimeout(this.executeAction, this.time, this.actionTime, this.actionTimeName); //run once after time seconds
        }
    }
};
