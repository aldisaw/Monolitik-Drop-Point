<?php
// Set headers for CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = '127.0.0.1'; // gunakan 127.0.0.1 agar pakai TCP
$username   = 'root';      // default XAMPP
$password   = '';          // default XAMPP biasanya kosong (root tanpa password)
$dbname     = 'logistics_db';
$portEnv    = getenv('DB_PORT') ?: 3306;
$port       = (int)$portEnv;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>