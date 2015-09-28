var DignityAction = function () {
	DignityObject.call(this);

    this.createObj = null;
    this.createObjPos = null;
    
    this.destroyObj = new DignityAIBase;
    this.destroyLevel = 0;
    
    this.upgradeObj = null;
    this.upgradeObjPropName = "";
    this.upgradeObjIncVal = 0;
    this.upgradeObjNewVal = 0;
    
    this.moveObj = new DignityAIBase;
    this.moveFollowObj = null;
    
    this.senseObj = new DignityAIBase;
    this.senseRadius = 0;
    this.senseTriggerTime = 0;
    
    this.customActionObj = null;
    this.customActionName = "";

	this.ammo = 0;
    this.fireSpeed = 0;
    this.maxTurnAngle = 0;
};

DignityAction.prototype = Object.create(DignityObject.prototype);
DignityAction.prototype.constructor = DignityAction;

DignityAction.prototype.create = function () {
    var _createdObject = this.createObj.clone();
    this.createObj.setPosition(this.createObjPos);
};

DignityAction.prototype.destroy= function () {
    this.destroyObj.life -= this.destroyLevel;
};

DignityAction.prototype.upgrade= function () {
    if(this.upgradeObj.hasOwnProperty(this.upgradeObjPropName)) {
        if(this.upgradeObjIncVal > 0) {
            this.upgradeObj[this.upgradeObjPropName] += this.upgradeObjIncVal; 
        } else if(this.upgradeObjNewVal > 0) {
            this.upgradeObj[this.upgradeObjPropName] = this.upgradeObjNewVal;
        }
    }
};

DignityAction.prototype.move= function () {
    if(this.moveObj != null) {
        this.moveObj.moveStart = true;
        this.moveObj.moveEnd = false;
    }
};

DignityAction.prototype.sense= function () {
    if(this.senseObj != null) {
        this.senseObj.senseRadius = this.senseRadius;
        this.senseObj.senseStart = true;
        this.senseObj.senseEnd = false;
    }
};

DignityAction.prototype.custom = function() {
    this.customActionObj[this.customActionName]();
};
