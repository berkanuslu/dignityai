function DignityAIBase() {
	DignityObject.call(this);

    this.parentObject = null;

    this.bullets = null;

    this.life = 100;
    this.value = 0;
    this.level = 0;
    
    //move speed
    this.speed = 1;
    
    this.missionList = [];
    this.missionIndex = 0;
    
    //for sense
    this.friendList = [];
    this.enemyList = [];
    this.obstacleList = [];
    this.collectableList = [];
    this.ignoreList = [];
    
    this.pathList = [];
    this.pathIndex = 0;
    
    this.moveStart = false;
    this.moveEnd = false;
    
    this.senseRadius = 1;
    this.senseStart = false;
    this.senseEnd = false;

    //if it has a collected object
    this.collectedObjects = [];
};

DignityAIBase.prototype = Object.create(DignityObject.prototype);
DignityAIBase.prototype.constructor = DignityAIBase;

DignityAIBase.prototype.start = function() {
    //run async missons first
    for (var i = 0; i < this.missionList.length; i++) {
        if(this.missionList[i].async) {
            this.missionList[i].execute();
        }
    }
    
    if(!this.missionList[this.missionIndex].async)
        this.missionList[this.missionIndex].execute();
};

DignityAIBase.prototype.executeMission = function() {
    this.missionList[this.missionIndex].execute();
};

DignityAIBase.prototype.nextMission = function() {
    if(this.missionList.length > 0 && this.missionIndex < this.missionList.length) {
        this.missionIndex++;   
    } else {
        this.missionIndex = 0;
    }
};

DignityAIBase.prototype.prevMission = function() {
    if(this.missionList.length > 0 && this.missionIndex > 0) {
        this.missionIndex--;   
    } else {
        this.missionIndex = 0;
    }
};

DignityAIBase.prototype.nextPath = function() {
    if(this.pathList.length > 0 && this.pathIndex < this.pathList.length) {
        this.pathIndex++;   
    } else {
        this.pathIndex = 0;
    }
};

DignityAIBase.prototype.prevPath = function() {
    if(this.pathList.length > 0 && this.pathIndex > 0) {
        this.pathIndex--;   
    } else {
        this.pathIndex = 0;
    }
};

DignityAIBase.prototype.move = function(obj) {
    if(this.moveStart && !this.moveEnd) {
        if(this.pathList.length > 0 && this.pathIndex < this.pathList.length) {
            var path = this.pathList[this.pathIndex];
            var pathLength = path.movementPath.length;
            if( pathLength > 0 && path.movementPathCurrent < pathLength) {
                var x = 0.5 + (path.movementPath[path.movementPathCurrent][1]*1);
                var z = 47.5 - (path.movementPath[path.movementPathCurrent][0]*1);

                obj.movePoint = new pc.Vec3(x, 0, z);
                var pos = obj.entity.getPosition();
                var tmpVec = new pc.Vec3();
                tmpVec.lerp(pos, obj.movePoint, 0.025);
                obj.entity.setPosition(tmpVec);

                if(pos.x.toFixed(1) > (x.toFixed(1)-1) && pos.z.toFixed(1) > (z.toFixed(1)-1)) {
                    path.movementPathCurrent++;
                    console.log('current movePath: '+path.movementPathCurrent);
                }
                if(path.movementPathCurrent === path.movementPath.length) {
                    this.nextPath();
                    this.moveEnd = true;
                    this.moveStart = false;
                    var currentMission = this.missionList[this.missionIndex];
                    if(currentMission.actionEnd != null) {
                        currentMission.end = true;
                        currentMission.executeEndAction();
                        this.nextMission();
                    }
                }
            }
        }
    }
};

DignityAIBase.prototype.sense = function(obj,context) {
    if(this.senseStart && !this.senseEnd) {
        var currentPos = obj.entity.getPosition();
        currentPos.x = Math.floor(currentPos.x);
        currentPos.z = Math.floor(currentPos.z);
        currentPos.y = 0.0;
        var ray1 = currentPos.clone(),
        ray2 = currentPos.clone(),
        ray3 = currentPos.clone(),
        ray4 = currentPos.clone(),
        ray5 = currentPos.clone();
        
        var _facing = "front";

        var rayRadius1 = this.senseRadius * 6;
        var rayRadius2 = this.senseRadius * 2;
        var rayRadius3 = this.senseRadius * 1;


        switch(_facing){
            case "left":
                ray1.x -=rayRadius1;
                ray2.x -=rayRadius1;
                ray3.x -=rayRadius1;
                ray4.x -=rayRadius1;
                ray5.x -=rayRadius1;

                ray2.z +=rayRadius2;
                ray3.z -=rayRadius2;
                ray4.z +=rayRadius3;
                ray5.z -=rayRadius3;
                break;
            case "right":
                ray1.x +=rayRadius1;
                ray2.x +=rayRadius1;
                ray3.x +=rayRadius1;
                ray4.x +=rayRadius1;
                ray5.x +=rayRadius1;

                ray2.z +=rayRadius2;
                ray3.z -=rayRadius2;
                ray4.z +=rayRadius3;
                ray5.z -=rayRadius3;
                break;
            case "front":
                ray1.z +=rayRadius1;
                ray2.z +=rayRadius1;
                ray3.z +=rayRadius1;
                ray4.z +=rayRadius1;
                ray5.z +=rayRadius1;

                ray2.x +=rayRadius2;
                ray3.x -=rayRadius2;
                ray4.x +=rayRadius3;
                ray5.x -=rayRadius3;
                break;
            case "back":
                ray1.z -=rayRadius1;
                ray2.z -=rayRadius1;
                ray3.z -=rayRadius1;
                ray4.z -=rayRadius1;
                ray5.z -=rayRadius1;

                ray2.x +=rayRadius2;
                ray3.x -=rayRadius2;
                ray4.x +=rayRadius3;
                ray5.x -=rayRadius3;
                break;
        }

        this.cast(context,obj,ray1.x, ray1.y, ray1.z);
        this.cast(context,obj,ray2.x, ray2.y, ray2.z);
        this.cast(context,obj,ray3.x, ray3.y, ray3.z);
        this.cast(context,obj,ray4.x, ray4.y, ray4.z);
        this.cast(context,obj,ray5.x, ray5.y, ray5.z);
    }
};

DignityAIBase.prototype.cast = function(context,obj,x,y,z) {
    if(this.senseStart && !this.senseEnd) {
        var rayStart = new pc.Vec3();
        var rayEnd = new pc.Vec3(x, y, z);
        rayStart.copy(obj.entity.getPosition());
        rayStart.y = 0.0;
        context.systems.rigidbody.raycastFirst(rayStart, rayEnd, this.findHit.bind(this));
    }
};

DignityAIBase.prototype.findHit = function(result) {
    if(this.senseStart && !this.senseEnd) {
        //split for first _ character in result object if it doesn't have it return full name
        var name = result.entity.getName().split("_")[0];

        var otherDetected = true;

        if(this.ignoreList.indexOf(name) < 0) {
            if(this.friendList.indexOf(name) >= 0) {
                console.log('detected friend: '+name);
                this.detectedFriend(result.entity);
                otherDetected = false;
            }

            if(this.enemyList.indexOf(name) >= 0) {
                console.log('detected enemy: '+name);
                this.detectedEnemy(result.entity);
                otherDetected = false;
            }

            if(this.collectableList.indexOf(name) >= 0) {
                console.log('detected collectable: '+name);
                this.detectedCollectable(result.entity);
                otherDetected = false;
            }

            if(this.obstacleList.indexOf(name) >= 0) {
                console.log('detected obstacle: '+name);
                this.detectedObstacle(result.entity);
                otherDetected = false;
            }

            if(otherDetected) {
                console.log('detected object: '+name);
                this.detectedOther(result.entity);
            }
        }
    }
};

DignityAIBase.prototype.stopSense = function() {
        this.senseEnd = true;
        this.senseStart = false;
        var currentMission = this.missionList[this.missionIndex];
        if(currentMission.actionEnd != null) {
            currentMission.end = true;
            currentMission.executeEndAction();
            this.nextMission();
        }
};

DignityAIBase.prototype.detectedFriend = function(entity) {
    console.log('detectedFriend action base');
};

DignityAIBase.prototype.detectedEnemy = function(entity) {
    console.log('detectedEnemy action base');
};

DignityAIBase.prototype.detectedCollectable = function(entity) {
    console.log('detectedCollectable action base');
};

DignityAIBase.prototype.detectedObstacle = function(entity) {
    console.log('detectedObstacle action base');
};

DignityAIBase.prototype.detectedOther = function(entity) {
    console.log('detectedOther action base');
};

DignityAIBase.prototype.shoot = function(bullets, entity) {
    console.log('shoot action base');
    bullets.new({
        id: new Date().getTime(),
        from: this.parentObject,
        tx: entity.getPosition().x,
        ty: entity.getPosition().z,
        sp: 1
    });
};
