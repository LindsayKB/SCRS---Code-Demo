<? 
session_start();
include("dbconfig.php");
/*include 'functions.php'; */
$con = mysql_connect($dbhost, $dbuser, $dbpassword) or die(mysql_error());
$db = mysql_select_db('a8990775_scrs', $con) or die(mysql_error());
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
  
  <!-- JavaScript
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <script type='text/javascript' src='/js/functions.js'></script>


</head>
<body>

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
  <!--Header-->
  <div class="row header">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns"><center><h1>LOG IN</h1></center></div>
  <div class="two columns">&nbsp;</div>
  </div>
  <!--Navigation and Logo-->
  <div class="row">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns">
    <form action="http://scrs-test.comli.com/process.php" id="validate" method="post" autocomplete="off">
		  		<table cellpadding="2" cellspacing="0" border="0" align="center">
			  		<tr>
				  		<td>Email: </td>
					  	<td><input type="text" autocapitalize="off" class="users input1 required email" name="email" size="25" value="<? echo $_GET['e']?>"/></td>
  					</tr>
  					<tr>
  						<td>Password: </td>
  						<td><input type="password" class="users input1 required" minlength="4" name="password" value=""/></td>
  					</tr>
  					<tr>
  						<td colspan="2" align="center">
  							<input type="hidden" name="formStep" value="login" />
                <input type="hidden" name="assigned" value="<?=$assigned?>"/>
                <input type="submit" name="submit" value="Continue" id="submit" />
              </td>
  					</tr>
  				</table>
  			</form>
     </div>
  <div class="two columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
