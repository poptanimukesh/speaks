-- DROP DATABASE IF EXISTS pharmdscholarlyproject_dev;

CREATE DATABASE pharmdscholarlyproject_dev;

USE pharmdscholarlyproject_dev;

CREATE TABLE `student` (
 	`StudentID` INT NOT NULL AUTO_INCREMENT,
	`Email` VARCHAR(255) NOT NULL,
	`FirstName` VARCHAR(255) NOT NULL,
	`LastName` VARCHAR(255) NOT NULL,
	`Active` BOOL,
	`Timestamp` TIMESTAMP,
	PRIMARY KEY (`StudentID`)
);

CREATE TABLE `student_team` (
	`TeamID` INT NOT NULL AUTO_INCREMENT,
	`StudentID` INT NOT NULL,
	PRIMARY KEY (`TeamID`,`StudentID`)
);

CREATE TABLE `details` (
	`DetailsID` INT NOT NULL AUTO_INCREMENT,
	`DataKey` VARCHAR(255) NOT NULL,
	`DataValue` TEXT NOT NULL,
	`Timestamp` TIMESTAMP,
	PRIMARY KEY (`DetailsID`,`DataKey`)
);

CREATE TABLE `project` (
	`ProjectID` INT NOT NULL AUTO_INCREMENT,
	`TeamID` INT NOT NULL,
	`MentorID` INT NOT NULL,
	`DetailsID` INT NOT NULL,
	`Timestamp` TIMESTAMP,
	PRIMARY KEY (`ProjectID`),
	CONSTRAINT `FkProjectDetails` FOREIGN KEY (`DetailsID`) REFERENCES `details` (`DetailsID`)
);

CREATE TABLE `presentation` (
	`PresentationID` INT NOT NULL AUTO_INCREMENT,
	`ProjectID` INT NOT NULL,
	`Meeting` VARCHAR(255),
	`Location` VARCHAR(255),
	`Date` VARCHAR(255),
	`Title` VARCHAR(1024),
	`Authors` VARCHAR(1024),
	`Timestamp` TIMESTAMP,
	PRIMARY KEY(`PresentationID`),
	CONSTRAINT `FkProjectPresentation` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`)
);

CREATE TABLE `document` (
	`DocumentID` INT NOT NULL AUTO_INCREMENT,
	`ProjectID` INT NOT NULL,
	`Category` VARCHAR(255) NOT NULL,
	`Version` VARCHAR(255) NOT NULL,
	`OriginalName` VARCHAR(255) NOT NULL,
	`Path` VARCHAR(1024) NOT NULL,
	`Active` BOOLEAN NOT NULL,
	`Timestamp` TIMESTAMP,
	PRIMARY KEY (`DocumentID`),
	CONSTRAINT `FkProjectDocument` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`)
);

CREATE TABLE `user` (
	`UserID` VARCHAR(255) UNIQUE NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`UserID`)
);

ALTER TABLE `student` AUTO_INCREMENT = 101;
ALTER TABLE `student_team` AUTO_INCREMENT = 101;
ALTER TABLE `details` AUTO_INCREMENT = 101;
ALTER TABLE `project` AUTO_INCREMENT = 101;
ALTER TABLE `presentation` AUTO_INCREMENT = 101;
ALTER TABLE `document` AUTO_INCREMENT = 101;
