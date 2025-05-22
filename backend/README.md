# Trendyol Marketplace Entegrasyonu

Bu proje, e-ticaret sisteminizi Trendyol marketplace'i ile entegre etmek için geliştirilmiş bir Node.js uygulamasıdır.

## Özellikler

- Ürün senkronizasyonu (e-ticaret -> Trendyol)
- Sipariş takibi (Trendyol -> e-ticaret)
- Stok yönetimi
- Otomatik fiyat güncelleme
- Hata yönetimi ve loglama
- Webhook desteği
- MongoDB veritabanı entegrasyonu

## Teknolojiler

- Node.js
- Express.js
- MongoDB
- Redis (önbellek için)
- Winston (loglama)
- Node-cron (zamanlanmış görevler)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd trendyol-fullstack/backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun:
```env
# Trendyol API Bilgileri
TRENDYOL_SUPPLIER_ID=your_supplier_id
TRENDYOL_API_KEY=your_api_key
TRENDYOL_API_SECRET=your_api_secret

# MongoDB Bağlantısı
MONGODB_URI=mongodb://localhost:27017/trendyol-integration

# Redis Bağlantısı (opsiyonel)
REDIS_URL=redis://localhost:6379

# Port Ayarları
PORT=5001
WEBHOOK_PORT=3000

# Webhook Güvenliği
TRENDYOL_WEBHOOK_SECRET=your_webhook_secret
```

4. MongoDB'yi başlatın:
```bash
mongod
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

API sunucusu varsayılan olarak [http://localhost:5001](http://localhost:5001) adresinde çalışacaktır.

## Servisler

### ProductService
- Ürünleri e-ticaret sisteminden Trendyol'a aktarma
- Ürün bilgilerini güncelleme
- Toplu ürün işlemleri
- Fiyat güncelleme

### OrderService
- Yeni siparişleri çekme
- Siparişleri e-ticaret sistemine aktarma
- Sipariş durumu takibi
- Sipariş geçmişi

### StockService
- Stok güncelleme
- Toplu stok güncelleme
- Stok kontrolü
- Stok uyarıları

### WebhookService
- Trendyol webhook'larını dinleme
- Sipariş bildirimleri
- Stok değişiklikleri
- Fiyat güncellemeleri

## API Endpoints

### Ürünler
- `GET /api/products` - Ürün listesi
- `POST /api/products` - Yeni ürün ekleme
- `PUT /api/products/:id` - Ürün güncelleme
- `DELETE /api/products/:id` - Ürün silme

### Siparişler
- `GET /api/orders` - Sipariş listesi
- `GET /api/orders/:id` - Sipariş detayı
- `PUT /api/orders/:id/status` - Sipariş durumu güncelleme

### Stok
- `GET /api/stock` - Stok durumu
- `PUT /api/stock/:id` - Stok güncelleme
- `POST /api/stock/bulk` - Toplu stok güncelleme

## Zamanlanmış Görevler

- Her 5 dakikada bir yeni sipariş kontrolü
- Her saat başı stok kontrolü
- Her gün gece yarısı fiyat güncelleme

## Hata Yönetimi

Tüm servisler Winston logger kullanarak hata ve bilgi loglarını `error.log` ve `combined.log` dosyalarına kaydeder.

## Güvenlik

- API istekleri için rate limiting
- Webhook istekleri için imza doğrulama
- CORS yapılandırması
- Güvenli başlık ayarları

## Lisans

MIT
