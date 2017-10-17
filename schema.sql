-- MySQL dump 10.13  Distrib 5.7.19, for Linux (x86_64)
--
-- Host: localhost    Database: blayncafe
-- ------------------------------------------------------
-- Server version       5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AccessTokens`
--

DROP TABLE IF EXISTS `AccessTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AccessTokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accessToken` varchar(255) DEFAULT NULL,
  `expiredTime` bigint(20) DEFAULT NULL,
  `userType` enum('student','sponsor','admin') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `sponsorId` int(11) DEFAULT NULL,
  `adminId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `sponsorId` (`sponsorId`),
  KEY `adminId` (`adminId`),
  CONSTRAINT `AccessTokens_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `Students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AccessTokens_ibfk_2` FOREIGN KEY (`sponsorId`) REFERENCES `Sponsors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AccessTokens_ibfk_3` FOREIGN KEY (`adminId`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=699 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userName` (`userName`),
  UNIQUE KEY `Admins_userName_unique` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventTitle` text NOT NULL,
  `date` date NOT NULL,
  `startingTime` time NOT NULL,
  `endTime` time NOT NULL,
  `recruitmentNumbers` int(11) NOT NULL,
  `images` varchar(191) DEFAULT NULL,
  `status` enum('draft','under_review','approved','held','canceled','rejected') NOT NULL DEFAULT 'draft',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sponsorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsorId` (`sponsorId`),
  FULLTEXT KEY `text_idx` (`description`,`eventTitle`),
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`sponsorId`) REFERENCES `Sponsors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Sponsors`
--

DROP TABLE IF EXISTS `Sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyName` varchar(191) NOT NULL,
  `staffName` varchar(191) NOT NULL,
  `staffRubyName` varchar(191) NOT NULL,
  `companyAddress1` varchar(191) NOT NULL,
  `companyAddress2` varchar(191) NOT NULL,
  `companyAddress3` varchar(191) NOT NULL,
  `companyPhoneNumber` varchar(191) NOT NULL,
  `department` varchar(191) DEFAULT NULL,
  `positon` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `companyLogo` varchar(191) NOT NULL,
  `ceoName` varchar(191) NOT NULL,
  `dateOfEstablishedCompany` datetime NOT NULL,
  `numberOfEmployees` int(11) NOT NULL,
  `industry` varchar(191) NOT NULL,
  `websiteUrl` varchar(191) NOT NULL,
  `introduction1` text NOT NULL,
  `introduction2` text NOT NULL,
  `contactStartDate` date NOT NULL,
  `contactDeadline` varchar(191) NOT NULL,
  `remark` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `Sponsors_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `StudentEvents`
--

DROP TABLE IF EXISTS `StudentEvents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StudentEvents` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `studentId` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  PRIMARY KEY (`studentId`,`eventId`),
  KEY `eventId` (`eventId`),
  CONSTRAINT `StudentEvents_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `Students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StudentEvents_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `StudentLogs`
--

DROP TABLE IF EXISTS `StudentLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StudentLogs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
KEY `studentId` (`studentId`),
  CONSTRAINT `studentlogs_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `Students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Students`
--

DROP TABLE IF EXISTS `Students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `familyName` varchar(191) NOT NULL,
  `giveName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `admissionYear` int(11) NOT NULL,
  `department` varchar(191) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `sex` enum('female','male','others') NOT NULL,
  `password` varchar(191) NOT NULL,
  `studentCard` varchar(191) NOT NULL,
  `profileImage` varchar(191) DEFAULT NULL,
  `studentNumber` varchar(191) NOT NULL,
  `barcode` varchar(191) NOT NULL,
  `status` enum('member','under_review','deactivated') NOT NULL,
  `joinDate` date NOT NULL,
  `deadline` date NOT NULL,
  `remark` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `studentNumber` (`studentNumber`),
  `barcode` varchar(191) NOT NULL,
  `status` enum('member','under_review','deactivated') NOT NULL,
  `joinDate` date NOT NULL,
  `deadline` date NOT NULL,
  `remark` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `studentNumber` (`studentNumber`),
  UNIQUE KEY `barcode` (`barcode`),
  UNIQUE KEY `Students_email_unique` (`email`),
  UNIQUE KEY `Students_studentNumber_unique` (`studentNumber`),
  UNIQUE KEY `Students_barcode_unique` (`barcode`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-16 14:12:34

