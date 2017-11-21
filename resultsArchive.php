<?php
session_start();
//connect to the database so we can check, edit, or insert data to our users table
include("dbconfig.php");

/* if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) {

header ("Location: index.php");

} */

$con = mysql_connect($dbhost, $dbuser, $dbpassword) or die(mysql_error());
$db = mysql_select_db('a8990775_scrs', $con) or die(mysql_error());

$userEmail = $_SESSION['email'];
$firstname = $_SESSION['firstname'];
$clientLast = $_SESSION['clientLast'];
$clientFirst = $_SESSION['clientFirst'];
$therapistLast = $_SESSION['therapistLast'];
$therapistFirst = $_SESSION['therapistFirst'];
$date = $_SESSION['date'];
$numCount = $_SESSION['count'];
$curDate = $_SESSION['date'];
$listOfRelationships = $_SESSION['listOfRelationships'];
$ID = $_GET['id'];
$clientFirst = $_GET['clientfirst'];
$clientLast = $_GET['clientlast'];

//Get ID
//Retrieve
//echo $_SESSION['listOfRelationships'];
//GROUPS
//WeakWeak = Weak Influence, Weak Likeability = 9
//WeakMod = Weak Influence, Moderate Likeability = 8
//WeakStrong = Weak Influence, Strong Likeability = 7
//ModWeak = Moderate Influence, Weak Likeability = 6
//ModMod = Moderate Influence, Moderate Likeability = 5
//ModStrong = Moderate Influence, Strong Likeability = 4
//StrongWeak = Strong Influence, Weak Likeability = 3
//StrongMod = Strong Influence, Moderate Likeability = 2
//StrongStrong = Strong Influence, Strong Likeability = 1

$weakWeakArray = array();
$weakModArray = array();
$weakStrongArray = array();
$modWeakArray = array();
$modModArray = array();
$modStrongArray = array();
$strongWeakArray = array();
$strongModArray = array();
$strongStrongArray = array();

//Get all results by session ID
//$SQL = "SELECT relationName, close, influence, likeability, interact, groupNum, distance, clientFirst, clientLast, curDate  FROM results WHERE (curDate = '".$curDate."') AND (clientFirst = '".$clientFirst."') AND (clientLast = '".$clientLast."')";
$SQL = "SELECT displayName, influence, groupNum, deceased  FROM results WHERE (sessionID = '".$ID."')";
$query = mysql_query($SQL)  or die(mysql_error());
$data = array(); // create a variable to hold the information
while (($row = mysql_fetch_array($query, MYSQL_ASSOC)) !== false){
	$group = $row['groupNum'];
	$displayName = $row['displayName'];
	$influence = $row['influence'];
	$deceased = $row['deceased'];
	if ($group == 1)
	{
		 $strongStrongArray[] = $row;
	}
	elseif($group == 2)
	{
		$strongModArray[] = $row;
	}
	elseif($group == 3)
	{
		$strongWeakArray[] = $row;
	}
	elseif($group == 4)
	{
		$modStrongArray[] = $row;
	}
	elseif($group == 5)
	{
		$modModArray[] = $row;
	}
	elseif($group == 6)
	{
		$modWeakArray[] = $row;
	}
	elseif($group == 7)
	{
		$weakStrongArray[] = $row;
	}
	elseif($group == 8)
	{
		$weakModArray[] = $row;
	}
	elseif($group == 9)
	{
		$weakWeakArray[] = $row;
	}
}
/* $blankArray = array();
    $blankArray[] = array('relationName' => ' ', 'influence' => ' ', 'groupNum'=>'9');
	$strongStrongArray = array_merge($strongStrongArray,$blankArray);
	$strongModArray = array_merge($strongModArray,$blankArray); */
/*echo $strongStrongArray;
echo $strongModArray;
echo $strongWeakArray;
echo $modStrongArray;
echo $modModArray;
echo $modWeakArray;
echo $weakStrongArray;
echo $weakModArray;
echo $weakWeakArray; */
$strongStrongCount = count($strongStrongArray);
$strongModCount = count($strongModArray);
$strongWeakCount = count($strongWeakArray);
$modStrongCount = count($modStrongArray);
$modModCount = count($modModArray);
$modWeakCount = count($modWeakArray);
$weakStrongCount = count($weakStrongArray);
$weakModCount = count($weakModArray);
$weakWeakCount = count($weakWeakArray);
$midCircleCount = $modStrongCount + $modModCount + $modWeakCount;
$outerCircleCount = $weakModCount + $weakStrongCount + $weakWeakCount;
//print_r($modModArray);
//Put all arrays into associative array
//Send to json file
//Send counts to javascript file

//Merges all arrays together
$jsonArray = array_merge($strongStrongArray,$strongModArray,$strongWeakArray,$modStrongArray,$modModArray,$modWeakArray,$weakStrongArray,$weakModArray,$weakWeakArray);
//print_r($jsonArray);
$arrayNum = count($jsonArray);

for( $i = 0 ; $i < $arrayNum ; $i++ )
{
    $this_value = $jsonArray[$i]['displayName'];
    unset($jsonArray[$i]['displayName']);
    $jsonArray[$i]['key'] = $this_value;
	$this_influence = $jsonArray[$i]['influence'];
    unset($jsonArray[$i]['influence']);
    $jsonArray[$i]['radius'] = $this_influence;
	$this_group = $jsonArray[$i]['groupNum'];
    unset($jsonArray[$i]['groupNum']);
    $jsonArray[$i]['orbital_period'] = $this_group;
	$this_deceased = $jsonArray[$i]['deceased'];
    unset($jsonArray[$i]['deceased']);
    $jsonArray[$i]['deceased'] = $this_deceased;
}
$name = $clientFirst;
$content = json_encode($jsonArray);
$my_file = 'solarSystem' . $ID . '.json';
$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file); 
fwrite($handle, $content);

//For each array, do the following:
//Count the elements
//Divide 360 by number
//Give each person an x coordinate of 400 - distance
//Assign y coordinates based on angles
/*
for ($x = 0; $x <= $numCount; $x++) {
	$nameOfPerson = $data[$x]['relationName'];
	$influence = $data[$x]['influence'];
	$likeability = $data[$x]['likeability'];
	$interact = $data[$x]['interact'];
	if ($influence == 1 && $likeability == 1)
	{
		$weakWeakArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
	else if ($influence == 1 && $likeability == 2)
	{
		$weakModArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
	else if ($influence == 1 && $likeability == 3)
	{
		$weakStrongArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}	
	else if ($influence == 2 && $likeability == 1)
	{
		$modWeakArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
    else if ($influence == 2 && $likeability == 2)
	{
		$modModArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}	
	else if ($influence == 2 && $likeability == 3)
	{
		$modStrongArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
	else if ($influence == 3 && $likeability == 1)
	{
		$strongWeakArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
	else if ($influence == 3 && $likeability == 2)
	{
		$strongModArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
	else if ($influence == 3 && $likeability == 3)
	{
		$strongStrongArray[] = array("relationName" => $nameOfPerson, "influence" => $influence, "likeability" => $likeability, "interact" => $interact);
	}
}  */

//Put into array (name, distance, likeability, deceased)
//

?>

<!DOCTYPE html>
<html lang="en">
<head>

  <!-- Basic Page Needs
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>SCRS</title>
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile Specific Metas
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta name="viewport" content="width=device-width, initial-scale=1">


  <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/skeleton.css">
  <link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
  <script src="/js/functions.js" type="text/javascript"></script> 
  <style>
     td
	 {
		 border-bottom:0px;
	 }
  </style>
  
  <!-- JavaScript
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <script type='text/javascript' src='/js/functions.js'></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script>
  function closeDescription()
  {
	  alert("Inner Circle\n\nVery close family and friends by your choice or people who you are in close association (such as co-workers or supervisors) by necessity.  They have your attention either by your choice or not, and whether the relationship is positive or negative.  For example – a loving parent, spouse, children, nosy neighbor, positive mentor, controlling boss.  They are a major focus for your time and resources.\n\nMiddleCircle\n\nNot as close as your inner circle but more than acquaintances.  Family and friends or co-workers and supervisor, pastor, etc., who have some influence on your life but are less of a focus than your primary group.  You may not interact with them for significant periods of time with little cost to the relationship.  For example – friends with whom you go out to eat occasionally, people with whom you volunteer on church projects, an old friend whom you don’t regularly see but with whom you talk often by phone and may see once a year, parents for whom you assist in caretaking but with whom you otherwise spend little time.\n\nOuter Circle\n\nHave little to no influence on your life and are of little relative importance and minor focus for your time and resources.  They can be acquaintances, relatives, co-workers with whom you have little interaction and can commonly ignore if you choose.  For example – a relative you see once a year at a reunion, a hairdresser,  a neighbor you greet regularly but never get to know, a worker at your office whom you know by occasional interaction but don’t work on the same projects or production line.");
	  }
	function nodeClick(name)
	{
		var sessionID = <?php echo json_encode($ID); ?>;
		var file = "/returnData.php";
		$.ajax({
			type: "POST",
			url: file,
			dataType: 'text',
			type: 'GET', 
            aysnc: false,
			data: { name: name},
			success: function(result){
                alert(result);
                //pin number should return
            }
	})
};



  </script>
 
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>
  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
  <!--Header-->
  <div class="row header">
  <div id="client-first" style="display:none;"><?php echo $clientFirst ?></div>
  </div>
  <!--Navigation and Logo-->
  <div class="row">
  <div class="one columns">&nbsp;</div>
  <div class="ten columns">
	<div class="container">
		<div class="row">
		<br>
			<div class="twelve column">
			<script>
			 var strongStrongCount = <?php echo json_encode($StrongStrongCount); ?>;
			 var strongModCount = <?php echo json_encode($strongModCount); ?>;
			 var strongWeakCount = <?php echo json_encode($strongWeakCount); ?>;
			 var modStrongCount = <?php echo json_encode($modStrongCount); ?>;
			 var midCircleCount = <?php echo json_encode($midCircleCount); ?>;
			 var outerCircleCount = <?php echo json_encode($outerCircleCount); ?>;
			 var modModCount = <?php echo json_encode($modModCount); ?>;
			 var modWeakCount = <?php echo json_encode($modWeakCount); ?>;
			 var weakStrongCount = <?php echo json_encode($weakStrongCount); ?>;
			 var weakModCount = <?php echo json_encode($weakModCount); ?>;
			 var weakWeakCount = <?php echo json_encode($weakWeakCount); ?>; 
			 var name = <?php echo json_encode($name) ?>;
			</script> 
			<?php include("results-test.php"); ?>
			<a href="archive.php"><button>Go Back</button></a>
            </div>
	    </div>
	</div>
 </div>
 <div class="one columns"><center><a href="logout.php"><button>Log Out</button></a> <a href="list.php"><button>List of Clients</button></a> <a href="edit.php"><button>Edit Profiles</button></a> <a href="archive.php"><button>Archive</button></a></center></div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <footer>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8" type="text/javascript"></script>
<script src="d3.layout.orbit.js" charset="utf-8" type="text/javascript"></script>
<script src="jquery.cookie.js" charset="utf-8" type="text/javascript"></script>
</footer>
</body>
</html>
