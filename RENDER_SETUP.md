# 🚀 Render Deploy Kılavuzu - Hızlı Kurulum

## ❌ Aldığınız Hata

```
npm error Missing script: "build"
```

## ✅ Çözüm

`package.json`'a build script eklendi ve Render yapılandırması tamamlandı.

---

## 📋 Render Dashboard Ayarları

### 1️⃣ Web Service Oluşturma

Render Dashboard → **New** → **Web Service**

### 2️⃣ GitHub Repo Bağlama

- Repository: `montana-yonetim`
- Branch: `main`

### 3️⃣ Build & Deploy Ayarları

**UYARI**: Render'da MUTLAKA bu ayarları yapın:

| Ayar               | Değer                                   |
| ------------------ | --------------------------------------- |
| **Name**           | montana-yonetim (veya istediğiniz isim) |
| **Region**         | Frankfurt (veya Oregon)                 |
| **Branch**         | main                                    |
| **Root Directory** | _(boş bırakın)_                         |
| **Runtime**        | Node                                    |
| **Build Command**  | `npm install`                           |
| **Start Command**  | `npm start`                             |
| **Plan**           | Free                                    |

### 4️⃣ Environment Variables (ÇOK ÖNEMLİ!)

**Environment** sekmesine gidin ve şunları ekleyin:

```env
# Node Environment
NODE_ENV=production

# Port (Render otomatik set eder ama yine de ekleyin)
PORT=3000

# Session Secret - ÇOK ÖNEMLİ! Güçlü bir key kullanın
SESSION_SECRET=oB759YX0nl9t73roNEyLpdki2PmW/bYgNR04HY2NG0M=

# Database (Render PostgreSQL kullanıyorsanız)
DB_HOST=your-postgres-hostname.oregon-postgres.render.com
DB_PORT=5432
DB_USER=membership_user
DB_PASSWORD=your-strong-password
DB_NAME=membership_db

# CORS - Uygulamanızın Render URL'i
ALLOWED_ORIGINS=https://montana-yonetim.onrender.com
```

**Not**: `SESSION_SECRET` için yukarıda oluşturduğunuz güçlü key'i kullanın!

---

## 🗄️ PostgreSQL Database Kurulumu

### Seçenek 1: Render PostgreSQL (Önerilen)

1. Render Dashboard → **New** → **PostgreSQL**
2. Name: `montana-postgres`
3. Database: `membership_db`
4. User: `membership_user`
5. Region: Web service ile aynı region seçin (Frankfurt)
6. Plan: Free

#### Database Bağlantı Bilgilerini Alma

PostgreSQL service'inizi oluşturduktan sonra:

- Dashboard → PostgreSQL Service → **Info** sekmesi
- "Internal Database URL" veya ayrı ayrı credentials'ları kopyalayın
- Web Service'inizin Environment Variables'ına ekleyin

### Seçenek 2: Harici PostgreSQL

Render dışında bir PostgreSQL kullanıyorsanız, connection bilgilerini environment variables'a ekleyin.

---

## 🔧 Database Schema Kurulumu

PostgreSQL'iniz hazır olduktan sonra:

### 1. Render'da Shell Açın

Dashboard → Web Service → **Shell** sekmesi

### 2. Database'e Bağlanın

```bash
# PostgreSQL client ile bağlanın
psql $DATABASE_URL

# Veya credentials ile
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### 3. Schema'yı Oluşturun

```sql
-- Tabloları oluştur
\i src/db/schema.sql

-- Seed data ekle
\i src/db/seed.sql
```

### 4. Admin Kullanıcısını Kontrol Edin

```sql
SELECT id, username, is_active, created_at FROM admins;
```

**Varsayılan Login**:

- Username: `admin`
- Password: `admin123`

---

## ✅ Deploy Checklist

Deploy etmeden önce kontrol edin:

- [ ] `package.json`'da `build` script var mı?
- [ ] `.node-version` dosyası var mı? (Node 20.16.0)
- [ ] Render'da Build Command: `npm install`
- [ ] Render'da Start Command: `npm start`
- [ ] Render'da Health Check Path: `/api/health`
- [ ] Environment Variables hepsi set edildi mi?
  - [ ] `NODE_ENV=production`
  - [ ] `SESSION_SECRET` (güçlü key!)
  - [ ] Database credentials
  - [ ] `ALLOWED_ORIGINS`
- [ ] PostgreSQL database oluşturuldu mu?
- [ ] Database schema çalıştırıldı mı?

---

## 🚀 Deploy

### 1. Git Push

```bash
git add .
git commit -m "Add Render configuration and fix build script"
git push
```

### 2. Render Otomatik Deploy Edecek

- Render Dashboard'da Logs'u izleyin
- Deploy başarılı olursa URL'niz: `https://your-app-name.onrender.com`

### 3. Test Edin

```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Veya tarayıcıda açın
https://your-app-name.onrender.com
```

---

## 🐛 Sorun Giderme

### "Port scan timeout" Hatası ⚠️ YENİ!

**Hata Mesajı**: `Port scan timeout reached, no open ports detected`

**Sebep**: Uygulama porta bind olamadan crash oluyor.

**Çözüm**: ✅ Düzeltildi!

- `pool.js`'deki `process.exit(-1)` kaldırıldı
- Server `0.0.0.0` host'una bind oluyor (Render gereksinimi)
- Database bağlantı hatası artık uygulamayı crash ettirmiyor
- SSL desteği production için eklendi

### "Missing script: build" Hatası

✅ `package.json`'a build script eklendi. Yeni commit'i push edin.

### Database Connection Error

- ✅ Environment variables doğru mu?
- ✅ PostgreSQL service çalışıyor mu?
- ✅ Firewall/Security group açık mı?
- ✅ SSL gerekiyor mu? (Production'da SSL aktif)
- ✅ Internal Database URL kullanıyorsanız host doğru mu?

### "Oturum bulunamadı" Hatası

- ✅ `SESSION_SECRET` set edildi mi?
- ✅ `NODE_ENV=production` set edildi mi?
- ✅ HTTPS üzerinden mi erişiyorsunuz?

### Session Kaybolma

✅ PostgreSQL session store zaten aktif! `session` tablosu otomatik oluşturulacak.

### 502 Bad Gateway

- ✅ Uygulama düzgün başladı mı? (Logs'a bakın)
- ✅ PORT environment variable set edildi mi?
- ✅ Health check endpoint çalışıyor mu?

---

## 📊 Deploy Sonrası

### 1. Logs Kontrolü

Dashboard → Web Service → **Logs**

Şunu görmelisiniz:

```
PostgreSQL bağlantısı başarılı
Server: http://localhost:10000 (Render internal port)
Environment: production
```

### 2. Health Check

Tarayıcıda: `https://your-app.onrender.com/api/health`

Yanıt:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-01T..."
}
```

### 3. Login Test

1. Ana sayfaya gidin: `https://your-app.onrender.com`
2. Login yapın:
   - Username: `admin`
   - Password: `admin123`
3. Başarılı olmalı! 🎉

---

## 🔒 Güvenlik - ÇOK ÖNEMLİ!

Deploy sonrası MUTLAKA yapın:

### 1. Admin Şifresini Değiştirin

Shell'de veya pgAdmin'de:

```sql
-- Yeni şifre hash'i oluşturmak için local'de:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YeniGüçlüŞifre123!', 10).then(h => console.log(h));"

UPDATE admins
SET password_hash = '$2b$10$...' -- buraya yeni hash'i yapıştırın
WHERE username = 'admin';
```

### 2. SESSION_SECRET'i Güçlü Tutun

- En az 32 karakter
- Rastgele karakterler
- Kimseyle paylaşmayın

### 3. Database Credentials

- Güçlü şifreler kullanın
- Sadece gerekli IP'lere izin verin

---

## 🎯 Özet

**Yapılan değişiklikler**:

1. ✅ `package.json` - build script eklendi
2. ✅ `render.yaml` - Render config dosyası
3. ✅ `.node-version` - Node version belirtildi
4. ✅ `app.js` - PostgreSQL session store aktif
5. ✅ CORS ve cookie ayarları production-ready

**Sonraki adımlar**:

1. Git push
2. Render'da environment variables set et
3. Deploy'u bekle
4. Test et
5. Admin şifresini değiştir

---

**Herhangi bir sorun olursa Render Logs'a bakın!**

Dashboard → Your Web Service → Logs sekmesi

İyi deploy'lar! 🚀
