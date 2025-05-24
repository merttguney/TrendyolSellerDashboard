# Trendyol Entegrasyon Projesi

Bu proje, Trendyol satıcı paneli ile entegre çalışan bir yönetim sistemidir. Ürün, sipariş ve stok yönetimini tek bir arayüzden yapmanızı sağlar.

## Proje Yapısı

Aşağıda, projenin dosya ve klasör yapısı ile her bir katmanın işlevi detaylı şekilde açıklanmıştır. Bu yapı, hem kodun okunabilirliğini hem de sürdürülebilirliğini artırmak için modern fullstack mimari prensiplerine göre tasarlanmıştır.

```
trendyol-fullstack/
├── backend/                         # Node.js/Express tabanlı RESTful API
│   ├── package.json                 # Backend bağımlılıkları ve scriptler
│   ├── .env                         # Çevre değişkenleri (örn. MongoDB URI, API anahtarları)
│   └── src/
│       ├── index.js                 # Backend ana uygulama dosyası (Express entrypoint)
│       ├── api/                     # Tüm API endpoint route dosyaları
│       │   ├── products.js          # /api/products endpointleri
│       │   ├── orders.js            # /api/orders endpointleri
│       │   ├── stock.js             # /api/stock endpointleri
│       │   └── settings.js          # /api/settings endpointleri
│       ├── models/                  # Mongoose şema ve modelleri
│       │   ├── Product.js           # Ürün modeli
│       │   ├── Order.js             # Sipariş modeli
│       │   ├── Settings.js          # Ayarlar modeli
│       │   └── WebhookLog.js        # Webhook log modeli
│       ├── services/                # İş mantığı ve Trendyol entegrasyon servisleri
│       │   ├── productService.js    # Ürün iş mantığı
│       │   ├── orderService.js      # Sipariş iş mantığı
│       │   ├── stockService.js      # Stok iş mantığı
│       │   ├── webhookService.js    # Webhook sunucusu ve event yönetimi
│       │   └── trendyol.js          # Trendyol API entegrasyon fonksiyonları
│       ├── config/                  # Konfigürasyon ve veritabanı bağlantısı
│       │   ├── config.js            # Genel konfigürasyon
│       │   └── database.js          # MongoDB bağlantı ayarları
│       ├── utils/                   # Yardımcı fonksiyonlar ve Trendyol API wrapper
│       │   └── trendyolApi.js
│       └── test/                    # Test ve örnek veri scriptleri
│           └── db-test.js
│
├── frontend/                        # React tabanlı kullanıcı arayüzü
│   ├── package.json                 # Frontend bağımlılıkları ve scriptler
│   └── src/
│       ├── App.js                   # Ana uygulama bileşeni ve tema
│       ├── index.js                 # React entrypoint
│       ├── components/              # Ortak UI bileşenleri (örn. Layout)
│       │   └── Layout.js
│       ├── pages/                   # Uygulama sayfaları
│       │   ├── Dashboard.js         # Genel istatistikler ve özet
│       │   ├── Products.js          # Ürün yönetimi arayüzü
│       │   ├── Orders.js            # Sipariş yönetimi arayüzü
│       │   ├── Stock.js             # Stok yönetimi arayüzü
│       │   └── Settings.js          # Ayarlar ve entegrasyon sayfası
│       ├── store/                   # Redux store ve global state yönetimi
│       │   ├── index.js
│       │   └── slices/              # Her işlev için ayrı slice dosyaları
│       │       ├── productsSlice.js
│       │       ├── ordersSlice.js
│       │       ├── stockSlice.js
│       │       └── settingsSlice.js
│       ├── App.css                  # Global stiller
│       └── index.css                # Temel stiller
│
├── .gitignore                       # Versiyon kontrolü için hariç tutulan dosyalar
├── package.json                     # Monorepo scriptleri ve kök bağımlılıklar
├── package-lock.json
└── README.md                        # Proje dokümantasyonu ve kullanım rehberi
```

### Katmanlar ve Mimarinin Avantajları
- **Backend (API):** Tüm iş mantığı, veri yönetimi ve Trendyol ile entegrasyon burada merkezi olarak yönetilir. Servis ve model katmanları ile kodun sürdürülebilirliği ve test edilebilirliği artırılmıştır.
- **Frontend (UI):** Modern, responsive ve kullanıcı dostu bir arayüz. Sayfa ve bileşen bazlı mimari ile kolay geliştirme ve bakım.
- **Redux Store:** Uygulama genelinde tutarlı ve yönetilebilir bir state yapısı sağlar.
- **Test ve Geliştirme:** Hot reload, nodemon ve örnek veri scriptleri ile hızlı geliştirme ve test imkanı.

### Projeyi Farklı Kılanlar
- **Gerçekçi e-ticaret senaryoları ve Trendyol API entegrasyonu**
- **Tamamen modüler ve ölçeklenebilir dosya yapısı**
- **Modern UI/UX ve responsive tasarım**
- **Açık, anlaşılır ve zengin dokümantasyon**
- **Kolay kurulum ve tek komutla başlatma**

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

Sorularınız veya önerileriniz için k.mertguney@gmail.com adresine mail atabilirsiniz. 