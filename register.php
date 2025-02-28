<?php
require 'vendor/autoload.php';
include_once 'db_connect.php';
include 'password_encryption.php';

// Check if the encryption key exists in the database
$stmt = $conn->prepare("SELECT enc_key FROM enkeys WHERE id = 1 LIMIT 1");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // Key exists, retrieve it from the database
    $row = $result->fetch_assoc();
    $encryptionKey = $row['enc_key'];
} else {
    // Key doesn't exist, generate a new one
    $encryptionKey = generateEncryptionKey();

    // Store the new key in the database
    $stmt = $conn->prepare("INSERT INTO enkeys (enc_key) VALUES (?)");
    $stmt->bind_param("s", $encryptionKey);
    $stmt->execute();
    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Encrypt password
    $encryptionData = encryptPassword($password, $encryptionKey);

    // Prepare SQL statement for storing user data
    $stmt = $conn->prepare("INSERT INTO users (username, email, encrypted_password, iv) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $encryptionData['encryptedPassword'], $encryptionData['iv']);

    // Execute the statement
    $stmt->execute();
    $stmt->error;

    // Close statement
    $stmt->close();

    // Redirect user to success page or do whatever you need
    // header("Location: manage_passwords.html");
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration</title>
</head>
<body>
    <h2>User Registration Form</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        Username: <input type="text" name="username"><br>
        Email: <input type="text" name="email"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Register">
    </form>
</body>
</html>
