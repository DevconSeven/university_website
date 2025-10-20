-- phpMyAdmin SQL Dump


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `uni`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lecturers`
--

CREATE TABLE `lecturers` (
  `lecturer_id` int(11) NOT NULL,
  `lecturer_firstname` varchar(100) DEFAULT NULL,
  `lecturer_lastname` varchar(100) DEFAULT NULL,
  `entry_date` varchar(50) NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `lecturers`
--

INSERT INTO `lecturers` (`lecturer_id`, `lecturer_firstname`, `lecturer_lastname`, `entry_date`, `subject_id`) VALUES
(4, 'Hans', 'Ziegler', '2001-04-11', 2),
(5, 'Kilian', 'Baumann', '2011-03-23', 1),
(6, 'Sabine', 'Wittemann', '1997-05-16', 7),
(7, 'Hans-Joachim', 'Jung', '1999-07-02', 3),
(8, 'Susanne', 'Obermayer', '2007-02-02', 5),
(9, 'Petra', 'Seiler', '2011-09-12', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `pending_user`
--

CREATE TABLE `pending_user` (
  `pending_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(50) NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'secretariat'),
(3, 'lecturer'),
(4, 'student');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `student_firstname` varchar(100) NOT NULL,
  `student_lastname` varchar(100) NOT NULL,
  `student_age` int(11) NOT NULL,
  `student_mail` varchar(50) NOT NULL,
  `student_address` varchar(100) NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `students`
--

INSERT INTO `students` (`student_id`, `student_firstname`, `student_lastname`, `student_age`, `student_mail`, `student_address`, `subject_id`) VALUES
(2025001, 'Joris', 'Mayer', 26, 'joris-m@gmail.com', 'Hauptstraße 23, 76709 Kronau', 3),
(2025002, 'Maria', 'Hofmann', 26, 'maria-hof@web.de', 'Amselweg 8, 65123 Langen', 5),
(2025003, 'Yannik', 'Peisker', 22, 'Jan.Peisker@arcor.de', 'Adenauerring 145, 76131 Karlsruhe', 1),
(2025004, 'Anna-Lena', 'Steinhilper', 29, 'Steini123@gmail.com', 'Im Kiesbruch 9, 76669 Bad Schönorn', 6),
(2025005, 'Mohammad', 'Alshalabi', 22, 'Mohammad.A@gmx.net', 'Bahnhofstraße 67, 65987 Weinheim', 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject`) VALUES
(1, 'Physics'),
(2, 'Mathematics'),
(3, 'Data Science'),
(4, 'Statistics'),
(5, 'Chemistry'),
(6, 'Biology'),
(7, 'Psychology'),
(8, 'Literature'),
(9, 'Sociology'),
(10, 'Philosophy');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `active` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `role_id`, `active`) VALUES
(1, 'John_doe', '12345', 2, 1),
(2, 'admin', 'admin123', 1, 1),
(3, 'HansPeter66', '$2y$10$vMVJ/2PI/ShzaHw6xl420uGDhkRkN4WsXEiHwANrHB1oijqFU53I.', 3, 1),
(4, 'Hannes99', '$2y$10$/vyxV1Q7uamlVKVIyNEyvOvyv2raiYxpxlG2VzxCjXkxqdF4WAC0u', 4, 1),
(5, 'Maria.Zimmermann', '$2y$10$zxE3wrXVhmGOofo.N2mTEe/KEljgMDvqJRetgTZuddyoGigcy9mEK', 4, 1),
(6, 'MaxBaumann', '$2y$10$5ArBXN1JyHIvYGlkPFAi7uB1ZJ2o.5eQITyYftm6p4bYv7AR6xHim', 4, 0),
(7, 'Konrad_Kunze', '$2y$10$a75k/1njBBBNM/M/HyeAUe37ceCF/dHpjR4mtPB58s9FSVSequRAy', 4, 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`lecturer_id`),
  ADD KEY `fachID` (`subject_id`);

--
-- Indizes für die Tabelle `pending_user`
--
ALTER TABLE `pending_user`
  ADD PRIMARY KEY (`pending_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indizes für die Tabelle `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indizes für die Tabelle `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indizes für die Tabelle `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `lecturers`
--
ALTER TABLE `lecturers`
  MODIFY `lecturer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `pending_user`
--
ALTER TABLE `pending_user`
  MODIFY `pending_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2025007;

--
-- AUTO_INCREMENT für Tabelle `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `lecturers`
--
ALTER TABLE `lecturers`
  ADD CONSTRAINT `lecturers_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints der Tabelle `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
