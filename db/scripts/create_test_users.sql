INSERT INTO `student` (`first_name`, `last_name`, `email`) VALUES ("Person", "One", "one@usc.edu");

INSERT INTO `details` (`data_key`, `data_value`) VALUES ("key1", "value1");
SELECT LAST_INSERT_ID();
INSERT INTO `details` (`details_id`, `data_key`, `data_value`) VALUES (LAST_INSERT_ID(), "key2", "value2");
INSERT INTO `details` (`details_id`, `data_key`, `data_value`) VALUES (LAST_INSERT_ID(), "key3", "value3");
INSERT INTO `details` (`details_id`, `data_key`, `data_value`) VALUES (LAST_INSERT_ID(), "key4", "value4");
SELECT * FROM `details`;