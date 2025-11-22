<?php
// Izinkan akses dari React.js (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db_connect.php'; // Pastikan file koneksi database Anda sudah benar

$method = $_SERVER['REQUEST_METHOD'];
// Ambil data POST/PUT/DELETE dari body request
$data = json_decode(file_get_contents("php://input"), true);

// Dapatkan parameter resource dari URL, default ke shipments
$resource = isset($_GET['resource']) ? $_GET['resource'] : 'shipments'; 

switch ($method) {
    case 'GET':
        $items = array();
        $sql = "";
        
        if ($resource === 'couriers') {
            // Logika Ambil data kurir
            $sql = "SELECT id, name, phone, vehicle_plate, status FROM courier";
        } else {
            // Logika Ambil data shipments (default)
            $sql = "SELECT * FROM shipments ORDER BY id DESC";
        }

        $result = $conn->query($sql);
        if ($result) {
            while($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
        }
        echo json_encode($items);
        break;

    case 'POST':
        // 1. 🔑 Logika Otentikasi/Login
        if (isset($data['username']) && isset($data['password'])) {
            $username = $data['username'];
            $password = $data['password'];

            $stmt = $conn->prepare("SELECT id, username, nama_lengkap, role FROM user_id WHERE username = ? AND password = ?");
            $stmt->bind_param("ss", $username, $password);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                http_response_code(200); 
                echo json_encode(array(
                    "message" => "Login berhasil.",
                    "user" => $user
                ));
            } else {
                http_response_code(401); 
                echo json_encode(array("message" => "Username atau Password salah."));
            }
            $stmt->close();
            break; 
        }

        // 2. 📦 Logika Tambah Shipment
        $sql = "INSERT INTO shipments (
                    shipper_name, weight_item, shipper_phone, receiver_phone, receiver_name, 
                    provinsi, kota, kecamatan, kode_pos, alamat_lengkap
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        
        $stmt->bind_param("ssssssssss", 
            $data['shipper_name'], 
            $data['weight_item'], 
            $data['shipper_phone'], 
            $data['receiver_phone'],
            $data['receiver_name'],
            $data['provinsi'],      
            $data['kota'],
            $data['kecamatan'],
            $data['kode_pos'],
            $data['alamat_lengkap']
        );

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "New shipment added successfully."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error adding shipment: " . $stmt->error));
        }
        $stmt->close();
        break;

    case 'PUT':
        $shipment_id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["message" => "Missing shipment ID"])); 
        $courier_id_to_assign = isset($data['courier_id']) ? $data['courier_id'] : null; 
        $courier_id_to_cancel = isset($data['cancel_courier_id']) ? $data['cancel_courier_id'] : null; 

        $set_clauses = [];
        $params = [];
        $types = "";

        // 1. Tentukan update STATUS SHIPMENT
        if (isset($data['status'])) {
            $set_clauses[] = "status = ?";
            $params[] = $data['status'];
            $types .= "s";
        }
        
        // 2. Tentukan update COURIER_ID SHIPMENT
        if ($courier_id_to_cancel !== null) {
            // Jika Batal: Atur courier_id menjadi NULL
            $set_clauses[] = "courier_id = NULL"; 
        } elseif ($courier_id_to_assign !== null) {
            // Jika Assign: Atur courier_id ke ID baru
            $set_clauses[] = "courier_id = ?";
            $params[] = $courier_id_to_assign;
            $types .= "i";
        }

        if (!empty($set_clauses)) {
            $sql = "UPDATE shipments SET " . implode(", ", $set_clauses) . " WHERE id = ?";
            
            $stmt = $conn->prepare($sql);
            $params[] = $shipment_id;
            $types .= "i";

            // Panggil bind_param secara dinamis
            $stmt->bind_param($types, ...$params);

            if ($stmt->execute()) {
                $success_message = "Shipment updated successfully.";

                // ===============================================
                // 🚨 LOGIKA UPDATE STATUS KURIR (ASSIGN)
                // ===============================================
                if ($courier_id_to_assign !== null) {
                    $new_courier_status = "Sedang Mengambil";
                    $sql_courier = "UPDATE courier SET status = ? WHERE id = ?";
                    $stmt_courier = $conn->prepare($sql_courier);
                    $stmt_courier->bind_param("si", $new_courier_status, $courier_id_to_assign);
                    
                    if ($stmt_courier->execute()) {
                        $success_message .= " Courier assigned and status updated to 'Sedang Mengambil'.";
                    }
                    $stmt_courier->close();
                }

                // ===============================================
                // 🛑 LOGIKA KEMBALIKAN STATUS KURIR (CANCEL)
                // ===============================================
                if ($courier_id_to_cancel !== null) {
                    $new_courier_status = "Tersedia";
                    $sql_courier = "UPDATE courier SET status = ? WHERE id = ?";
                    $stmt_courier = $conn->prepare($sql_courier);
                    $stmt_courier->bind_param("si", $new_courier_status, $courier_id_to_cancel);
                    
                    if ($stmt_courier->execute()) {
                        $success_message = "Assignment canceled. Courier status reverted to 'Tersedia'.";
                    } else {
                        error_log("Failed to revert courier status: " . $stmt_courier->error);
                        $success_message .= " (Warning: Courier status rollback failed)";
                    }
                    $stmt_courier->close();
                }
                // ===============================================

                http_response_code(200);
                echo json_encode(array("message" => $success_message));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Error updating shipment: " . $stmt->error));
            }
            $stmt->close();
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["message" => "Missing ID for deletion"]));
        $sql = "DELETE FROM shipments WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Shipment deleted successfully."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error deleting shipment: " . $stmt->error));
        }
        $stmt->close();
        break;
}

$conn->close();
?>