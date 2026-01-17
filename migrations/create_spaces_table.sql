-- Spaces Table
CREATE TABLE IF NOT EXISTS spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    location VARCHAR(500),
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (active)
);

-- Junction table for spaces and instructors (many-to-many)
CREATE TABLE IF NOT EXISTS spaces_instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    space_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_space_instructor (space_id, user_id),
    INDEX idx_space_id (space_id),
    INDEX idx_user_id (user_id)
);

-- Junction table for spaces and disciplines (many-to-many)
CREATE TABLE IF NOT EXISTS spaces_disciplines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    space_id INT NOT NULL,
    discipline_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
    UNIQUE KEY unique_space_discipline (space_id, discipline_name),
    INDEX idx_space_id (space_id)
);
