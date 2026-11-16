-- Mitarbeiter anlegen
INSERT INTO employee (employee_name)
VALUES
	('Sabine'),
    ('Mara'),
    ('Jonas');

-- Leistungen anlegen
INSERT INTO service (service_name, price, duration)
VALUES
	('Herrenschnitt', 2800, 30),
    ('Damenschnitt', 4200, 45),
    ('Kinderschnitt', 1600, 20),
    ('Bartpflege', 1200, 15),
    ('Waschen und Foehnen', 2200, 30),
    ('Faerben', 7500, 90);
    
-- Mitarbeitern Leistung zuordnen
INSERT INTO employee_service (employee_id, service_id)
VALUES
	(1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
	(2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    (2, 6),
	(3, 1),
    (3, 3),
    (3, 4),
    (3, 5);
    
-- Öffnungszeiten anlegen
INSERT INTO opening_time (weekday, start_time, end_time)
VALUES
	('Montag', '09:00', '18:00'),
    ('Dienstag', '09:00', '18:00'),
    ('Mittwoch', '09:00', '18:00'),
    ('Donnerstag', '09:00', '18:00'),
    ('Freitag', '09:00', '18:00'),
    ('Samstag', '09:00', '14:00');

-- Terminstatus anlegen
INSERT INTO appointment_status (status_name)
VALUES
	('booked'),
    ('completed'),
    ('no_show'),
    ('cancelled');