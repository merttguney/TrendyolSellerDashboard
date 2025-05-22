# Trendyol Entegrasyon Projesi

Bu proje, Trendyol satıcı paneli ile entegre çalışan bir yönetim sistemidir. Ürün, sipariş ve stok yönetimini tek bir arayüzden yapmanızı sağlar.

## Proje Yapısı

```
trendyol-fullstack/
├── backend/                 # Backend uygulaması
│   ├── src/
│   │   ├── api/            # API route'ları
│   │   ├── config/         # Konfigürasyon dosyaları
│   │   ├── models/         # MongoDB modelleri
│   │   ├── services/       # İş mantığı servisleri
│   │   ├── utils/          # Yardımcı fonksiyonlar
│   │   └── index.js        # Ana uygulama dosyası
│   ├── .env               # Backend çevre değişkenleri
│   └── package.json       # Backend bağımlılıkları
│
├── frontend/               # Frontend uygulaması
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── pages/        # Sayfa bileşenleri
│   │   ├── store/        # Redux store ve slice'lar
│   │   ├── services/     # API servisleri
│   │   ├── utils/        # Yardımcı fonksiyonlar
│   │   └── App.js        # Ana uygulama bileşeni
│   ├── .env             # Frontend çevre değişkenleri
│   └── package.json     # Frontend bağımlılıkları
│
├── .gitignore           # Git tarafından yok sayılacak dosyalar
├── package.json         # Ana proje bağımlılıkları
└── README.md           # Proje dokümantasyonu
```

## Özellikler

- 🛍️ Ürün Yönetimi
  - Ürün listeleme ve arama
  - Ürün ekleme ve düzenleme
  - Trendyol ile otomatik senkronizasyon
  - Stok ve fiyat güncelleme

- 📦 Sipariş Yönetimi
  - Sipariş listeleme ve filtreleme
  - Sipariş detaylarını görüntüleme
  - Sipariş durumu güncelleme
  - Trendyol ile otomatik senkronizasyon

- 📊 Stok Yönetimi
  - Stok durumu takibi
  - Toplu stok güncelleme
  - Stok hareketleri raporlama

- ⚙️ Ayarlar
  - Trendyol API entegrasyonu
  - Webhook yapılandırması
  - Bildirim ayarları

## Teknolojiler

### Frontend
- React 18
- Redux Toolkit
- Material-UI
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Winston (Loglama)
- Node-cron (Zamanlanmış görevler)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/trendyol-fullstack.git
cd trendyol-fullstack
```

2. Bağımlılıkları yükleyin:
```bash
npm run install-all
```

3. Backend için `.env` dosyası oluşturun:
```env
MONGODB_URI=mongodb://localhost:27017/trendyol-integration
PORT=5001
TRENDYOL_API_KEY=your_api_key
TRENDYOL_API_SECRET=your_api_secret
TRENDYOL_SUPPLIER_ID=your_supplier_id
WEBHOOK_URL=your_webhook_url
```

4. Uygulamayı başlatın:
```bash
npm start
```

Frontend: http://localhost:3001
Backend: http://localhost:5001

## Geliştirme

Proje, geliştirme sürecini kolaylaştırmak için aşağıdaki özelliklere sahiptir:

- **Hot Reload**: Frontend'de yapılan değişiklikler anında görüntülenir
- **Nodemon**: Backend'de yapılan değişiklikler otomatik olarak yeniden başlatılır
- **Tek Komut**: `npm start` ile hem frontend hem de backend başlatılır

## API Endpoints

### Ürünler
- `GET /api/products` - Tüm ürünleri listele
- `POST /api/products` - Yeni ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil
- `POST /api/products/sync` - Trendyol ile senkronize et

### Siparişler
- `GET /api/orders` - Tüm siparişleri listele
- `GET /api/orders/:id` - Sipariş detaylarını getir
- `PUT /api/orders/:id/status` - Sipariş durumunu güncelle
- `POST /api/orders/sync` - Trendyol ile senkronize et

### Stok
- `GET /api/stock` - Stok durumunu getir
- `PUT /api/stock/:barcode` - Stok güncelle
- `POST /api/stock/bulk` - Toplu stok güncelle

### Ayarlar
- `GET /api/settings` - Ayarları getir
- `PUT /api/settings` - Ayarları güncelle
- `POST /api/settings/test-connection` - API bağlantısını test et

## Webhook Events

- `ORDER_STATUS_CHANGED` - Sipariş durumu değiştiğinde
- `STOCK_UPDATED` - Stok güncellendiğinde
- `PRICE_UPDATED` - Fiyat güncellendiğinde

## Lisans

MIT

## İletişim

Sorularınız veya önerileriniz için [email protected] adresine mail atabilirsiniz. 