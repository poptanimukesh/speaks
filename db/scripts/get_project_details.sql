SET @project_id = 1;

SELECT * FROM `project` WHERE `project_id` = @project_id INTO @project_id, @team_id, @mentor_id, @details_id;

SELECT * FROM `student_team` WHERE `team_id` = @team_id;

SELECT * FROM `student` WHERE `student_id` IN (SELECT `student_id` FROM `student_team` WHERE `team_id` = @team_id);