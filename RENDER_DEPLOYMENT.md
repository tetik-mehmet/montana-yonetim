# Render Deployment Kılavuzu

## Yapılan Değişiklikler

### 1. Session Cookie Ayarları

- `sameSite: "none"` - Production'da cross-origin isteklere izin vermek için
- `proxy: true` - Render'ın proxy'si arkasında çalışmak için gerekli

### 2. CORS Desteği

- Cross-origin istekleri için CORS middleware eklendi
- Frontend farklı bir domaindeyse çalışabilir

## Render'da Environment Variables Ayarları

Render dashboard'unuzda şu environment variable'ları **mutlaka** ayarlayın:

```env
# Database (Render PostgreSQL)
DB_HOST=your-render-postgres-host
DB_PORT=5432
DB_USER=your-postgres-user
DB_PASSWORD=your-postgres-password
DB_NAME=your-database-name

# Server
PORT=3000
NODE_ENV=production

# Session Secret - GÜVENLİ BİR KEY KULLANIN!
SESSION_SECRET=super-gizli-ve-uzun-bir-anahtar-en-az-32-karakter

# CORS - Uygulamanızın domain'i
ALLOWED_ORIGINS=https://your-app-name.onrender.com
```

## Adım Adım Render Kurulumu

### 1. Environment Variables Ayarlama

Render Dashboard → Your Web Service → Environment sekmesi:

- Her bir variable'ı yukarıdaki gibi ekleyin
- **ÖNEMLİ**: `SESSION_SECRET` için güçlü bir key oluşturun
  ```bash
  # Terminal'de rastgele key oluşturmak için:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 2. PostgreSQL Bağlantısı

Eğer Render PostgreSQL kullanıyorsanız:

- Render'da PostgreSQL service'inizi oluşturun
- "Internal Database URL" kopyalayın
- Environment variables'a ekleyin VEYA
- Doğrudan `DATABASE_URL` olarak ekleyin ve `pool.js`'i güncelleyin

### 3. HTTPS ve Cookies

- Render otomatik HTTPS sağlar
- `secure: true` ayarı HTTPS'de cookie'lerin çalışmasını sağlar
- `sameSite: "none"` cross-origin isteklere izin verir

### 4. Session Persistence ✅

✅ **TAMAMLANDI**: Session'lar artık PostgreSQL'de saklanıyor!

**Avantajlar**:

- ✅ Her restart'ta session'lar korunur
- ✅ Birden fazla instance session'ları paylaşır
- ✅ Kullanıcılar oturumlarını kaybetmez
- ✅ Session tablosu otomatik oluşturulur (`createTableIfMissing: true`)

**Nasıl Çalışıyor**:

- `connect-pg-simple` paketi kullanılıyor
- Session'lar `session` tablosunda saklanıyor
- 24 saat sonra otomatik siliniyor
- İlk çalıştırmada tablo otomatik oluşturuluyor

## Test Etme

1. **Health Check**:

   ```
   https://your-app.onrender.com/api/health
   ```

2. **Login Test**:
   - Tarayıcıda console'u açın (F12)
   - Network sekmesinde cookie'leri kontrol edin
   - Set-Cookie header'ını görmeli ve SameSite=None; Secure olmalı

3. **Cookie Kontrol**:
   - Application/Storage → Cookies
   - Session cookie'nin Secure ve SameSite:None olduğunu doğrulayın

## Sorun Giderme

### "Oturum bulunamadı" hatası

✅ `SESSION_SECRET` ayarlandı mı?
✅ `NODE_ENV=production` ayarlandı mı?
✅ HTTPS üzerinden mi erişiyorsunuz?
✅ Tarayıcı cookie'leri engelliyor mu?

### Session kaybolma

✅ `connect-pg-simple` kullanın (yukarıda açıklandı)

### CORS hataları

✅ `ALLOWED_ORIGINS` doğru domain'i içeriyor mu?
✅ Virgülle ayrılmış birden fazla domain ekleyebilirsiniz

## Güvenlik Notları

1. ✅ Güçlü `SESSION_SECRET` kullanın (en az 32 karakter)
2. ✅ `NODE_ENV=production` ayarlayın
3. ✅ Database şifrelerini güçlü tutun
4. ✅ `ALLOWED_ORIGINS` sadece gerçek domain'lerinizi içersin

## Deploy Sonrası

1. Uygulamayı test edin
2. Browser console'da hata olup olmadığını kontrol edin
3. Render logs'ları kontrol edin: Dashboard → Logs
4. Database bağlantısının çalıştığını doğrulayın

---

**Not**: Frontend ve backend aynı domain'deyse (örn. her ikisi de Render'da host ediliyorsa), `ALLOWED_ORIGINS`'e kendi domain'inizi ekleyin.
