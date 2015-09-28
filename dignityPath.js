var DignityPath = function() {
	DignityObject.call(this);

	this.from = [];
    this.subPaths = [];
    this.to = [];
    this.isPong = false;
    this.randomable = false;
    this.randomRange = 0;
    this.map = [[]];
    
    this.movementPath = [];
    this.movementPathCurrent = 0;
};

DignityPath.prototype = Object.create(DignityObject.prototype);
DignityPath.prototype.constructor = DignityPath;

DignityPath.prototype.findPath = function()
{
    var world = this.map;
    
    var worldWidth = world[0].length;
	var worldHeight = world.length;
	var worldSize =	worldWidth * worldHeight;
    
    var pathStart = this.from;
    var pathEnd = this.to;
    
    if(this.randomable) {
        var randomX = Math.floor((Math.random() * (worldWidth-2-this.randomRange)) + 1);
        var randomY = Math.floor((Math.random() * (worldHeight-2-this.randomRange)) + 1);

        var usageInfo = this.map[randomX][randomY];
        while(usageInfo === 1) {
            randomX = Math.floor((Math.random() * (worldWidth-2)) + 1);
            randomY = Math.floor((Math.random() * (worldHeight-2)) + 1);
            usageInfo = this.map[randomX][randomY];
        }
        
        pathEnd = [randomX,randomY];
    }

	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;

	var maxWalkableTileNum = 0;

//	var distanceFunction = ManhattanDistance;
//	var findNeighbours = function(){}; // empty

//  alternate heuristics, depending on your game:

//  diagonals allowed but no sqeezing through cracks:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighbours;

//	diagonals and squeezing through cracks allowed:
//	var distanceFunction = DiagonalDistance;
//	var findNeighbours = DiagonalNeighboursFree;
//
//	euclidean but no squeezing through cracks:
//	var distanceFunction = EuclideanDistance;
//	var findNeighbours = DiagonalNeighbours;
//
//	euclidean and squeezing through cracks allowed:
//	var distanceFunction = EuclideanDistance;
//	var findNeighbours = DiagonalNeighboursFree;


	function ManhattanDistance(Point, Goal)
	{
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	function DiagonalDistance(Point, Goal)
	{
		return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
	}

	function EuclideanDistance(Point, Goal)
	{
		return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
	}

	function Neighbours(x, y)
	{
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	}

	function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
	{
		if(myN)
		{
			if(myE && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myW && canWalkHere(W, N))
			result.push({x:W, y:N});
		}
		if(myS)
		{
			if(myE && canWalkHere(E, S))
			result.push({x:E, y:S});
			if(myW && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result)
	{
		myN = N > -1;
		myS = S < worldHeight;
		myE = E < worldWidth;
		myW = W > -1;
		if(myE)
		{
			if(myN && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myS && canWalkHere(E, S))
			result.push({x:E, y:S});
		}
		if(myW)
		{
			if(myN && canWalkHere(W, N))
			result.push({x:W, y:N});
			if(myS && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	function canWalkHere(x, y)
	{
		return ((world[x] != null) &&
			(world[x][y] != null) &&
			(world[x][y] <= maxWalkableTileNum));
	};

	function Node(Parent, Point)
	{
		var newNode = {
			Parent:Parent,
			value:Point.x + (Point.y * worldWidth),
			x:Point.x,
			y:Point.y,
			f:0,
			g:0
		};

		return newNode;
	}

	function calculatePath()
	{
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		var AStar = new Array(worldSize);
		var Open = [mypathStart];
		var Closed = [];
		var result = [];
		var myNeighbours;
		var myNode;
		var myPath;
		var length, max, min, i, j;
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			myNode = Open.splice(min, 1)[0];
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				AStar = Closed = Open = [];
				result.reverse();
			}
			else
			{
				myNeighbours = Neighbours(myNode.x, myNode.y);
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						Open.push(myPath);
						AStar[myPath.value] = true;
					}
				}
				Closed.push(myNode);
			}
		}
		return result;
	}

	this.movementPath = calculatePath();
    this.movementPathCurrent = 0;
};
