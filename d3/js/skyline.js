// city skyline
// Jake Gluck
// jakeagluck@gmail.com
// https://github.com/jagluck/city-skyline

///////////////
// constants //
///////////////

var svg;

// [X1Y2, building]
var buildings = []
const lineGenerator = d3.line();

const sunDirrection = getSunDirrection();

const chartHeight = 600;
const chartWidth = 600;

const vanishingPointX = randomIntFromInterval((chartWidth/5), ((chartWidth/5) * 4));
const vanishingPointY = randomIntFromInterval((chartHeight/10), ((chartHeight/10) * 3));

const buildingMaxHeight = 100;
const buildingMinHeight = 50;

const buildingMaxWidth = 50;
const buildingMinWidth = 20;

const buildingMaxDepth = 10;
const buildingMinDepth = 20;

const maxDraw = 30;

var xScale = d3.scaleLinear()
             //accepts
             .domain([0, 100])
             //outputs
             .range([0, chartWidth]);

var yScale = d3.scaleLinear()
             //accepts
             .domain([0, 100])
             //outputs
             .range([0, h=chartHeight]); 

////////////////
// draw image //
////////////////

setUpImage();
drawBuildings(200);
drawVanishingPoint();

///////////////
// functions //
///////////////

function drawBuilding(buildingColor, buildingWidth, buildingHeight, buildingDepth) { 

	// we need to project 3 dimensions to 2

	////////////////////////////////////
	//      Building Points (2D)      //
	//                                //
	//       X3Y3------------X4Y3     //
	//        /              /|       //
	//       /              / |       //
	//    X1Y1-----------X2Y1 |       //
	//      |              | X4Y4     //
	//      |              | /        //
	//      |              |/         //
	//    X1Y2-----------X2Y2         //
	//                                //
	////////////////////////////////////

	////////////////////////////////////
	//         Building Sides         //
	//                                //
	//         o------F-------o       //
	//        E              G|       //
	//       /              / H       //
	//      o-------B------o  |       //
	//      |              |  o       //
	//      A              C I        //
	//      |              |/         //
	//      o-------D------o          //
	//                                //
	////////////////////////////////////

	////////////////////////////////////
	//             Axis               //
	//                                //
	//        (X)   (Y)-->            //
	//         |              ^       //
	//         |             /        //
	//         V           (Z*)       //
	//                                //
	////////////////////////////////////
	
	// calculate front square
	var X1 = randomIntFromInterval(0, (chartWidth - buildingWidth));
  	var Y1 = randomIntFromInterval((vanishingPointY - buildingHeight), (chartHeight - buildingHeight));

  	var X2 = X1 + buildingWidth;
  	var Y2 = Y1 + buildingHeight;

  	var [X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);

	var thisBuilding = [];

	if (X1 < vanishingPointX && X2 > vanishingPointX) {
		if (buildingDepth > buildingWidth){
			buildingDepth = buildingWidth;
			[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
		}
		if (Y1 > vanishingPointY){
			while (Y3 < vanishingPointY && buildingDepth > 1) {
				buildingDepth = Math.floor(buildingDepth/2);
				[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
			}
		} else if (Y1 < vanishingPointY){
			while (Y3 > vanishingPointY && buildingDepth > 1) {
				buildingDepth = Math.floor(buildingDepth/2);
				[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
			}
		}
	}else if (X2 < vanishingPointX) {
		// || ((Y3 - vanishingPointY) < 20)
		while ((X4 - X2) > maxDraw) {
			buildingDepth = Math.floor(buildingDepth/2);
			[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
		}
		while (X4 > vanishingPointX){
			buildingDepth = Math.floor(buildingDepth/2);
			[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
		}
	} else if (X1 > vanishingPointX) {
		//|| ((Y3 - vanishingPointY) < 20)

		while ((X2 - X4) > maxDraw) {
			buildingDepth = Math.floor(buildingDepth/2);
			[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
		}
		while (X3 < vanishingPointX){
			buildingDepth = Math.floor(buildingDepth/2);
			[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
		}
	}
	while (X4 - X3 < (buildingMinWidth - 5) && buildingDepth > 1){
		buildingDepth = Math.floor(buildingDepth/2);
		[X3, X4, Y3, Y4] = calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth);
	}
	
	var buildingFrontPoints = [
	    [X2, Y1],
	    [X2, Y2],
	    [X1, Y2],
	    [X1, Y1],
	    [X2, Y1],
	];	

  	var buildingTopPoints = [
	    [X1, Y1],
	    [X3, Y3],
	    [X4, Y3],
	    [X2, Y1],
	    [X1, Y1],
	];	

	var buildingSide;
	var buildingSidePoints;
	if (X1 > vanishingPointX) {
	  	buildingSidePoints = [
		    [X1, Y2],
		    [X3, Y4],
		    [X3, Y3],
		    [X1, Y1],
		    [X1, Y2],
		];	
		buildingSide = 'left';

	} else if (X2 < vanishingPointX){
	  	buildingSidePoints = [
		    [X2, Y2],
		    [X2, Y1],
		    [X4, Y3],
		    [X4, Y4],
		    [X2, Y2],
		];	
		buildingSide = 'right'
	}

	thisBuilding = drawSides(thisBuilding, buildingFrontPoints, buildingTopPoints, buildingSidePoints, buildingSide, buildingColor, Y1);
	
	buildings.push([Y2, thisBuilding]);
}

function drawSides(thisBuilding, buildingFrontPoints, buildingTopPoints, buildingSidePoints, buildingSide, buildingColor, Y1){
	
	var sideColor = buildingColor;
	var topColor = buildingColor;
	var frontColor = buildingColor;

	if (sunDirrection === 'front'){
		frontColor = shadeColor(buildingColor, 50);
	} else if (sunDirrection === 'right'){
		if (buildingSide === 'right'){
			sideColor = shadeColor(buildingColor, 50);
		}else{
			sideColor = shadeColor(buildingColor, -50);
		}
	} else if (sunDirrection === 'left'){
		if (buildingSide === 'left'){
			sideColor = shadeColor(buildingColor, 50);
		}else{
			sideColor = shadeColor(buildingColor, -50);
		}
	} else if (sunDirrection === 'top'){
		topColor = shadeColor(buildingColor, 50);
	} else if (sunDirrection === 'back'){
		frontColor = shadeColor(buildingColor, -50);
	}

	// create sides
	if (Y1 <= vanishingPointY){
		thisBuilding = drawShape(buildingFrontPoints, frontColor, thisBuilding);
		if (buildingSidePoints){
			thisBuilding = drawShape(buildingSidePoints, sideColor, thisBuilding);
		}
	} else{
		if (buildingSidePoints){
			thisBuilding = drawShape(buildingSidePoints, sideColor, thisBuilding);
		}
		thisBuilding = drawShape(buildingTopPoints, topColor, thisBuilding);
		thisBuilding = drawShape(buildingFrontPoints, frontColor, thisBuilding);
	}

	return thisBuilding;
}

function calculatePoints(X1, Y1, X2, Y2, buildingWidth, buildingHeight, buildingDepth){
	if (Y1 < vanishingPointY){
		var Y3 = Y1 + buildingDepth;
	} else {
		var Y3 = Y1 - buildingDepth;
	}
  	
  	// m = (y₂ - y₁)/(x₂ - x₁)
	var EM = (Y1 - vanishingPointY)/(X1 - vanishingPointX);
	// b = y₁ - x₁(y₂ - y₁)/(x₂ - x₁)
	var EB = vanishingPointY - (vanishingPointX * (Y1 - vanishingPointY)/(X1 - vanishingPointX));
	
	// x = (y - b)/m
	var X3 = Math.round((Y3 - EB)/EM);

	// m = (y₂ - y₁)/(x₂ - x₁)
	var GM = (Y1 - vanishingPointY)/(X2 - vanishingPointX);
	// b = y₁ - x₁(y₂ - y₁)/(x₂ - x₁)
	var GB = vanishingPointY - (vanishingPointX * (Y1 - vanishingPointY)/(X2 - vanishingPointX));

	// x = (y - b)/m
	var X4 = (Y3 - GB)/GM;

	if (X1 > vanishingPointX) {
		// m = (y₂ - y₁)/(x₂ - x₁)
  		var IM = (Y2 - vanishingPointY)/(X1 - vanishingPointX);
  		// b = y₁ - x₁(y₂ - y₁)/(x₂ - x₁)
  		var IB = vanishingPointY - (vanishingPointX * (Y2 - vanishingPointY)/(X1 - vanishingPointX));
  		// y = mx + b
  		var Y4 = (IM * X3) + IB;
	} else if (X2 < vanishingPointX){
		// m = (y₂ - y₁)/(x₂ - x₁)
  		var IM = (Y2 - vanishingPointY)/(X1 - vanishingPointX);
  		// b = y₁ - x₁(y₂ - y₁)/(x₂ - x₁)
  		var IB = vanishingPointY - (vanishingPointX * (Y2 - vanishingPointY)/(X1 - vanishingPointX));
  		// y = mx + b
  		var Y4 = (IM * X3) + IB;
	}

	return [X3, X4, Y3, Y4];
}

function drawBuildings(numBuildings) { 
	// draw N buildings
	var i;
	for (i = 0; i < numBuildings; i++) {
		var buildingColor = getColor();
		var buildingWidth = randomIntFromInterval(buildingMinWidth, buildingMaxWidth);
		var buildingHeight = randomIntFromInterval(buildingMinHeight, buildingMaxHeight);
		var buildingDepth = randomIntFromInterval(buildingMinDepth, buildingMaxDepth);
		drawBuilding(buildingColor, buildingWidth, buildingHeight, buildingDepth);
	}

	buildings.sort(function(a,b) {
	    return a[0]-b[0]
	});

	for (i = 0; i < buildings.length; i++) {
		var j;
		for (j = 0; j < buildings[i][1].length; j++) {
			var thisBuilding = buildings[i][1][j][0];
			var freeline = svg.append("path")
			               .attr("class", "freeline")
			               .attr("d", function(d) { return thisBuilding; })
			               .attr('stroke', 'black')
			               .attr("stroke-width", "1")
			               .attr("stroke-linecap", "round")
			               .style("stroke-linejoin", "round")
					  	   .attr('fill', buildings[i][1][j][1]);
					  	   // .attr("transform", "scale(" + (buildings[i][0]/(4 * vanishingPointY)).toString() + ")"); 
		}
	}

  // .x(function(d) { return xScale(d[0]) })
  //                   	   .y(function(d) { return yScale(d[1]) })
	
	
}

function drawShape(shapePoints, shapeColor, thisBuilding) { 
	var shapePathData = lineGenerator(shapePoints);
	thisBuilding.push([shapePathData,shapeColor]);
	return thisBuilding;
}

function setUpImage() { 
	// create svg element:
	svg = d3.select("#chart").append("svg").attr("width", chartWidth).attr("height", chartHeight);

	// set background
	svg.append("rect")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("fill", "#D3D3D3");
}

function drawVanishingPoint() { 
	// vanishing point 
	svg.append('circle')
	    .attr('cx', vanishingPointX)
	    .attr('cy', vanishingPointY)
	    .attr('r', 5)
	    .attr('stroke', 'black')
	    .attr('fill', '#69a3b2');
}

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

// source: https://stackoverflow.com/a/57401891
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}


function getSunDirrection(){
	var directions = ['left', 'right', 'top', 'front', 'back'];
 	var direction = directions[Math.floor(Math.random() * directions.length)];
 	return direction;
}

// source: https://simplicable.com/new/pastel-color
function getColor(){
	var colors = ['#77dd77','#836953','#89cff0','#99c5c4','#9adedb','#aa9499','#aaf0d1','#b2fba5','#b39eb5','#bdb0d0','#bee7a5','#befd73','#c1c6fc','#c6a4a4','#c8ffb0','#cb99c9','#cef0cc','#cfcfc4','#d6fffe','#d8a1c4','#dea5a4','#deece1','#dfd8e1','#e5d9d3','#e9d1bf','#f49ac2','#f4bfff','#fdfd96','#ff6961','#ff964f','#ff9899','#ffb7ce'];
 	var color = colors[Math.floor(Math.random() * colors.length)];
 	return color;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}