CREATE DATABASE cctv_dashboard;
USE cctv_dashboard;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(255)
);

INSERT INTO users VALUES (NULL,'admin',MD5('admin123'));

CREATE TABLE cctvs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  ip VARCHAR(50),
  url VARCHAR(150),
  status ENUM('UP','DOWN'),
  lat DOUBLE,
  lng DOUBLE
);
