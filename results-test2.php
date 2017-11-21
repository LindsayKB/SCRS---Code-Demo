<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Orbit Layout Modes</title>
  <meta charset="utf-8" />
  <script>
  var div = document.getElementById("client-first");
  var myData = div.textContent;
  </script>
</head>
<style>

  #viz, svg {
    width: 1000px;
    height: 1000px;
	/* background-image: url("img/graph-bg.png"); */
	background-size: 90% 90%;
    background-repeat: no-repeat;
  }
  
  .viz
  {
	  background-color:#666666;
  }

  text {
    pointer-events: none;
	font-size: 1.5em;
  }

  #buttons {
    position: absolute;
    top:0;
    left:0;
	display:none;
  }

  circle.ring {
    fill: none;
    stroke: black;
    stroke-width: 1px;
    stroke-opacity: .15;
	border:1px #000000 solid;
    margin:10%;
  }
  
  circle{
	  stroke: black;
	  stroke-width: 3;
  }
  
  
</style>
<script>


function makeViz() {
  var filename = 'solarsystem.json';
  d3.json(filename, function(data) {drawOrbit(data)});

}

function drawOrbit(_data) {

  orbitScale = d3.scale.linear().domain([1, 3]).range([3.8, 1.5]).clamp(true);
  radiusScale = d3.scale.linear().domain([210.64,2500,10000,71492.68]).range([2,4,8,16]);

  planetColors = {1: "#cccccc", 2: "#d6bb87", 3: "#677188", 4: "#7c5541", 5: "#a36a3e", 6: "#e9ba85", 7: "#73cbf0", 8: "#6383d1", 9: "#4d4dff"}


  orbit = d3.layout.orbit().size([1000,1000])
  .children(function(d) {return d.values})
  .revolution(function(d) {return 1 / d.orbital_period})
  .orbitSize(function(d) {return orbitScale(d.depth)})
  .speed(0)
  .mode("atomic")
  .nodes(_data);

  d3.select("svg")
.append("g")
.attr("class", "viz")
.attr("transform", "translate(50,50)")
  .selectAll("g.node").data(orbit.nodes())
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", function(d) {return "translate(" +d.x +"," + d.y+")"})
  .on("mouseover", nodeOver)
  .on("mouseout", nodeOut)

  d3.selectAll("g.node")
  .append("circle")
  .attr("r", function(d) {return d.radius ? radiusScale(d.radius) : 70})
  .style("fill", function(d) {return d.depth == 0 ? "#7fffff" : d.depth == 1 ? planetColors[d.orbital_period] : "lightgray"});
  
  d3.selectAll("g.node").filter(function(d) {return d.depth == 0})
  .append("text")
  .text(function(d) {return d.depth == 0 ? myData : d.key})
  .attr("y", 10)
  .style("text-anchor", "middle")
  .text(function(d) { return d.key; })
  .on("click", function(d) { alert("Hello world"); });

  d3.selectAll("g.node").filter(function(d) {return d.depth == 1})
  .append("text")
  .text(function(d) {return d.depth == 0 ? "Sun" : d.key})
  .attr("y", 10)
  .style("text-anchor", "middle")

  d3.select("g.viz")
  .selectAll("circle.ring")
  .data(orbit.orbitalRings())
  .enter()
  .insert("circle", "g")
  .attr("class", "ring")
  .attr("r", function(d) {return d.r})
  .attr("cx", function(d) {return d.x})
  .attr("cy", function(d) {return d.y})

  d3.select("#buttons").append("button").html("solar").on("click", function() {newMode("solar")})
  d3.select("#buttons").append("button").html("flat").on("click", function() {newMode("flat")})
  d3.select("#buttons").append("button").html("atomic").on("click", function() {newMode("atomic")})
  d3.select("#buttons").append("button").html("custom").on("click", function() {newMode([4,4])})

  orbit.on("tick", function() {
    d3.selectAll("g.node")
      .attr("transform", function(d) {return "translate(" +d.x +"," + d.y+")"});

    d3.selectAll("circle.ring")
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y});
  });

  orbit.start();

  function newMode(_mode) {
    orbit.mode(_mode)
    .nodes(_data);

  d3.select("g.viz")
  .selectAll("circle.ring")
  .data(orbit.orbitalRings())
    .exit()
    .transition()
    .duration(500)
    .style("stroke-opacity", 0)
    .style("stroke-width", 3)
    .remove();

    d3.select("g.viz")
    .selectAll("circle.ring")
    .data(orbit.orbitalRings())
    .enter()
    .insert("circle", "g")
    .attr("class", "ring");
    
    d3.selectAll("circle.ring")
    .attr("r", function(d) {return d.r})
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y});

  }

  function nodeOver(d) {
    orbit.stop();

    if (d.depth == 2) {
      d3.select(this).append("text").text(d.label || d.key).style("text-anchor", "middle")
      .attr("y", 15)
      .attr("class", "moon");
    }
   /* d3.select(this).select("circle").style("stroke", "black").style("stroke-width", 3); */
  }

  function nodeOut() {
    orbit.start();
      d3.selectAll("text.moon").remove();
    /* d3.selectAll("g.node > circle").style("stroke", "none").style("stroke-width", 0);     */
  }


}

</script>
<body onload="makeViz()">
<div id="viz"><svg></svg><div id="buttons"></div></div>
<footer>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8" type="text/javascript"></script>
<script src="d3.layout.orbit.js" charset="utf-8" type="text/javascript"></script>
<?php   
 /* $jsonurl='solarsystem.json'; 
  $json = file_get_contents($jsonurl,0,null,null);  
  $json_output = json_decode($json, true);  
  $i = -1;  
  foreach ($json_output as $trend){   
   echo $trend['key'];
   echo $trend['radius'];
  }  */
?>
</footer>
</body>
</html>