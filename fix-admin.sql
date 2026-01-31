-- Admin şifresini düzelt
-- Kullanıcı: admin
-- Şifre: admin123

-- Eski admin'i sil
DELETE FROM admins WHERE username = 'admin';

-- Yeni admin'i doğru hash ile ekle
INSERT INTO admins (username, password_hash, is_active) 
VALUES ('admin', '$2b$10$2D4XidRQF6dYCmPxY326BOmaaOvkq8lew6X06Hfpu0HxxnHkFGBXG', true);

-- Kontrol et
SELECT id, username, is_active, created_at FROM admins WHERE username = 'admin';
