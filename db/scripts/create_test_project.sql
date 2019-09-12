# Insert Students and Team
INSERT INTO `student` (`email`, `first_name`, `last_name`) VALUES ("one@usc.edu", "Person", "One");
INSERT INTO `student` (`email`, `first_name`, `last_name`) VALUES ("two@usc.edu", "Person", "Two");
INSERT INTO `student` (`email`, `first_name`, `last_name`) VALUES ("three@usc.edu", "Person", "Three");

INSERT INTO `student_team` (`student_id`) VALUES ("one@usc.edu");
SET @team_id = LAST_INSERT_ID();
INSERT INTO `student_team` (`team_id`, `student_id`) VALUES (@team_id, "two@usc.edu"), (@team_id, "three@usc.edu");

# Insert Faculty
INSERT INTO `faculty` (`email`, `first_name`, `last_name`) VALUES ("mone@usc.edu", "Mentor", "One");
SET @mentor_id = LAST_INSERT_ID();

# Insert Project
INSERT INTO `details` (`data_key`, `data_value`) VALUES ("project_init", "");
SET @project_details_id = LAST_INSERT_ID();
INSERT INTO `details` (`data_key`, `data_value`) VALUES ("proposal_init", "");
SET @proposal_details_id = LAST_INSERT_ID();
INSERT INTO `project` (`team_id`, `mentor_id`, `details_id`) VALUES (@team_id, @mentor_id, @project_details_id);

# Test
SELECT * FROM `student_team`;
