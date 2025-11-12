<?php
// backend/config/database.php
class Database {
    private $conn;
    
    public function __construct() {
        // Try to load config file first
        $configFile = __DIR__ . '/db.config.php';
        $config = [];
        
        if (file_exists($configFile)) {
            $config = require $configFile;
        }
        
        // Priority: Environment variables > Config file > Defaults
        $host = getenv('MYSQL_HOST') ?: ($config['host'] ?? 'localhost');
        $port = getenv('MYSQL_PORT') ?: ($config['port'] ?? '3306');
        $dbname = getenv('MYSQL_DATABASE') ?: ($config['database'] ?? 'ollyo_task');
        $user = getenv('MYSQL_USER') ?: ($config['username'] ?? 'root');
        $password = getenv('MYSQL_PASSWORD') ?: ($config['password'] ?? '');
        
        // Validate required fields
        if (empty($dbname)) {
            http_response_code(500);
            echo json_encode(['error' => 'Database name is required. Please configure db.config.php or set MYSQL_DATABASE environment variable.']);
            exit();
        }
        
        try {
            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
            $this->conn = new PDO($dsn, $user, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage() . '. Please check your database configuration in backend/config/db.config.php']);
            exit();
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
}
?>