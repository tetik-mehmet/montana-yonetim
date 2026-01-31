-- Üyelik Yönetim Sistemi - Seed Data
-- Bu script başlangıç verilerini PostgreSQL'e yükler

-- Membership Packages (Başlangıç paketleri)
INSERT INTO membership_packages (name, duration_in_days, price, is_active) VALUES
('Aylık', 30, 150.00, true),
('5 Aylık', 150, 650.00, true),
('Yıllık', 365, 1200.00, true);

-- Admin kullanıcıları manuel olarak eklenmeli
-- Aşağıdaki SQL komutlarını kullanabilirsiniz:

-- Admin ekleme örneği:
-- Şifre hash'lerini bcrypt ile üretmeniz gerekiyor
-- Örnek: bcrypt.hashSync('your_password', 10)

-- MANUEL EKLEME KOMUTU:
-- INSERT INTO admins (username, password_hash, is_active) VALUES
-- ('admin', '$2b$10$YourHashedPasswordHere', true);

-- Not: Güvenlik için şifreleri bu dosyada açık text olarak saklamıyoruz.
-- Uygulama çalıştırıldıktan sonra, aşağıdaki gibi admin ekleyebilirsiniz:

-- Örnek 1: Admin kullanıcısı ekle
-- Username: admin
-- Password: admin123
-- Hash: $2b$10$CwTycUXWue0Thq9StjUM0uBfSWD2LADwPzH.Dq8R0TyZl5cYG4VPq
-- INSERT INTO admins (username, password_hash, is_active) VALUES ('admin', '$2b$10$CwTycUXWue0Thq9StjUM0uBfSWD2LADwPzH.Dq8R0TyZl5cYG4VPq', true);

-- Örnek 2: Manager kullanıcısı ekle  
-- Username: manager
-- Password: manager123
-- Hash: $2b$10$VE7dyqVfDurzGKzYe.8F6OXnJkFfZqFE7WLBjQZTJYKF8AYpD8G5m
-- INSERT INTO admins (username, password_hash, is_active) VALUES ('manager', '$2b$10$VE7dyqVfDurzGKzYe.8F6OXnJkFfZqFE7WLBjQZTJYKF8AYpD8G5m', true);

-- Test için örnek üyeler (opsiyonel)
-- INSERT INTO members (first_name, last_name, email) VALUES
-- ('Ahmet', 'Yılmaz', 'ahmet.yilmaz@example.com'),
-- ('Ayşe', 'Demir', 'ayse.demir@example.com'),
-- ('Mehmet', 'Kaya', 'mehmet.kaya@example.com');
