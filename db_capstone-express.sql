
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    userName varchar(255) UNIQUE,
    fullName varchar(255),
    email varchar(255),
    password varchar(255),
    phoneNumber varchar(50)
)

DROP TABLE IF EXISTS images;
CREATE TABLE images (
    imageId INT PRIMARY KEY AUTO_INCREMENT,
    imageName VARCHAR(255),    
    imageUrl VARCHAR(255),
    users_id INT,
    FOREIGN KEY (users_id) REFERENCES users(userId)
)

DROP TABLE IF EXISTS saved;
CREATE TABLE saved (
    isSaved INT,
    users_id INT,
    images_id INT,
    PRIMARY KEY (users_id, images_id),
    FOREIGN KEY (users_id) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (images_id) REFERENCES images(imageId) ON DELETE CASCADE
)

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    commentId INT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(255),
    users_id INT,
    FOREIGN KEY (users_id) REFERENCES users(userId),
    images_id INT,
    FOREIGN KEY (images_id) REFERENCES images(imageId) ON DELETE CASCADE
) 





