-- Run this from MySQL Workbench or other tools
CREATE DATABASE url_shortener;

USE url_shortener;

CREATE TABLE short_links (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- Automatically increments with each new row
  short_code VARCHAR(20) NOT NULL UNIQUE,  -- Unique short code for the shortened URL
  url VARCHAR(255) NOT NULL  -- Original URL that is being shortened
);

