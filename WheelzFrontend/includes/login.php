<?php
include('config.php');
session_start();
?>

<html>
<head> Login Failed </head>
<body>
<h3>
<?php
if (isset($_POST['submit'])) {

	$email = $_POST['email'];
	$password = $_POST['password'];
	//Error handlers
	//Check if inputs are empty

		$sql = "SELECT password FROM Logins WHERE email='$email'";
		$result = mysqli_query($db, $sql);
		$resultCheck = mysqli_num_rows($result);
		if ($resultCheck < 1) {
			echo 'This email does not exist in the Database. Please go back and try again';
		} else {
			if ($row = mysqli_fetch_assoc($result)) {
				//De-hashing the password argon2i fix here
				$hashedPwdCheck = password_verify($password, $row['password']);
				if ($hashedPwdCheck == false) {
					echo 'Password incorrect try again';
				} elseif ($hashedPwdCheck == true) {
					mysqli_close($db);
					unset($_SESSION['password']);
					header("Location: ../sindex.html");
				}
			}
		}

} else {
	header("Location: ../index.html?login=error");
	echo '	This should never run...but if you see me then panic	';
}
mysqli_close($db);
?>
</h3>
	<form action="/index.html" method="get">
		<button type ="submit">Go Back</button>
	</form>
</body>
</html>
