function DignityHuman() {
	DignityAIBase.call(this);

	this.senseEnemySpeed = 0;
    this.isFindCover = false;
    this.fearEnemyLevel = 0;
};

DignityHuman.prototype = Object.create(DignityAIBase.prototype);
DignityHuman.prototype.constructor = DignityHuman;

DignityHuman.prototype.detectedFriend = function(entity) {
    console.log('human detectedFriend action');
};

DignityHuman.prototype.detectedEnemy = function(entity) {
    console.log('human detectedEnemy action');
    this.bullets = this.appContext.root.getChildren()[0].script.bullets;

    this.shoot(this.bullets, entity);
};

DignityHuman.prototype.detectedOther = function(entity) {
    console.log('detectedOther action base');
    var name = result.entity.getName();

    if(this.isFindCover) {
        if(name.indexOf('cover') >= 0) {
            this.coverObject(entity);
        }
    }
};

DignityHuman.prototype.coverObject = function(entity) {
    console.log("human cover object");
    this.speed = 0;
};
