CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_word VARCHAR(255) NOT NULL,
    end_word VARCHAR(255) NOT NULL,
    solution VARCHAR(255) NOT NULL,
    milliseconds INT NOT NULL,
    run_at DATETIME NOT NULL
);

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'pass';
FLUSH PRIVILEGES;
