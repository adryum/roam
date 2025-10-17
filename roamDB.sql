CREATE DATABASE  IF NOT EXISTS `roam` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `roam`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: roam
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pet_tags`
--

DROP TABLE IF EXISTS `pet_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `text` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_pet_tags_pets` (`pet_id`),
  CONSTRAINT `FK_pet_tags_pets` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_tags`
--

LOCK TABLES `pet_tags` WRITE;
/*!40000 ALTER TABLE `pet_tags` DISABLE KEYS */;
INSERT INTO `pet_tags` VALUES (1,'Mazs',1),(2,'Melns',1);
/*!40000 ALTER TABLE `pet_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (1,'Pipariņš',NULL,1,'Melns yorks','Melns',99999);
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_pets`
--

DROP TABLE IF EXISTS `reservation_pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_pets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pet_id` bigint DEFAULT NULL,
  `reservation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservation_pets_reservations` (`reservation_id`),
  KEY `FK_reservation_pets_pets` (`pet_id`),
  CONSTRAINT `FK_reservation_pets_pets` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_reservation_pets_reservations` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_pets`
--

LOCK TABLES `reservation_pets` WRITE;
/*!40000 ALTER TABLE `reservation_pets` DISABLE KEYS */;
INSERT INTO `reservation_pets` VALUES (1,1,1);
/*!40000 ALTER TABLE `reservation_pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,1,2,'te','Rīgas miesnineks',20,'Vedu suņus uz desām!','2025-09-23 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,10,1,2,'Labi nosvinējām','Pipariņš uz iesma nekad nav tik labi garšojis!!!','2025-09-23 00:00:00'),(2,5,2,3,'Ok','Viss labi, nav vainas.','2025-08-23 00:00:00'),(3,2,1,3,'Slikts','Nepatika :( elle','2025-09-23 00:00:00');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_description_points`
--

DROP TABLE IF EXISTS `user_description_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_description_points` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `point` varchar(500) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_description_points_users` (`user_id`),
  CONSTRAINT `FK_description_points_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_description_points`
--

LOCK TABLES `user_description_points` WRITE;
/*!40000 ALTER TABLE `user_description_points` DISABLE KEYS */;
INSERT INTO `user_description_points` VALUES (1,'Mīļš',2),(2,'Pūkains',1),(3,'Labs',3);
/*!40000 ALTER TABLE `user_description_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Igors','Litvjakovs','Tavs skapis','Mazs ar lielu personalitāti',NULL,'USER','qwerty@gmail.com','1234567890'),(2,'Kudrins','Nezinu','RVT Toalete','Patīk zvanīt',NULL,'USER','a@','123'),(3,'Jānis','Čaks','Ur moms house','Kruts dude','https://media.istockphoto.com/id/1090878494/photo/close-up-portrait-of-young-smiling-handsome-man-in-blue-polo-shirt-isolated-on-gray-background.jpg?s=612x612&w=0&k=20&c=AycQ2obu8sgJxWAJgYBbYR6jeRB9Bhs1JZBXzSgL6LE=','WALKER','asdasd@asda.com','12345'),(4,'Liene','Brasa','Rīga','5 gadu pieredze','https://cbx-prod.b-cdn.net/COLOURBOX61105480.jpg?width=800&height=800&quality=70','WALKER','liene@gmail.com','123'),(5,'Vilnis','Barakovs','Ogre','2 mēnešu pieredze','https://thumbs.dreamstime.com/b/portrait-handsome-smiling-young-man-folded-arms-smiling-joyful-cheerful-men-crossed-hands-isolated-studio-shot-172869765.jpg','WALKER','vilnis1@gmail.com','12345'),(6,'asd','trrt',NULL,NULL,NULL,'USER','s@','12345'),(7,'bfadf','sdfsdf',NULL,NULL,NULL,'USER','bars1@','123'),(8,'dfdfda','sdfdsf',NULL,NULL,NULL,'USER','fg@gmail.com','12345678'),(9,'vcbvc','vcbcvb',NULL,NULL,NULL,'USER','1@gmail.com','12345678'),(10,'sdf','sdf',NULL,NULL,NULL,'USER','asd@inbox.lv','12345678'),(11,'Andris','Kapka',NULL,NULL,NULL,'WALKER','kapka@gmail.com','12345678');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-17 11:15:13
