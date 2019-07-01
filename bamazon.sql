DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (name, department_name, price, stock_quantity)
VALUES ("old mixtape", "music", 3.28, 17),
("boombox", "music", 29.99, 35),
("jeans", "clothing", 24.99, 35),
("overalls", "clothing", 19.99, 7),
("dog food", "pets", 17.37, 23),
("commemorative beer koozy", "homewares", 2.99, 58),
("computer monitor", "electronics", 99.97, 6),
("'Major Award' leg lamp", "homewares", 42.45, 1),
("computer mouse", "electronics", 14.35, 9),
("Unicorn custome for small dogs", "pets", 9.99, 23);

SELECT * FROM products