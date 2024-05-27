CREATE TABLE `enkeys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enc_key` varbinary(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
