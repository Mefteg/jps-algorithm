"use strict";

var Utils = require('utils');
var JPS = require('jps');


var mapWidth	= 10;
var mapHeight	= 7;
var map 		= new Utils.Map(mapWidth, mapHeight);
map.values = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

var source	= new Utils.Coord(1, 2);
map.set(source.x, source.y, 2);
var destination	= new Utils.Coord(mapWidth - 2, mapHeight - 2);
map.set(destination.x, destination.y, 3);

var currentCoord 		= new Utils.Coord(source.x, source.y);
var currentDirection 	= Utils.DirectionEnum.East;

var coords = [];

JPS.goStraight(map, currentCoord, Utils.DirectionEnum.East, destination, coords);
JPS.goStraight(map, currentCoord, Utils.DirectionEnum.West, destination, coords);
JPS.goStraight(map, currentCoord, Utils.DirectionEnum.North, destination, coords);
JPS.goStraight(map, currentCoord, Utils.DirectionEnum.South, destination, coords);

JPS.goDiagonnally(map, currentCoord, Utils.DirectionEnum.NorthEast, destination, coords);
JPS.goDiagonnally(map, currentCoord, Utils.DirectionEnum.NorthWest, destination, coords);
JPS.goDiagonnally(map, currentCoord, Utils.DirectionEnum.SouthEast, destination, coords);
JPS.goDiagonnally(map, currentCoord, Utils.DirectionEnum.SouthWest, destination, coords);

console.log("results:");
for (var i=0; i<coords.length; ++i)
{
	console.log(coords[i].toString());
}

console.log("map:");
console.log(map.toString());