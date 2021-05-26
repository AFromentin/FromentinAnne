/*https://www.d3-graph-gallery.com/graph/scatter_basic.html


// ----------------------------------------------------------------
// HTML
<!doctype html>
<html>
	<head>
		<title>Demande</title>
		<meta charset="UTF-8">
		<script src="https://d3js.org/d3.v6.min.js"></script>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>
		<h1>Demandes d3js</h1>
		<h2>TOPn</h2>
		<div id="top"></div>
		<h2>Nuage de points</h2>
		<div id="nuage"></div>
		<script src="script.js"></script>
		
	</body>
</html>



// ----------------------------------------------------------------
// Javascript*/

creation_tableau = function (data) {
	var year_dup = d3.rollups(data, v => 1, d => d.Year),
		year_unique = d3.map(year_dup, d => d[0]),
		year_max = d3.max(year_unique, d => parseInt(d));
		
	var choix = d3.select("#top").append("select");
	choix.selectAll("option")
		.data(year_unique)
		.enter()
		.append("option")
		.html(d => d)
		.property("selected", d => (d == year_max));
	choix.on("change", () => { 
		var tbody = d3.select("#top table tbody");
		tbody.html("");
		tbody.selectAll("tr")
		.data(d3.filter(data, d => d.Year == choix.property("value"))
				.slice(0, taille.property("value"))) // ICI filtre sur l'année de départ
		.enter()
			.append("tr")
			.selectAll("td")
			.data(d => Object.values(d))
				.enter()
				.append("td")
				.html(d => d);
	});

	var taille = d3.select("#top").append("select");
	taille.selectAll("option")
		.data([3, 5, 10, 20])
		.enter()
		.append("option")
		.html(d => d)
		.property("selected", d => (d == 10));
	taille.on("change", () => { 
		var tbody = d3.select("#top table tbody");
		tbody.html("");
		tbody.selectAll("tr")
		.data(d3.filter(data, d => d.Year == choix.property("value"))
				.slice(0, taille.property("value"))) // ICI filtre sur l'année de départ
		.enter()
			.append("tr")
			.selectAll("td")
			.data(d => Object.values(d))
				.enter()
				.append("td")
				.html(d => d);
	});

	var tableau = d3.select("#top").append("table");
	tableau.append("thead").append("tr").selectAll("th")
		.data(Object.keys(data[0]))
		.enter()
		.append("th").html(d => d);
	tableau.append("tbody").selectAll("tr")
		.data(d3.filter(data, d => d.Year == year_max).slice(0, 10)) // ICI filtre sur l'année de départ
		.enter()
			.append("tr")
			.selectAll("td")
			.data(d => Object.values(d))
				.enter()
				.append("td")
				.html(d => d);
}

creation_nuage = function(data) {
	data = d3.filter(data, d => d.Year == 2019);
	
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 30, bottom: 30, left: 60},
		width_total = 800,
		width = width_total - margin.left - margin.right,
		height_total = 400,
		height = height_total - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#nuage")
	  .append("svg")
		.attr("width", width_total)
		.attr("height", height_total)
	  .append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");

	// Add X axis
	var x = d3.scaleLog()
		.domain([d3.min(data, d => parseInt(d.Documents)), d3.max(data, d => parseInt(d.Documents))])
		.range([0, width]);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
		
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Nb de documents");

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([d3.min(data, d => parseInt(d.Citations)), d3.max(data, d => parseInt(d.Citations))])
		.range([height, 0]);
	svg.append("g")
		.call(d3.axisLeft(y));
		
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Nb de citations");

	
	//Creation variable H-index
	var thindex = d3.scaleLinear()
	.domain([0, d3.max(data, d => parseInt(d["H index"]))])
	.range([1,10]);
	svg.append("g")
	.attr("tranform")
	
	//Creation variable Rank
	var rank = d3.scaleLinear()
	.domain([0, d3.max(data, d => parseInt(d.Rank))])
	.range(["green", "red"]);
	svg.append("g")
	.attr("tranform")
	
	
	
	// Add dots
	svg.append("g")
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
			.attr("cx", d => x(d.Documents) )
			.attr("cy", d => y(d.Citations) )
			.attr("r", d=> thindex(d["H index"]) ) // intégrer une échelle sur le H-index
			.attr("fill", d=> rank(d.Rank)) // échelle sur le rang
			



}

d3.csv("https://fxjollois.github.io/donnees/scimagojr/scimagojr.csv")
	.then(data => {
		creation_tableau(data);
		creation_nuage(data);
	});