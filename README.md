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

## Yayına Alma (Production)

Önerilen yol: **Vercel** (hosting) + **Neon** veya **Supabase** (Postgres) + **Cloudflare R2** (S3 uyumlu görsel/döküman depolama). Kod bu üçlüye hazır yazıldı; local'de MinIO yerine sadece env değişkenleri değişir, kod değişikliği gerekmez.

### 1. GitHub'a push

Vercel bir Git deposundan deploy eder. Projeyi kendi GitHub hesabınızda bir repoya push edin (`git remote add origin ...` + `git push -u origin master`).

### 2. Veritabanı (Neon veya Supabase)

1. [neon.tech](https://neon.tech) veya [supabase.com](https://supabase.com)'da ücretsiz bir proje oluşturun.
2. Verilen `DATABASE_URL`'i (SSL zorunlu, `?sslmode=require` içerir) not edin.
3. Local makinenizden bu URL'e karşı migration'ları çalıştırın ve **sadece admin kullanıcıyı** oluşturun (demo araçlar olmadan):
   ```bash
   DATABASE_URL="<neon-connection-string>" npx drizzle-kit migrate
   DATABASE_URL="<neon-connection-string>" SEED_ADMIN_EMAIL="..." SEED_ADMIN_PASSWORD="..." SEED_SKIP_VEHICLES=true npx tsx scripts/seed.ts
   ```

### 3. Görsel depolama (Cloudflare R2)

1. Cloudflare hesabınızda bir R2 bucket oluşturun (örn. `emirhanoto`).
2. Bucket için "Public access" açın veya bir custom domain (örn. `cdn.emirhanotomotiv.com`) bağlayın — bu, `S3_PUBLIC_URL` olacak.
3. R2 API token'ı oluşturun (Access Key ID / Secret) ve bucket'ı local'deki gibi oluşturmak için:
   ```bash
   S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com" S3_REGION=auto S3_ACCESS_KEY_ID="..." S3_SECRET_ACCESS_KEY="..." S3_BUCKET=emirhanoto S3_FORCE_PATH_STYLE=true npx tsx scripts/setup-storage.ts
   ```

### 4. Vercel'e deploy

1. [vercel.com](https://vercel.com)'da GitHub reponuzu import edin.
2. Environment Variables kısmına `.env.example`'daki değişkenleri **production değerleriyle** girin: `DATABASE_URL` (Neon/Supabase), `SESSION_SECRET` (yeni bir tane üretin), `S3_*` (R2 bilgileri), `NEXT_PUBLIC_SITE_URL` (gerçek domain), `NEXT_PUBLIC_WHATSAPP_NUMBER`. `SEED_ADMIN_*` değişkenlerini Vercel'e eklemenize gerek yok, sadece local'den seed çalıştırırken kullanılıyor.
3. Deploy edin. Vercel otomatik HTTPS sağlar.
4. Kendi domaininizi (örn. emirhanotomotiv.com) Vercel proje ayarlarından bağlayın.

> Not: Hesap oluşturma, domain satın alma ve gerçek API anahtarlarını girme adımları kendi hesaplarınızda yapılmalıdır. Bu adımlarda takılırsanız hangi ekranda olduğunuzu söyleyin, birlikte ilerleriz.

## Kapsam Durumu (Faz 1)

Tamamlanan: araç kataloğu + filtreleme, 8+ fotoğraflı araç detay sayfası (galeri/lightbox, teknik özellikler, donanım, ekspertiz/hasar bilgileri), admin panelinde araç CRUD + görsel/rapor yükleme + stok durumu yönetimi, admin authentication.

Sonraki fazlar: Test sürüşü / Takas / Araç Değerleme formları + admin "Talepler" paneli, interaktif finansman hesaplama, ileri SEO (sitemap/robots/OG image) ve mobil/performans cilası.
