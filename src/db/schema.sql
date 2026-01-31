-- Üyelik Yönetim Sistemi - PostgreSQL Schema
-- Database: membership_db

-- Drop tables if exists (for development purposes)
DROP TABLE IF EXISTS member_memberships CASCADE;
DROP TABLE IF EXISTS membership_packages CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create members table
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create membership_packages table
CREATE TABLE membership_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_in_days INTEGER NOT NULL CHECK (duration_in_days > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create member_memberships table
CREATE TABLE member_memberships (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES membership_packages(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_member_memberships_member_id ON member_memberships(member_id);
CREATE INDEX idx_member_memberships_status ON member_memberships(status);
CREATE INDEX idx_member_memberships_end_date ON member_memberships(end_date);
CREATE INDEX idx_admins_username ON admins(username);

-- Comments for documentation
COMMENT ON TABLE admins IS 'Sistem yöneticileri - çok yönetici desteği';
COMMENT ON TABLE members IS 'Üyeler - temel bilgileri içerir';
COMMENT ON TABLE membership_packages IS 'Üyelik paketleri - süre ve fiyat tanımları';
COMMENT ON TABLE member_memberships IS 'Üye-paket ilişkisi - aktif/süresi dolmuş durumları';
