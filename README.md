# Üyelik Yönetim Sistemi

PostgreSQL tabanlı, çok yöneticili, session-based kimlik doğrulamalı üyelik yönetim sistemi.

## 🚀 Özellikler

- ✅ Çok yönetici desteği (Multi-admin authentication)
- ✅ Session-based kimlik doğrulama
- ✅ Üye yönetimi (CRUD işlemleri)
- ✅ Üyelik paketleri yönetimi (süre ve fiyat düzenlenebilir)
- ✅ Üyeliklerin paketlere atanması
- ✅ Otomatik süre dolumu kontrolü
- ✅ Süresi dolmuş üyeliklerin yenilenmesi
- ✅ Katmanlı mimari (n-tier architecture)
- ✅ Responsive tasarım (Tailwind CSS)
- ✅ Vanilla JavaScript (Framework'süz)

## 📋 Teknoloji Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: bcrypt + express-session
- **Database Driver**: node-postgres (pg)

### Frontend

- **HTML5**
- **Tailwind CSS** (CDN)
- **Vanilla JavaScript** (ES6+)

## 📁 Proje Yapısı

```
membership-management/
├── src/
│   ├── controllers/          # Presentation Layer
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── packageController.js
│   │   └── membershipController.js
│   ├── services/             # Business Logic Layer
│   │   ├── authService.js
│   │   ├── memberService.js
│   │   ├── packageService.js
│   │   └── membershipService.js
│   ├── repositories/         # Data Access Layer
│   │   ├── adminRepository.js
│   │   ├── memberRepository.js
│   │   ├── packageRepository.js
│   │   └── membershipRepository.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── members.js
│   │   ├── packages.js
│   │   └── memberships.js
│   ├── db/
│   │   ├── pool.js           # PostgreSQL connection pool
│   │   ├── schema.sql        # Database schema
│   │   └── seed.sql          # Seed data
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   └── app.js
│   │   └── index.html
│   └── app.js                # Express application
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔧 Kurulum

### 1. Ön Gereksinimler

- Node.js (v16 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya yarn

### 2. Projeyi Klonlayın

```bash
git clone <repository-url>
cd membership-management
```

### 3. Bağımlılıkları Yükleyin

```bash
npm install
```

### 4. PostgreSQL Veritabanını Oluşturun

PostgreSQL terminalinde:

```sql
CREATE DATABASE membership_db;
```

### 5. Veritabanı Şemasını Oluşturun

```bash
psql -U postgres -d membership_db -f src/db/schema.sql
```

### 6. Seed Verilerini Yükleyin

```bash
psql -U postgres -d membership_db -f src/db/seed.sql
```

### 7. Ortam Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=membership_db

PORT=3000
NODE_ENV=development

SESSION_SECRET=your-super-secret-key-change-this
```

### 8. Admin Kullanıcı Oluşturun

PostgreSQL terminalinde admin kullanıcısı oluşturun:

```sql
-- Örnek admin kullanıcısı (username: admin, password: admin123)
INSERT INTO admins (username, password_hash, is_active)
VALUES ('admin', '$2b$10$CwTycUXWue0Thq9StjUM0uBfSWD2LADwPzH.Dq8R0TyZl5cYG4VPq', true);
```

**Not**: Yukarıdaki hash `admin123` şifresine karşılık gelir. Production ortamında güçlü şifreler kullanın.

Kendi şifrenizi hash'lemek için Node.js REPL'de:

```javascript
const bcrypt = require("bcrypt");
bcrypt.hashSync("your_password", 10);
```

### 9. Sunucuyu Başlatın

Development modu:

```bash
npm run dev
```

Production modu:

```bash
npm start
```

Sunucu `http://localhost:3000` adresinde çalışacaktır.

## 📖 Kullanım

### Giriş Yapma

1. Tarayıcıda `http://localhost:3000` adresine gidin
2. Admin kullanıcı adı ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

**Varsayılan Kullanıcı:**

- Kullanıcı Adı: `admin`
- Şifre: `admin123`

### Üye Yönetimi

- **Üye Ekleme**: "Yeni Üye Ekle" formundan ad, soyad ve e-posta bilgilerini girin
- **Üye Listeleme**: Tüm üyeler tablo halinde görüntülenir
- **Üye Silme**: Üye satırındaki "Sil" butonuna tıklayın

### Paket Yönetimi

- **Paket Listeleme**: Mevcut paketler ve özellikleri görüntülenir
- **Paket Düzenleme**: "Düzenle" butonuna tıklayarak süre ve fiyat güncellenebilir
- Sistem varsayılan olarak 3 paket ile gelir:
  - Aylık (30 gün - 150 TL)
  - 5 Aylık (150 gün - 650 TL)
  - Yıllık (365 gün - 1200 TL)

### Üyelik Yönetimi

- **Paket Atama**: Bir üyeye paket atamak için üye, paket ve başlangıç tarihi seçin
- **Aktif Üyelikler**: Şu anda aktif olan tüm üyelikleri görüntüleyin
- **Süresi Dolmuş Üyelikler**: Expire olmuş üyelikleri görüntüleyin ve yenileyin
- **Üyelik Yenileme**: Süresi dolmuş üyelikler için "Yenile" butonunu kullanın

## 🏗️ Mimari

### Katmanlı Mimari (Layered Architecture)

```
┌─────────────────────────────────────┐
│    Presentation Layer (Routes)     │
│         Controllers                 │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│   Application Layer (Services)      │
│       Business Logic                │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│   Data Access Layer (Repositories)  │
│         SQL Queries                 │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Database Layer (PostgreSQL)    │
└─────────────────────────────────────┘
```

### İş Kuralları

1. **Tek Aktif Üyelik**: Bir üyenin aynı anda sadece 1 aktif üyeliği olabilir
2. **Otomatik Süre Dolumu**: `end_date < bugün` ise status → `expired`
3. **Yenileme Mekanizması**: Expired üyelikler yenilenerek yeni kayıt oluşturulur
4. **Cascade Delete**: Üye silindiğinde tüm üyelikleri de silinir

## 🔒 Güvenlik

- ✅ Şifreler bcrypt ile hash'lenir (saltRounds: 10)
- ✅ Session cookies güvenli şekilde yapılandırılmıştır (httpOnly, sameSite)
- ✅ SQL Injection koruması (Parametrize queries)
- ✅ Input validation (Backend + Frontend)
- ✅ Authentication middleware ile korumalı route'lar

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - Admin girişi
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Members

- `GET /api/members` - Tüm üyeleri listele
- `GET /api/members/:id` - Üye detayı
- `POST /api/members` - Yeni üye ekle
- `PUT /api/members/:id` - Üye güncelle
- `DELETE /api/members/:id` - Üye sil

### Packages

- `GET /api/packages` - Tüm paketleri listele
- `GET /api/packages/:id` - Paket detayı
- `POST /api/packages` - Yeni paket oluştur
- `PUT /api/packages/:id` - Paket güncelle
- `DELETE /api/packages/:id` - Paket deaktif et

### Memberships

- `GET /api/memberships` - Tüm üyelikler
- `GET /api/memberships/active` - Aktif üyelikler
- `GET /api/memberships/expired` - Süresi dolmuş üyelikler
- `GET /api/memberships/member/:memberId` - Üyenin tüm üyelikleri
- `POST /api/memberships/assign` - Paket ata
- `POST /api/memberships/renew` - Üyelik yenile
- `POST /api/memberships/check-expired` - Süresi dolmuşları kontrol et
- `PUT /api/memberships/:id/cancel` - Üyelik iptal et

## 🛠️ Geliştirme

### Database Migration

Şemada değişiklik yaptığınızda:

```bash
psql -U postgres -d membership_db -f src/db/schema.sql
```

### Debug Mode

Development modunda detaylı hata logları gösterilir:

```bash
NODE_ENV=development npm run dev
```

## 📝 Lisans

ISC

## 👨‍💻 Geliştirici Notları

- Backend'de SQL sorguları repository katmanında izole edilmiştir
- Controller'lar sadece HTTP handling yapar, business logic içermez
- Service katmanı validation ve business rules içerir
- Frontend SPA (Single Page Application) yaklaşımı ile geliştirilmiştir
- Responsive tasarım Tailwind CSS utility classes ile sağlanmıştır

## 🐛 Bilinen Sorunlar

Şu an için bilinen bir sorun bulunmamaktadır.

## 📞 Destek

Sorun bildirmek veya öneride bulunmak için issue açabilirsiniz.
