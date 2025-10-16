-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.3.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for roam
CREATE DATABASE IF NOT EXISTS `roam` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `roam`;

-- Dumping structure for table roam.pets
CREATE TABLE IF NOT EXISTS `pets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `owner_user_id` bigint NOT NULL,
  `species` varchar(50) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_pets_users` (`owner_user_id`),
  CONSTRAINT `FK_pets_users` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.pets: ~0 rows (approximately)
INSERT INTO `pets` (`id`, `name`, `image`, `owner_user_id`, `species`, `description`, `age`) VALUES
	(1, 'Pipariņš', NULL, 1, 'Melns yorks', 'Melns', 99999);

-- Dumping structure for table roam.pet_tags
CREATE TABLE IF NOT EXISTS `pet_tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `text` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_pet_tags_pets` (`pet_id`),
  CONSTRAINT `FK_pet_tags_pets` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.pet_tags: ~2 rows (approximately)
INSERT INTO `pet_tags` (`id`, `text`, `pet_id`) VALUES
	(1, 'Mazs', 1),
	(2, 'Melns', 1);

-- Dumping structure for table roam.reservations
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `walker_user_id` bigint DEFAULT NULL,
  `client_user_id` bigint DEFAULT NULL,
  `path_start` varchar(50) DEFAULT NULL,
  `path_end` varchar(50) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `creation_date_time` datetime DEFAULT NULL,
  `walk_start_date_time` datetime DEFAULT NULL,
  `walk_end_date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservations_users` (`walker_user_id`),
  KEY `FK_reservations_users_2` (`client_user_id`),
  CONSTRAINT `FK_reservations_users` FOREIGN KEY (`walker_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_reservations_users_2` FOREIGN KEY (`client_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.reservations: ~1 rows (approximately)
INSERT INTO `reservations` (`id`, `walker_user_id`, `client_user_id`, `path_start`, `path_end`, `price`, `description`, `creation_date_time`, `walk_start_date_time`, `walk_end_date_time`) VALUES
	(1, 1, 2, 'te', 'Rīgas miesnineks', 20, 'Vedu suņus uz desām!', '2025-09-23 00:00:00', NULL, NULL);

-- Dumping structure for table roam.reservation_pets
CREATE TABLE IF NOT EXISTS `reservation_pets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pet_id` bigint DEFAULT NULL,
  `reservation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservation_pets_reservations` (`reservation_id`),
  KEY `FK_reservation_pets_pets` (`pet_id`),
  CONSTRAINT `FK_reservation_pets_pets` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_reservation_pets_reservations` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.reservation_pets: ~0 rows (approximately)
INSERT INTO `reservation_pets` (`id`, `pet_id`, `reservation_id`) VALUES
	(1, 1, 1);

-- Dumping structure for table roam.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stars` float NOT NULL DEFAULT (0),
  `from_user_id` bigint NOT NULL,
  `to_user_id` bigint NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reviews_users` (`from_user_id`),
  KEY `FK_reviews_users_2` (`to_user_id`),
  CONSTRAINT `FK_reviews_users` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_reviews_users_2` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.reviews: ~0 rows (approximately)
INSERT INTO `reviews` (`id`, `stars`, `from_user_id`, `to_user_id`, `title`, `content`, `creation_date`) VALUES
	(1, 10, 1, 2, 'Labi nosvinējām', 'Pipariņš uz iesma nekad nav tik labi garšojis!!!', '2025-09-23 00:00:00');

-- Dumping structure for table roam.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `profile_picture` text,
  `role` enum('USER','WALKER') DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `name`, `surname`, `location`, `description`, `profile_picture`, `role`, `email`, `password`) VALUES
	(1, 'Igors', 'Litvjakovs', 'Tavs skapis', 'Mazs ar lielu personalitāti', NULL, 'USER', 'qwerty@gmail.com', '1234567890'),
	(2, 'Kudrins', 'Nezinu', 'RVT Toalete', 'Patīk zvanīt', NULL, 'USER', 'a@', '123');

-- Dumping structure for table roam.user_description_points
CREATE TABLE IF NOT EXISTS `user_description_points` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `point` varchar(500) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_description_points_users` (`user_id`),
  CONSTRAINT `FK_description_points_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table roam.user_description_points: ~2 rows (approximately)
INSERT INTO `user_description_points` (`id`, `point`, `user_id`) VALUES
	(1, 'Mīļš', 2),
	(2, 'Pūkains', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
