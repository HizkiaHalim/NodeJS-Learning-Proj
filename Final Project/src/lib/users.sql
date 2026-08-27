CREATE TABLE users (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password            VARCHAR(255) NOT NULL,
    role                ENUM('Admin', 'User') DEFAULT 'User',
    create_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
)
