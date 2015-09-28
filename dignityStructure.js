var DignityStructure = function() {
	DignityAIBase.call(this);

	this.destroyable = true;

    this.storeCapacity = 0;
    this.storeObjects = [];

    this.outputObject = null;
    this.outputObjects = [];
    this.outputTime = 0;
};

DignityStructure.prototype = Object.create(DignityAIBase.prototype);
DignityStructure.prototype.constructor = DignityStructure;

DignityStructure.prototype.destroy = function() {
    if(this.destroyable) {
        this.storeCapacity = 0;
        this.storeObjects = [];
        this.outputObjects = [];
        this.outputTime = 0;
    }
};

DignityStructure.prototype.store = function(_dignityObject) {
    if(this.storeCapacity > 0 && this.storeCapacity < this.storeObjects.length) {
        this.storeObjects.push(_dignityObject);
    }
};

DignityStructure.prototype.generate = function(isStoreObject) {
    if(this.outputTime > 0) {
        window.setTimeout(this.pushOutput, this.outputTime, isStoreObject);
    } else {
        this.pushOutput(isStoreObject);
    }
};

DignityStructure.prototype.pushOutput = function(isStoreObject) {
    this.outputObjects.push(this.outputObject);
    if(isStoreObject) {
        this.store(this.outputObject);
    }
};
