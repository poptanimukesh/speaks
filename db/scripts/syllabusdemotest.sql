USE syllabusdemo;

INSERT INTO `lecturers` (`LastName`, `FirstName`, `Email`, `Phone`, `Institution`, `Department`, `Title`) VALUES ("Kent", "Clark", "clark_kent@league.com", "9991231234", "Justice League", "", "Superman");
SELECT LAST_INSERT_ID();

SELECT * FROM `lecturers` WHERE `Email` = "moane@usc.edu";