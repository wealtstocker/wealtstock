CREATE DATABASE  IF NOT EXISTS `finance_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `finance_db`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: finance_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `add_funds`
--

DROP TABLE IF EXISTS `add_funds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `add_funds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(50) DEFAULT NULL,
  `utr_number` varchar(100) DEFAULT NULL,
  `screenshot` varchar(255) DEFAULT NULL,
  `status` enum('pending','successful','failed') DEFAULT 'pending',
  `note` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `add_funds_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_funds`
--

LOCK TABLES `add_funds` WRITE;
/*!40000 ALTER TABLE `add_funds` DISABLE KEYS */;
INSERT INTO `add_funds` VALUES (1,'GRP005003',442.00,NULL,'UTR12345678','uploads/screenshots/1749546160703-findimage.jpg','successful','hfgjhkjhvhhjjh',1,'2025-06-10 09:02:40','2025-06-10 09:04:38'),(2,'GRP005003',442.00,NULL,'UTR12345678','uploads/screenshots/1749546180195-findimage.jpg','successful','hfgjhkjhvhhjjh',1,'2025-06-10 09:03:00','2025-06-10 09:04:46'),(3,'GRP005003',5000.00,NULL,'UTR12345678','uploads/screenshots/1749546723516-findimage.jpg','successful','hfgjhkjhvhhjjh',1,'2025-06-10 09:12:03','2025-06-10 09:12:12'),(4,'GRP005003',500.00,'upi','235235325','uploads/screenshots/1750178035853-login.jpg','successful','bsdfgd',1,'2025-06-17 16:33:55','2025-06-17 16:49:24'),(5,'GRP005003',1000.00,'upi','34567','uploads/screenshots/1750179200651-app_image.png','successful','5678',1,'2025-06-17 16:53:20','2025-06-17 16:54:01'),(6,'GRP005003',5000.00,NULL,'UTR12345678','uploads/screenshots/1750220534856-findimage.jpg','pending','hfgjhkjhvhhjjh',1,'2025-06-18 04:22:14','2025-06-18 04:22:14'),(7,'GRP005003',5000.00,NULL,'UTR12345678','uploads/screenshots/1750250699326-findimage.jpg','pending','hfgjhkjhvhhjjh',1,'2025-06-18 12:44:59','2025-06-18 12:44:59');
/*!40000 ALTER TABLE `add_funds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_bank_accounts`
--

DROP TABLE IF EXISTS `customer_bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_bank_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) NOT NULL,
  `account_holder_name` varchar(100) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `customer_bank_accounts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_bank_accounts`
--

LOCK TABLES `customer_bank_accounts` WRITE;
/*!40000 ALTER TABLE `customer_bank_accounts` DISABLE KEYS */;
INSERT INTO `customer_bank_accounts` VALUES (1,'GRP005003','Rohit Patel','SBI','SBIN0001234','123456789012',0,0,'2025-06-10 10:08:30','2025-06-10 10:08:30');
/*!40000 ALTER TABLE `customer_bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_no` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) DEFAULT NULL,
  `id` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `aadhar_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `password_hash` text,
  `address` text,
  `document_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`customer_no`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_2` (`id`),
  UNIQUE KEY `id_3` (`id`),
  UNIQUE KEY `id_4` (`id`),
  UNIQUE KEY `id_5` (`id`),
  UNIQUE KEY `profile_image` (`profile_image`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,NULL,'GRP000001',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$2a$10$FcjCs2chPyUpUigPeFOVkeDiq14QUjbFnx/HRZTM3OEQNpqv1luW.',NULL,'uploads\\documents\\1749387034586-cardimg.png','2025-06-08 12:50:34',1),(2,NULL,'GRP000002','raj patel','raj1@gmail.com','6265861851',NULL,'Male','2005-08-16','123456789017','ABCDE1239G','MP','Saving','Ujjain','$2a$10$osNhaSIEeyevG3qqSRRl6OvTafydy8U6WCQUBSLZGmtIEtz8HdN96','123 Lane, Test City','uploads\\documents\\1749387312062-cardimg.png','2025-06-08 12:55:12',1),(3,'e8c77d31-1b32-417e-9b66-84067801501b','GRP005003','Rohit patel','rr@gmail.com','6265861847',NULL,'Male','2005-08-16','123456789011','ABCDE1239H','MP','Saving','indore','1234','123 Lane, Test City','uploads\\documents\\1749543260719-cardimg.png','2025-06-10 08:14:20',NULL),(4,'f053e914-1eb7-40cd-8eab-529225576d07','GRP005004','Preston Edwards','seji@mailinator.com','+1 (992) 429-5464',NULL,'Male','1983-08-23','390','484','Delhi','Current','Sed id accusamus cul','Pa$$w0rd!','Eveniet reiciendis ','uploads\\documents\\1750158982754-logo-white.png','2025-06-17 11:16:22',1);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_config`
--

DROP TABLE IF EXISTS `site_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_name` varchar(100) NOT NULL,
  `upi_id` varchar(100) NOT NULL,
  `qr_image_url` text NOT NULL,
  `logo_url` text,
  `support_email` varchar(100) DEFAULT NULL,
  `support_phone` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_config`
--

LOCK TABLES `site_config` WRITE;
/*!40000 ALTER TABLE `site_config` DISABLE KEYS */;
INSERT INTO `site_config` VALUES (1,'cgvhbk','rer@gmail','http://localhost:1010/uploads/site/1750256146805-Logo.png',NULL,NULL,NULL,NULL,'2025-06-18 14:15:46','2025-06-18 14:27:16');
/*!40000 ALTER TABLE `site_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trades`
--

DROP TABLE IF EXISTS `trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) NOT NULL,
  `trade_number` varchar(50) NOT NULL,
  `instrument` varchar(100) DEFAULT NULL,
  `buy_price` decimal(10,2) DEFAULT NULL,
  `buy_quantity` int DEFAULT NULL,
  `buy_value` decimal(10,2) DEFAULT NULL,
  `exit_price` decimal(10,2) DEFAULT NULL,
  `exit_quantity` int DEFAULT NULL,
  `exit_value` decimal(10,2) DEFAULT NULL,
  `profit_loss` enum('profit','loss') NOT NULL,
  `profit_loss_value` decimal(10,2) DEFAULT NULL,
  `brokerage` decimal(10,2) DEFAULT NULL,
  `status` enum('requested','approved','rejected','manual') DEFAULT 'requested',
  `created_by` enum('customer','admin') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trades`
--

LOCK TABLES `trades` WRITE;
/*!40000 ALTER TABLE `trades` DISABLE KEYS */;
INSERT INTO `trades` VALUES (1,'GRP005003','33','AAPL',100.00,10,1000.00,120.00,10,1200.00,'profit',200.00,10.00,'approved','admin',1,'2025-06-15 11:38:50','2025-06-15 11:38:50'),(2,'GRP005003','33','AAPL',100.00,10,1000.00,120.00,10,1200.00,'loss',400.00,10.00,'approved','admin',1,'2025-06-15 11:40:47','2025-06-15 11:53:34'),(4,'GRP005003','T-1001','AAPL',100.00,10,1000.00,120.00,10,1200.00,'profit',200.00,5.00,'approved','admin',1,'2025-06-15 12:09:57','2025-06-15 12:09:57'),(5,'GRP005003','T-1002','AAPL',100.00,10,1000.00,30.00,10,300.00,'loss',720.00,20.00,'approved','admin',1,'2025-06-15 12:17:21','2025-06-15 13:05:12'),(6,'GRP005003','T-1003','AAPL',100.00,10,1000.00,50.00,8,400.00,'loss',605.00,5.00,'approved','admin',1,'2025-06-15 12:18:12','2025-06-15 12:18:12'),(7,'GRP005003','T-1004','AAPL',100.00,10,1000.00,140.00,8,1120.00,'profit',100.00,20.00,'approved','admin',0,'2025-06-15 13:10:04','2025-06-17 05:29:46'),(8,'GRP005003','T-1005','AAPL',100.00,10,1000.00,80.00,8,640.00,'loss',370.00,10.00,'approved','admin',1,'2025-06-17 05:31:17','2025-06-17 05:34:28'),(9,'GRP005003','T-1006','AAPL',100.00,10,1000.00,90.00,9,810.00,'loss',200.00,10.00,'requested','customer',1,'2025-06-17 06:09:39','2025-06-17 06:09:39');
/*!40000 ALTER TABLE `trades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_reversed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'GRP005003','debit',400.00,'Withdrawal Request','pending','2025-06-10 09:26:02',0),(2,'GRP005003','debit',200.00,'Withdrawal Rejected','rejected','2025-06-10 10:26:26',0),(3,'GRP005003','debit',4.00,'Withdrawal Approved','completed','2025-06-13 08:29:18',0),(4,'GRP005003','debit',4000.00,'Withdrawal Pending','pending','2025-06-13 08:29:28',0),(5,'GRP005003','debit',4000.00,'Withdrawal Rejected','rejected','2025-06-13 08:29:32',0),(6,'GRP005003','debit',300.00,'Withdrawal Approved','completed','2025-06-13 12:41:55',0),(7,'GRP005003','debit',38.00,'Withdrawal Rejected','rejected','2025-06-13 12:53:06',0),(8,'GRP005003','credit',500.00,'Referral bonus','completed','2025-06-13 13:23:25',0),(9,'GRP005003','credit',200.00,'Referral bonus','completed','2025-06-13 13:27:05',0),(10,'GRP005003','credit',20000.00,'Admin adding funds','completed','2025-06-13 13:31:16',0),(11,'GRP005003','debit',1100.00,'Admin adding funds','completed','2025-06-13 13:31:40',0),(12,'GRP005003','debit',38.00,'Withdrawal approved','completed','2025-06-14 07:03:04',0),(13,'GRP005003','debit',962.00,'Withdrawal Approved','completed','2025-06-14 08:05:03',0),(14,'GRP005003','debit',1000.00,'Admin adding funds','completed','2025-06-14 08:09:24',0),(15,'GRP005003','credit',2000.00,'Admin adding funds','completed','2025-06-14 08:10:08',0),(16,'GRP005003','credit',200.00,'Trade credit for Trade No: 33','completed','2025-06-15 11:38:50',0),(17,'GRP005003','credit',200.00,'Trade credit for Trade No: 33','completed','2025-06-15 11:40:47',0),(18,'GRP005003','credit',200.00,'Trade credit for Trade No: T-1001','completed','2025-06-15 12:09:57',0),(19,'GRP005003','debit',720.00,'Trade debit for Trade No: T-1002','completed','2025-06-15 12:17:21',0),(20,'GRP005003','debit',605.00,'Trade debit for Trade No: T-1003','completed','2025-06-15 12:18:12',0),(21,'GRP005003','debit',300.00,'Trade debit for Trade No: undefined','completed','2025-06-15 13:10:04',0),(22,'GRP005003','debit',140.00,'Trade debit for Trade No: undefined','completed','2025-06-15 13:19:21',0),(23,'GRP005003','credit',100.00,'Trade credit for Trade No: undefined','completed','2025-06-15 13:22:47',0),(24,'GRP005003','credit',20.00,'Trade credit for Trade No: undefined','completed','2025-06-15 13:25:11',0),(26,'GRP005003','credit',100.00,'Trade credit for Trade No: T-1004','completed','2025-06-17 05:15:32',1),(28,'GRP005003','debit',370.00,'Trade debit for Trade No: T-1005','completed','2025-06-17 05:34:28',0),(29,'GRP005003','debit',962.00,'Withdrawal Request','pending','2025-06-17 17:31:53',0);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password_hash` text NOT NULL,
  `role` enum('admin','superadmin') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'31e19953-6861-414e-b086-300796a7e30c','Rohit Patel','admin@gmail.com','9876543210','$2a$10$3BBw2d11/rqaUQv204TiXeglJPsDOF.ReZb31iJPOiWQPp2UUOkkS','admin',1,'2025-06-09 12:42:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `transaction_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `wallets_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
INSERT INTO `wallets` VALUES (1,'GRP005003',442.00,'credit',442.00,NULL,'2025-06-10 09:04:38','2025-06-10 09:04:38'),(2,'GRP005003',442.00,'credit',442.00,NULL,'2025-06-10 09:04:46','2025-06-10 09:04:46'),(3,'GRP005003',5000.00,'credit',5442.00,NULL,'2025-06-10 09:12:12','2025-06-10 09:12:12'),(4,'GRP005003',200.00,'debit',5242.00,2,'2025-06-13 12:35:59','2025-06-13 12:35:59'),(5,'GRP005003',4.00,'debit',5238.00,3,'2025-06-13 12:37:01','2025-06-13 12:37:01'),(6,'GRP005003',4000.00,'debit',1238.00,5,'2025-06-13 12:43:25','2025-06-13 12:43:25'),(7,'GRP005003',300.00,'debit',938.00,6,'2025-06-13 12:52:18','2025-06-13 12:52:18'),(8,'GRP005003',38.00,'debit',900.00,7,'2025-06-13 12:53:15','2025-06-13 12:53:15'),(9,'GRP005003',500.00,'credit',900.01,8,'2025-06-13 13:23:25','2025-06-13 13:23:25'),(10,'GRP005003',200.00,'credit',1100.01,9,'2025-06-13 13:27:05','2025-06-13 13:27:05'),(11,'GRP005003',20000.00,'credit',21100.01,10,'2025-06-13 13:31:16','2025-06-13 13:31:16'),(12,'GRP005003',1100.00,'debit',20000.01,11,'2025-06-13 13:31:40','2025-06-13 13:31:40'),(13,'GRP005003',38.00,'debit',19962.01,12,'2025-06-14 07:03:39','2025-06-14 07:03:39'),(14,'GRP005003',962.00,'debit',19000.01,13,'2025-06-14 08:07:24','2025-06-14 08:07:24'),(15,'GRP005003',1000.00,'debit',18000.01,14,'2025-06-14 08:09:24','2025-06-14 08:09:24'),(16,'GRP005003',2000.00,'credit',20000.01,15,'2025-06-14 08:10:08','2025-06-14 08:10:08'),(17,'GRP005003',200.00,'credit',20200.01,16,'2025-06-15 11:38:50','2025-06-15 11:38:50'),(18,'GRP005003',200.00,'credit',20400.01,17,'2025-06-15 11:40:47','2025-06-15 11:40:47'),(19,'GRP005003',1000.00,'credit',21400.01,NULL,'2025-06-15 11:52:56','2025-06-15 11:52:56'),(20,'GRP005003',50000.00,'credit',71400.01,NULL,'2025-06-15 11:53:34','2025-06-15 11:53:34'),(21,'GRP005003',200.00,'credit',71600.01,18,'2025-06-15 12:09:57','2025-06-15 12:09:57'),(22,'GRP005003',720.00,'debit',71190.01,19,'2025-06-15 12:17:21','2025-06-15 13:05:12'),(23,'GRP005003',605.00,'debit',71290.01,20,'2025-06-15 12:18:12','2025-06-15 12:18:12'),(24,'GRP005003',300.00,'debit',70990.01,21,'2025-06-15 13:10:04','2025-06-15 13:15:41'),(25,'GRP005003',140.00,'debit',70850.01,22,'2025-06-15 13:19:21','2025-06-15 13:19:21'),(26,'GRP005003',100.00,'credit',70950.01,23,'2025-06-15 13:22:47','2025-06-15 13:22:47'),(27,'GRP005003',20.00,'credit',70970.01,24,'2025-06-15 13:25:11','2025-06-15 13:25:11'),(29,'GRP005003',100.00,'credit',71070.01,26,'2025-06-17 05:15:32','2025-06-17 05:15:32'),(30,'GRP005003',100.00,'debit',70970.01,26,'2025-06-17 05:18:20','2025-06-17 05:18:20'),(31,'GRP005003',100.00,'debit',70870.01,26,'2025-06-17 05:29:46','2025-06-17 05:29:46'),(33,'GRP005003',370.00,'debit',70500.01,28,'2025-06-17 05:34:28','2025-06-17 05:34:28'),(34,'GRP005003',500.00,'credit',71000.01,NULL,'2025-06-17 16:49:24','2025-06-17 16:49:24'),(35,'GRP005003',1000.00,'credit',72000.01,NULL,'2025-06-17 16:54:01','2025-06-17 16:54:01');
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) NOT NULL,
  `bank_account_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('requested','approved','rejected','completed') DEFAULT 'requested',
  `note` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `transaction_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `bank_account_id` (`bank_account_id`),
  KEY `fk_withdrawal_transaction` (`transaction_id`),
  CONSTRAINT `fk_withdrawal_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`),
  CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `withdrawals_ibfk_2` FOREIGN KEY (`bank_account_id`) REFERENCES `customer_bank_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
INSERT INTO `withdrawals` VALUES (1,'GRP005003',1,200.00,'rejected',NULL,1,'2025-06-10 10:26:26','2025-06-13 12:36:37',2),(2,'GRP005003',1,4.00,'completed',NULL,1,'2025-06-13 08:29:18','2025-06-13 12:37:01',3),(3,'GRP005003',1,4000.00,'requested',NULL,1,'2025-06-13 08:29:28','2025-06-13 12:37:38',4),(4,'GRP005003',1,4000.00,'rejected',NULL,1,'2025-06-13 08:29:32','2025-06-13 12:44:02',5),(5,'GRP005003',1,300.00,'completed',NULL,1,'2025-06-13 12:41:55','2025-06-13 12:52:18',6),(6,'GRP005003',1,38.00,'rejected',NULL,1,'2025-06-13 12:53:06','2025-06-14 07:04:36',7),(7,'GRP005003',1,38.00,'completed',NULL,1,'2025-06-14 07:03:04','2025-06-14 07:03:39',12),(8,'GRP005003',1,962.00,'completed',NULL,1,'2025-06-14 08:05:03','2025-06-14 08:07:24',13),(9,'GRP005003',1,962.00,'requested',NULL,1,'2025-06-17 17:31:53','2025-06-17 17:31:53',29);
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-18 19:59:06
