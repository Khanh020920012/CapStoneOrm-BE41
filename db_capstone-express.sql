/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `users_id` int DEFAULT NULL,
  `images_id` int DEFAULT NULL,
  PRIMARY KEY (`commentId`),
  KEY `users_id` (`users_id`),
  KEY `images_id` (`images_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`userId`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`images_id`) REFERENCES `images` (`imageId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `imageId` int NOT NULL AUTO_INCREMENT,
  `imageName` varchar(255) DEFAULT NULL,
  `users_id` int DEFAULT NULL,
  PRIMARY KEY (`imageId`),
  KEY `users_id` (`users_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `saved`;
CREATE TABLE `saved` (
  `isSaved` int DEFAULT NULL,
  `users_id` int NOT NULL,
  `images_id` int NOT NULL,
  PRIMARY KEY (`users_id`,`images_id`),
  KEY `images_id` (`images_id`),
  CONSTRAINT `saved_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `saved_ibfk_2` FOREIGN KEY (`images_id`) REFERENCES `images` (`imageId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `images` (`imageId`, `imageName`, `users_id`) VALUES
(2, 'TenHinhfnef', 1);


INSERT INTO `saved` (`isSaved`, `users_id`, `images_id`) VALUES
(1, 1, 2);


INSERT INTO `users` (`userId`, `userName`, `fullName`, `email`, `password`, `phoneNumber`) VALUES
(1, 'vulebaolog', 'Vũ Lê Bảo Long', 'vulebaolong@gmail.com', '$2a$10$Xb0MIwze.F3/jAIuIgi89et6Oe.yEJl0qlSUxyWlPaEAItG3R05nm', '0836789578');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;