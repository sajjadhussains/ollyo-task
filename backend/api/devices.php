<?php
// backend/api/devices.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        try {
            $stmt = $db->query("SELECT * FROM devices ORDER BY created_at DESC");
            $devices = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $devices]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    case 'POST':
        if (!isset($input['type']) || !isset($input['name']) || !isset($input['settings'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        try {
            $stmt = $db->prepare("INSERT INTO devices (type, name, settings, created_at) VALUES (:type, :name, :settings, NOW())");
            $stmt->execute([
                ':type' => $input['type'],
                ':name' => $input['name'],
                ':settings' => json_encode($input['settings'])
            ]);
            
            // Get the inserted device
            $lastId = $db->lastInsertId();
            $stmt = $db->prepare("SELECT * FROM devices WHERE id = :id");
            $stmt->execute([':id' => $lastId]);
            $device = $stmt->fetch();
            
            echo json_encode(['success' => true, 'data' => $device]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    case 'PUT':
        if (!isset($input['id']) || !isset($input['settings'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        try {
            $stmt = $db->prepare("UPDATE devices SET settings = :settings, updated_at = NOW() WHERE id = :id");
            $stmt->execute([
                ':id' => $input['id'],
                ':settings' => json_encode($input['settings'])
            ]);
            
            // Get the updated device
            $stmt = $db->prepare("SELECT * FROM devices WHERE id = :id");
            $stmt->execute([':id' => $input['id']]);
            $device = $stmt->fetch();
            
            echo json_encode(['success' => true, 'data' => $device]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing device ID']);
            exit();
        }
        
        try {
            $stmt = $db->prepare("DELETE FROM devices WHERE id = :id");
            $stmt->execute([':id' => $_GET['id']]);
            echo json_encode(['success' => true, 'message' => 'Device deleted']);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}
?>