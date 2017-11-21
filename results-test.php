<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Orbit Layout Modes</title>
  <meta charset="utf-8" />
  <script>
  var div = document.getElementById("client-first");
  var myData = div.textContent;
  </script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script>
<!-- <script type="text/javascript" src="http://gabelerner.github.io/canvg/rgbcolor.js"></script> 
<script type="text/javascript" src="http://gabelerner.github.io/canvg/StackBlur.js"></script>
<script type="text/javascript" src="http://gabelerner.github.io/canvg/canvg.js"></script> -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="d3-save-svg.min.js"></script>
</head>
<style>

#viz
{
	text-align:center;
}
  svg, canvas {
   width: 1000px;
    height: 1000px;
    background-image: url("img/graph-bg-2.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-top: 34px;
    padding-left: 0px;
    background-position: 8% 7%;
    display: inline-block;
  }
  
  .viz
  {
	  background-color:#666666;
  }
  

  text {
    pointer-events: none;
	font-size:1.5em;
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
    stroke-width: 0px;
    stroke-opacity: .15;
	border:1px #000000 solid;
    margin:10%;
  }
 
  
  .inner{
	  stroke-width: 0px;
  }
  
  .outer{
	  stroke-width: 2;
	  stroke: black;
  }
  
  .small
  {
	  font-size:0.8em;
  }
  .large
  {
	  font-size:1.3em;
  }
#canvas-wrap { position:relative; width:800px; height:600px }
#canvas-wrap canvas { position:absolute; top:0; left:0; z-index:0 }
.download { 
  background: #333; 
  color: #FFF; 
  font-weight: 900; 
  border: 2px solid #B10000; 
  padding: 4px; 
  margin:4px;
}
</style>
<script>


function makeViz() {
  var filename = '<?php echo $my_file; ?>';
  d3.json(filename, function(data) {drawOrbit(data)});

}

function drawOrbit(_data) {

  orbitScale = d3.scale.linear().domain([1, 3]).range([3.8, 1.5]).clamp(true);
  radiusScale = d3.scale.linear().domain([200000.00,300000.00,400000.00]).range([20,30,40]);
  innerRadiusScale = d3.scale.linear().domain([200000.00,300000.00,400000.00]).range([10,20,30]);

  planetColors = {1: "#FF8000", 2: "#FFD000", 3: "#80B080", 4: "#5080E0", 5: "#D0B080", 6: "#C0C0C0", 7: "#808080", 8: "#404040", 9: "#000000"}


  orbit = d3.layout.orbit().size([900,900])
  .children(function(d) {return d.values})
  .revolution(function(d) {return 1 / d.orbital_period})
  .orbitSize(function(d) {return orbitScale(d.depth)})
  .speed(0)
  .mode("solar")
  .nodes(_data);

  d3.select("svg")
.append("g")
.attr("class", "viz")
.attr("id", "viz")
.attr("transform", "translate(50,50)")
  .selectAll("g.node").data(orbit.nodes())
  .enter()
  .append("g")
  .attr("deceased", function(d) {return d.deceased})
  .attr("class", "node")
  .attr("name", function(d) {return d.depth == 0 ? myData : d.key;})
  //.attr("onclick", "nodeClick(this.getAttribute('name'))")
  .attr("onclick", function(d) 
  {
	  return d.depth == 0 ? null : "nodeClick(this.getAttribute('name'))";
  }  )
  .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        }); 
  
  //Outer layer
  d3.selectAll("g.node")
  .append("circle")
  .attr("class", "outer")
  .attr("padding", "15px")
  .attr("r", function(d) {return d.radius ? radiusScale(d.radius) : 50})
  //.style("fill", function(d) {return d.depth == 0 ? "#7fffff" : d.depth == 1 ? planetColors[d.orbital_period] : "lightgray"});
  .style("fill", function(d) {return d.depth == 0 ? "66ffff" : d.depth == 1 ? planetColors[d.orbital_period] : "lightgray"});
  
  //Inner layer
  //If deceased, radius is 50. Else, radius is 80
    d3.selectAll("g.node")
  .append("circle")
  .attr("class", "inner")
  //.attr("round", function(d) {return radiusScale(d.radius)})
  .attr("deceased", function(d) {return d.deceased})
  //.attr("r", function(d) {return d.deceased == "y" ? innerRadiusScale(d.radius) : d.depth == 0 ? 0 : radiusScale(d.radius)})
  .attr("r", function(d) {return d.deceased == "y" ? innerRadiusScale(d.radius) : 0})
  .style("fill", "f0f0f0");
  
  d3.selectAll("g.node").filter(function(d) {return d.depth == 0})
  .append("text")
  .attr("name", function(d) {return d.depth == 0 ? myData : d.key;})
  .text(function(d) {return d.depth == 0 ? myData : d.key})
  .attr("y", 10)
  .style("text-anchor", "middle") 
  

  d3.selectAll("g.node").filter(function(d) {return d.depth == 1})
  .append("text")
  .text(function(d) {return d.depth == 0 ? "Sun" : d.key})
  .attr("y", 10)
  .attr("class", function(d) {return radiusScale(d.radius) == 30 ? "small" : radiusScale(d.radius) == 20 ? "small" : "large"})
  .style("text-anchor", "middle")
  .attr("name", function(d) {return d.depth == 0 ? myData : d.key;})
  

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

var svg = document.getElementById("viz");
d3_save_svg.embedRasterImages(svg.node());
    d3.select('#dl').on('click', function() {
      var config = {
        filename: 'customFileName',
      }
      d3_save_svg.save(d3.select('svg').node(), config);
    });

</script>
<body onload="makeViz()">
<div id="viz"><svg id="graph"></svg></div>
<!-- <canvas id="canvas" width="1000" height="1000"></canvas> -->

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
/*  include("GrabzItClient.class.php"); */

// Create the GrabzItClient class
// Replace "APPLICATION KEY", "APPLICATION SECRET" with the values from your account!
/*$grabzIt = new GrabzItClient("OTI3MzRjM2UyYzFiNDJjZmEwYTFkYzIxZjExMmFhMjc=", "Pz8/P3JsKj8jPT8MPz4/cz9bPxI/EzA/Pz8NP3k/PxU="); */
// To take a image screenshot
/* $grabzIt->SetImageOptions("http://scrs-test.comli.com/results-test.php");
$grabzIt->SaveTo("test.jpg"); */
?>
</footer>
</body>
</html>