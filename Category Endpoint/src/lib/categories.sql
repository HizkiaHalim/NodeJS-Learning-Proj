CREATE TABLE categories (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    nama                VARCHAR(100) NOT NULL,
    slug                VARCHAR(100) UNIQUE NOT NULL,
    create_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
)
