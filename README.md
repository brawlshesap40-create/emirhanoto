# Emirhan Otomotiv

36 yıllık tecrübeye sahip Emirhan Otomotiv için geliştirilen araç alım satım platformu. Next.js (App Router) + PostgreSQL (Drizzle ORM) + S3 uyumlu dosya depolama ile gerçek işletme kullanımına uygun olarak inşa edildi.

## Teknoloji

- **Next.js 16** (App Router, TypeScript, Server Actions)
- **Tailwind CSS v4** + shadcn/ui
- **PostgreSQL** + **Drizzle ORM**
- **S3 uyumlu depolama** (local: MinIO, production: AWS S3 / Cloudflare R2 vb.)
- Özel, hafif oturum (session) tabanlı admin authentication (bcrypt + jose/JWT)

## Local Geliştirme Ortamı

### 1. Gereksinimler

- Node.js 20.9+
- Docker Desktop (Postgres ve MinIO local'de container olarak çalışır)

### 2. Ortam değişkenleri

```bash
cp .env.example .env.local
```

`.env.local` içindeki değerler local Docker Compose servisleriyle uyumludur, olduğu gibi kullanılabilir. Sadece `SESSION_SECRET` değerini kendi ortamınız için değiştirmeniz önerilir (`openssl rand -base64 32`).

### 3. Servisleri başlat

```bash
docker compose up -d
```

Bu komut Postgres'i (`localhost:5432`) ve MinIO'yu (`localhost:9000`, konsol: `localhost:9001`) ayağa kaldırır.

### 4. Bağımlılıkları kur

```bash
npm install
```

### 5. Veritabanı migration'larını çalıştır

```bash
npm run db:migrate
```

### 6. MinIO bucket'ını oluştur (ilk kurulumda bir kez)

```bash
npx tsx --env-file=.env.local scripts/setup-storage.ts
```

### 7. Örnek veriyi yükle (admin kullanıcı + 15 demo araç)

```bash
npm run db:seed
```

`.env.local` içindeki `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` ile admin panelinde giriş yapabilirsiniz (`/admin/login`).

> Not: Demo araçların gerçek fotoğrafı yoktur (fabrikasyon stok fotoğrafı eklenmedi). Admin panelinden gerçek araç fotoğraflarını yükleyebilirsiniz.

### 8. Geliştirme sunucusunu başlat

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
    storage/            S3 client ve yükleme yardımcıları
    vehicles/           Sorgular, server action'lar, sabitler
  proxy.ts              Next.js 16 "proxy" dosyası - /admin/* rota koruması
```

## Kapsam Durumu (Faz 1)

Tamamlanan: araç kataloğu + filtreleme, 8+ fotoğraflı araç detay sayfası (galeri/lightbox, teknik özellikler, donanım, ekspertiz/hasar bilgileri), admin panelinde araç CRUD + görsel/rapor yükleme + stok durumu yönetimi, admin authentication.

Sonraki fazlar: Test sürüşü / Takas / Araç Değerleme formları + admin "Talepler" paneli, interaktif finansman hesaplama, ileri SEO (sitemap/robots/OG image) ve mobil/performans cilası.
