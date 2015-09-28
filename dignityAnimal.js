function DignityAnimal() {
	DignityAIBase.call(this);

	this.type = "";
    this.isHuntHuman = false;
    this.isHuntSameType = false;
    this.isLiveCrowd = false;
};

DignityAnimal.prototype = Object.create(DignityAIBase.prototype);
DignityAnimal.prototype.constructor = DignityAnimal;

DignityAnimal.prototype.detectedFriend = function(entity) {
    console.log('human detectedFriend action');
    if(this.isHuntHuman) {
        if(entity.getName().indexOf('human') >= 0) {
            this.huntHuman(entity);
        }
    }

    if(this.isHuntSameType) {
        if(entity.getName().indexOf('animal') >= 0) {
            this.huntAnimal(entity);
        }
    }
};

DignityAnimal.prototype.detectedEnemy = function(entity) {
    console.log('human detectedEnemy action');
    this.bullets = this.appContext.root.getChildren()[0].script.bullets;

    this.shoot(this.bullets, entity);
};

DignityAnimal.prototype.huntHuman = function(entity) {
    console.log('human hunting');
    this.bullets = this.appContext.root.getChildren()[0].script.bullets;

    this.shoot(this.bullets, entity);
};

DignityAnimal.prototype.huntAnimal= function(entity) {
    console.log('animal hunting');
    this.bullets = this.appContext.root.getChildren()[0].script.bullets;

    this.shoot(this.bullets, entity);
};
