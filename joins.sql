CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(50),
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

INSERT INTO Students (student_id, name) VALUES
(1, 'Alice'),
(2, 'Bob'),
(3, 'Charlie');

INSERT INTO Courses (course_id, course_name, student_id) VALUES
(101, 'Math', 1),
(102, 'Science', 2),
(103, 'History', NULL);

SELECT *
FROM Students
INNER JOIN Courses ON Students.student_id = Courses.student_id;

SELECT Students.student_id, Students.name, Courses.course_name
FROM Students
INNER JOIN Courses ON Students.student_id = Courses.student_id;

SELECT *
FROM Students
LEFT JOIN Courses ON Students.student_id = Courses.student_id;

SELECT Students.student_id, Students.name, Courses.course_name
FROM Students
LEFT JOIN Courses ON Students.student_id = Courses.student_id;

SELECT *
FROM Students
RIGHT JOIN Courses ON Students.student_id = Courses.student_id;

SELECT Students.student_id, Students.name, Courses.course_name
FROM Students
RIGHT JOIN Courses ON Students.student_id = Courses.student_id;