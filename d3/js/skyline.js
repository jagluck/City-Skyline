// city skyline
// Jake Gluck
// jakeagluck@gmail.com
// https://github.com/jagluck/city-skyline

///////////////
// constants //
///////////////

var svg;
const lineGenerator = d3.line();

const chartHeight = 600;
const chartWidth = 600;

const vanishingPointX = randomIntFromInterval((chartWidth/5), ((chartWidth/5) * 4));
const vanishingPointY = randomIntFromInterval((chartHeight/10), ((chartHeight/10) * 3));

const buildingMaxHeight = 100;
const buildingMinHeight = 50;

const buildingMaxWidth = 50;
const buildingMinWidth = 20;

////////////////
// draw image //
////////////////

setUpImage();
drawBuildings(5);
drawVanishingPoint();

///////////////
// functions //
///////////////

function drawBuildings(numBuildings) { 
	// draw N buildings
	var i;
	for (i = 0; i < numBuildings; i++) {

		var buildingWidth = randomIntFromInterval(buildingMinWidth, buildingMaxWidth);
		var buildingHeight = randomIntFromInterval(buildingMinHeight, buildingMaxHeight);
		var buildingX = randomIntFromInterval(0, (chartWidth - buildingWidth));
	  	var buildingY = randomIntFromInterval(vanishingPointY, (chartHeight - buildingHeight));

	  	if (buildingX < vanishingPointX){
	  		var points = [
			    [buildingX, buildingY],
			    [(buildingX + buildingWidth), buildingY],
			    [(buildingX + buildingWidth), (buildingY + buildingHeight)],
			    [buildingX, (buildingY + buildingHeight)],
			    [buildingX, buildingY],
			];	
	  	} else{
	  		var points = [
			    [buildingX, buildingY],
			    [(buildingX + buildingWidth), buildingY],
			    [(buildingX + buildingWidth), (buildingY + buildingHeight)],
			    [buildingX, (buildingY + buildingHeight)],
			    [buildingX, buildingY],
			];	
	  	}
	  

		var pathData = lineGenerator(points);
		var freeline = svg.append("path")
		               .attr("class", "freeline")
		               .attr("d", function(d) { return pathData ; })
		               .attr('stroke', 'black')
				  	   .attr('fill', '#69a3b2');

		// svg.append('rect')
		// 	.attr('x', buildingX)
		// 	.attr('y', buildingY)
		// 	.attr('width', buildingWidth)
		// 	.attr('height', buildingHeight)
		// 	.attr('stroke', 'black')
		// 	.attr('fill', '#69a3b2');
	}
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

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}