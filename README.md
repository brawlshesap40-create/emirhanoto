# Emirhan Otomotiv

36 yıllık tecrübeye sahip Emirhan Otomotiv için geliştirilen araç alım satım platformu. Next.js (App Router) + PostgreSQL (Drizzle ORM) ile gerçek işletme kullanımına uygun olarak inşa edildi; araç fotoğrafları sunucu diskine yazılır.

## Teknoloji

- **Next.js 16** (App Router, TypeScript, Server Actions)
- **Tailwind CSS v4** + shadcn/ui
- **PostgreSQL** + **Drizzle ORM**
- Yerel disk depolama (`public/uploads`) — araç fotoğrafları ve döküman yüklemeleri
- Özel, hafif oturum (session) tabanlı admin authentication (bcrypt + jose/JWT)

## Local Geliştirme Ortamı

### 1. Gereksinimler

- Node.js 20.9+
- Docker Desktop (Postgres local'de container olarak çalışır)

### 2. Ortam değişkenleri

```bash
cp .env.example .env.local
```

`.env.local` içindeki değerler local Docker Compose servisleriyle uyumludur, olduğu gibi kullanılabilir. Sadece `SESSION_SECRET` değerini kendi ortamınız için değiştirmeniz önerilir (`openssl rand -base64 32`).

### 3. Servisleri başlat

```bash
docker compose up -d
```

Bu komut Postgres'i `localhost:5432`'de ayağa kaldırır.

### 4. Bağımlılıkları kur

```bash
npm install
```

### 5. Veritabanı migration'larını çalıştır

```bash
npm run db:migrate
```

### 6. Örnek veriyi yükle (admin kullanıcı + 15 demo araç)

```bash
npm run db:seed
```

`.env.local` içindeki `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` ile admin panelinde giriş yapabilirsiniz (`/admin/login`).

> Not: Demo araçların gerçek fotoğrafı yoktur (fabrikasyon stok fotoğrafı eklenmedi). Admin panelinden gerçek araç fotoğraflarını yükleyebilirsiniz.

### 7. Geliştirme sunucusunu başlat

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinden siteyi, `/admin/login` adresinden yönetici panelini görüntüleyebilirsiniz.

## Kullanışlı Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run db:generate` | Şema değişikliğinden yeni migration üretir |
| `npm run db:migrate` | Migration'ları veritabanına uygular |
| `npm run db:studio` | Drizzle Studio (veritabanı arayüzü) |
| `npm run db:seed` | Admin kullanıcı + demo araç verisi yükler |

## Proje Yapısı

```
src/
  app/
    (public)/          Herkese açık site (anasayfa, araçlarımız, iletişim)
    admin/              Yönetici paneli (login + araç yönetimi)
    api/uploads/        Görsel/döküman yükleme endpoint'i
  components/
    site/               Header, footer, hero vb. genel bileşenler
    vehicles/           Araç kartı, galeri, filtre, özellikler
    admin/              Admin formu, görsel yükleyici, tablo aksiyonları
    ui/                 shadcn/ui bileşenleri
  lib/
    db/                 Drizzle şeması ve client
    auth/               Oturum yönetimi (jose/JWT), server action'lar
    storage/            Yerel disk yükleme yardımcıları (public/uploads)
    vehicles/           Sorgular, server action'lar, sabitler
  proxy.ts              Next.js 16 "proxy" dosyası - /admin/* rota koruması
```

## Yayına Alma (Production — FastPanel / VPS)

Bu proje kendi sunucunuzda (FastPanel panelli bir VPS) çalışacak şekilde yapılandırıldı: Postgres sunucuda local olarak kurulur, araç fotoğrafları da `public/uploads` altında sunucu diskine yazılır — S3/Vercel gerekmez.

### 1. Sunucuda Postgres

FastPanel → Databases bölümünden bir Postgres veritabanı + kullanıcı oluşturun. Uygulama aynı sunucuda çalışacağı için bağlantı `localhost` üzerinden olur:

```
DATABASE_URL=postgresql://KULLANICI:SIFRE@localhost:5432/VERITABANI_ADI
```

### 2. Kodu sunucuya alma

Repoyu sunucuya çekin (`git clone` veya FastPanel'in Git deploy özelliği) ve proje kökünde bir `.env` (veya `.env.production.local`) dosyası oluşturup değerleri girin: `DATABASE_URL`, `SESSION_SECRET` (`openssl rand -base64 32` ile üretin), `NEXT_PUBLIC_SITE_URL` (gerçek domain), `NEXT_PUBLIC_WHATSAPP_NUMBER`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.

### 3. Bağımlılık kurulumu + build

```bash
npm install
npm run build
```

### 4. Migration + admin kullanıcı

```bash
npm run db:migrate
SEED_SKIP_VEHICLES=true npm run db:seed
```

(`SEED_SKIP_VEHICLES=true` demo araçları eklemeden sadece admin kullanıcıyı oluşturur.)

### 5. Uygulamayı çalıştırma

FastPanel'in Node.js App bölümünde:
- Başlangıç dosyası / komut: `npm start` (bu `next start` çalıştırır, `next build` sonrasını sunar)
- Uygulama kök dizini: proje klasörü
- FastPanel bir port atar ve Nginx reverse-proxy ile domain'e bağlar

`public/uploads` klasörünün yazılabilir olduğundan ve yedeklerinize dahil edildiğinden emin olun — kullanıcıların yüklediği araç fotoğrafları burada tutulur.

### 6. SSL/domain

FastPanel genelde Let's Encrypt sertifikasını domain bağlarken otomatik sağlar.

> Not: Sunucu erişimi, domain bağlama ve panel arayüzündeki adımlar kendi hesabınızda yapılmalıdır. Bir ekranda takılırsanız hangi adımda olduğunuzu söyleyin, birlikte ilerleriz.

## Kapsam Durumu (Faz 1)

Tamamlanan: araç kataloğu + filtreleme, 8+ fotoğraflı araç detay sayfası (galeri/lightbox, teknik özellikler, donanım, ekspertiz/hasar bilgileri), admin panelinde araç CRUD + görsel/rapor yükleme + stok durumu yönetimi, admin authentication.

Sonraki fazlar: Test sürüşü / Takas / Araç Değerleme formları + admin "Talepler" paneli, interaktif finansman hesaplama, ileri SEO (sitemap/robots/OG image) ve mobil/performans cilası.
