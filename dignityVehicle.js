var DignityVehicle = function() {
	DignityAIBase.call(this);
    
    this.engineLife = 100;
    this.driveSpeed = 1;
    
    this.onAir = false;
    this.onSea = false;
    this.onRail = false;
    this.onRoad = false;

    this.updateSpeed();
};

DignityVehicle.prototype = Object.create(DignityAIBase.prototype);
DignityVehicle.prototype.constructor = DignityVehicle;

DignityVehicle.prototype.updateSpeed = function() {
    this.speed = this.driveSpeed * (this.engineLife/100);
};

//call for crash other vehicles
DignityVehicle.prototype.crashVehicle = function(damage) {
    if(damage > 0) {
        this.engineLife -= damage;
        this.updateSpeed();
    }

    if(this.engineLife <= 0) {
        this.stopEngine();
    }
};

DignityVehicle.prototype.stopEngine = function() {
    this.speed = 0;
};

DignityVehicle.prototype.repairEngine = function(repairValue) {
    if(repairValue > 0) {
        this.engineLife += repairValue;
        this.updateSpeed();
    }
};

DignityVehicle.prototype.detectedFriend = function(entity) {
    console.log('vehicle detectedFriend action');
};

DignityVehicle.prototype.detectedEnemy = function(entity) {
    console.log('vehicle detectedEnemy action');
    this.bullets = this.appContext.root.getChildren()[0].script.bullets;

    this.shoot(this.bullets, entity);
};
