"use strict";

var DirectionEnum = {
	North: 		0,
	NorthEast: 	1,
	East: 		2,
	SouthEast: 	3,
	South: 		4,
	SouthWest: 	5,
	West: 		6,
	NorthWest: 	7
};

var Coord = function(_x, _y)
{
	this.x = _x;
	this.y = _y;

	this.equals = function(_coord)
	{
		return this.x == _coord.x && this.y == _coord.y;
	};

	this.isValid = function()
	{
		return (this.x != -1 && this.y != -1);
	}

	this.toString = function()
	{
		return "(" + this.x + ", " + this.y + ")";
	}
};

var Map = function(_width, _height)
{
	this.width = _width;
	this.height = _height;

	this.values = new Array(this.width * this.height); // set size


	this.get = function(_x, _y)
	{
		return this.values[_y * this.width + _x];
	};

	this.set = function(_x, _y, _value)
	{
		this.values[_y * this.width + _x] = _value;
	};

	this.toString = function()
	{
		var str = "";
		for (var i=0; i<this.height; ++i)
		{
			str += "[";
			for (var j=0; j<this.width; ++j)
			{
				if (j == 0)
				{
					str += "" + this.get(j, i);
				}
				else
				{
					str += ", " + this.get(j, i);
				}
			}
			str += "]\n";
		}

		return str;
	};
};


function isStraightDirection(_direction)
{
	return	(	_direction == DirectionEnum.North || _direction == DirectionEnum.South 
			|| 	_direction == DirectionEnum.East || _direction == DirectionEnum.West);
}

function isForcedNeighborAround(_map, _coord, _direction)
{
	var x = _coord.x;
	var y = _coord.y;

	switch(_direction)
	{
		case DirectionEnum.East:
		{
			return ((_map.get(x, y-1) == 0 && _map.get(x+1, y-1) > 0)) || ((_map.get(x, y+1) == 0 && _map.get(x+1, y+1) > 0));
		}
		case DirectionEnum.West:
		{
			return ((_map.get(x, y-1) == 0 && _map.get(x-1, y-1) > 0)) || ((_map.get(x, y+1) == 0 && _map.get(x-1, y+1) > 0));
		}
		case DirectionEnum.North:
		{
			return ((_map.get(x+1, y) == 0 && _map.get(x+1, y-1) > 0)) || ((_map.get(x-1, y) == 0 && _map.get(x-1, y-1) > 0));
		}
		case DirectionEnum.South:
		{
			return ((_map.get(x+1, y) == 0 && _map.get(x+1, y+1) > 0)) || ((_map.get(x-1, y) == 0 && _map.get(x-1, y+1) > 0));
		}
		case DirectionEnum.NorthEast:
		{
			return ((_map.get(x-1, y) == 0 && _map.get(x-1, y-1) > 0)) || ((_map.get(x, y+1) == 0 && _map.get(x+1, y+1) > 0));
		}
		case DirectionEnum.NorthWest:
		{
			return ((_map.get(x+1, y) == 0 && _map.get(x+1, y-1) > 0)) || ((_map.get(x, y+1) == 0 && _map.get(x-1, y+1) > 0));
		}
		case DirectionEnum.SouthEast:
		{
			return ((_map.get(x-1, y) == 0 && _map.get(x-1, y+1) > 0)) || ((_map.get(x, y-1) == 0 && _map.get(x+1, y-1) > 0));
		}
		case DirectionEnum.SouthWest:
		{
			return ((_map.get(x+1, y) == 0 && _map.get(x+1, y+1) > 0)) || ((_map.get(x, y-1) == 0 && _map.get(x-1, y-1) > 0));
		}
	}
}

function goStraight(_map, _parentCoord, _parentDirection, _destination, _coords)
{
	var stepX = 0;
	var stepY = 0;

	switch(_parentDirection)
	{
		case DirectionEnum.East:
		{
			stepX = 1;
			break;
		}
		case DirectionEnum.West:
		{
			stepX = -1;
			break;
		}
		case DirectionEnum.North:
		{
			stepY = -1;
			break;
		}
		case DirectionEnum.South:
		{
			stepY = 1;
			break;
		}
	}

	var currentCoord 		= new Coord(_parentCoord.x + stepX, _parentCoord.y + stepY);
	while (currentCoord.x >= 0 && currentCoord.x < _map.width && currentCoord.y >= 0 && currentCoord.y < _map.height)
	{
		if (_map.get(currentCoord.x, currentCoord.y) == 0)
		{
			return;
		}
		
		_map.set(currentCoord.x, currentCoord.y, 5);

		if (currentCoord.equals(_destination) || isForcedNeighborAround(_map, currentCoord, _parentDirection))
		{
			_coords.push(currentCoord);

			return;
		}

		currentCoord.x += stepX;
		currentCoord.y += stepY;
	}
}

function goDiagonnally(_map, _parentCoord, _parentDirection, _destination, _coords)
{
	var stepX = 0;
	var stepY = 0;

	var verticalDirection 	= DirectionEnum.North;
	var horizontalDirection = DirectionEnum.East;

	switch(_parentDirection)
	{
		case DirectionEnum.NorthEast:
		{
			stepX = 1;
			stepY = -1;
			verticalDirection 	= DirectionEnum.North;
			horizontalDirection = DirectionEnum.East;
			break;
		}
		case DirectionEnum.NorthWest:
		{
			stepX = -1;
			stepY = -1;
			verticalDirection 	= DirectionEnum.North;
			horizontalDirection = DirectionEnum.West;
			break;
		}
		case DirectionEnum.SouthEast:
		{
			stepX = 1;
			stepY = 1;
			verticalDirection 	= DirectionEnum.South;
			horizontalDirection = DirectionEnum.East;
			break;
		}
		case DirectionEnum.SouthWest:
		{
			stepX = -1;
			stepY = 1;
			verticalDirection 	= DirectionEnum.South;
			horizontalDirection = DirectionEnum.West;
			break;
		}
	}

	var currentCoord = new Coord(_parentCoord.x + stepX, _parentCoord.y + stepY);
	while (currentCoord.x >= 0 && currentCoord.x < _map.width && currentCoord.y >= 0 && currentCoord.y < _map.height)
	{
		if (_map.get(currentCoord.x, currentCoord.y) > 0)
		{
			_map.set(currentCoord.x, currentCoord.y, 6);

			if (currentCoord.equals(_destination) || isForcedNeighborAround(_map, currentCoord, _parentDirection))
			{
				_coords.push(currentCoord);
				break;
			}
			else
			{
				var tmpCoords = [];
				goStraight(_map, currentCoord, verticalDirection, _destination, tmpCoords);
				goStraight(_map, currentCoord, horizontalDirection, _destination, tmpCoords);
				if (tmpCoords.length > 0)
				{
					_coords.push(currentCoord);
		console.log(_parentCoord.toString(), currentCoord.toString(), _parentDirection);
		console.log(tmpCoords);
					break;
				}
			}

			currentCoord.x += stepX;
			currentCoord.y += stepY;
		}
		else
		{
			break;
		}
	}
}


/* --------------------------------------------------------- */


var mapWidth	= 10;
var mapHeight	= 7;
var map 		= new Map(mapWidth, mapHeight);
map.values = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

var source	= new Coord(1, 2);
map.set(source.x, source.y, 2);
var destination	= new Coord(mapWidth - 2, mapHeight - 2);
map.set(destination.x, destination.y, 3);

var currentCoord 		= new Coord(source.x, source.y);
var currentDirection 	= DirectionEnum.East;

var coords = [];

goStraight(map, currentCoord, DirectionEnum.East, destination, coords);
goStraight(map, currentCoord, DirectionEnum.West, destination, coords);
goStraight(map, currentCoord, DirectionEnum.North, destination, coords);
goStraight(map, currentCoord, DirectionEnum.South, destination, coords);

goDiagonnally(map, currentCoord, DirectionEnum.NorthEast, destination, coords);
goDiagonnally(map, currentCoord, DirectionEnum.NorthWest, destination, coords);
goDiagonnally(map, currentCoord, DirectionEnum.SouthEast, destination, coords);
goDiagonnally(map, currentCoord, DirectionEnum.SouthWest, destination, coords);

console.log("results:");
for (var i=0; i<coords.length; ++i)
{
	console.log(coords[i].toString());
}

console.log("map:");
console.log(map.toString());