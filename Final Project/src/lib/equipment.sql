CREATE TABLE equipments (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) UNIQUE NOT NULL,
    description         VARCHAR(255) NOT NULL,
    price               INT NOT NULL,
    stock               INT NOT NULL,
    status              INT DEFAULT 1,
    create_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
)
