<?php
include_once 'password_encryption.php';
// Include your database connection file here
include_once 'db_connect.php';

// Receive username and password from the request body
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Insert new password into the database
$stmt = $conn->prepare("INSERT INTO passwords (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $password); // Assuming passwords are stored in plain text
if ($stmt->execute()) {
    // Return success message
    echo json_encode(['message' => 'Password added successfully']);
} else {
    // Return error message
    echo json_encode(['error' => 'Failed to add password']);
}

$stmt->close();
$conn->close();
?>
