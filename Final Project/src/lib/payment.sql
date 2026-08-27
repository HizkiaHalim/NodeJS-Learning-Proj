CREATE TABLE payments (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id      INT NOT NULL REFERENCES reservation_carts(id),
    total_paid          INT NOT NULL,
    status              INT DEFAULT 1,
    create_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
)
