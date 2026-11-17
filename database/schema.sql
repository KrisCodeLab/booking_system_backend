# DB erstellen und auswählen
CREATE DATABASE IF NOT EXISTS booking_system;
USE booking_system;

# Tabellen erstellen
-- Mitarbeiter
CREATE TABLE employee (
    id          	INT AUTO_INCREMENT PRIMARY KEY,
    employee_name   VARCHAR(80) NOT NULL,
    is_active	 	BOOLEAN NOT NULL DEFAULT TRUE
);

-- Leistung
CREATE TABLE service (
	id				INT AUTO_INCREMENT PRIMARY KEY,
    service_name	VARCHAR(80) NOT NULL,
    price			INT NOT NULL,
    duration		INT NOT NULL,
    is_active		BOOLEAN NOT NULL DEFAULT TRUE
);

-- Mitarbeiter<->Leistung
CREATE TABLE employee_service (
	employee_id		INT NOT NULL,
    service_id		INT NOT NULL,
    
	PRIMARY KEY (employee_id, service_id),

    CONSTRAINT fk_employee_employee_service
        FOREIGN KEY (employee_id) REFERENCES employee(id),

    CONSTRAINT fk_service_employee_service
        FOREIGN KEY (service_id) REFERENCES service(id)
);
    
-- Kunde
CREATE TABLE customer (
	id			    INT AUTO_INCREMENT PRIMARY KEY,
	customer_name	VARCHAR(160) NOT NULL,
    phone		    VARCHAR(80) NOT NULL,
    mail		    VARCHAR(80) NOT NULL UNIQUE
);

-- Terminstatus
CREATE TABLE appointment_status (
	id				INT AUTO_INCREMENT PRIMARY KEY,
    status_name		VARCHAR(20) NOT NULL UNIQUE
);

-- Termin
CREATE TABLE appointment (
	id						INT AUTO_INCREMENT PRIMARY KEY,
    service_id				INT NOT NULL,
    customer_id				INT NOT NULL,
    employee_id				INT NOT NULL,
    start_date				DATETIME NOT NULL,
    end_date				DATETIME NOT NULL,
    appointment_status_id	INT NOT NULL DEFAULT 1,
    token					VARCHAR(36) NOT NULL UNIQUE,
    
    CONSTRAINT fk_service_appointment
        FOREIGN KEY (service_id) REFERENCES service(id),
    
	CONSTRAINT fk_employee_appointment
        FOREIGN KEY (employee_id) REFERENCES employee(id),

    CONSTRAINT fk_customer_appointment
        FOREIGN KEY (customer_id) REFERENCES customer(id),

    CONSTRAINT fk_appointment_status_appointment
        FOREIGN KEY (appointment_status_id) REFERENCES appointment_status(id)
);

-- Öffnungszeiten
CREATE TABLE opening_time (
	id			INT AUTO_INCREMENT PRIMARY KEY,
    weekday		VARCHAR(15) NOT NULL UNIQUE,
    start_time	TIME NOT NULL,
    end_time	TIME NOT NULL
);
	