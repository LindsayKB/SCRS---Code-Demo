<?php
 include( 'screenshot.class.php' );
 $screenShot = new screenShot( $_REQUEST['url'], 'jpg');
 $screenShot->setParam( 'width', 300);
 $screenShot->setParam( 'css_url', 'http://scrs-test.comli.com/css/style.css');
 $screenShot->capturePage();
 echo $screenShot->capture;
?>