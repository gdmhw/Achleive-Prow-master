<?php
   define('DB_SERVER', 'localhost'); //fix here
   define('DB_USERNAME', 'achleive');
   define('DB_PASSWORD', 'Achprow1');
   define('DB_DATABASE', 'achleive');
   $db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
   if (mysqli_connect_errno())
			{
				echo "Failed to connect to MySQL: " . mysqli_connect_error();
			}
?>
