# Trendyol Marketplace Frontend

Bu proje, Trendyol marketplace entegrasyonunun frontend arayüzünü içerir. React ile geliştirilmiş olup, backend API'si ile entegre çalışmaktadır.

## Özellikler

- Ürün yönetimi arayüzü
- Sipariş takip sistemi
- Stok yönetimi
- Fiyat güncelleme
- Gerçek zamanlı bildirimler

## Teknolojiler

- React 19.1.0
- React Router
- Axios
- Material-UI (veya kullandığınız UI kütüphanesi)
- Redux (veya state management çözümünüz)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd trendyol-fullstack/frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun:
```env
REACT_APP_API_URL=http://localhost:5001
```

4. Uygulamayı başlatın:
```bash
npm start
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Proje Yapısı

```
src/
├── components/     # Yeniden kullanılabilir UI bileşenleri
├── pages/         # Sayfa bileşenleri
├── services/      # API servisleri
├── store/         # State management
├── utils/         # Yardımcı fonksiyonlar
└── App.js         # Ana uygulama bileşeni
```

## Backend Entegrasyonu

Frontend uygulaması, backend API'sine `http://localhost:5001` üzerinden bağlanır. API endpoint'leri:

- `/api/products` - Ürün yönetimi
- `/api/orders` - Sipariş yönetimi
- `/api/stock` - Stok yönetimi

## Geliştirme

### Kullanılabilir Komutlar

- `npm start` - Geliştirme sunucusunu başlatır
- `npm test` - Testleri çalıştırır
- `npm run build` - Production build oluşturur

### Kod Standartları

- ESLint ve Prettier kullanılmaktadır
- Component'ler için TypeScript kullanılmaktadır
- Bileşen isimlendirmeleri PascalCase olmalıdır
- Dosya isimlendirmeleri kebab-case olmalıdır

## Deployment

Production build oluşturmak için:

```bash
npm run build
```

Build klasörü, statik dosyaları içerir ve herhangi bir web sunucusunda host edilebilir.

## Lisans

MIT
