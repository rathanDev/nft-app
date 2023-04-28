use mydb;

CREATE TABLE registration(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nric VARCHAR(255), 
    wallet_address VARCHAR(255),
    created_date timestamp default now()
);