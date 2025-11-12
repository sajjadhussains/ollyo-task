<?php
// backend/api/presets.php
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
            $stmt = $db->query("SELECT * FROM presets ORDER BY created_at DESC");
            $presets = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $presets]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    case 'POST':
        if (!isset($input['name']) || !isset($input['devices'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        try {
            // Check for duplicate name (case-insensitive)
            $stmt = $db->prepare("SELECT id FROM presets WHERE LOWER(name) = LOWER(:name)");
            $stmt->execute([':name' => $input['name']]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'Preset name already exists']);
                exit();
            }
            
            $stmt = $db->prepare("INSERT INTO presets (name, devices, created_at) VALUES (:name, :devices, NOW())");
            $stmt->execute([
                ':name' => $input['name'],
                ':devices' => json_encode($input['devices'])
            ]);
            
            // Get the inserted preset
            $lastId = $db->lastInsertId();
            $stmt = $db->prepare("SELECT * FROM presets WHERE id = :id");
            $stmt->execute([':id' => $lastId]);
            $preset = $stmt->fetch();
            
            echo json_encode(['success' => true, 'data' => $preset]);
        } catch(PDOException $e) {
            // Check if error is due to duplicate key constraint
            if ($e->getCode() == 23000 || strpos($e->getMessage(), 'Duplicate') !== false) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'Preset name already exists']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
        }
        break;
        
    case 'PUT':
        if (!isset($input['id']) || !isset($input['devices'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        try {
            $stmt = $db->prepare("UPDATE presets SET devices = :devices, updated_at = NOW() WHERE id = :id");
            $stmt->execute([
                ':id' => $input['id'],
                ':devices' => json_encode($input['devices'])
            ]);
            
            // Get the updated preset
            $stmt = $db->prepare("SELECT * FROM presets WHERE id = :id");
            $stmt->execute([':id' => $input['id']]);
            $preset = $stmt->fetch();
            
            echo json_encode(['success' => true, 'data' => $preset]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing preset ID']);
            exit();
        }
        
        try {
            $stmt = $db->prepare("DELETE FROM presets WHERE id = :id");
            $stmt->execute([':id' => $_GET['id']]);
            echo json_encode(['success' => true, 'message' => 'Preset deleted']);
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