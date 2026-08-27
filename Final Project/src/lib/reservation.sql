CREATE TABLE reservation_carts (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL REFERENCES users(id),
    reservation_status  ENUM('Waiting For Payment', 'Payment Received', 'Processing', 'Borrowed', 'Returned') DEFAULT 'Waiting For Payment',
    status              INT DEFAULT 1,
    create_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) 

CREATE TABLE reservation_detail (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id      INT NOT NULL REFERENCES reservation_carts(id),
    equipments_id       INT NOT NULL REFERENCES equipments(id),
    qty                 INT NOT NULL,
    status              INT DEFAULT 1,
    create_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
)