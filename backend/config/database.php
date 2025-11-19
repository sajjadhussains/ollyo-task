<?php
// backend/config/database.php
class Database {
    private $conn;
    
    public function __construct() {
        $configFile = __DIR__ . '/db.config.php';

        if (!file_exists($configFile)) {
            http_response_code(500);
            echo json_encode(['error' => 'db.config.php not found']);
            exit();
        }

        $config = require $configFile;

        $host = $config['host'];
        $port = $config['port'];
        $dbname = $config['database'];
        $user = $config['username'];
        $password = $config['password'];

        try {
            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
            $this->conn = new PDO($dsn, $user, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Database connection failed: ' . $e->getMessage()
            ]);
            exit();
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
}
?>
