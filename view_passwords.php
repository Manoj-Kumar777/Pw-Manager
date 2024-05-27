<?php
// Include your database connection file here
include_once 'db_connect.php';

// Check if the user is logged in
session_start();
if (!isset($_SESSION['username'])) {
    // Redirect to login page or handle unauthorized access
    header("Location: login.html");
    exit();
}

// Fetch passwords for the logged-in user from the database
$passwords = [];
$stmt = $conn->prepare("SELECT id, username, password FROM passwords WHERE username = ?");
$stmt->bind_param("s", $_SESSION['username']); // Use session variable
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    // If passwords are encrypted, decrypt them here
    // $row['password'] = decryptPassword($row['password']); // Example decryption function
    $passwords[] = $row;
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return passwords as JSON
header('Content-Type: application/json');
echo json_encode($passwords);
?>
